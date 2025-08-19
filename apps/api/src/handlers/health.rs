use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use shared_types::ApiResponse;
use std::sync::Arc;
use utoipa::ToSchema;

use crate::state::AppState;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct HealthStatus {
    pub status: String,
    pub version: String,
    pub database: String,
    pub redis: String,
    pub uptime: u64,
}

/// Health check endpoint
#[utoipa::path(
    get,
    path = "/health",
    responses(
        (status = 200, description = "Health check successful", body = ApiResponse<HealthStatus>),
        (status = 503, description = "Service unavailable", body = ApiResponse<()>)
    ),
    tag = "health"
)]
pub async fn health_check(
    State(state): State<Arc<AppState>>,
) -> Json<ApiResponse<HealthStatus>> {
    let database_status = check_database(&state).await;
    let redis_status = check_redis(&state).await;
    
    let overall_status = if database_status == "healthy" && redis_status == "healthy" {
        "healthy"
    } else {
        "unhealthy"
    };

    let health = HealthStatus {
        status: overall_status.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        database: database_status,
        redis: redis_status,
        uptime: get_uptime(),
    };

    Json(ApiResponse::success(health))
}

async fn check_database(state: &AppState) -> String {
    match sqlx::query("SELECT 1").execute(&state.db_pool).await {
        Ok(_) => "healthy".to_string(),
        Err(_) => "unhealthy".to_string(),
    }
}

async fn check_redis(state: &AppState) -> String {
    let mut conn = state.redis.clone();
    match redis::cmd("PING").query_async::<_, String>(&mut conn).await {
        Ok(_) => "healthy".to_string(),
        Err(_) => "unhealthy".to_string(),
    }
}

fn get_uptime() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    
    static START_TIME: std::sync::OnceLock<u64> = std::sync::OnceLock::new();
    let start = START_TIME.get_or_init(|| {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
    });
    
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() - start
}
