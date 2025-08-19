use thiserror::Error;
use uuid::Uuid;

/// Domain-specific errors
#[derive(Error, Debug)]
pub enum DomainError {
    // Authentication errors
    #[error("Invalid credentials")]
    InvalidCredentials,
    
    #[error("Account is locked")]
    AccountLocked,
    
    #[error("Email not verified")]
    EmailNotVerified,
    
    #[error("Token has expired")]
    TokenExpired,
    
    #[error("Invalid token")]
    TokenInvalid,
    
    #[error("Insufficient permissions: {permission}")]
    InsufficientPermissions { permission: String },
    
    // Tenant errors
    #[error("Tenant not found: {tenant_id}")]
    TenantNotFound { tenant_id: Uuid },
    
    #[error("Tenant is inactive: {tenant_id}")]
    TenantInactive { tenant_id: Uuid },
    
    #[error("Tenant slug already taken: {slug}")]
    TenantSlugTaken { slug: String },
    
    // User errors
    #[error("User not found: {user_id}")]
    UserNotFound { user_id: Uuid },
    
    #[error("User already exists: {email}")]
    UserAlreadyExists { email: String },
    
    #[error("User is inactive: {user_id}")]
    UserInactive { user_id: Uuid },
    
    #[error("Invalid invitation")]
    InvalidInvitation,
    
    // Business logic errors
    #[error("Insufficient stock for product: {product_id}")]
    InsufficientStock { product_id: Uuid },
    
    #[error("Invalid status transition from {from} to {to}")]
    InvalidStatusTransition { from: String, to: String },
    
    #[error("Duplicate entry: {field}")]
    DuplicateEntry { field: String },
    
    #[error("Entity is referenced by other entities")]
    ReferencedByOtherEntity,
    
    // Validation errors
    #[error("Validation failed: {message}")]
    ValidationFailed { message: String },
    
    // External service errors
    #[error("Email service unavailable")]
    EmailServiceUnavailable,
    
    #[error("Payment service unavailable")]
    PaymentServiceUnavailable,
    
    // Generic errors
    #[error("Internal error: {message}")]
    InternalError { message: String },
    
    #[error("Not found: {resource}")]
    NotFound { resource: String },
    
    #[error("Conflict: {message}")]
    Conflict { message: String },
}

impl DomainError {
    pub fn error_code(&self) -> &'static str {
        match self {
            Self::InvalidCredentials => "INVALID_CREDENTIALS",
            Self::AccountLocked => "ACCOUNT_LOCKED",
            Self::EmailNotVerified => "EMAIL_NOT_VERIFIED",
            Self::TokenExpired => "TOKEN_EXPIRED",
            Self::TokenInvalid => "TOKEN_INVALID",
            Self::InsufficientPermissions { .. } => "INSUFFICIENT_PERMISSIONS",
            Self::TenantNotFound { .. } => "TENANT_NOT_FOUND",
            Self::TenantInactive { .. } => "TENANT_INACTIVE",
            Self::TenantSlugTaken { .. } => "TENANT_SLUG_TAKEN",
            Self::UserNotFound { .. } => "USER_NOT_FOUND",
            Self::UserAlreadyExists { .. } => "USER_ALREADY_EXISTS",
            Self::UserInactive { .. } => "USER_INACTIVE",
            Self::InvalidInvitation => "INVALID_INVITATION",
            Self::InsufficientStock { .. } => "INSUFFICIENT_STOCK",
            Self::InvalidStatusTransition { .. } => "INVALID_STATUS_TRANSITION",
            Self::DuplicateEntry { .. } => "DUPLICATE_ENTRY",
            Self::ReferencedByOtherEntity => "REFERENCED_BY_OTHER_ENTITY",
            Self::ValidationFailed { .. } => "VALIDATION_FAILED",
            Self::EmailServiceUnavailable => "EMAIL_SERVICE_UNAVAILABLE",
            Self::PaymentServiceUnavailable => "PAYMENT_SERVICE_UNAVAILABLE",
            Self::InternalError { .. } => "INTERNAL_ERROR",
            Self::NotFound { .. } => "NOT_FOUND",
            Self::Conflict { .. } => "CONFLICT",
        }
    }

    pub fn http_status_code(&self) -> u16 {
        match self {
            Self::InvalidCredentials 
            | Self::AccountLocked 
            | Self::EmailNotVerified 
            | Self::TokenExpired 
            | Self::TokenInvalid => 401,
            
            Self::InsufficientPermissions { .. } => 403,
            
            Self::TenantNotFound { .. } 
            | Self::UserNotFound { .. } 
            | Self::NotFound { .. } => 404,
            
            Self::TenantSlugTaken { .. } 
            | Self::UserAlreadyExists { .. } 
            | Self::DuplicateEntry { .. } 
            | Self::Conflict { .. } => 409,
            
            Self::ValidationFailed { .. } 
            | Self::InvalidInvitation 
            | Self::InvalidStatusTransition { .. } => 422,
            
            Self::EmailServiceUnavailable 
            | Self::PaymentServiceUnavailable => 502,
            
            _ => 500,
        }
    }
}

pub type DomainResult<T> = Result<T, DomainError>;
