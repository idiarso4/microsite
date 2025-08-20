use std::task::{Context, Poll};
use std::pin::Pin;
use std::sync::Arc;

use axum::{http::{Request, StatusCode, header::AUTHORIZATION}, response::Response};
use tower::{Layer, Service};

use crate::{state::AppState, middleware::auth_middleware::CurrentUser};

#[derive(Clone)]
pub struct AuthLayer {
    pub state: Arc<AppState>,
}

impl AuthLayer {
    pub fn new(state: Arc<AppState>) -> Self { Self { state } }
}

#[derive(Clone)]
pub struct AuthService<S> {
    inner: S,
    state: Arc<AppState>,
}

impl<S> Layer<S> for AuthLayer {
    type Service = AuthService<S>;
    fn layer(&self, inner: S) -> Self::Service { AuthService { inner, state: self.state.clone() } }
}

impl<S, B> Service<Request<B>> for AuthService<S>
where
    B: Send + 'static,
    S: Service<Request<B>, Response = Response> + Clone + Send + 'static,
    S::Future: Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = Pin<Box<dyn std::future::Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> { self.inner.poll_ready(cx) }

    fn call(&mut self, mut req: Request<B>) -> Self::Future {
        let mut inner = self.inner.clone();
        let state = self.state.clone();
        Box::pin(async move {
            // Bypass for public paths
            let path = req.uri().path();
            let is_public = path.starts_with("/api/v1/auth") || path.starts_with("/docs") || path == "/health";

            // Try read Authorization
            if let Some(value) = req.headers().get(AUTHORIZATION) {
                if let Ok(s) = value.to_str() {
                    if s.to_ascii_lowercase().starts_with("bearer ") {
                        let token = s[7..].trim();
                        match state.jwt_service.validate_token(token) {
                            Ok(claims) => {
                                let ctx = CurrentUser {
                                    user_id: claims.sub,
                                    tenant_id: claims.tenant_id,
                                    email: claims.email,
                                    roles: claims.roles,
                                    permissions: claims.permissions,
                                };
                                req.extensions_mut().insert(ctx);
                            }
                            Err(_) => {
                                if !is_public {
                                    // Short-circuit unauthorized for protected routes
                                    let resp = Response::builder()
                                        .status(StatusCode::UNAUTHORIZED)
                                        .body(axum::body::Body::empty())
                                        .unwrap();
                                    return Ok(resp);
                                }
                            }
                        }
                    } else if !is_public {
                        let resp = Response::builder()
                            .status(StatusCode::UNAUTHORIZED)
                            .body(axum::body::Body::empty())
                            .unwrap();
                        return Ok(resp);
                    }
                }
            } else if !is_public {
                let resp = Response::builder()
                    .status(StatusCode::UNAUTHORIZED)
                    .body(axum::body::Body::empty())
                    .unwrap();
                return Ok(resp);
            }

            let res = inner.call(req).await?;
            Ok(res)
        })
    }
}
