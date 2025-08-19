use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

/// Get user profile
pub async fn get_profile(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Get user profile");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Update user profile
pub async fn update_profile(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Update user profile");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Change user password
pub async fn change_password(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Change user password");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}
