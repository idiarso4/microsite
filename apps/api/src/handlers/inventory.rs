use axum::{extract::{State, Extension}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

// Product handlers
pub async fn list_products(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List products");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create product");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn get_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Get product");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn update_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Update product");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn delete_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Delete product");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Warehouse handlers
pub async fn list_warehouses(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List warehouses");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_warehouse(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("Create warehouse");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

// Stock handlers
pub async fn list_stock(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List stock");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn list_stock_movements(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<()>> {
    info!("List stock movements");
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
