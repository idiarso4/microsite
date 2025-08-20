use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
};

use super::auth_middleware::CurrentUser;

pub async fn set_tenant_context(
    req: Request,
    next: Next,
) -> Result<Response, Response> {
    // Get CurrentUser from extensions
    let Some(user) = req.extensions().get::<CurrentUser>() else {
        return Err(axum::response::IntoResponse::into_response(axum::http::StatusCode::UNAUTHORIZED));
    };

    // We defer SET LOCAL ke level handler menggunakan koneksi dari extractor DbConn.
    // Middleware ini hanya memastikan CurrentUser tersedia. Jika perlu, kita bisa melakukan pengecekan tambahan di sini.

    Ok(next.run(req).await)
}

