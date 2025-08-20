use axum::{
    extract::Request,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use shared_types::ApiError;
use tower::{Layer, Service};
use tracing::error;

#[derive(Clone)]
pub struct ErrorHandlerLayer;

impl ErrorHandlerLayer {
    pub fn new() -> Self {
        Self
    }
}

impl<S> Layer<S> for ErrorHandlerLayer {
    type Service = ErrorHandlerService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        ErrorHandlerService { inner }
    }
}

#[derive(Clone)]
pub struct ErrorHandlerService<S> {
    inner: S,
}

impl<S> Service<Request> for ErrorHandlerService<S>
where
    S: Service<Request, Response = Response> + Clone + Send + 'static,
    S::Future: Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = std::pin::Pin<Box<dyn std::future::Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, cx: &mut std::task::Context<'_>) -> std::task::Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, request: Request) -> Self::Future {
        let mut inner = self.inner.clone();
        
        Box::pin(async move {
            let response = inner.call(request).await?;
            
            // Handle errors here if needed
            // For now, just pass through the response
            Ok(response)
        })
    }
}

// Global error handler for unhandled errors
pub async fn handle_error(err: Box<dyn std::error::Error + Send + Sync>) -> impl IntoResponse {
    error!("Unhandled error: {:?}", err);
    
    let api_error = ApiError::internal_error("An internal error occurred");
    
    (StatusCode::INTERNAL_SERVER_ERROR, Json(api_error))
}
