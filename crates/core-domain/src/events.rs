//! Domain events (placeholder)

#[derive(Debug, Clone)]
pub enum DomainEvent {
    UserRegistered,
    TenantCreated,
}

impl DomainEvent {
    pub fn name(&self) -> &'static str {
        match self {
            DomainEvent::UserRegistered => "UserRegistered",
            DomainEvent::TenantCreated => "TenantCreated",
        }
    }
}
