use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

// Vendor handlers
pub async fn list_vendors(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List vendors");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_vendor(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create vendor");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Purchase Order handlers
pub async fn list_purchase_orders(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List purchase orders");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_purchase_order(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create purchase order");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
