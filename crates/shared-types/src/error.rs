use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Standard API error response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ApiError {
    pub error_type: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
    pub request_id: Option<String>,
}

impl ApiError {
    pub fn new(error_type: &str, message: &str) -> Self {
        Self {
            error_type: error_type.to_string(),
            message: message.to_string(),
            details: None,
            request_id: None,
        }
    }

    pub fn with_details(mut self, details: serde_json::Value) -> Self {
        self.details = Some(details);
        self
    }

    pub fn with_request_id(mut self, request_id: String) -> Self {
        self.request_id = Some(request_id);
        self
    }

    // Common error constructors
    pub fn validation_error(message: &str) -> Self {
        Self::new("VALIDATION_ERROR", message)
    }

    pub fn authentication_error(message: &str) -> Self {
        Self::new("AUTHENTICATION_ERROR", message)
    }

    pub fn authorization_error(message: &str) -> Self {
        Self::new("AUTHORIZATION_ERROR", message)
    }

    pub fn not_found(resource: &str) -> Self {
        Self::new("NOT_FOUND", &format!("{} not found", resource))
    }

    pub fn conflict(message: &str) -> Self {
        Self::new("CONFLICT", message)
    }

    pub fn internal_error(message: &str) -> Self {
        Self::new("INTERNAL_ERROR", message)
    }

    pub fn bad_request(message: &str) -> Self {
        Self::new("BAD_REQUEST", message)
    }

    pub fn service_unavailable(message: &str) -> Self {
        Self::new("SERVICE_UNAVAILABLE", message)
    }
}

/// Validation error details
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ValidationError {
    pub field: String,
    pub message: String,
    pub code: String,
}

/// Business logic error types
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BusinessErrorType {
    // Auth errors
    InvalidCredentials,
    AccountLocked,
    EmailNotVerified,
    TokenExpired,
    TokenInvalid,
    InsufficientPermissions,
    
    // Tenant errors
    TenantNotFound,
    TenantInactive,
    TenantSlugTaken,
    
    // User errors
    UserNotFound,
    UserAlreadyExists,
    UserInactive,
    InvalidInvitation,
    
    // Business logic errors
    InsufficientStock,
    InvalidStatusTransition,
    DuplicateEntry,
    ReferencedByOtherEntity,
    
    // External service errors
    EmailServiceUnavailable,
    PaymentServiceUnavailable,
    
    // Rate limiting
    RateLimitExceeded,
    
    // Generic
    UnknownError,
}

impl BusinessErrorType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::InvalidCredentials => "INVALID_CREDENTIALS",
            Self::AccountLocked => "ACCOUNT_LOCKED",
            Self::EmailNotVerified => "EMAIL_NOT_VERIFIED",
            Self::TokenExpired => "TOKEN_EXPIRED",
            Self::TokenInvalid => "TOKEN_INVALID",
            Self::InsufficientPermissions => "INSUFFICIENT_PERMISSIONS",
            Self::TenantNotFound => "TENANT_NOT_FOUND",
            Self::TenantInactive => "TENANT_INACTIVE",
            Self::TenantSlugTaken => "TENANT_SLUG_TAKEN",
            Self::UserNotFound => "USER_NOT_FOUND",
            Self::UserAlreadyExists => "USER_ALREADY_EXISTS",
            Self::UserInactive => "USER_INACTIVE",
            Self::InvalidInvitation => "INVALID_INVITATION",
            Self::InsufficientStock => "INSUFFICIENT_STOCK",
            Self::InvalidStatusTransition => "INVALID_STATUS_TRANSITION",
            Self::DuplicateEntry => "DUPLICATE_ENTRY",
            Self::ReferencedByOtherEntity => "REFERENCED_BY_OTHER_ENTITY",
            Self::EmailServiceUnavailable => "EMAIL_SERVICE_UNAVAILABLE",
            Self::PaymentServiceUnavailable => "PAYMENT_SERVICE_UNAVAILABLE",
            Self::RateLimitExceeded => "RATE_LIMIT_EXCEEDED",
            Self::UnknownError => "UNKNOWN_ERROR",
        }
    }
}
