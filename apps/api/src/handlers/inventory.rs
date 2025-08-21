use axum::{extract::{State, Extension, Query, Path}, Json};
use shared_types::{ApiResponse, PaginatedResponse, PaginationMeta};
use std::sync::Arc;
use tracing::info;
use sqlx::Row;
use utoipa::ToSchema;
use validator::Validate;
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use uuid::Uuid;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};
use shared_types::inventory::*;

// Query parameters for listing products
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListProductsQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub category_id: Option<Uuid>,
    pub status: Option<String>,
    pub low_stock: Option<bool>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/inventory/products",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("category_id" = Option<String>, Query, description = "Filter by category"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("low_stock" = Option<bool>, Query, description = "Filter low stock items"),
        ("sort_by" = Option<String>, Query, description = "sku|name|created_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List products", body = ApiResponse<PaginatedResponse<Product>>)),
    tag = "inventory"
)]
pub async fn list_products(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListProductsQuery>,
) -> Json<ApiResponse<PaginatedResponse<Product>>> {
    info!("List products");

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
    let mut where_parts: Vec<String> = vec!["p.is_active = true".to_string()];
    let mut bind_params: Vec<String> = vec![];
    let mut param_count = 0;

    if let Some(search) = &q.search {
        param_count += 1;
        where_parts.push(format!("(p.sku ILIKE ${} OR p.name ILIKE ${})", param_count, param_count));
        bind_params.push(format!("%{}%", search));
    }

    if let Some(category_id) = &q.category_id {
        param_count += 1;
        where_parts.push(format!("p.category_id = ${}", param_count));
        bind_params.push(category_id.to_string());
    }

    if let Some(status) = &q.status {
        param_count += 1;
        where_parts.push(format!("p.status = ${}", param_count));
        bind_params.push(status.clone());
    }

    if q.low_stock.unwrap_or(false) {
        where_parts.push("p.current_stock <= p.minimum_stock".to_string());
    }

    let where_clause = if where_parts.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_parts.join(" AND "))
    };

    // Determine sort
    let sort_by = q.sort_by.as_deref().unwrap_or("created_at");
    let order_by = match sort_by {
        "sku" => "p.sku",
        "name" => "p.name",
        _ => "p.created_at"
    };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) {
        Some(ref s) if s == "asc" => "ASC",
        _ => "DESC",
    };

    // Count total
    let count_sql = format!(
        "SELECT COUNT(*) FROM products p LEFT JOIN product_categories c ON p.category_id = c.id {}",
        where_clause
    );
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        count_query = count_query.bind(param);
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT p.id, p.tenant_id, p.sku, p.name, p.description, p.category_id,
                  c.name as category_name, p.unit_of_measure, p.cost_price, p.selling_price,
                  p.minimum_stock, p.current_stock, p.status, p.barcode, p.weight,
                  p.dimensions, p.supplier_id, p.is_active, p.created_at, p.updated_at
           FROM products p
           LEFT JOIN product_categories c ON p.category_id = c.id
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
                let category = if row.try_get::<Uuid, _>("category_id").is_ok() {
                    Some(Category {
                        id: row.get("category_id"),
                        tenant_id: current.tenant_id,
                        name: row.try_get("category_name").unwrap_or_default(),
                        description: None,
                        parent_id: None,
                        is_active: true,
                        created_at: Utc::now(),
                        updated_at: Utc::now(),
                    })
                } else {
                    None
                };

                Product {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    sku: row.get("sku"),
                    name: row.get("name"),
                    description: row.try_get("description").unwrap_or(None),
                    category_id: row.try_get("category_id").ok(),
                    category,
                    unit_of_measure: row.get("unit_of_measure"),
                    cost_price: row.get("cost_price"),
                    selling_price: row.get("selling_price"),
                    minimum_stock: row.get("minimum_stock"),
                    current_stock: row.get("current_stock"),
                    status: match row.get::<String, _>("status").as_str() {
                        "inactive" => ProductStatus::Inactive,
                        "discontinued" => ProductStatus::Discontinued,
                        "out_of_stock" => ProductStatus::OutOfStock,
                        _ => ProductStatus::Active,
                    },
                    barcode: row.try_get("barcode").unwrap_or(None),
                    weight: row.try_get("weight").unwrap_or(None),
                    dimensions: row.try_get("dimensions").unwrap_or(None),
                    supplier_id: row.try_get("supplier_id").ok(),
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
    path = "/api/v1/inventory/products",
    request_body = CreateProductRequest,
    responses((status = 201, description = "Product created", body = ApiResponse<Product>)),
    tag = "inventory"
)]
pub async fn create_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateProductRequest>,
) -> Json<ApiResponse<Product>> {
    info!("Create product");

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Check if SKU already exists
    let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM products WHERE sku = $1")
        .bind(&req.sku)
        .fetch_one(&mut *conn)
        .await
        .unwrap_or(0);

    if existing > 0 {
        return Json(ApiResponse::error_typed("SKU already exists".to_string()));
    }

    let row = sqlx::query(
        r#"INSERT INTO products (tenant_id, sku, name, description, category_id, unit_of_measure,
                                cost_price, selling_price, minimum_stock, barcode, weight, dimensions, supplier_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING id, tenant_id, sku, name, description, category_id, unit_of_measure,
                     cost_price, selling_price, minimum_stock, current_stock, status, barcode,
                     weight, dimensions, supplier_id, is_active, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.sku)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.category_id)
    .bind(&req.unit_of_measure)
    .bind(&req.cost_price)
    .bind(&req.selling_price)
    .bind(&req.minimum_stock)
    .bind(&req.barcode)
    .bind(&req.weight)
    .bind(&req.dimensions)
    .bind(&req.supplier_id)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let product = Product {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                sku: row.get("sku"),
                name: row.get("name"),
                description: row.try_get("description").unwrap_or(None),
                category_id: row.try_get("category_id").ok(),
                category: None, // Will be loaded separately if needed
                unit_of_measure: row.get("unit_of_measure"),
                cost_price: row.get("cost_price"),
                selling_price: row.get("selling_price"),
                minimum_stock: row.get("minimum_stock"),
                current_stock: row.get("current_stock"),
                status: ProductStatus::Active,
                barcode: row.try_get("barcode").unwrap_or(None),
                weight: row.try_get("weight").unwrap_or(None),
                dimensions: row.try_get("dimensions").unwrap_or(None),
                supplier_id: row.try_get("supplier_id").ok(),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(product))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    get,
    path = "/api/v1/inventory/products/{id}",
    params(("id" = uuid::Uuid, Path, description = "Product ID")),
    responses((status = 200, description = "Product detail", body = ApiResponse<Product>)),
    tag = "inventory"
)]
pub async fn get_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<Uuid>,
) -> Json<ApiResponse<Product>> {
    info!("Get product {}", id);

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"SELECT p.id, p.tenant_id, p.sku, p.name, p.description, p.category_id,
                  c.name as category_name, p.unit_of_measure, p.cost_price, p.selling_price,
                  p.minimum_stock, p.current_stock, p.status, p.barcode, p.weight,
                  p.dimensions, p.supplier_id, p.is_active, p.created_at, p.updated_at
           FROM products p
           LEFT JOIN product_categories c ON p.category_id = c.id
           WHERE p.id = $1 LIMIT 1"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match row {
        Ok(Some(row)) => {
            let category = if row.try_get::<Uuid, _>("category_id").is_ok() {
                Some(Category {
                    id: row.get("category_id"),
                    tenant_id: current.tenant_id,
                    name: row.try_get("category_name").unwrap_or_default(),
                    description: None,
                    parent_id: None,
                    is_active: true,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                })
            } else {
                None
            };

            let product = Product {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                sku: row.get("sku"),
                name: row.get("name"),
                description: row.try_get("description").unwrap_or(None),
                category_id: row.try_get("category_id").ok(),
                category,
                unit_of_measure: row.get("unit_of_measure"),
                cost_price: row.get("cost_price"),
                selling_price: row.get("selling_price"),
                minimum_stock: row.get("minimum_stock"),
                current_stock: row.get("current_stock"),
                status: match row.get::<String, _>("status").as_str() {
                    "inactive" => ProductStatus::Inactive,
                    "discontinued" => ProductStatus::Discontinued,
                    "out_of_stock" => ProductStatus::OutOfStock,
                    _ => ProductStatus::Active,
                },
                barcode: row.try_get("barcode").unwrap_or(None),
                weight: row.try_get("weight").unwrap_or(None),
                dimensions: row.try_get("dimensions").unwrap_or(None),
                supplier_id: row.try_get("supplier_id").ok(),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(product))
        }
        Ok(None) => Json(ApiResponse::error_typed("Product not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

#[utoipa::path(
    put,
    path = "/api/v1/inventory/products/{id}",
    params(("id" = uuid::Uuid, Path, description = "Product ID")),
    request_body = UpdateProductRequest,
    responses((status = 200, description = "Product updated", body = ApiResponse<Product>)),
    tag = "inventory"
)]
pub async fn update_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateProductRequest>,
) -> Json<ApiResponse<Product>> {
    info!("Update product {}", id);

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Check if SKU already exists (if being updated)
    if let Some(sku) = &req.sku {
        let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM products WHERE sku = $1 AND id != $2")
            .bind(sku)
            .bind(id)
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0);

        if existing > 0 {
            return Json(ApiResponse::error_typed("SKU already exists".to_string()));
        }
    }

    let status_str = req.status.as_ref().map(|s| match s {
        ProductStatus::Active => "active",
        ProductStatus::Inactive => "inactive",
        ProductStatus::Discontinued => "discontinued",
        ProductStatus::OutOfStock => "out_of_stock",
    });

    let row = sqlx::query(
        r#"UPDATE products SET
               sku = COALESCE($2, sku),
               name = COALESCE($3, name),
               description = COALESCE($4, description),
               category_id = COALESCE($5, category_id),
               unit_of_measure = COALESCE($6, unit_of_measure),
               cost_price = COALESCE($7, cost_price),
               selling_price = COALESCE($8, selling_price),
               minimum_stock = COALESCE($9, minimum_stock),
               status = COALESCE($10, status),
               barcode = COALESCE($11, barcode),
               weight = COALESCE($12, weight),
               dimensions = COALESCE($13, dimensions),
               supplier_id = COALESCE($14, supplier_id),
               is_active = COALESCE($15, is_active),
               updated_at = NOW()
           WHERE id = $1
           RETURNING id, tenant_id, sku, name, description, category_id, unit_of_measure,
                     cost_price, selling_price, minimum_stock, current_stock, status, barcode,
                     weight, dimensions, supplier_id, is_active, created_at, updated_at"#
    )
    .bind(id)
    .bind(&req.sku)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.category_id)
    .bind(&req.unit_of_measure)
    .bind(&req.cost_price)
    .bind(&req.selling_price)
    .bind(&req.minimum_stock)
    .bind(status_str)
    .bind(&req.barcode)
    .bind(&req.weight)
    .bind(&req.dimensions)
    .bind(&req.supplier_id)
    .bind(&req.is_active)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let product = Product {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                sku: row.get("sku"),
                name: row.get("name"),
                description: row.try_get("description").unwrap_or(None),
                category_id: row.try_get("category_id").ok(),
                category: None, // Will be loaded separately if needed
                unit_of_measure: row.get("unit_of_measure"),
                cost_price: row.get("cost_price"),
                selling_price: row.get("selling_price"),
                minimum_stock: row.get("minimum_stock"),
                current_stock: row.get("current_stock"),
                status: match row.get::<String, _>("status").as_str() {
                    "inactive" => ProductStatus::Inactive,
                    "discontinued" => ProductStatus::Discontinued,
                    "out_of_stock" => ProductStatus::OutOfStock,
                    _ => ProductStatus::Active,
                },
                barcode: row.try_get("barcode").unwrap_or(None),
                weight: row.try_get("weight").unwrap_or(None),
                dimensions: row.try_get("dimensions").unwrap_or(None),
                supplier_id: row.try_get("supplier_id").ok(),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(product))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    delete,
    path = "/api/v1/inventory/products/{id}",
    params(("id" = uuid::Uuid, Path, description = "Product ID")),
    responses((status = 200, description = "Product deleted", body = ApiResponse<()>)),
    tag = "inventory"
)]
pub async fn delete_product(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<Uuid>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Delete product {}", id);

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let res = sqlx::query(
        r#"UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match res {
        Ok(Some(row)) => {
            let deleted_id: Uuid = row.get("id");
            Json(ApiResponse::success(serde_json::json!({ "deleted_id": deleted_id })))
        }
        Ok(None) => Json(ApiResponse::error_typed("Product not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

// Warehouse handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListWarehousesQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/inventory/warehouses",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
    ),
    responses((status = 200, description = "List warehouses", body = ApiResponse<PaginatedResponse<Warehouse>>)),
    tag = "inventory"
)]
pub async fn list_warehouses(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListWarehousesQuery>,
) -> Json<ApiResponse<PaginatedResponse<Warehouse>>> {
    info!("List warehouses");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    let (where_clause, bind_param) = if let Some(search) = &q.search {
        ("WHERE is_active = true AND (code ILIKE $1 OR name ILIKE $1)", Some(format!("%{}%", search)))
    } else {
        ("WHERE is_active = true", None)
    };

    // Count total
    let count_sql = format!("SELECT COUNT(*) FROM warehouses {}", where_clause);
    let total_count: i64 = if let Some(param) = &bind_param {
        sqlx::query_scalar(&count_sql)
            .bind(param)
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0)
    } else {
        sqlx::query_scalar(&count_sql)
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0)
    };

    // Fetch data
    let data_sql = format!(
        r#"SELECT id, tenant_id, code, name, description, address, manager_id,
                  is_active, created_at, updated_at
           FROM warehouses
           {}
           ORDER BY code ASC
           LIMIT $2 OFFSET $3"#,
        where_clause
    );

    let rows = if let Some(param) = &bind_param {
        sqlx::query(&data_sql)
            .bind(param)
            .bind(per_page as i64)
            .bind(offset)
            .fetch_all(&mut *conn)
            .await
    } else {
        sqlx::query(&data_sql)
            .bind(per_page as i64)
            .bind(offset)
            .fetch_all(&mut *conn)
            .await
    };

    let warehouses = rows
        .map(|recs| {
            recs.into_iter().map(|row| {
                Warehouse {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    code: row.get("code"),
                    name: row.get("name"),
                    description: row.try_get("description").unwrap_or(None),
                    address: row.try_get("address").unwrap_or(None),
                    manager_id: row.try_get("manager_id").ok(),
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

    let resp = PaginatedResponse { data: warehouses, pagination: meta };
    Json(ApiResponse::success(resp))
}

#[utoipa::path(
    post,
    path = "/api/v1/inventory/warehouses",
    request_body = CreateWarehouseRequest,
    responses((status = 201, description = "Warehouse created", body = ApiResponse<Warehouse>)),
    tag = "inventory"
)]
pub async fn create_warehouse(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateWarehouseRequest>,
) -> Json<ApiResponse<Warehouse>> {
    info!("Create warehouse");

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Check if code already exists
    let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM warehouses WHERE code = $1")
        .bind(&req.code)
        .fetch_one(&mut *conn)
        .await
        .unwrap_or(0);

    if existing > 0 {
        return Json(ApiResponse::error_typed("Warehouse code already exists".to_string()));
    }

    let row = sqlx::query(
        r#"INSERT INTO warehouses (tenant_id, code, name, description, address, manager_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, tenant_id, code, name, description, address, manager_id,
                     is_active, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.code)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.address)
    .bind(&req.manager_id)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let warehouse = Warehouse {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                code: row.get("code"),
                name: row.get("name"),
                description: row.try_get("description").unwrap_or(None),
                address: row.try_get("address").unwrap_or(None),
                manager_id: row.try_get("manager_id").ok(),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(warehouse))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

// Stock handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListStockQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    pub warehouse_id: Option<Uuid>,
    pub low_stock: Option<bool>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/inventory/stock",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("warehouse_id" = Option<String>, Query, description = "Filter by warehouse"),
        ("low_stock" = Option<bool>, Query, description = "Filter low stock items"),
        ("search" = Option<String>, Query, description = "Search term"),
    ),
    responses((status = 200, description = "List stock levels", body = ApiResponse<PaginatedResponse<StockLevel>>)),
    tag = "inventory"
)]
pub async fn list_stock(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListStockQuery>,
) -> Json<ApiResponse<PaginatedResponse<StockLevel>>> {
    info!("List stock");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    // Build dynamic filters
    let mut where_parts: Vec<String> = vec!["sl.tenant_id = current_setting('app.current_tenant_id', true)::UUID".to_string()];
    let mut bind_params: Vec<String> = vec![];
    let mut param_count = 0;

    if let Some(warehouse_id) = &q.warehouse_id {
        param_count += 1;
        where_parts.push(format!("sl.warehouse_id = ${}", param_count));
        bind_params.push(warehouse_id.to_string());
    }

    if q.low_stock.unwrap_or(false) {
        where_parts.push("sl.quantity_on_hand <= sl.minimum_stock".to_string());
    }

    if let Some(search) = &q.search {
        param_count += 1;
        where_parts.push(format!("(p.sku ILIKE ${} OR p.name ILIKE ${})", param_count, param_count));
        bind_params.push(format!("%{}%", search));
    }

    let where_clause = format!("WHERE {}", where_parts.join(" AND "));

    // Count total
    let count_sql = format!(
        "SELECT COUNT(*) FROM stock_levels sl JOIN products p ON sl.product_id = p.id JOIN warehouses w ON sl.warehouse_id = w.id {}",
        where_clause
    );
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        count_query = count_query.bind(param);
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT sl.id, sl.tenant_id, sl.product_id, sl.warehouse_id, sl.quantity_on_hand,
                  sl.quantity_reserved, sl.quantity_available, sl.minimum_stock, sl.maximum_stock,
                  sl.reorder_point, sl.last_movement_at, sl.updated_at,
                  p.sku, p.name as product_name, p.unit_of_measure,
                  w.code as warehouse_code, w.name as warehouse_name
           FROM stock_levels sl
           JOIN products p ON sl.product_id = p.id
           JOIN warehouses w ON sl.warehouse_id = w.id
           {}
           ORDER BY p.sku ASC
           LIMIT ${} OFFSET ${}"#,
        where_clause, param_count + 1, param_count + 2
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
                let product = Product {
                    id: row.get("product_id"),
                    tenant_id: current.tenant_id,
                    sku: row.get("sku"),
                    name: row.get("product_name"),
                    description: None,
                    category_id: None,
                    category: None,
                    unit_of_measure: row.get("unit_of_measure"),
                    cost_price: Decimal::ZERO,
                    selling_price: Decimal::ZERO,
                    minimum_stock: 0,
                    current_stock: 0,
                    status: ProductStatus::Active,
                    barcode: None,
                    weight: None,
                    dimensions: None,
                    supplier_id: None,
                    is_active: true,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                };

                let warehouse = Warehouse {
                    id: row.get("warehouse_id"),
                    tenant_id: current.tenant_id,
                    code: row.get("warehouse_code"),
                    name: row.get("warehouse_name"),
                    description: None,
                    address: None,
                    manager_id: None,
                    is_active: true,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                };

                StockLevel {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    product_id: row.get("product_id"),
                    product: Some(product),
                    warehouse_id: row.get("warehouse_id"),
                    warehouse: Some(warehouse),
                    quantity_on_hand: row.get("quantity_on_hand"),
                    quantity_reserved: row.get("quantity_reserved"),
                    quantity_available: row.get("quantity_available"),
                    minimum_stock: row.get("minimum_stock"),
                    maximum_stock: row.try_get("maximum_stock").ok(),
                    reorder_point: row.try_get("reorder_point").ok(),
                    last_movement_at: row.try_get("last_movement_at").ok(),
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

#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListStockMovementsQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    pub product_id: Option<Uuid>,
    pub warehouse_id: Option<Uuid>,
    pub movement_type: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/inventory/stock/movements",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("product_id" = Option<String>, Query, description = "Filter by product"),
        ("warehouse_id" = Option<String>, Query, description = "Filter by warehouse"),
        ("movement_type" = Option<String>, Query, description = "Filter by movement type"),
    ),
    responses((status = 200, description = "List stock movements", body = ApiResponse<PaginatedResponse<StockMovement>>)),
    tag = "inventory"
)]
pub async fn list_stock_movements(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListStockMovementsQuery>,
) -> Json<ApiResponse<PaginatedResponse<StockMovement>>> {
    info!("List stock movements");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    // Build dynamic filters
    let mut where_parts: Vec<String> = vec!["sm.tenant_id = current_setting('app.current_tenant_id', true)::UUID".to_string()];
    let mut bind_params: Vec<String> = vec![];
    let mut param_count = 0;

    if let Some(product_id) = &q.product_id {
        param_count += 1;
        where_parts.push(format!("sm.product_id = ${}", param_count));
        bind_params.push(product_id.to_string());
    }

    if let Some(warehouse_id) = &q.warehouse_id {
        param_count += 1;
        where_parts.push(format!("sm.warehouse_id = ${}", param_count));
        bind_params.push(warehouse_id.to_string());
    }

    if let Some(movement_type) = &q.movement_type {
        param_count += 1;
        where_parts.push(format!("sm.movement_type = ${}", param_count));
        bind_params.push(movement_type.clone());
    }

    let where_clause = format!("WHERE {}", where_parts.join(" AND "));

    // Count total
    let count_sql = format!(
        "SELECT COUNT(*) FROM stock_movements sm {}",
        where_clause
    );
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        count_query = count_query.bind(param);
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT sm.id, sm.tenant_id, sm.product_id, sm.warehouse_id, sm.movement_type,
                  sm.quantity, sm.unit_cost, sm.reference_type, sm.reference_id, sm.notes,
                  sm.created_by, sm.created_at,
                  p.sku, p.name as product_name,
                  w.code as warehouse_code, w.name as warehouse_name
           FROM stock_movements sm
           JOIN products p ON sm.product_id = p.id
           JOIN warehouses w ON sm.warehouse_id = w.id
           {}
           ORDER BY sm.created_at DESC
           LIMIT ${} OFFSET ${}"#,
        where_clause, param_count + 1, param_count + 2
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
                StockMovement {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    product_id: row.get("product_id"),
                    product: None, // Simplified for performance
                    warehouse_id: row.get("warehouse_id"),
                    warehouse: None, // Simplified for performance
                    movement_type: match row.get::<String, _>("movement_type").as_str() {
                        "out" => StockMovementType::Out,
                        "transfer" => StockMovementType::Transfer,
                        "adjustment" => StockMovementType::Adjustment,
                        _ => StockMovementType::In,
                    },
                    quantity: row.get("quantity"),
                    unit_cost: row.try_get("unit_cost").ok(),
                    reference_type: row.try_get("reference_type").ok(),
                    reference_id: row.try_get("reference_id").ok(),
                    notes: row.try_get("notes").ok(),
                    created_by: row.get("created_by"),
                    created_at: row.get("created_at"),
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
