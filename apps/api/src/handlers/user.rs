use axum::{extract::{State}, Json};
use shared_types::{ApiResponse, User};
use std::sync::Arc;
use tracing::info;
use sqlx::Row;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};

/// Get user profile
pub async fn get_profile(
    State(_state): State<Arc<AppState>>,
    current: axum::extract::Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
) -> Json<ApiResponse<User>> {
    info!("Get user profile for {}", current.email);

    // Set tenant context on this connection (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Query profile data using the same connection
    let row = sqlx::query(
        r#"SELECT id, email, first_name, last_name, is_active, email_verified_at, last_login_at
            FROM users WHERE id = $1 LIMIT 1"#
    )
    .bind(current.user_id)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let user = User {
                base: shared_types::BaseEntity { id: row.get("id"), created_at: chrono::Utc::now(), updated_at: chrono::Utc::now() },
                email: row.get("email"),
                first_name: row.try_get("first_name").ok(),
                last_name: row.try_get("last_name").ok(),
                is_active: row.get("is_active"),
                email_verified_at: row.try_get("email_verified_at").ok(),
                last_login_at: row.try_get("last_login_at").ok(),
            };
            Json(ApiResponse::success(user))
        }
        Err(e) => Json(ApiResponse::<User>::error_typed(format!("{}", e)))
    }
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
