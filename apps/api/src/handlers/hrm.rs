use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

// Employee handlers
pub async fn list_employees(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List employees");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_employee(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create employee");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Leave handlers
pub async fn list_leaves(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List leaves");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_leave(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create leave");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
