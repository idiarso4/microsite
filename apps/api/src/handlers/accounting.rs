use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

// Account handlers
pub async fn list_accounts(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List accounts");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_account(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create account");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Journal handlers
pub async fn list_journals(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List journals");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_journal(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create journal");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
