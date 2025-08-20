use axum::{extract::{State, Extension}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

/// Get current tenant information
pub async fn get_current_tenant(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Get current tenant");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Update current tenant
pub async fn update_current_tenant(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Update current tenant");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Get tenant members
pub async fn get_members(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Get tenant members");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Invite user to tenant
pub async fn invite_user(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Invite user to tenant");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}
