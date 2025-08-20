use axum::{extract::{State, Extension}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

// Employee handlers
pub async fn list_employees(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List employees");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_employee(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create employee");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Leave handlers
pub async fn list_leaves(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List leaves");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_leave(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create leave");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
