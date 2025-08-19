use sqlx::{postgres::PgPoolOptions, PgPool};
use anyhow::Result;
use std::time::Duration;

pub async fn create_pool(database_url: &str, max: u32, min: u32, acquire_sec: u64, idle_sec: u64) -> Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(max)
        .min_connections(min)
        .acquire_timeout(Duration::from_secs(acquire_sec))
        .idle_timeout(Duration::from_secs(idle_sec))
        .connect(database_url)
        .await?;
    Ok(pool)
}
