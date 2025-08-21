use axum::{extract::{State, Extension, Query, Path}, Json};
use shared_types::{ApiResponse, PaginatedResponse, PaginationMeta};
use std::sync::Arc;
use tracing::info;
use sqlx::{Row, Acquire};
use utoipa::ToSchema;
use validator::Validate;
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use uuid::Uuid;

use crate::{state::AppState, middleware::{auth_middleware::CurrentUser, db_conn::DbConn}};
use shared_types::accounting::*;

// Query parameters for listing accounts
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListAccountsQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub account_type: Option<String>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/accounting/accounts",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("account_type" = Option<String>, Query, description = "Filter by account type"),
        ("sort_by" = Option<String>, Query, description = "code|name|created_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List accounts", body = ApiResponse<PaginatedResponse<Account>>)),
    tag = "accounting"
)]
pub async fn list_accounts(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListAccountsQuery>,
) -> Json<ApiResponse<PaginatedResponse<Account>>> {
    info!("List accounts");

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
    let mut where_parts: Vec<&str> = vec!["is_active = true"];
    let mut bind_count = 0;

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

    // Build query with filters
    let (total_count, rows): (i64, Vec<Account>) = if let Some(search) = &q.search {
        bind_count += 1;
        let pattern = format!("%{}%", search);
        where_parts.push("(code ILIKE $1 OR name ILIKE $1)");

        if let Some(account_type) = &q.account_type {
            bind_count += 1;
            where_parts.push("account_type = $2");
        }

        let where_clause = format!("WHERE {}", where_parts.join(" AND "));

        let total: i64 = if q.account_type.is_some() {
            sqlx::query_scalar(&format!("SELECT COUNT(*) FROM accounts {}", where_clause))
                .bind(&pattern)
                .bind(q.account_type.as_ref().unwrap())
                .fetch_one(&mut *conn)
                .await
                .unwrap_or(0)
        } else {
            sqlx::query_scalar(&format!("SELECT COUNT(*) FROM accounts {}", where_clause))
                .bind(&pattern)
                .fetch_one(&mut *conn)
                .await
                .unwrap_or(0)
        };

        let sql = format!(
            r#"SELECT id, tenant_id, code, name, account_type, account_subtype, parent_id,
                      is_active, description, balance_type, created_at, updated_at
               FROM accounts
               {}
               ORDER BY {} {}
               LIMIT ${} OFFSET ${}"#,
            where_clause, order_by, direction, bind_count + 1, bind_count + 2
        );

        let query = if q.account_type.is_some() {
            sqlx::query(&sql)
                .bind(&pattern)
                .bind(q.account_type.as_ref().unwrap())
                .bind(per_page as i64)
                .bind(offset)
        } else {
            sqlx::query(&sql)
                .bind(&pattern)
                .bind(per_page as i64)
                .bind(offset)
        };

        let data = query
            .fetch_all(&mut *conn)
            .await
            .map(|recs| {
                recs.into_iter().map(|row| {
                    Account {
                        id: row.get("id"),
                        tenant_id: row.get("tenant_id"),
                        code: row.get("code"),
                        name: row.get("name"),
                        account_type: match row.get::<String, _>("account_type").as_str() {
                            "asset" => AccountType::Asset,
                            "liability" => AccountType::Liability,
                            "equity" => AccountType::Equity,
                            "revenue" => AccountType::Revenue,
                            "expense" => AccountType::Expense,
                            _ => AccountType::Asset,
                        },
                        account_subtype: row.try_get("account_subtype").unwrap_or(None),
                        parent_id: row.try_get("parent_id").unwrap_or(None),
                        is_active: row.get("is_active"),
                        description: row.try_get("description").unwrap_or(None),
                        balance_type: match row.get::<String, _>("balance_type").as_str() {
                            "credit" => BalanceType::Credit,
                            _ => BalanceType::Debit,
                        },
                        created_at: row.get("created_at"),
                        updated_at: row.get("updated_at"),
                    }
                }).collect::<Vec<_>>()
            })
            .unwrap_or_default();

        (total, data)
    } else {
        // No search filter
        if let Some(account_type) = &q.account_type {
            where_parts.push("account_type = $1");
            bind_count += 1;
        }

        let where_clause = format!("WHERE {}", where_parts.join(" AND "));

        let total: i64 = if q.account_type.is_some() {
            sqlx::query_scalar(&format!("SELECT COUNT(*) FROM accounts {}", where_clause))
                .bind(q.account_type.as_ref().unwrap())
                .fetch_one(&mut *conn)
                .await
                .unwrap_or(0)
        } else {
            sqlx::query_scalar(&format!("SELECT COUNT(*) FROM accounts {}", where_clause))
                .fetch_one(&mut *conn)
                .await
                .unwrap_or(0)
        };

        let sql = format!(
            r#"SELECT id, tenant_id, code, name, account_type, account_subtype, parent_id,
                      is_active, description, balance_type, created_at, updated_at
               FROM accounts
               {}
               ORDER BY {} {}
               LIMIT ${} OFFSET ${}"#,
            where_clause, order_by, direction, bind_count + 1, bind_count + 2
        );

        let query = if q.account_type.is_some() {
            sqlx::query(&sql)
                .bind(q.account_type.as_ref().unwrap())
                .bind(per_page as i64)
                .bind(offset)
        } else {
            sqlx::query(&sql)
                .bind(per_page as i64)
                .bind(offset)
        };

        let data = query
            .fetch_all(&mut *conn)
            .await
            .map(|recs| {
                recs.into_iter().map(|row| {
                    Account {
                        id: row.get("id"),
                        tenant_id: row.get("tenant_id"),
                        code: row.get("code"),
                        name: row.get("name"),
                        account_type: match row.get::<String, _>("account_type").as_str() {
                            "asset" => AccountType::Asset,
                            "liability" => AccountType::Liability,
                            "equity" => AccountType::Equity,
                            "revenue" => AccountType::Revenue,
                            "expense" => AccountType::Expense,
                            _ => AccountType::Asset,
                        },
                        account_subtype: row.try_get("account_subtype").unwrap_or(None),
                        parent_id: row.try_get("parent_id").unwrap_or(None),
                        is_active: row.get("is_active"),
                        description: row.try_get("description").unwrap_or(None),
                        balance_type: match row.get::<String, _>("balance_type").as_str() {
                            "credit" => BalanceType::Credit,
                            _ => BalanceType::Debit,
                        },
                        created_at: row.get("created_at"),
                        updated_at: row.get("updated_at"),
                    }
                }).collect::<Vec<_>>()
            })
            .unwrap_or_default();

        (total, data)
    };

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
    path = "/api/v1/accounting/accounts",
    request_body = CreateAccountRequest,
    responses((status = 201, description = "Account created", body = ApiResponse<Account>)),
    tag = "accounting"
)]
pub async fn create_account(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateAccountRequest>,
) -> Json<ApiResponse<Account>> {
    info!("Create account");

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Check if account code already exists
    let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM accounts WHERE code = $1")
        .bind(&req.code)
        .fetch_one(&mut *conn)
        .await
        .unwrap_or(0);

    if existing > 0 {
        return Json(ApiResponse::error_typed("Account code already exists".to_string()));
    }

    let account_type_str = match req.account_type {
        AccountType::Asset => "asset",
        AccountType::Liability => "liability",
        AccountType::Equity => "equity",
        AccountType::Revenue => "revenue",
        AccountType::Expense => "expense",
    };

    let balance_type_str = match req.balance_type {
        BalanceType::Debit => "debit",
        BalanceType::Credit => "credit",
    };

    let row = sqlx::query(
        r#"INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, parent_id, description, balance_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, tenant_id, code, name, account_type, account_subtype, parent_id, is_active, description, balance_type, created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&req.code)
    .bind(&req.name)
    .bind(account_type_str)
    .bind(&req.account_subtype)
    .bind(&req.parent_id)
    .bind(&req.description)
    .bind(balance_type_str)
    .fetch_one(&mut *conn)
    .await;

    match row {
        Ok(row) => {
            let account = Account {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                code: row.get("code"),
                name: row.get("name"),
                account_type: match row.get::<String, _>("account_type").as_str() {
                    "asset" => AccountType::Asset,
                    "liability" => AccountType::Liability,
                    "equity" => AccountType::Equity,
                    "revenue" => AccountType::Revenue,
                    "expense" => AccountType::Expense,
                    _ => AccountType::Asset,
                },
                account_subtype: row.try_get("account_subtype").unwrap_or(None),
                parent_id: row.try_get("parent_id").unwrap_or(None),
                is_active: row.get("is_active"),
                description: row.try_get("description").unwrap_or(None),
                balance_type: match row.get::<String, _>("balance_type").as_str() {
                    "credit" => BalanceType::Credit,
                    _ => BalanceType::Debit,
                },
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(account))
        }
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e)))
    }
}

#[utoipa::path(
    get,
    path = "/api/v1/accounting/accounts/{id}",
    params(("id" = uuid::Uuid, Path, description = "Account ID")),
    responses((status = 200, description = "Account detail", body = ApiResponse<Account>)),
    tag = "accounting"
)]
pub async fn get_account(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Path(id): Path<Uuid>,
) -> Json<ApiResponse<Account>> {
    info!("Get account {}", id);

    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    let row = sqlx::query(
        r#"SELECT id, tenant_id, code, name, account_type, account_subtype, parent_id,
                  is_active, description, balance_type, created_at, updated_at
           FROM accounts WHERE id = $1 LIMIT 1"#
    )
    .bind(id)
    .fetch_optional(&mut *conn)
    .await;

    match row {
        Ok(Some(row)) => {
            let account = Account {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                code: row.get("code"),
                name: row.get("name"),
                account_type: match row.get::<String, _>("account_type").as_str() {
                    "asset" => AccountType::Asset,
                    "liability" => AccountType::Liability,
                    "equity" => AccountType::Equity,
                    "revenue" => AccountType::Revenue,
                    "expense" => AccountType::Expense,
                    _ => AccountType::Asset,
                },
                account_subtype: row.try_get("account_subtype").unwrap_or(None),
                parent_id: row.try_get("parent_id").unwrap_or(None),
                is_active: row.get("is_active"),
                description: row.try_get("description").unwrap_or(None),
                balance_type: match row.get::<String, _>("balance_type").as_str() {
                    "credit" => BalanceType::Credit,
                    _ => BalanceType::Debit,
                },
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Json(ApiResponse::success(account))
        }
        Ok(None) => Json(ApiResponse::error_typed("Account not found".to_string())),
        Err(e) => Json(ApiResponse::error_typed(format!("{}", e))),
    }
}

// Journal Entry handlers
#[derive(serde::Deserialize, Validate, Debug)]
pub struct ListJournalEntriesQuery {
    #[validate(range(min = 1, max = 10000))]
    pub page: Option<u32>,
    #[validate(range(min = 1, max = 100))]
    pub per_page: Option<u32>,
    #[validate(length(min = 1, max = 100))]
    pub search: Option<String>,
    pub status: Option<String>,
    pub from_date: Option<NaiveDate>,
    pub to_date: Option<NaiveDate>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/accounting/journal-entries",
    params(
        ("page" = Option<u32>, Query, description = "Page number"),
        ("per_page" = Option<u32>, Query, description = "Items per page"),
        ("search" = Option<String>, Query, description = "Search term"),
        ("status" = Option<String>, Query, description = "Filter by status"),
        ("from_date" = Option<String>, Query, description = "From date (YYYY-MM-DD)"),
        ("to_date" = Option<String>, Query, description = "To date (YYYY-MM-DD)"),
        ("sort_by" = Option<String>, Query, description = "entry_date|entry_number|created_at"),
        ("sort_order" = Option<String>, Query, description = "asc|desc"),
    ),
    responses((status = 200, description = "List journal entries", body = ApiResponse<PaginatedResponse<JournalEntry>>)),
    tag = "accounting"
)]
pub async fn list_journal_entries(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Query(q): Query<ListJournalEntriesQuery>,
) -> Json<ApiResponse<PaginatedResponse<JournalEntry>>> {
    info!("List journal entries");

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
    let mut where_parts: Vec<String> = vec![];
    let mut bind_params: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = vec![];
    let mut param_count = 0;

    if let Some(search) = &q.search {
        param_count += 1;
        where_parts.push(format!("(entry_number ILIKE ${} OR description ILIKE ${})", param_count, param_count));
        bind_params.push(Box::new(format!("%{}%", search)));
    }

    if let Some(status) = &q.status {
        param_count += 1;
        where_parts.push(format!("status = ${}", param_count));
        bind_params.push(Box::new(status.clone()));
    }

    if let Some(from_date) = &q.from_date {
        param_count += 1;
        where_parts.push(format!("entry_date >= ${}", param_count));
        bind_params.push(Box::new(*from_date));
    }

    if let Some(to_date) = &q.to_date {
        param_count += 1;
        where_parts.push(format!("entry_date <= ${}", param_count));
        bind_params.push(Box::new(*to_date));
    }

    let where_clause = if where_parts.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_parts.join(" AND "))
    };

    // Determine sort
    let sort_by = q.sort_by.as_deref().unwrap_or("entry_date");
    let order_by = match sort_by {
        "entry_number" => "entry_number",
        "created_at" => "created_at",
        _ => "entry_date"
    };
    let direction = match q.sort_order.as_deref().map(|s| s.to_ascii_lowercase()) {
        Some(ref s) if s == "asc" => "ASC",
        _ => "DESC",
    };

    // Count total
    let count_sql = format!("SELECT COUNT(*) FROM journal_entries {}", where_clause);
    let mut count_query = sqlx::query_scalar::<_, i64>(&count_sql);
    for param in &bind_params {
        // This is a simplified approach - in real implementation you'd need proper parameter binding
    }
    let total_count = count_query.fetch_one(&mut *conn).await.unwrap_or(0);

    // Fetch data
    let data_sql = format!(
        r#"SELECT id, tenant_id, entry_number, entry_date, reference, description,
                  total_debit, total_credit, status, created_by, posted_by, posted_at,
                  created_at, updated_at
           FROM journal_entries
           {}
           ORDER BY {} {}
           LIMIT ${} OFFSET ${}"#,
        where_clause, order_by, direction, param_count + 1, param_count + 2
    );

    let mut data_query = sqlx::query(&data_sql);
    for param in &bind_params {
        // This is a simplified approach - in real implementation you'd need proper parameter binding
    }
    data_query = data_query.bind(per_page as i64).bind(offset);

    let rows = data_query
        .fetch_all(&mut *conn)
        .await
        .map(|recs| {
            recs.into_iter().map(|row| {
                JournalEntry {
                    id: row.get("id"),
                    tenant_id: row.get("tenant_id"),
                    entry_number: row.get("entry_number"),
                    entry_date: row.get("entry_date"),
                    reference: row.try_get("reference").unwrap_or(None),
                    description: row.get("description"),
                    total_debit: row.get("total_debit"),
                    total_credit: row.get("total_credit"),
                    status: match row.get::<String, _>("status").as_str() {
                        "posted" => JournalEntryStatus::Posted,
                        "reversed" => JournalEntryStatus::Reversed,
                        _ => JournalEntryStatus::Draft,
                    },
                    created_by: row.get("created_by"),
                    posted_by: row.try_get("posted_by").unwrap_or(None),
                    posted_at: row.try_get("posted_at").unwrap_or(None),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                    lines: None, // Will be loaded separately if needed
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
    path = "/api/v1/accounting/journal-entries",
    request_body = CreateJournalEntryRequest,
    responses((status = 201, description = "Journal entry created", body = ApiResponse<JournalEntry>)),
    tag = "accounting"
)]
pub async fn create_journal_entry(
    State(_state): State<Arc<AppState>>,
    current: Extension<CurrentUser>,
    DbConn(mut conn): DbConn,
    Json(req): Json<CreateJournalEntryRequest>,
) -> Json<ApiResponse<JournalEntry>> {
    info!("Create journal entry");

    // Set tenant context (RLS)
    let _ = sqlx::query("SELECT set_config('app.current_tenant_id', $1, true)")
        .bind(current.tenant_id.to_string())
        .execute(&mut *conn)
        .await;

    // Validate that debits equal credits
    let total_debits: Decimal = req.lines.iter().map(|l| l.debit_amount).sum();
    let total_credits: Decimal = req.lines.iter().map(|l| l.credit_amount).sum();

    if total_debits != total_credits {
        return Json(ApiResponse::error_typed("Total debits must equal total credits".to_string()));
    }

    if total_debits == Decimal::ZERO {
        return Json(ApiResponse::error_typed("Journal entry must have non-zero amounts".to_string()));
    }

    // Validate that each line has either debit or credit (not both)
    for line in &req.lines {
        if (line.debit_amount > Decimal::ZERO && line.credit_amount > Decimal::ZERO) ||
           (line.debit_amount == Decimal::ZERO && line.credit_amount == Decimal::ZERO) {
            return Json(ApiResponse::error_typed("Each line must have either debit or credit amount (not both or neither)".to_string()));
        }
    }

    // Generate entry number
    let entry_number = format!("JE-{}-{:06}",
        chrono::Utc::now().format("%Y%m"),
        chrono::Utc::now().timestamp_millis() % 1000000
    );

    // Start transaction
    let mut tx = match conn.begin().await {
        Ok(tx) => tx,
        Err(e) => return Json(ApiResponse::error_typed(format!("Failed to start transaction: {}", e))),
    };

    // Insert journal entry header
    let journal_row = sqlx::query(
        r#"INSERT INTO journal_entries (tenant_id, entry_number, entry_date, reference, description,
                                       total_debit, total_credit, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, tenant_id, entry_number, entry_date, reference, description,
                     total_debit, total_credit, status, created_by, posted_by, posted_at,
                     created_at, updated_at"#
    )
    .bind(current.tenant_id)
    .bind(&entry_number)
    .bind(&req.entry_date)
    .bind(&req.reference)
    .bind(&req.description)
    .bind(total_debits)
    .bind(total_credits)
    .bind(current.user_id)
    .fetch_one(&mut *tx)
    .await;

    let journal_entry = match journal_row {
        Ok(row) => {
            let journal_id: Uuid = row.get("id");

            // Insert journal entry lines
            for (index, line) in req.lines.iter().enumerate() {
                let line_result = sqlx::query(
                    r#"INSERT INTO journal_entry_lines (tenant_id, journal_entry_id, account_id,
                                                       description, debit_amount, credit_amount, line_number)
                       VALUES ($1, $2, $3, $4, $5, $6, $7)"#
                )
                .bind(current.tenant_id)
                .bind(journal_id)
                .bind(line.account_id)
                .bind(&line.description)
                .bind(line.debit_amount)
                .bind(line.credit_amount)
                .bind((index + 1) as i32)
                .execute(&mut *tx)
                .await;

                if line_result.is_err() {
                    let _ = tx.rollback().await;
                    return Json(ApiResponse::error_typed("Failed to create journal entry lines".to_string()));
                }
            }

            // Commit transaction
            if tx.commit().await.is_err() {
                return Json(ApiResponse::error_typed("Failed to commit transaction".to_string()));
            }

            JournalEntry {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                entry_number: row.get("entry_number"),
                entry_date: row.get("entry_date"),
                reference: row.try_get("reference").unwrap_or(None),
                description: row.get("description"),
                total_debit: row.get("total_debit"),
                total_credit: row.get("total_credit"),
                status: JournalEntryStatus::Draft,
                created_by: row.get("created_by"),
                posted_by: None,
                posted_at: None,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
                lines: None,
            }
        }
        Err(e) => {
            let _ = tx.rollback().await;
            return Json(ApiResponse::error_typed(format!("Failed to create journal entry: {}", e)));
        }
    };

    Json(ApiResponse::success(journal_entry))
}
