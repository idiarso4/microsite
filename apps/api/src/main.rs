mod config;
mod handlers;
mod middleware;
mod routes;
mod services;
mod state;
mod extractors;

use anyhow::Result;
use axum::Router;
use config::AppConfig;
use state::AppState;
use std::sync::Arc;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing::{info, instrument};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = AppConfig::load()?;
    info!("Configuration loaded successfully");

    // Initialize application state
    let state = AppState::new(config).await?;
    info!("Application state initialized");

    // Run database migrations
    sqlx::migrate!("./migrations")
        .run(&state.db_pool)
        .await?;
    info!("Database migrations completed");

    // Build application router
    let app = create_app(state).await?;

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    info!("Server starting on http://0.0.0.0:3000");
    
    axum::serve(listener, app).await?;

    Ok(())
}

#[instrument(skip(state))]
async fn create_app(state: AppState) -> Result<Router> {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_credentials(true);

    let shared_state = Arc::new(state);
    let middleware_stack = ServiceBuilder::new()
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .layer(middleware::request_id::RequestIdLayer::new())
        .layer(middleware::error_handler::ErrorHandlerLayer::new())
        .layer(middleware::auth_layer::AuthLayer::new(shared_state.clone()));

    let app = Router::new()
        .nest("/api/v1", routes::api_routes())
        .nest("/docs", routes::docs_routes())
        .route("/health", axum::routing::get(handlers::health::health_check))
        .layer(middleware_stack)
        .with_state(shared_state);

    Ok(app)
}
