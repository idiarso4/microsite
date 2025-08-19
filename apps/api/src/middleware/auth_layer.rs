use axum::{http::{Request, header::AUTHORIZATION}, response::Response};
use tower::{Layer, Service};
use std::task::{Context, Poll};
use std::pin::Pin;

#[derive(Clone)]
pub struct AuthLayer;

impl AuthLayer { pub fn new() -> Self { Self } }

#[derive(Clone)]
pub struct AuthService<S> { inner: S }

impl<S> Layer<S> for AuthLayer {
    type Service = AuthService<S>;
    fn layer(&self, inner: S) -> Self::Service { AuthService { inner } }
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

    fn call(&mut self, req: Request<B>) -> Self::Future {
        let mut inner = self.inner.clone();
        Box::pin(async move {
            // TODO: parse bearer token, validate JWT, set tenant context for DB RLS
            let res = inner.call(req).await?;
            Ok(res)
        })
    }
}
