use std::sync::Arc;

use axum::{
    extract::{State, Request},
    middleware::Next,
    response::Response,
};

use crate::state::AppState;
use super::auth_middleware::CurrentUser;

pub async fn set_tenant_context(
    State(state): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Result<Response, Response> {
    // Get CurrentUser from extensions
    let Some(user) = req.extensions().get::<CurrentUser>() else {
        return Err(axum::response::IntoResponse::into_response(axum::http::StatusCode::UNAUTHORIZED));
    };

    // Set Postgres GUC for RLS
    let sql = "SELECT set_config('app.current_tenant_id', $1, true)";
    if let Err(e) = sqlx::query(sql)
        .bind(user.tenant_id.to_string())
        .execute(&state.db_pool)
        .await
    {
        eprintln!("Failed to set tenant context: {:?}", e);
        return Err(axum::response::IntoResponse::into_response(axum::http::StatusCode::INTERNAL_SERVER_ERROR));
    }

    Ok(next.run(req).await)
}

