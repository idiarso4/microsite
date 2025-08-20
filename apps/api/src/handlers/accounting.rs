use axum::{extract::{State, Extension}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

// Account handlers
pub async fn list_accounts(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List accounts");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_account(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create account");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Journal handlers
pub async fn list_journals(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List journals");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_journal(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create journal");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
