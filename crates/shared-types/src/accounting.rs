use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Account {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub code: String,
    pub name: String,
    pub account_type: AccountType,
    pub account_subtype: Option<String>,
    pub parent_id: Option<Uuid>,
    pub is_active: bool,
    pub description: Option<String>,
    pub balance_type: BalanceType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum AccountType {
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum BalanceType {
    Debit,
    Credit,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JournalEntry {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub entry_number: String,
    pub entry_date: NaiveDate,
    pub reference: Option<String>,
    pub description: String,
    pub total_debit: Decimal,
    pub total_credit: Decimal,
    pub status: JournalEntryStatus,
    pub created_by: Uuid,
    pub posted_by: Option<Uuid>,
    pub posted_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub lines: Option<Vec<JournalEntryLine>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum JournalEntryStatus {
    Draft,
    Posted,
    Reversed,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct JournalEntryLine {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub journal_entry_id: Uuid,
    pub account_id: Uuid,
    pub account: Option<Account>,
    pub description: Option<String>,
    pub debit_amount: Decimal,
    pub credit_amount: Decimal,
    pub line_number: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AccountBalance {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub account_id: Uuid,
    pub account: Option<Account>,
    pub period_year: i32,
    pub period_month: i32,
    pub opening_balance: Decimal,
    pub debit_total: Decimal,
    pub credit_total: Decimal,
    pub closing_balance: Decimal,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct FinancialPeriod {
    pub id: Uuid,
    pub tenant_id: Uuid,
    pub name: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub status: PeriodStatus,
    pub is_current: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum PeriodStatus {
    Open,
    Closed,
}

// Request/Response DTOs
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateAccountRequest {
    pub code: String,
    pub name: String,
    pub account_type: AccountType,
    pub account_subtype: Option<String>,
    pub parent_id: Option<Uuid>,
    pub description: Option<String>,
    pub balance_type: BalanceType,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateAccountRequest {
    pub code: Option<String>,
    pub name: Option<String>,
    pub account_type: Option<AccountType>,
    pub account_subtype: Option<String>,
    pub parent_id: Option<Uuid>,
    pub description: Option<String>,
    pub balance_type: Option<BalanceType>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateJournalEntryRequest {
    pub entry_date: NaiveDate,
    pub reference: Option<String>,
    pub description: String,
    pub lines: Vec<CreateJournalEntryLineRequest>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateJournalEntryLineRequest {
    pub account_id: Uuid,
    pub description: Option<String>,
    pub debit_amount: Decimal,
    pub credit_amount: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateJournalEntryRequest {
    pub entry_date: Option<NaiveDate>,
    pub reference: Option<String>,
    pub description: Option<String>,
    pub lines: Option<Vec<CreateJournalEntryLineRequest>>,
}

// Financial Reports
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrialBalance {
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub accounts: Vec<TrialBalanceAccount>,
    pub total_debits: Decimal,
    pub total_credits: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TrialBalanceAccount {
    pub account: Account,
    pub debit_balance: Decimal,
    pub credit_balance: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BalanceSheet {
    pub as_of_date: NaiveDate,
    pub assets: Vec<BalanceSheetSection>,
    pub liabilities: Vec<BalanceSheetSection>,
    pub equity: Vec<BalanceSheetSection>,
    pub total_assets: Decimal,
    pub total_liabilities: Decimal,
    pub total_equity: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BalanceSheetSection {
    pub section_name: String,
    pub accounts: Vec<BalanceSheetAccount>,
    pub section_total: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct BalanceSheetAccount {
    pub account: Account,
    pub balance: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct IncomeStatement {
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub revenue: Vec<IncomeStatementSection>,
    pub expenses: Vec<IncomeStatementSection>,
    pub total_revenue: Decimal,
    pub total_expenses: Decimal,
    pub net_income: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct IncomeStatementSection {
    pub section_name: String,
    pub accounts: Vec<IncomeStatementAccount>,
    pub section_total: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct IncomeStatementAccount {
    pub account: Account,
    pub amount: Decimal,
}
