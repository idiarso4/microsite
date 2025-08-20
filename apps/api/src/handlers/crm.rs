use axum::{extract::{State, Extension, Query, Path}, Json};
use shared_types::ApiResponse;
use std::sync::Arc;
use tracing::info;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};
use sqlx::Row;

use validator::Validate;
// Company handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListCompaniesQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>, // "asc" | "desc"
}


#[utoipa::path(
    get,
    path = "/api/v1/crm/companies",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("sort_by" = Option<String>, Query, description = "name|created_at|updated_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List companies", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn list_companies(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListCompaniesQuery>,
) -> Json<ApiResponse<shared_types::PaginatedResponse<serde_json::Value>>> {
    info!("List companies");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }
    if let Some(ref by) = q.sort_by {
        match by.as_str() {
            "name" | "created_at" | "updated_at" => {}
            _ => return Json(ApiResponse::error_typed("Invalid sort_by".to_string())),
        }
    }
    if let Some(ref by) = q.sort_by {
        match by.as_str() {
            "name" | "created_at" | "updated_at" => {}
            _ => return Json(ApiResponse::error_typed("Invalid sort_by".to_string())),
        }
    }
    if let Some(ref ord) = q.sort_order {
        match ord.to_ascii_lowercase().as_str() {
            "asc" | "desc" => {}
            _ => return Json(ApiResponse::error_typed("Invalid sort_order".to_string())),
        }
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
    let mut where_parts: Vec<&str> = vec!["is_active = true"];

    // Determine sort
    let sort_by = q.sort_by.as_deref().unwrap_or("created_at");
    let order_by = match sort_by { "name" => "name", "updated_at" => "updated_at", _ => "created_at" };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) {
        Some(ref s) if s == "asc" => "ASC",
        _ => "DESC",
    };

    // Count total + Fetch data with proper bind numbering depending on search
    let (total_count, rows): (i64, Vec<serde_json::Value>) = if let Some(search) = &q.search {
        let pattern = format!("%{}%", search);
        where_parts.push("(name ILIKE $1 OR email ILIKE $1 OR website ILIKE $1)");
        let where_clause = format!("WHERE {}", where_parts.join(" AND "));

        let total: i64 = sqlx::query_scalar(&format!("SELECT COUNT(*) FROM companies {}", where_clause))
            .bind(&pattern)
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0);

        let sql = format!(
            r#"SELECT id, tenant_id, name, website, email, phone, address, tags, is_active, created_at, updated_at
               FROM companies
               {}
               ORDER BY {} {}
               LIMIT $2 OFFSET $3"#,
            where_clause, order_by, direction
        );

        let data = sqlx::query(&sql)
            .bind(&pattern)
            .bind(per_page as i64)
            .bind(offset)
            .fetch_all(&mut *conn)
            .await
            .map(|recs| {
                recs.into_iter().map(|row| {
                    serde_json::json!({
                        "id": row.get::<uuid::Uuid, _>("id"),
                        "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                        "name": row.get::<String, _>("name"),
                        "website": row.try_get::<Option<String>, _>("website").unwrap_or(None),
                        "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                        "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                        "address": row.try_get::<serde_json::Value, _>("address").unwrap_or(serde_json::json!({})),
                        "tags": row.try_get::<Vec<String>, _>("tags").unwrap_or_default(),
                        "is_active": row.get::<bool, _>("is_active"),
                        "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                        "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
                    })
                }).collect::<Vec<_>>()
            })
            .unwrap_or_default();

        (total, data)
    } else {
        let where_clause = format!("WHERE {}", where_parts.join(" AND "));
        let total: i64 = sqlx::query_scalar(&format!("SELECT COUNT(*) FROM companies {}", where_clause))
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0);

        let sql = format!(
            r#"SELECT id, tenant_id, name, website, email, phone, address, tags, is_active, created_at, updated_at
               FROM companies
               {}
               ORDER BY {} {}
               LIMIT $1 OFFSET $2"#,
            where_clause, order_by, direction
        );

        let data = sqlx::query(&sql)
            .bind(per_page as i64)
            .bind(offset)
            .fetch_all(&mut *conn)
            .await
            .map(|recs| {
                recs.into_iter().map(|row| {
                    serde_json::json!({
                        "id": row.get::<uuid::Uuid, _>("id"),
                        "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                        "name": row.get::<String, _>("name"),
                        "website": row.try_get::<Option<String>, _>("website").unwrap_or(None),
                        "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                        "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                        "address": row.try_get::<serde_json::Value, _>("address").unwrap_or(serde_json::json!({})),
                        "tags": row.try_get::<Vec<String>, _>("tags").unwrap_or_default(),
                        "is_active": row.get::<bool, _>("is_active"),
                        "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                        "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
                    })
                }).collect::<Vec<_>>()
            })
            .unwrap_or_default();

        (total, data)
    };


    let total_pages = ((total_count as f64) / (per_page as f64)).ceil() as u32;
    let meta = shared_types::PaginationMeta {
        current_page: page,
        per_page,
        total_pages,
        total_count: total_count as u64,
        has_next: page < total_pages,
        has_prev: page > 1,
    };

    let resp = shared_types::PaginatedResponse { data: rows, pagination: meta };
    Json(ApiResponse::success(resp))
}

#[derive(serde::Deserialize, Validate, Debug)]
pub struct CreateCompanyRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(url)]
    pub website: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub phone: Option<String>,
    pub address: Option<serde_json::Value>,
    pub tags: Option<Vec<String>>,
}

#[utoipa::path(
    post,
    path = "/api/v1/crm/companies",
    request_body = CreateCompanyRequest,
    responses((status = 201, description = "Company created", body = ApiResponse<serde_json::Value>)),
    tag = "crm"
)]
pub async fn create_company(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateCompanyRequest>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Create company");

    if let Err(e) = req.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid input: {}", e)));
    }

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let address = req.address.unwrap_or(serde_json::json!({}));
    let tags = req.tags.unwrap_or_default();

    let row = sqlx::query(
        r#"INSERT INTO companies (tenant_id, name, website, email, phone, address, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, tenant_id, name, website, email, phone, address, tags, is_active, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.name)
    .bind(&req.website)
    .bind(&req.email)
    .bind(&req.phone)
    .bind(address)
    .bind(tags)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "name": row.get::<String, _>("name"),
                "website": row.try_get::<Option<String>, _>("website").unwrap_or(None),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "address": row.try_get::<serde_json::Value, _>("address").unwrap_or(serde_json::json!({})),
                "tags": row.try_get::<Vec<String>, _>("tags").unwrap_or_default(),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    get,
    path = "/api/v1/crm/companies/{id}",
    params(("id" = uuid::Uuid, Path, description = "Company ID")),
    responses((status = 200, description = "Company detail", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn get_company(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Get company {}", id);
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"SELECT id, tenant_id, name, website, email, phone, address, tags, is_active, created_at, updated_at
           FROM companies WHERE id = $1 LIMIT 1"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match row {
        Ok(Some(row)) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "name": row.get::<String, _>("name"),
                "website": row.try_get::<Option<String>, _>("website").unwrap_or(None),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "address": row.try_get::<serde_json::Value, _>("address").unwrap_or(serde_json::json!({})),
                "tags": row.try_get::<Vec<String>, _>("tags").unwrap_or_default(),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Ok(None) => Json(ApiResponse::error_typed("Company not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

#[derive(serde::Deserialize, Validate, Debug)]
pub struct UpdateCompanyRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: Option<String>,
    #[validate(url)]
    pub website: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub phone: Option<String>,
    pub address: Option<serde_json::Value>,
    pub tags: Option<Vec<String>>,
    pub is_active: Option<bool>,
}

#[utoipa::path(
    put,
    path = "/api/v1/crm/companies/{id}",
    params(("id" = uuid::Uuid, Path, description = "Company ID")),
    request_body = UpdateCompanyRequest,
    responses((status = 200, description = "Company updated", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn update_company(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
    Json(req): Json<UpdateCompanyRequest>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Update company {}", id);
    if let Err(e) = req.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid input: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"UPDATE companies SET
               name = COALESCE($2, name),
               website = COALESCE($3, website),
               email = COALESCE($4, email),
               phone = COALESCE($5, phone),
               address = COALESCE($6, address),
               tags = COALESCE($7, tags),
               is_active = COALESCE($8, is_active),
               updated_at = NOW()
           WHERE id = $1
           RETURNING id, tenant_id, name, website, email, phone, address, tags, is_active, created_at, updated_at"#
    )
    .bind(id)
    .bind(&req.name)
    .bind(&req.website)
    .bind(&req.email)
    .bind(&req.phone)
    .bind(&req.address)
    .bind(&req.tags)
    .bind(&req.is_active)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "name": row.get::<String, _>("name"),
                "website": row.try_get::<Option<String>, _>("website").unwrap_or(None),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "address": row.try_get::<serde_json::Value, _>("address").unwrap_or(serde_json::json!({})),
                "tags": row.try_get::<Vec<String>, _>("tags").unwrap_or_default(),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    delete,
    path = "/api/v1/crm/companies/{id}",
    params(("id" = uuid::Uuid, Path, description = "Company ID")),
    responses((status = 200, description = "Company deleted", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn delete_company(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Delete company {}", id);
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let res = sqlx::query(
        r#"UPDATE companies SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match res {
        Ok(Some(row)) => {
            let deleted_id: uuid::Uuid = row.get("id");
            Json(ApiResponse::success(serde_json::json!({ "deleted_id": deleted_id })))
        }
        Ok(None) => Json(ApiResponse::error_typed("Company not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

// Contact handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListContactsQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub sort_by: Option<String>, // first_name | last_name | created_at | updated_at
    pub sort_order: Option<String>, // asc | desc
}

#[utoipa::path(
    get,
    path = "/api/v1/crm/contacts",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("sort_by" = Option<String>, Query, description = "first_name|last_name|created_at|updated_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List contacts", body = ApiResponse<shared_types::PaginatedResponse<serde_json::Value>>)),
    tag = "crm"
)]
pub async fn list_contacts(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListContactsQuery>,
) -> Json<ApiResponse<shared_types::PaginatedResponse<serde_json::Value>>> {
    info!("List contacts");

    if let Err(e) = q.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid query: {}", e)));
    }
    if let Some(ref by) = q.sort_by {
        match by.as_str() {
            "first_name" | "last_name" | "created_at" | "updated_at" => {}
            _ => return Json(ApiResponse::error_typed("Invalid sort_by".to_string())),
        }
    }
    if let Some(ref ord) = q.sort_order {
        match ord.to_ascii_lowercase().as_str() {
            "asc" | "desc" => {}
            _ => return Json(ApiResponse::error_typed("Invalid sort_order".to_string())),
        }
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let page = q.page.unwrap_or(1).max(1);
    let per_page = q.per_page.unwrap_or(20).clamp(1, 100);
    let offset = ((page - 1) as i64) * (per_page as i64);

    let mut conds: Vec<String> = vec!["is_active = true".to_string()];
    let mut args: Vec<(usize, String)> = vec![];

    if let Some(search) = &q.search {
        conds.push("(first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)".to_string());
        args.push((1, format!("%{}%", search)));
    }

    let where_clause = if conds.is_empty() { String::new() } else { format!("WHERE {}", conds.join(" AND ")) };

    let total_count: i64 = if let Some((_, s)) = args.get(0) {
        sqlx::query_scalar(&format!("SELECT COUNT(*) FROM contacts {}", where_clause))
            .bind(s)
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0)
    } else {
        sqlx::query_scalar(&format!("SELECT COUNT(*) FROM contacts {}", where_clause))
            .fetch_one(&mut *conn)
            .await
            .unwrap_or(0)
    };

    let sort_by = q.sort_by.as_deref().unwrap_or("created_at");
    let order_by = match sort_by { "first_name" => "first_name", "last_name" => "last_name", "updated_at" => "updated_at", _ => "created_at" };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) { Some(ref s) if s == "asc" => "ASC", _ => "DESC" };

    let base_sql = format!(
        r#"SELECT id, tenant_id, company_id, first_name, last_name, email, phone, position, notes, is_active, created_at, updated_at
           FROM contacts
           {}
           ORDER BY {} {}
           LIMIT $2 OFFSET $3"#,
        where_clause, order_by, direction
    );

    let query = if let Some((_, s)) = args.get(0) {
        sqlx::query(&base_sql).bind(s).bind(per_page as i64).bind(offset)
    } else {
        sqlx::query(&base_sql).bind(per_page as i64).bind(offset)
    };

    let rows: Vec<serde_json::Value> = query
        .fetch_all(&mut *conn)
        .await
        .map(|recs| {
            recs.into_iter().map(|row| {
                serde_json::json!({
                    "id": row.get::<uuid::Uuid, _>("id"),
                    "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                    "company_id": row.try_get::<Option<uuid::Uuid>, _>("company_id").ok(),
                    "first_name": row.get::<String, _>("first_name"),
                    "last_name": row.get::<String, _>("last_name"),
                    "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                    "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                    "position": row.try_get::<Option<String>, _>("position").unwrap_or(None),
                    "notes": row.try_get::<Option<String>, _>("notes").unwrap_or(None),
                    "is_active": row.get::<bool, _>("is_active"),
                    "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                    "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
                })
            }).collect::<Vec<_>>()
        })
        .unwrap_or_default();

    let total_pages = ((total_count as f64) / (per_page as f64)).ceil() as u32;
    let meta = shared_types::PaginationMeta {
        current_page: page,
        per_page,
        total_pages,
        total_count: total_count as u64,
        has_next: page < total_pages,
        has_prev: page > 1,
    };

    let resp = shared_types::PaginatedResponse { data: rows, pagination: meta };
    Json(ApiResponse::success(resp))
}

#[derive(serde::Deserialize, Validate, Debug)]
pub struct CreateContactRequest {
    #[validate(length(min = 1, max = 100))]
    pub first_name: String,
    #[validate(length(min = 1, max = 100))]
    pub last_name: String,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub phone: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub position: Option<String>,
    pub notes: Option<String>,
    pub company_id: Option<uuid::Uuid>,
}

#[utoipa::path(
    post,
    path = "/api/v1/crm/contacts",
    request_body = CreateContactRequest,
    responses((status = 201, description = "Contact created", body = ApiResponse<serde_json::Value>)),
    tag = "crm"
)]
pub async fn create_contact(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateContactRequest>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Create contact");

    if let Err(e) = req.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid input: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"INSERT INTO contacts (tenant_id, company_id, first_name, last_name, email, phone, position, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, tenant_id, company_id, first_name, last_name, email, phone, position, notes, is_active, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.company_id)
    .bind(&req.first_name)
    .bind(&req.last_name)
    .bind(&req.email)
    .bind(&req.phone)
    .bind(&req.position)
    .bind(&req.notes)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "company_id": row.try_get::<Option<uuid::Uuid>, _>("company_id").ok(),
                "first_name": row.get::<String, _>("first_name"),
                "last_name": row.get::<String, _>("last_name"),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "position": row.try_get::<Option<String>, _>("position").unwrap_or(None),
                "notes": row.try_get::<Option<String>, _>("notes").unwrap_or(None),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    get,
    path = "/api/v1/crm/contacts/{id}",
    params(("id" = uuid::Uuid, Path, description = "Contact ID")),
    responses((status = 200, description = "Contact detail", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn get_contact(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Get contact {}", id);
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"SELECT id, tenant_id, company_id, first_name, last_name, email, phone, position, notes, is_active, created_at, updated_at
           FROM contacts WHERE id = $1 LIMIT 1"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match row {
        Ok(Some(row)) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "company_id": row.try_get::<Option<uuid::Uuid>, _>("company_id").ok(),
                "first_name": row.get::<String, _>("first_name"),
                "last_name": row.get::<String, _>("last_name"),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "position": row.try_get::<Option<String>, _>("position").unwrap_or(None),
                "notes": row.try_get::<Option<String>, _>("notes").unwrap_or(None),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Ok(None) => Json(ApiResponse::error_typed("Contact not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

#[derive(serde::Deserialize, Validate, Debug)]
pub struct UpdateContactRequest {
    #[validate(length(min = 1, max = 100))]
    pub first_name: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub last_name: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub phone: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub position: Option<String>,
    pub notes: Option<String>,
    pub company_id: Option<uuid::Uuid>,
    pub is_active: Option<bool>,
}

#[utoipa::path(
    put,
    path = "/api/v1/crm/contacts/{id}",
    params(("id" = uuid::Uuid, Path, description = "Contact ID")),
    request_body = UpdateContactRequest,
    responses((status = 200, description = "Contact updated", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn update_contact(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
    Json(req): Json<UpdateContactRequest>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Update contact {}", id);
    if let Err(e) = req.validate() {
        return Json(ApiResponse::error_typed(format!("Invalid input: {}", e)));
    }

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"UPDATE contacts SET
               company_id = COALESCE($2, company_id),
               first_name = COALESCE($3, first_name),
               last_name = COALESCE($4, last_name),
               email = COALESCE($5, email),
               phone = COALESCE($6, phone),
               position = COALESCE($7, position),
               notes = COALESCE($8, notes),
               is_active = COALESCE($9, is_active),
               updated_at = NOW()
           WHERE id = $1
           RETURNING id, tenant_id, company_id, first_name, last_name, email, phone, position, notes, is_active, created_at, updated_at"#
    )
    .bind(id)
    .bind(&req.company_id)
    .bind(&req.first_name)
    .bind(&req.last_name)
    .bind(&req.email)
    .bind(&req.phone)
    .bind(&req.position)
    .bind(&req.notes)
    .bind(&req.is_active)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let json = serde_json::json!({
                "id": row.get::<uuid::Uuid, _>("id"),
                "tenant_id": row.get::<uuid::Uuid, _>("tenant_id"),
                "company_id": row.try_get::<Option<uuid::Uuid>, _>("company_id").ok(),
                "first_name": row.get::<String, _>("first_name"),
                "last_name": row.get::<String, _>("last_name"),
                "email": row.try_get::<Option<String>, _>("email").unwrap_or(None),
                "phone": row.try_get::<Option<String>, _>("phone").unwrap_or(None),
                "position": row.try_get::<Option<String>, _>("position").unwrap_or(None),
                "notes": row.try_get::<Option<String>, _>("notes").unwrap_or(None),
                "is_active": row.get::<bool, _>("is_active"),
                "created_at": row.get::<chrono::DateTime<chrono::Utc>, _>("created_at"),
                "updated_at": row.get::<chrono::DateTime<chrono::Utc>, _>("updated_at"),
            });
            Json(ApiResponse::success(json))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    delete,
    path = "/api/v1/crm/contacts/{id}",
    params(("id" = uuid::Uuid, Path, description = "Contact ID")),
    responses((status = 200, description = "Contact deleted", body = ApiResponse<()>)),
    tag = "crm"
)]
pub async fn delete_contact(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<uuid::Uuid>,
) -> Json<ApiResponse<serde_json::Value>> {
    info!("Delete contact {}", id);
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let res = sqlx::query(
        r#"UPDATE contacts SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match res {
        Ok(Some(row)) => {
            let deleted_id: uuid::Uuid = row.get("id");
            Json(ApiResponse::success(serde_json::json!({ "deleted_id": deleted_id })))
        }
        Ok(None) => Json(ApiResponse::error_typed("Contact not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}
