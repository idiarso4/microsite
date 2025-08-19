use anyhow::Result;
use auth::{JwtService, PasswordService};
use chrono::Utc;
use shared_types::{LoginRequest, LoginResponse, User, Tenant};
use sqlx::{Pool, Postgres, Row};
use redis::aio::ConnectionManager;

pub struct AuthAppService<'a> {
    pub db: &'a Pool<Postgres>,
    pub jwt: &'a JwtService,
    pub password: &'a PasswordService,
    pub redis: &'a ConnectionManager,
}

impl<'a> AuthAppService<'a> {
    pub fn new(
        db: &'a Pool<Postgres>,
        jwt: &'a JwtService,
        password: &'a PasswordService,
        redis: &'a ConnectionManager,
    ) -> Self {
        Self { db, jwt, password, redis }
    }

    pub async fn register_tenant(
        &self,
        company_name: &str,
        slug: &str,
        admin_email: &str,
        admin_password: &str,
        admin_first_name: &str,
        admin_last_name: &str,
    ) -> Result<()> {
        let mut tx = self.db.begin().await?;

        // Check slug uniqueness
        let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(1) FROM tenants WHERE slug = $1")
            .bind(slug)
            .fetch_one(&mut *tx)
            .await?;
        if exists > 0 { anyhow::bail!("TENANT_SLUG_TAKEN"); }

        // Check email uniqueness
        let email_exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(1) FROM users WHERE email = $1")
            .bind(admin_email)
            .fetch_one(&mut *tx)
            .await?;
        if email_exists > 0 { anyhow::bail!("USER_ALREADY_EXISTS"); }

        // Insert tenant
        let tenant_id: uuid::Uuid = sqlx::query_scalar(
            "INSERT INTO tenants (name, slug, plan, settings, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id"
        )
        .bind(company_name)
        .bind(slug)
        .bind("basic")
        .bind(serde_json::json!({}))
        .fetch_one(&mut *tx)
        .await?;

        // Hash password
        let password_hash = self
            .password
            .hash_password(admin_password)
            .map_err(|e| anyhow::anyhow!(e.to_string()))?;

        // Insert user
        let user_id: uuid::Uuid = sqlx::query_scalar(
            "INSERT INTO users (email, password_hash, first_name, last_name, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id"
        )
        .bind(admin_email)
        .bind(password_hash)
        .bind(admin_first_name)
        .bind(admin_last_name)
        .fetch_one(&mut *tx)
        .await?;

        // Membership as owner
        sqlx::query(
            "INSERT INTO tenant_memberships (tenant_id, user_id, role, is_active) VALUES ($1, $2, 'owner', true)"
        )
        .bind(tenant_id)
        .bind(user_id)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn login(&self, req: &LoginRequest) -> Result<LoginResponse> {
        // Lookup user by email
        let row = sqlx::query(
            r#"SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.is_active,
                       tm.tenant_id, t.name as tenant_name, t.slug as tenant_slug, t.plan as tenant_plan, t.settings as tenant_settings, t.is_active as tenant_active
                 FROM users u
                 JOIN tenant_memberships tm ON tm.user_id = u.id
                 JOIN tenants t ON t.id = tm.tenant_id
                 WHERE u.email = $1 AND tm.is_active = true AND t.is_active = true
                 LIMIT 1"#,
        )
        .bind(&req.email)
        .fetch_optional(self.db)
        .await?;

        let row = match row {
            Some(r) => r,
            None => anyhow::bail!("INVALID_CREDENTIALS"),
        };

        // Verify password
        let password_hash: String = row.get("password_hash");
        let ok = self
            .password
            .verify_password(&req.password, &password_hash)
            .map_err(|e| anyhow::anyhow!(e.to_string()))?;
        if !ok {
            anyhow::bail!("INVALID_CREDENTIALS");
        }

        // TODO: fetch permissions/roles properly
        let permissions: Vec<String> = vec![];

        // Tokens
        let user_id = row.get("id");
        let tenant_id = row.get("tenant_id");
        let email: String = row.get("email");
        let access_token = self
            .jwt
            .generate_access_token(user_id, tenant_id, email.clone(), vec![], permissions.clone())?;
        let refresh_token = self.jwt.generate_refresh_token();
        let expires_at = self.jwt.access_token_expires_at();

        // Store refresh token in Redis with TTL
        {
            use redis::AsyncCommands;
            let mut conn = self.redis.clone();
            let key = format!("refresh:{}", user_id);
            let ttl = (self.jwt.refresh_token_expires_at() - Utc::now()).num_seconds();
            let _: () = redis::pipe()
                .cmd("SET").arg(&key).arg(&refresh_token).ignore()
                .cmd("EXPIRE").arg(&key).arg(ttl).ignore()
                .query_async(&mut conn)
                .await?;
        }

        // Compose response types
        let user = User {
            base: shared_types::BaseEntity { id: user_id, created_at: Utc::now(), updated_at: Utc::now() },
            email,
            first_name: row.try_get::<Option<String>, _>("first_name").unwrap_or(None),
            last_name: row.try_get::<Option<String>, _>("last_name").unwrap_or(None),
            is_active: row.try_get::<bool, _>("is_active").unwrap_or(true),
            email_verified_at: None,
            last_login_at: None,
        };
        let tenant = Tenant {
            base: shared_types::BaseEntity { id: tenant_id, created_at: Utc::now(), updated_at: Utc::now() },
            name: row.try_get::<String, _>("tenant_name").unwrap_or_default(),
            slug: row.try_get::<String, _>("tenant_slug").unwrap_or_default(),
            plan: row.try_get::<String, _>("tenant_plan").unwrap_or_else(|_| "basic".to_string()),
            settings: row.try_get::<serde_json::Value, _>("tenant_settings").unwrap_or(serde_json::json!({})),
            is_active: row.try_get::<bool, _>("tenant_active").unwrap_or(true),
        };

        Ok(LoginResponse { user, tenant, permissions, access_token, refresh_token, expires_at })
    }
}

