use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use shared_types::JwtClaims;
use uuid::Uuid;

#[derive(Clone)]
pub struct JwtService {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    access_token_duration: Duration,
    refresh_token_duration: Duration,
}

impl JwtService {
    pub fn new(secret: &str) -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(secret.as_ref()),
            decoding_key: DecodingKey::from_secret(secret.as_ref()),
            access_token_duration: Duration::minutes(15),
            refresh_token_duration: Duration::days(7),
        }
    }

    pub fn generate_access_token(
        &self,
        user_id: Uuid,
        tenant_id: Uuid,
        email: String,
        roles: Vec<String>,
        permissions: Vec<String>,
    ) -> Result<String, jsonwebtoken::errors::Error> {
        let now = Utc::now();
        let exp = now + self.access_token_duration;

        let claims = JwtClaims {
            sub: user_id,
            tenant_id,
            email,
            roles,
            permissions,
            iat: now.timestamp(),
            exp: exp.timestamp(),
        };

        encode(&Header::default(), &claims, &self.encoding_key)
    }

    pub fn generate_refresh_token(&self) -> String {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        let token: String = (0..32)
            .map(|_| {
                let idx = rng.gen_range(0..62);
                match idx {
                    0..=25 => (b'a' + idx) as char,
                    26..=51 => (b'A' + idx - 26) as char,
                    _ => (b'0' + idx - 52) as char,
                }
            })
            .collect();
        token
    }

    pub fn validate_token(&self, token: &str) -> Result<JwtClaims, jsonwebtoken::errors::Error> {
        let validation = Validation::new(Algorithm::HS256);
        let token_data = decode::<JwtClaims>(token, &self.decoding_key, &validation)?;
        Ok(token_data.claims)
    }

    pub fn refresh_token_expires_at(&self) -> chrono::DateTime<Utc> {
        Utc::now() + self.refresh_token_duration
    }

    pub fn access_token_expires_at(&self) -> chrono::DateTime<Utc> {
        Utc::now() + self.access_token_duration
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_jwt_generation_and_validation() {
        let jwt_service = JwtService::new("test_secret");
        let user_id = Uuid::new_v4();
        let tenant_id = Uuid::new_v4();
        let email = "test@example.com".to_string();
        let roles = vec!["admin".to_string()];
        let permissions = vec!["users:read".to_string(), "users:write".to_string()];

        let token = jwt_service
            .generate_access_token(
                user_id,
                tenant_id,
                email.clone(),
                roles.clone(),
                permissions.clone(),
            )
            .unwrap();

        let claims = jwt_service.validate_token(&token).unwrap();

        assert_eq!(claims.sub, user_id);
        assert_eq!(claims.tenant_id, tenant_id);
        assert_eq!(claims.email, email);
        assert_eq!(claims.roles, roles);
        assert_eq!(claims.permissions, permissions);
    }

    #[test]
    fn test_refresh_token_generation() {
        let jwt_service = JwtService::new("test_secret");
        let token = jwt_service.generate_refresh_token();
        
        assert_eq!(token.len(), 32);
        assert!(token.chars().all(|c| c.is_alphanumeric()));
    }
}
