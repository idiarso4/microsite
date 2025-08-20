use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Company {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub name: String,
    pub website: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    #[schema(value_type = Object)]
    pub address: JsonValue,
    pub tags: Vec<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Contact {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub company_id: Option<Uuid>,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub position: Option<String>,
    pub notes: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

