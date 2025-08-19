use crate::config::AppConfig;
use anyhow::Result;
use auth::{JwtService, PasswordService};
use redis::aio::ConnectionManager;
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::time::Duration;

#[derive(Clone)]
pub struct AppState {
    pub config: AppConfig,
    pub db_pool: PgPool,
    pub redis: ConnectionManager,
    pub jwt_service: JwtService,
    pub password_service: PasswordService,
}

impl AppState {
    pub async fn new(config: AppConfig) -> Result<Self> {
        // Initialize database connection pool
        let db_pool = PgPoolOptions::new()
            .max_connections(config.database.max_connections)
            .min_connections(config.database.min_connections)
            .acquire_timeout(Duration::from_secs(config.database.acquire_timeout))
            .idle_timeout(Duration::from_secs(config.database.idle_timeout))
            .connect(&config.database.url)
            .await?;

        // Initialize Redis connection
        let redis_client = redis::Client::open(config.redis.url.clone())?;
        let redis = ConnectionManager::new(redis_client).await?;

        // Initialize services
        let jwt_service = JwtService::new(&config.jwt.secret);
        let password_service = PasswordService::new();

        Ok(Self {
            config,
            db_pool,
            redis,
            jwt_service,
            password_service,
        })
    }
}
