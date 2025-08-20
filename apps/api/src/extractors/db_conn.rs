use std::sync::Arc;

use axum::{extract::{FromRequestParts}, http::request::Parts};
use sqlx::{pool::PoolConnection, Postgres};

use crate::state::AppState;

/// Extractor yang memberikan koneksi database per-request
/// Pastikan Tenant Context sudah disetel di middleware agar RLS aktif.
pub struct DbConn(pub PoolConnection<Postgres>);

#[axum::async_trait]
impl<S> FromRequestParts<S> for DbConn
where
    S: Send + Sync,
{
    type Rejection = axum::http::StatusCode;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        // Ambil AppState dari Router state
        let Some(state) = parts.extensions.get::<Arc<AppState>>() else {
            return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
        };
        let conn = state
            .db_pool
            .acquire()
            .await
            .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(DbConn(conn))
    }
}
