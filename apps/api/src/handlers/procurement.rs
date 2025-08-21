use axum::{extract::{State, Extension, Query, Path}, Json};
use shared_types::{ApiResponse, PaginatedResponse, PaginationMeta};
use std::sync::Arc;
use tracing::info;
use sqlx::{Row, Acquire};
use validator::Validate;
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use uuid::Uuid;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};
use shared_types::procurement::*;

// Query parameters for listing vendors
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListVendorsQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub status: Option<String>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/procurement/vendors",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("sort_by" = Option<String>, Query, description = "code|name|created_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List vendors", body = ApiResponse<PaginatedResponse<Vendor>>)),
    tag = "procurement"
)]
pub async fn list_vendors(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListVendorsQuery>,
) -> Json<ApiResponse<PaginatedResponse<Vendor>>> {
    info!("List vendors");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    // Build dynamic filters
    let mut where_parts: Vec<String> = vec!["is_active = true".to_string()];
    let mut bind_params: Vec<String> = vec![];
    let mut param_count = 0;

    if let Some(search) = &q.search {
        param_count += 1;
        where_parts.push(format!("(code ILIKE ${} OR name ILIKE ${})", param_count, param_count));
        bind_params.push(format!("%{}%", search));
    }

    if let Some(status) = &q.status {
        param_count += 1;
        where_parts.push(format!("status = ${}", param_count));
        bind_params.push(status.clone());
    }

    let where_clause = if where_parts.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_parts.join(" AND "))
    };

    // Determine sort
    let sort_by = q.sort_by.as_deref().unwrap_or("code");
    let order_by = match sort_by {
        "name" => "name",
        "created_at" => "created_at",
        _ => "code"
    };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) {
        Some(ref s) if s == "desc" => "DESC",
        _ => "ASC",
    };

    // Count total
    let count_sql = format!("SELECT COUNT(*) FROM vendors {}", where_clause);
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        count_query = count_query.bind(param);
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT id, tenant_id, code, name, contact_person, email, phone, address,
                  tax_number, payment_terms, currency, status, credit_limit, is_active,
                  created_at, updated_at
           FROM vendors
           {}
           ORDER BY {} {}
           LIMIT ${} OFFSET ${}"#,
        where_clause, order_by, direction, param_count + 1, param_count + 2
    );

    let mut data_query = sqlx::query(&data_sql);
    for param in &bind_params {
        data_query = data_query.bind(param);
    }
    data_query = data_query.bind(per_page as i64).bind(offset);

    let rows = data_query
        .fetch_all(&mut *conn)
        .await
        .map(|recs| {
            recs.into_iter().map(|row| {
                Vendor {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    code: row.get("code"),
                    name: row.get("name"),
                    contact_person: row.try_get("contact_person").unwrap_or(None),
                    email: row.try_get("email").unwrap_or(None),
                    phone: row.try_get("phone").unwrap_or(None),
                    address: row.try_get("address").unwrap_or(None),
                    tax_number: row.try_get("tax_number").unwrap_or(None),
                    payment_terms: row.try_get("payment_terms").unwrap_or(None),
                    currency: row.get("currency"),
                    status: match row.get::<String, _>("status").as_str() {
                        "inactive" => VendorStatus::Inactive,
                        "blocked" => VendorStatus::Blocked,
                        "pending" => VendorStatus::Pending,
                        _ => VendorStatus::Active,
                    },
                    credit_limit: row.try_get("credit_limit").unwrap_or(None),
                    is_active: row.get("is_active"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                }
            }).collect::<Vec<_>>()
        })
        .unwrap_or_default();

    let total_pages = ((total_count as f64) / (per_page as f64)).ceil() as u32;
    let meta = PaginationMeta {
        current_page: page,
        per_page,
        total_pages,
        total_count: total_count as u64,
        has_next: page < total_pages,
        has_prev: page > 1,
    };

    let resp = PaginatedResponse { data: rows, pagination: meta };
    Json(ApiResponse::success(resp))
}

#[utoipa::path(
    post,
    path = "/api/v1/procurement/vendors",
    request_body = CreateVendorRequest,
    responses((status = 201, description = "Vendor created", body = ApiResponse<Vendor>)),
    tag = "procurement"
)]
pub async fn create_vendor(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateVendorRequest>,
) -> Json<ApiResponse<Vendor>> {
    info!("Create vendor");

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Check if vendor code already exists
    let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM vendors WHERE code = $1")
        .bind(&req.code)
        .fetch_one(&mut *conn)
        .await
        .unwrap_or(0);

    if existing > 0 {
        return Json(ApiResponse::error_typed("Vendor code already exists".to_string()));
    }

    let row = sqlx::query(
        r#"INSERT INTO vendors (tenant_id, code, name, contact_person, email, phone, address,
                              tax_number, payment_terms, currency, credit_limit)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, tenant_id, code, name, contact_person, email, phone, address,
                     tax_number, payment_terms, currency, status, credit_limit, is_active,
                     created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.code)
    .bind(&req.name)
    .bind(&req.contact_person)
    .bind(&req.email)
    .bind(&req.phone)
    .bind(&req.address)
    .bind(&req.tax_number)
    .bind(&req.payment_terms)
    .bind(&req.currency)
    .bind(&req.credit_limit)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let vendor = Vendor {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                code: row.get("code"),
                name: row.get("name"),
                contact_person: row.try_get("contact_person").unwrap_or(None),
                email: row.try_get("email").unwrap_or(None),
                phone: row.try_get("phone").unwrap_or(None),
                address: row.try_get("address").unwrap_or(None),
                tax_number: row.try_get("tax_number").unwrap_or(None),
                payment_terms: row.try_get("payment_terms").unwrap_or(None),
                currency: row.get("currency"),
                status: VendorStatus::Active,
                credit_limit: row.try_get("credit_limit").unwrap_or(None),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(vendor))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

// Purchase Order handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListPurchaseOrdersQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub vendor_id: Option<Uuid>,
    pub status: Option<String>,
    pub from_date: Option<NaiveDate>,
    pub to_date: Option<NaiveDate>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/procurement/purchase-orders",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("vendor_id" = Option<String>, Query, description = "Filter by vendor"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("from_date" = Option<String>, Query, description = "From date (YYYY-MM-DD)"),
        ("to_date" = Option<String>, Query, description = "To date (YYYY-MM-DD)"),
        ("sort_by" = Option<String>, Query, description = "order_date|po_number|created_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List purchase orders", body = ApiResponse<PaginatedResponse<PurchaseOrder>>)),
    tag = "procurement"
)]
pub async fn list_purchase_orders(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListPurchaseOrdersQuery>,
) -> Json<ApiResponse<PaginatedResponse<PurchaseOrder>>> {
    info!("List purchase orders");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    // Build dynamic filters
    let mut where_parts: Vec<String> = vec!["po.tenant_id = current_setting('app.current_tenant_id', true)::UUID".to_string()];
    let mut bind_params: Vec<String> = vec![];
    let mut param_count = 0;

    if let Some(search) = &q.search {
        param_count += 1;
        where_parts.push(format!("(po.po_number ILIKE ${} OR v.name ILIKE ${})", param_count, param_count));
        bind_params.push(format!("%{}%", search));
    }

    if let Some(vendor_id) = &q.vendor_id {
        param_count += 1;
        where_parts.push(format!("po.vendor_id = ${}", param_count));
        bind_params.push(vendor_id.to_string());
    }

    if let Some(status) = &q.status {
        param_count += 1;
        where_parts.push(format!("po.status = ${}", param_count));
        bind_params.push(status.clone());
    }

    if let Some(from_date) = &q.from_date {
        param_count += 1;
        where_parts.push(format!("po.order_date >= ${}", param_count));
        bind_params.push(from_date.to_string());
    }

    if let Some(to_date) = &q.to_date {
        param_count += 1;
        where_parts.push(format!("po.order_date <= ${}", param_count));
        bind_params.push(to_date.to_string());
    }

    let where_clause = format!("WHERE {}", where_parts.join(" AND "));

    // Determine sort
    let sort_by = q.sort_by.as_deref().unwrap_or("order_date");
    let order_by = match sort_by {
        "po_number" => "po.po_number",
        "created_at" => "po.created_at",
        _ => "po.order_date"
    };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) {
        Some(ref s) if s == "asc" => "ASC",
        _ => "DESC",
    };

    // Count total
    let count_sql = format!(
        "SELECT COUNT(*) FROM purchase_orders po JOIN vendors v ON po.vendor_id = v.id {}",
        where_clause
    );
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        count_query = count_query.bind(param);
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT po.id, po.tenant_id, po.po_number, po.vendor_id, po.order_date,
                  po.expected_delivery_date, po.delivery_address, po.status, po.currency,
                  po.exchange_rate, po.subtotal, po.tax_amount, po.discount_amount,
                  po.total_amount, po.notes, po.terms_conditions, po.created_by,
                  po.approved_by, po.approved_at, po.created_at, po.updated_at,
                  v.code as vendor_code, v.name as vendor_name
           FROM purchase_orders po
           JOIN vendors v ON po.vendor_id = v.id
           {}
           ORDER BY {} {}
           LIMIT ${} OFFSET ${}"#,
        where_clause, order_by, direction, param_count + 1, param_count + 2
    );

    let mut data_query = sqlx::query(&data_sql);
    for param in &bind_params {
        data_query = data_query.bind(param);
    }
    data_query = data_query.bind(per_page as i64).bind(offset);

    let rows = data_query
        .fetch_all(&mut *conn)
        .await
        .map(|recs| {
            recs.into_iter().map(|row| {
                let vendor = Vendor {
                    id: row.get("vendor_id"),
                    tenant_id: current.tenant_id,
                    code: row.get("vendor_code"),
                    name: row.get("vendor_name"),
                    contact_person: None,
                    email: None,
                    phone: None,
                    address: None,
                    tax_number: None,
                    payment_terms: None,
                    currency: "IDR".to_string(),
                    status: VendorStatus::Active,
                    credit_limit: None,
                    is_active: true,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                };

                PurchaseOrder {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    po_number: row.get("po_number"),
                    vendor_id: row.get("vendor_id"),
                    vendor: Some(vendor),
                    order_date: row.get("order_date"),
                    expected_delivery_date: row.try_get("expected_delivery_date").ok(),
                    delivery_address: row.try_get("delivery_address").unwrap_or(None),
                    status: match row.get::<String, _>("status").as_str() {
                        "pending" => PurchaseOrderStatus::Pending,
                        "approved" => PurchaseOrderStatus::Approved,
                        "sent" => PurchaseOrderStatus::Sent,
                        "partially_received" => PurchaseOrderStatus::PartiallyReceived,
                        "received" => PurchaseOrderStatus::Received,
                        "cancelled" => PurchaseOrderStatus::Cancelled,
                        "closed" => PurchaseOrderStatus::Closed,
                        _ => PurchaseOrderStatus::Draft,
                    },
                    currency: row.get("currency"),
                    exchange_rate: row.get("exchange_rate"),
                    subtotal: row.get("subtotal"),
                    tax_amount: row.get("tax_amount"),
                    discount_amount: row.get("discount_amount"),
                    total_amount: row.get("total_amount"),
                    notes: row.try_get("notes").unwrap_or(None),
                    terms_conditions: row.try_get("terms_conditions").unwrap_or(None),
                    created_by: row.get("created_by"),
                    approved_by: row.try_get("approved_by").ok(),
                    approved_at: row.try_get("approved_at").ok(),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                    items: None, // Will be loaded separately if needed
                }
            }).collect::<Vec<_>>()
        })
        .unwrap_or_default();

    let total_pages = ((total_count as f64) / (per_page as f64)).ceil() as u32;
    let meta = PaginationMeta {
        current_page: page,
        per_page,
        total_pages,
        total_count: total_count as u64,
        has_next: page < total_pages,
        has_prev: page > 1,
    };

    let resp = PaginatedResponse { data: rows, pagination: meta };
    Json(ApiResponse::success(resp))
}

#[utoipa::path(
    post,
    path = "/api/v1/procurement/purchase-orders",
    request_body = CreatePurchaseOrderRequest,
    responses((status = 201, description = "Purchase order created", body = ApiResponse<PurchaseOrder>)),
    tag = "procurement"
)]
pub async fn create_purchase_order(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreatePurchaseOrderRequest>,
) -> Json<ApiResponse<PurchaseOrder>> {
    info!("Create purchase order");

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Validate that vendor exists
    let vendor_exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM vendors WHERE id = $1 AND is_active = true")
        .bind(&req.vendor_id)
        .fetch_one(&mut *conn)
        .await
        .unwrap_or(0);

    if vendor_exists == 0 {
        return Json(ApiResponse::error_typed("Vendor not found or inactive".to_string()));
    }

    // Generate PO number
    let po_number = format!("PO-{}-{:06}",
        chrono::Utc::now().format("%Y%m"),
        chrono::Utc::now().timestamp_millis() % 1000000
    );

    let exchange_rate = req.exchange_rate.unwrap_or(Decimal::ONE);

    // Start transaction
    let mut tx = match conn.begin().await {
        Ok(tx) => tx,
        Err(e) => return Json(ApiResponse::error_typed(format!("Failed to start transaction: {}", e))),
    };

    // Insert purchase order header
    let po_row = sqlx::query(
        r#"INSERT INTO purchase_orders (tenant_id, po_number, vendor_id, order_date,
                                       expected_delivery_date, delivery_address, currency,
                                       exchange_rate, notes, terms_conditions, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, tenant_id, po_number, vendor_id, order_date, expected_delivery_date,
                     delivery_address, status, currency, exchange_rate, subtotal, tax_amount,
                     discount_amount, total_amount, notes, terms_conditions, created_by,
                     approved_by, approved_at, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&po_number)
    .bind(&req.vendor_id)
    .bind(&req.order_date)
    .bind(&req.expected_delivery_date)
    .bind(&req.delivery_address)
    .bind(&req.currency)
    .bind(exchange_rate)
    .bind(&req.notes)
    .bind(&req.terms_conditions)
    .bind(current.user_id)
    .fetch_one(&mut *tx)
    .await;

    let purchase_order = match po_row {
        Ok(row) => {
            let po_id: Uuid = row.get("id");

            // Insert purchase order items
            for (index, item) in req.items.iter().enumerate() {
                let discount_percent = item.discount_percent.unwrap_or(Decimal::ZERO);
                let tax_percent = item.tax_percent.unwrap_or(Decimal::ZERO);

                let discount_amount = item.unit_price * Decimal::from(item.quantity_ordered) * discount_percent / Decimal::from(100);
                let subtotal_after_discount = (item.unit_price * Decimal::from(item.quantity_ordered)) - discount_amount;
                let tax_amount = subtotal_after_discount * tax_percent / Decimal::from(100);
                let line_total = subtotal_after_discount + tax_amount;

                let item_result = sqlx::query(
                    r#"INSERT INTO purchase_order_items (tenant_id, purchase_order_id, product_id,
                                                        description, quantity_ordered, unit_price,
                                                        discount_percent, discount_amount, tax_percent,
                                                        tax_amount, line_total, line_number)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"#
                )
                .bind(current.tenant_id)
                .bind(po_id)
                .bind(item.product_id)
                .bind(&item.description)
                .bind(item.quantity_ordered)
                .bind(item.unit_price)
                .bind(discount_percent)
                .bind(discount_amount)
                .bind(tax_percent)
                .bind(tax_amount)
                .bind(line_total)
                .bind((index + 1) as i32)
                .execute(&mut *tx)
                .await;

                if item_result.is_err() {
                    let _ = tx.rollback().await;
                    return Json(ApiResponse::error_typed("Failed to create purchase order items".to_string()));
                }
            }

            // Commit transaction
            if tx.commit().await.is_err() {
                return Json(ApiResponse::error_typed("Failed to commit transaction".to_string()));
            }

            PurchaseOrder {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                po_number: row.get("po_number"),
                vendor_id: row.get("vendor_id"),
                vendor: None, // Will be loaded separately if needed
                order_date: row.get("order_date"),
                expected_delivery_date: row.try_get("expected_delivery_date").ok(),
                delivery_address: row.try_get("delivery_address").unwrap_or(None),
                status: PurchaseOrderStatus::Draft,
                currency: row.get("currency"),
                exchange_rate: row.get("exchange_rate"),
                subtotal: row.get("subtotal"),
                tax_amount: row.get("tax_amount"),
                discount_amount: row.get("discount_amount"),
                total_amount: row.get("total_amount"),
                notes: row.try_get("notes").unwrap_or(None),
                terms_conditions: row.try_get("terms_conditions").unwrap_or(None),
                created_by: row.get("created_by"),
                approved_by: None,
                approved_at: None,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
                items: None,
            }
        }
        Err(e) => {
            let _ = tx.rollback().await;
            return Json(ApiResponse::error_typed(format!("Failed to create purchase order: {}", e)));
        }
    };

    Json(ApiResponse::success(purchase_order))
}
