use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Vendor {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub code: String,
    pub name: String,
    pub contact_person: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<serde_json::Value>,
    pub tax_number: Option<String>,
    pub payment_terms: Option<String>, // NET30, NET60, etc.
    pub currency: String,
    pub status: VendorStatus,
    pub credit_limit: Option<Decimal>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum VendorStatus {
    Active,
    Inactive,
    Blocked,
    Pending,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PurchaseOrder {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub po_number: String,
    pub vendor_id: Uuid,
    pub vendor: Option<Vendor>,
    pub order_date: NaiveDate,
    pub expected_delivery_date: Option<NaiveDate>,
    pub delivery_address: Option<serde_json::Value>,
    pub status: PurchaseOrderStatus,
    pub currency: String,
    pub exchange_rate: Decimal,
    pub subtotal: Decimal,
    pub tax_amount: Decimal,
    pub discount_amount: Decimal,
    pub total_amount: Decimal,
    pub notes: Option<String>,
    pub terms_conditions: Option<String>,
    pub created_by: Uuid,
    pub approved_by: Option<Uuid>,
    pub approved_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub items: Option<Vec<PurchaseOrderItem>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum PurchaseOrderStatus {
    Draft,
    Pending,
    Approved,
    Sent,
    PartiallyReceived,
    Received,
    Cancelled,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PurchaseOrderItem {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub purchase_order_id: Uuid,
    pub product_id: Uuid,
    pub product_sku: Option<String>,
    pub product_name: Option<String>,
    pub description: Option<String>,
    pub quantity_ordered: i32,
    pub quantity_received: i32,
    pub unit_price: Decimal,
    pub discount_percent: Decimal,
    pub discount_amount: Decimal,
    pub tax_percent: Decimal,
    pub tax_amount: Decimal,
    pub line_total: Decimal,
    pub line_number: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PurchaseReceipt {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub receipt_number: String,
    pub purchase_order_id: Uuid,
    pub purchase_order: Option<PurchaseOrder>,
    pub vendor_id: Uuid,
    pub vendor: Option<Vendor>,
    pub receipt_date: NaiveDate,
    pub warehouse_id: Uuid,
    pub status: ReceiptStatus,
    pub notes: Option<String>,
    pub received_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub items: Option<Vec<PurchaseReceiptItem>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum ReceiptStatus {
    Draft,
    Received,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PurchaseReceiptItem {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub purchase_receipt_id: Uuid,
    pub purchase_order_item_id: Uuid,
    pub product_id: Uuid,
    pub quantity_received: i32,
    pub unit_cost: Decimal,
    pub line_total: Decimal,
    pub quality_status: QualityStatus,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum QualityStatus {
    Accepted,
    Rejected,
    Pending,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct VendorInvoice {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub invoice_number: String,
    pub vendor_invoice_number: String,
    pub vendor_id: Uuid,
    pub vendor: Option<Vendor>,
    pub purchase_order_id: Option<Uuid>,
    pub invoice_date: NaiveDate,
    pub due_date: NaiveDate,
    pub currency: String,
    pub exchange_rate: Decimal,
    pub subtotal: Decimal,
    pub tax_amount: Decimal,
    pub discount_amount: Decimal,
    pub total_amount: Decimal,
    pub paid_amount: Decimal,
    pub outstanding_amount: Decimal,
    pub status: InvoiceStatus,
    pub payment_terms: Option<String>,
    pub notes: Option<String>,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum InvoiceStatus {
    Draft,
    Pending,
    Approved,
    Paid,
    Overdue,
    Cancelled,
}

// Request/Response DTOs
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateVendorRequest {
    pub code: String,
    pub name: String,
    pub contact_person: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<serde_json::Value>,
    pub tax_number: Option<String>,
    pub payment_terms: Option<String>,
    pub currency: String,
    pub credit_limit: Option<Decimal>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateVendorRequest {
    pub code: Option<String>,
    pub name: Option<String>,
    pub contact_person: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<serde_json::Value>,
    pub tax_number: Option<String>,
    pub payment_terms: Option<String>,
    pub currency: Option<String>,
    pub status: Option<VendorStatus>,
    pub credit_limit: Option<Decimal>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreatePurchaseOrderRequest {
    pub vendor_id: Uuid,
    pub order_date: NaiveDate,
    pub expected_delivery_date: Option<NaiveDate>,
    pub delivery_address: Option<serde_json::Value>,
    pub currency: String,
    pub exchange_rate: Option<Decimal>,
    pub notes: Option<String>,
    pub terms_conditions: Option<String>,
    pub items: Vec<CreatePurchaseOrderItemRequest>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreatePurchaseOrderItemRequest {
    pub product_id: Uuid,
    pub description: Option<String>,
    pub quantity_ordered: i32,
    pub unit_price: Decimal,
    pub discount_percent: Option<Decimal>,
    pub tax_percent: Option<Decimal>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdatePurchaseOrderRequest {
    pub vendor_id: Option<Uuid>,
    pub order_date: Option<NaiveDate>,
    pub expected_delivery_date: Option<NaiveDate>,
    pub delivery_address: Option<serde_json::Value>,
    pub status: Option<PurchaseOrderStatus>,
    pub notes: Option<String>,
    pub terms_conditions: Option<String>,
    pub items: Option<Vec<CreatePurchaseOrderItemRequest>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreatePurchaseReceiptRequest {
    pub purchase_order_id: Uuid,
    pub receipt_date: NaiveDate,
    pub warehouse_id: Uuid,
    pub notes: Option<String>,
    pub items: Vec<CreatePurchaseReceiptItemRequest>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreatePurchaseReceiptItemRequest {
    pub purchase_order_item_id: Uuid,
    pub quantity_received: i32,
    pub unit_cost: Decimal,
    pub quality_status: QualityStatus,
    pub notes: Option<String>,
}

// Reports
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct VendorPerformanceReport {
    pub vendor: Vendor,
    pub total_orders: i32,
    pub total_amount: Decimal,
    pub on_time_delivery_rate: Decimal,
    pub quality_rating: Decimal,
    pub average_lead_time: i32, // days
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PurchaseAnalytics {
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub total_purchase_orders: i32,
    pub total_purchase_amount: Decimal,
    pub average_order_value: Decimal,
    pub top_vendors: Vec<VendorPerformanceReport>,
    pub pending_orders_count: i32,
    pub pending_orders_value: Decimal,
}
