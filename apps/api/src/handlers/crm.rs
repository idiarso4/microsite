use axum::{extract::State, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

// Company handlers
pub async fn list_companies(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List companies");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn create_company(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create company");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn get_company(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Get company");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn update_company(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Update company");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

pub async fn delete_company(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Delete company");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}

// Contact handlers
pub async fn list_contacts(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("List contacts");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn create_contact(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Create contact");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn get_contact(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Get contact");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn update_contact(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Update contact");
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}

pub async fn delete_contact(State(_state): State<Arc<AppState>>) -> Json<ApiResponse<()>> {
    info!("Delete contact");
    Json(ApiResponse::<()>::error_typed("Not implemented yet".to_string()))
}
