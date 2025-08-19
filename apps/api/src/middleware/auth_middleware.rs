use std::sync::Arc;

use axum::{
    extract::{State, Request},
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use uuid::Uuid;

use crate::state::AppState;

#[derive(Clone, Debug)]
pub struct CurrentUser {
    pub user_id: Uuid,
    pub tenant_id: Uuid,
    pub email: String,
    pub roles: Vec<String>,
    pub permissions: Vec<String>,
}

pub async fn require_auth(
    State(state): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // Read Authorization: Bearer <token>
    let Some(authz) = req.headers().get(axum::http::header::AUTHORIZATION) else {
        return Err(StatusCode::UNAUTHORIZED);
    };
    let Ok(authz) = authz.to_str() else { return Err(StatusCode::UNAUTHORIZED) };
    if !authz.to_ascii_lowercase().starts_with("bearer ") {
        return Err(StatusCode::UNAUTHORIZED);
    }
    let token = authz[7..].trim();

    // Validate token
    let claims = match state.jwt_service.validate_token(token) {
        Ok(c) => c,
        Err(_) => return Err(StatusCode::UNAUTHORIZED),
    };

    // Insert current user context
    let ctx = CurrentUser {
        user_id: claims.sub,
        tenant_id: claims.tenant_id,
        email: claims.email,
        roles: claims.roles,
        permissions: claims.permissions,
    };
    req.extensions_mut().insert(ctx);

    Ok(next.run(req).await)
}

