use axum::{extract::{State, Extension}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

// Vendor handlers
pub async fn list_vendors(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List vendors");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_vendor(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create vendor");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Purchase Order handlers
pub async fn list_purchase_orders(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List purchase orders");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_purchase_order(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create purchase order");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
