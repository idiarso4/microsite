use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Product {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<Uuid>,
    pub category: Option<Category>,
    pub unit_of_measure: String,
    pub cost_price: Decimal,
    pub selling_price: Decimal,
    pub minimum_stock: i32,
    pub current_stock: i32,
    pub status: ProductStatus,
    pub barcode: Option<String>,
    pub weight: Option<Decimal>,
    pub dimensions: Option<serde_json::Value>,
    pub supplier_id: Option<Uuid>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum ProductStatus {
    Active,
    Inactive,
    Discontinued,
    OutOfStock,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Category {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<Uuid>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Warehouse {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub address: Option<serde_json::Value>,
    pub manager_id: Option<Uuid>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct StockMovement {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub product_id: Uuid,
    pub product: Option<Product>,
    pub warehouse_id: Uuid,
    pub warehouse: Option<Warehouse>,
    pub movement_type: StockMovementType,
    pub quantity: i32,
    pub unit_cost: Option<Decimal>,
    pub reference_type: Option<String>, // purchase_order, sales_order, adjustment, etc.
    pub reference_id: Option<Uuid>,
    pub notes: Option<String>,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum StockMovementType {
    In,      // Stock masuk
    Out,     // Stock keluar
    Transfer, // Transfer antar gudang
    Adjustment, // Penyesuaian stock
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct StockLevel {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub product_id: Uuid,
    pub product: Option<Product>,
    pub warehouse_id: Uuid,
    pub warehouse: Option<Warehouse>,
    pub quantity_on_hand: i32,
    pub quantity_reserved: i32,
    pub quantity_available: i32,
    pub minimum_stock: i32,
    pub maximum_stock: Option<i32>,
    pub reorder_point: Option<i32>,
    pub last_movement_at: Option<DateTime<Utc>>,
    pub updated_at: DateTime<Utc>,
}

// Request/Response DTOs
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateProductRequest {
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<Uuid>,
    pub unit_of_measure: String,
    pub cost_price: Decimal,
    pub selling_price: Decimal,
    pub minimum_stock: i32,
    pub barcode: Option<String>,
    pub weight: Option<Decimal>,
    pub dimensions: Option<serde_json::Value>,
    pub supplier_id: Option<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateProductRequest {
    pub sku: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub category_id: Option<Uuid>,
    pub unit_of_measure: Option<String>,
    pub cost_price: Option<Decimal>,
    pub selling_price: Option<Decimal>,
    pub minimum_stock: Option<i32>,
    pub status: Option<ProductStatus>,
    pub barcode: Option<String>,
    pub weight: Option<Decimal>,
    pub dimensions: Option<serde_json::Value>,
    pub supplier_id: Option<Uuid>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateCategoryRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub parent_id: Option<Uuid>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateWarehouseRequest {
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub address: Option<serde_json::Value>,
    pub manager_id: Option<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateWarehouseRequest {
    pub code: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub address: Option<serde_json::Value>,
    pub manager_id: Option<Uuid>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateStockMovementRequest {
    pub product_id: Uuid,
    pub warehouse_id: Uuid,
    pub movement_type: StockMovementType,
    pub quantity: i32,
    pub unit_cost: Option<Decimal>,
    pub reference_type: Option<String>,
    pub reference_id: Option<Uuid>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct StockAdjustmentRequest {
    pub product_id: Uuid,
    pub warehouse_id: Uuid,
    pub new_quantity: i32,
    pub reason: String,
    pub notes: Option<String>,
}

// Inventory Reports
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct InventoryValuation {
    pub product_id: Uuid,
    pub product: Product,
    pub warehouse_id: Uuid,
    pub warehouse: Warehouse,
    pub quantity_on_hand: i32,
    pub unit_cost: Decimal,
    pub total_value: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LowStockAlert {
    pub product_id: Uuid,
    pub product: Product,
    pub warehouse_id: Uuid,
    pub warehouse: Warehouse,
    pub current_stock: i32,
    pub minimum_stock: i32,
    pub shortage: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct StockMovementReport {
    pub product_id: Uuid,
    pub product: Product,
    pub warehouse_id: Uuid,
    pub warehouse: Warehouse,
    pub opening_stock: i32,
    pub stock_in: i32,
    pub stock_out: i32,
    pub adjustments: i32,
    pub closing_stock: i32,
    pub period_start: DateTime<Utc>,
    pub period_end: DateTime<Utc>,
}
