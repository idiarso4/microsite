use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

/// Standard pagination parameters
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct PaginationParams {
    #[validate(range(min = 1, max = 100))]
    pub page: Option<u32>,
    
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
}

impl Default for PaginationParams {
    fn default() -> Self {
        Self {
            page: Some(1),
            per_page: Some(20),
        }
    }
}

/// Standard pagination response
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub pagination: PaginationMeta,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct PaginationMeta {
    pub current_page: u32,
    pub per_page: u32,
    pub total_pages: u32,
    pub total_count: u64,
    pub has_next: bool,
    pub has_prev: bool,
}

/// Standard filter parameters
#[derive(Debug, Clone, Deserialize, Validate, ToSchema)]
pub struct FilterParams {
    pub search: Option<String>,
    pub sort_by: Option<String>,
    pub sort_order: Option<SortOrder>,
    pub created_after: Option<DateTime<Utc>>,
    pub created_before: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "lowercase")]
pub enum SortOrder {
    Asc,
    Desc,
}

impl Default for SortOrder {
    fn default() -> Self {
        Self::Desc
    }
}

/// Standard API response wrapper
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
    pub errors: Option<Vec<String>>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
            errors: None,
        }
    }

    pub fn success_with_message(data: T, message: String) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: Some(message),
            errors: None,
        }
    }

    pub fn error_typed(message: String) -> ApiResponse<T> {
        ApiResponse {
            success: false,
            data: None,
            message: Some(message),
            errors: None,
        }
    }

    pub fn error(message: String) -> ApiResponse<()> {
        ApiResponse {
            success: false,
            data: None,
            message: Some(message),
            errors: None,
        }
    }

    pub fn validation_error(errors: Vec<String>) -> ApiResponse<()> {
        ApiResponse {
            success: false,
            data: None,
            message: Some("Validation failed".to_string()),
            errors: Some(errors),
        }
    }
}

/// Base entity fields
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct BaseEntity {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Tenant-aware entity fields
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct TenantEntity {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Address structure
#[derive(Debug, Clone, Serialize, Deserialize, Validate, ToSchema)]
pub struct Address {
    #[validate(length(min = 1, max = 255))]
    pub street: String,
    
    #[validate(length(min = 1, max = 100))]
    pub city: String,
    
    #[validate(length(min = 1, max = 100))]
    pub state: Option<String>,
    
    #[validate(length(min = 1, max = 20))]
    pub postal_code: String,
    
    #[validate(length(min = 1, max = 100))]
    pub country: String,
}

/// Contact information structure
#[derive(Debug, Clone, Serialize, Deserialize, Validate, ToSchema)]
pub struct ContactInfo {
    #[validate(email)]
    pub email: Option<String>,
    
    #[validate(length(min = 1, max = 50))]
    pub phone: Option<String>,
    
    #[validate(length(min = 1, max = 50))]
    pub mobile: Option<String>,
    
    #[validate(length(min = 1, max = 50))]
    pub fax: Option<String>,
    
    #[validate(url)]
    pub website: Option<String>,
}

/// Money amount with currency
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Money {
    pub amount: f64,
    pub currency: String, // ISO 4217 currency code
}

/// File attachment
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Attachment {
    pub id: Uuid,
    pub filename: String,
    pub content_type: String,
    pub size: u64,
    pub url: String,
    pub uploaded_at: DateTime<Utc>,
}

/// Audit trail entry
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct AuditEntry {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub user_id: Uuid,
    pub action: String,
    pub entity_type: String,
    pub entity_id: Uuid,
    pub old_values: Option<serde_json::Value>,
    pub new_values: Option<serde_json::Value>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}
