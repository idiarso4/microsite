use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

// Product handlers
pub async fn list_products(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List products");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_product(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create product");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn get_product(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Get product");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn update_product(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Update product");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn delete_product(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Delete product");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Warehouse handlers
pub async fn list_warehouses(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List warehouses");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_warehouse(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create warehouse");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

// Stock handlers
pub async fn list_stock(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List stock");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn list_stock_movements(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List stock movements");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
