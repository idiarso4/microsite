use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub jwt: JwtConfig,
    pub email: EmailConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub environment: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub acquire_timeout: u64,
    pub idle_timeout: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisConfig {
    pub url: String,
    pub max_connections: u32,
    pub connection_timeout: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JwtConfig {
    pub secret: String,
    pub access_token_duration: u64,
    pub refresh_token_duration: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailConfig {
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_username: String,
    pub smtp_password: String,
    pub from_email: String,
    pub from_name: String,
}

impl AppConfig {
    pub fn load() -> Result<Self> {
        dotenvy::dotenv().ok();

        let config = config::Config::builder()
            .add_source(config::Environment::default().separator("__"))
            .set_default("server.host", "0.0.0.0")?
            .set_default("server.port", 3000)?
            .set_default("server.environment", "development")?
            .set_default("database.max_connections", 10)?
            .set_default("database.min_connections", 1)?
            .set_default("database.acquire_timeout", 30)?
            .set_default("database.idle_timeout", 600)?
            .set_default("redis.max_connections", 10)?
            .set_default("redis.connection_timeout", 5)?
            .set_default("jwt.access_token_duration", 900)? // 15 minutes
            .set_default("jwt.refresh_token_duration", 604800)? // 7 days
            .set_default("email.smtp_port", 587)?
            .build()?;

        let app_config: AppConfig = config.try_deserialize()?;
        
        // Validate required fields
        if app_config.database.url.is_empty() {
            anyhow::bail!("DATABASE_URL is required");
        }
        
        if app_config.redis.url.is_empty() {
            anyhow::bail!("REDIS_URL is required");
        }
        
        if app_config.jwt.secret.is_empty() {
            anyhow::bail!("JWT_SECRET is required");
        }

        Ok(app_config)
    }
}
