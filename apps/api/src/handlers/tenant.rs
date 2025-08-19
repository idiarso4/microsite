use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

/// Get current tenant information
pub async fn get_current_tenant(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Get current tenant");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Update current tenant
pub async fn update_current_tenant(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Update current tenant");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Get tenant members
pub async fn get_members(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Get tenant members");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

/// Invite user to tenant
pub async fn invite_user(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("Invite user to tenant");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}
