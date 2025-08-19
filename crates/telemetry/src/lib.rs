use anyhow::Result;
use opentelemetry::global;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing(service_name: &str) -> Result<()> {
    // Minimal tracing init for now; Jaeger/OTel can be added later when needed
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    Ok(())
}

pub fn shutdown_tracing() {
    global::shutdown_tracer_provider();
}
