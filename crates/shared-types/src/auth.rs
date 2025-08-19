use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::common::BaseEntity;

/// User entity
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct User {
    #[serde(flatten)]
    pub base: BaseEntity,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub is_active: bool,
    pub email_verified_at: Option<DateTime<Utc>>,
    pub last_login_at: Option<DateTime<Utc>>,
}

/// Tenant entity
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct Tenant {
    #[serde(flatten)]
    pub base: BaseEntity,
    pub name: String,
    pub slug: String,
    pub plan: String,
    pub settings: serde_json::Value,
    pub is_active: bool,
}

/// Tenant membership
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct TenantMembership {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub user_id: Uuid,
    pub role: String,
    pub is_active: bool,
    pub joined_at: DateTime<Utc>,
}

/// Role entity
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct Role {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub is_system: bool,
    pub created_at: DateTime<Utc>,
}

/// Permission entity
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct Permission {
    pub id: Uuid,
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    pub module: String,
}

/// Login request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,

    pub remember_me: Option<bool>,
}

/// Login response
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct LoginResponse {
    pub user: User,
    pub tenant: Tenant,
    pub permissions: Vec<String>,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
}

/// Register tenant request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct RegisterTenantRequest {
    #[validate(length(min = 2, max = 100))]
    pub company_name: String,

    #[validate(length(min = 2, max = 50))]
    pub slug: String,

    #[validate(email)]
    pub admin_email: String,

    #[validate(length(min = 8))]
    pub admin_password: String,

    #[validate(length(min = 1, max = 50))]
    pub admin_first_name: String,

    #[validate(length(min = 1, max = 50))]
    pub admin_last_name: String,
}

/// Token refresh request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct RefreshTokenRequest {
    #[validate(length(min = 16))]
    pub refresh_token: String,
}

/// Accept invitation request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct AcceptInvitationRequest {
    pub token: String,

    #[validate(length(min = 8))]
    pub password: String,
}

/// Change password request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct ChangePasswordRequest {
    pub current_password: String,

    #[validate(length(min = 8))]
    pub new_password: String,
}

/// Forgot password request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct ForgotPasswordRequest {
    #[validate(email)]
    pub email: String,
}

/// Reset password request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct ResetPasswordRequest {
    pub token: String,

    #[validate(length(min = 8))]
    pub new_password: String,
}

/// Update profile request
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct UpdateProfileRequest {
    #[validate(length(min = 1, max = 50))]
    pub first_name: Option<String>,

    #[validate(length(min = 1, max = 50))]
    pub last_name: Option<String>,
}

/// JWT claims
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JwtClaims {
    pub sub: Uuid,           // user_id
    pub tenant_id: Uuid,
    pub email: String,
    pub roles: Vec<String>,
    pub permissions: Vec<String>,
    pub iat: i64,            // issued at
    pub exp: i64,            // expires at
}

/// Refresh token
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshToken {
    pub token: String,
    pub user_id: Uuid,
    pub tenant_id: Uuid,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

/// User session info
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct UserSession {
    pub user: User,
    pub tenant: Tenant,
    pub permissions: Vec<String>,
    pub roles: Vec<String>,
}

/// Invitation entity
#[derive(Debug, Clone, Serialize)]
pub struct Invitation {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub role: String,
    pub token: String,
    pub invited_by: Uuid,
    pub expires_at: DateTime<Utc>,
    pub accepted_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}
