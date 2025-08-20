use axum::{extract::State, Json};
use shared_types::{
    ApiResponse, LoginRequest, LoginResponse, RegisterTenantRequest,
    ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest
};
use validator::Validate;
use std::sync::Arc;
use tracing::info;

use crate::state::AppState;

/// User login
#[utoipa::path(
    post,
    path = "/api/v1/auth/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = ApiResponse<LoginResponse>),
        (status = 401, description = "Invalid credentials", body = ApiResponse<()>),
        (status = 422, description = "Validation error", body = ApiResponse<()>)
    ),
    tag = "auth"
)]
pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(request): Json<LoginRequest>,
) -> Json<ApiResponse<LoginResponse>> {
    info!("Login attempt for email: {}", request.email);

    // Validate input (basic)
    if let Err(e) = request.validate() {
        return Json(ApiResponse::<LoginResponse>::error_typed(format!("Invalid input: {}", e)));
    }

    // Do login via service
    match crate::services::AuthAppService::new(&state.db_pool, &state.jwt_service, &state.password_service, &state.redis)
        .login(&request)
        .await
    {
        Ok(resp) => Json(ApiResponse::success(resp)),
        Err(e) => Json(ApiResponse::<LoginResponse>::error_typed(format!("{}", e))),
    }
}

/// Register new tenant
#[utoipa::path(
    post,
    path = "/api/v1/auth/register",
    request_body = RegisterTenantRequest,
    responses(
        (status = 201, description = "Registration successful", body = ApiResponse<()>),
        (status = 409, description = "Email or slug already exists", body = ApiResponse<()>),
        (status = 422, description = "Validation error", body = ApiResponse<()>)
    ),
    tag = "auth"
)]
pub async fn register_tenant(
    State(state): State<Arc<AppState>>,
    Json(request): Json<RegisterTenantRequest>,
) -> Json<ApiResponse<()>> {
    info!("Tenant registration attempt for: {}", request.company_name);

    if let Err(e) = request.validate() {
        return Json(ApiResponse::<()>::error(format!("Invalid input: {}", e)));
    }

    let svc = crate::services::AuthAppService::new(&state.db_pool, &state.jwt_service, &state.password_service, &state.redis);
    let result = svc
        .register_tenant(
            &request.company_name,
            &request.slug,
            &request.admin_email,
            &request.admin_password,
            &request.admin_first_name,
            &request.admin_last_name,
        )
        .await;

    match result {
        Ok(()) => Json(ApiResponse::success_with_message((), "Registration successful".to_string())),
        Err(e) => Json(ApiResponse::<()>::error(format!("{}", e))),
    }
}

/// User logout
pub async fn logout(
    State(_state): State<Arc<AppState>>,
) -> Json<ApiResponse<()>> {
    info!("User logout");
    
    // TODO: Implement logout
    // 1. Extract refresh token from request
    // 2. Blacklist refresh token in Redis
    // 3. Clear cookies
    // 4. Return success response
    
    Json(ApiResponse::success_with_message((), "Logged out successfully".to_string()))
}

/// Refresh access token
#[utoipa::path(
    post,
    path = "/api/v1/auth/refresh",
    request_body = RefreshTokenRequest,
    responses(
        (status = 200, description = "Token refreshed", body = ApiResponse<LoginResponse>),
        (status = 401, description = "Invalid or expired token", body = ApiResponse<()>),
        (status = 422, description = "Validation error", body = ApiResponse<()>)
    ),
    tag = "auth"
)]
pub async fn refresh(
    State(state): State<Arc<AppState>>,
    Json(request): Json<RefreshTokenRequest>,
) -> Json<ApiResponse<LoginResponse>> {
    info!("Token refresh attempt");

    if let Err(e) = request.validate() {
        return Json(ApiResponse::<LoginResponse>::error_typed(format!("Invalid input: {}", e)));
    }

    let svc = crate::services::AuthAppService::new(&state.db_pool, &state.jwt_service, &state.password_service, &state.redis);
    match svc.refresh(&request.refresh_token).await {
        Ok(resp) => Json(ApiResponse::success(resp)),
        Err(e) => Json(ApiResponse::<LoginResponse>::error_typed(format!("{}", e))),
    }
}

/// Forgot password
pub async fn forgot_password(
    State(_state): State<Arc<AppState>>,
    Json(request): Json<ForgotPasswordRequest>,
) -> Json<ApiResponse<()>> {
    info!("Forgot password request for email: {}", request.email);
    
    // TODO: Implement forgot password
    // 1. Validate email
    // 2. Find user by email
    // 3. Generate reset token
    // 4. Store token in Redis with expiry
    // 5. Send reset email
    // 6. Return success response (always, for security)
    
    Json(ApiResponse::success_with_message(
        (), 
        "If the email exists, a password reset link has been sent".to_string()
    ))
}

/// Reset password
pub async fn reset_password(
    State(_state): State<Arc<AppState>>,
    Json(request): Json<ResetPasswordRequest>,
) -> Json<ApiResponse<()>> {
    info!("Password reset attempt");
    
    // TODO: Implement password reset
    // 1. Validate token
    // 2. Check if token exists in Redis
    // 3. Get user from token
    // 4. Validate new password strength
    // 5. Hash new password
    // 6. Update user password
    // 7. Delete reset token from Redis
    // 8. Invalidate all user sessions
    // 9. Return success response
    
    Json(ApiResponse::<()>::error("Not implemented yet".to_string()))
}
