pub mod auth;
pub mod common;
pub mod error;

pub mod crm;
pub mod accounting;
pub mod inventory;
pub mod procurement;
// pub mod hrm;

pub use auth::*;
pub use common::*;
pub use error::*;
pub use crm::*;
pub use accounting::*;
pub use inventory::*;
pub use procurement::*;
