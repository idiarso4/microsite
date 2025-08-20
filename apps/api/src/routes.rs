use axum::{routing::get, Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{handlers, state::AppState};
use std::sync::Arc;

pub fn api_routes() -> Router<Arc<AppState>> {
    Router::new()
        .nest("/auth", auth_routes())
        .nest("/tenants", tenant_routes())
        .nest("/users", user_routes())
        .nest("/crm", crm_routes())
        .nest("/inventory", inventory_routes())
        .nest("/procurement", procurement_routes())
        .nest("/accounting", accounting_routes())
        .nest("/hrm", hrm_routes())
}

pub fn auth_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", axum::routing::post(handlers::auth::login))
        .route("/logout", axum::routing::post(handlers::auth::logout))
        .route("/refresh", axum::routing::post(handlers::auth::refresh))
        .route("/register", axum::routing::post(handlers::auth::register_tenant))
        .route("/forgot-password", axum::routing::post(handlers::auth::forgot_password))
        .route("/reset-password", axum::routing::post(handlers::auth::reset_password))
}

pub fn tenant_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/current", get(handlers::tenant::get_current_tenant))
        .route("/current", axum::routing::put(handlers::tenant::update_current_tenant))
        .route("/members", get(handlers::tenant::get_members))
        .route("/invite", axum::routing::post(handlers::tenant::invite_user))

}

pub fn user_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/profile", get(handlers::user::get_profile))
        .route("/profile", axum::routing::put(handlers::user::update_profile))
        .route("/change-password", axum::routing::post(handlers::user::change_password))

}

pub fn crm_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/companies", get(handlers::crm::list_companies))
        .route("/companies", axum::routing::post(handlers::crm::create_company))
        .route("/companies/:id", get(handlers::crm::get_company))
        .route("/companies/:id", axum::routing::put(handlers::crm::update_company))
        .route("/companies/:id", axum::routing::delete(handlers::crm::delete_company))
        .route("/contacts", get(handlers::crm::list_contacts))
        .route("/contacts", axum::routing::post(handlers::crm::create_contact))
        .route("/contacts/:id", get(handlers::crm::get_contact))
        .route("/contacts/:id", axum::routing::put(handlers::crm::update_contact))
        .route("/contacts/:id", axum::routing::delete(handlers::crm::delete_contact))
}

pub fn inventory_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/products", get(handlers::inventory::list_products))
        .route("/products", axum::routing::post(handlers::inventory::create_product))
        .route("/products/:id", get(handlers::inventory::get_product))
        .route("/products/:id", axum::routing::put(handlers::inventory::update_product))
        .route("/products/:id", axum::routing::delete(handlers::inventory::delete_product))
        .route("/warehouses", get(handlers::inventory::list_warehouses))
        .route("/warehouses", axum::routing::post(handlers::inventory::create_warehouse))
        .route("/stock", get(handlers::inventory::list_stock))
        .route("/stock/movements", get(handlers::inventory::list_stock_movements))

}

pub fn procurement_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/vendors", get(handlers::procurement::list_vendors))
        .route("/vendors", axum::routing::post(handlers::procurement::create_vendor))
        .route("/purchase-orders", get(handlers::procurement::list_purchase_orders))
        .route("/purchase-orders", axum::routing::post(handlers::procurement::create_purchase_order))

}

pub fn accounting_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/accounts", get(handlers::accounting::list_accounts))
        .route("/accounts", axum::routing::post(handlers::accounting::create_account))
        .route("/journals", get(handlers::accounting::list_journals))
        .route("/journals", axum::routing::post(handlers::accounting::create_journal))

}

pub fn hrm_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/employees", get(handlers::hrm::list_employees))
        .route("/employees", axum::routing::post(handlers::hrm::create_employee))
        .route("/leaves", get(handlers::hrm::list_leaves))
        .route("/leaves", axum::routing::post(handlers::hrm::create_leave))

}

pub fn docs_routes() -> Router<Arc<AppState>> {
    #[derive(OpenApi)]
    #[openapi(
        paths(
            handlers::health::health_check,
            handlers::auth::login,
            handlers::auth::register_tenant,
            handlers::auth::refresh,
            handlers::crm::list_companies,
            handlers::crm::create_company,
            handlers::crm::get_company,
            handlers::crm::update_company,
            handlers::crm::delete_company,
            handlers::crm::list_contacts,
            handlers::crm::create_contact,
            handlers::crm::get_contact,
            handlers::crm::update_contact,
            handlers::crm::delete_contact,
        ),
        components(
            schemas(
                shared_types::ApiResponse<()>,
                shared_types::LoginRequest,
                shared_types::LoginResponse,
                shared_types::RegisterTenantRequest,
                shared_types::RefreshTokenRequest,
            )
        ),
        tags(
            (name = "auth", description = "Authentication endpoints"),
            (name = "health", description = "Health check endpoints"),
            (name = "crm", description = "CRM endpoints"),
        )
    )]
    struct ApiDoc;

    Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
}
