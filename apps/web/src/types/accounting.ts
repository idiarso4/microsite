// Accounting Types and Interfaces

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense'
}

export enum AccountSubType {
  // Assets
  CURRENT_ASSET = 'current_asset',
  FIXED_ASSET = 'fixed_asset',
  INTANGIBLE_ASSET = 'intangible_asset',
  
  // Liabilities
  CURRENT_LIABILITY = 'current_liability',
  LONG_TERM_LIABILITY = 'long_term_liability',
  
  // Equity
  OWNER_EQUITY = 'owner_equity',
  RETAINED_EARNINGS = 'retained_earnings',
  
  // Revenue
  OPERATING_REVENUE = 'operating_revenue',
  NON_OPERATING_REVENUE = 'non_operating_revenue',
  
  // Expenses
  OPERATING_EXPENSE = 'operating_expense',
  NON_OPERATING_EXPENSE = 'non_operating_expense',
  COST_OF_GOODS_SOLD = 'cost_of_goods_sold'
}

export interface Account {
  id: string
  code: string
  name: string
  type: AccountType
  subType: AccountSubType
  parentId?: string
  description?: string
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum TransactionType {
  JOURNAL_ENTRY = 'journal_entry',
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  RECEIPT = 'receipt',
  ADJUSTMENT = 'adjustment'
}

export interface JournalEntry {
  id: string
  entryNumber: string
  date: string
  description: string
  reference?: string
  type: TransactionType
  totalDebit: number
  totalCredit: number
  isPosted: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  lineItems: JournalLineItem[]
}

export interface JournalLineItem {
  id: string
  journalEntryId: string
  accountId: string
  account?: Account
  description?: string
  debitAmount: number
  creditAmount: number
  sortOrder: number
}

export interface FinancialReport {
  id: string
  name: string
  type: ReportType
  period: ReportPeriod
  startDate: string
  endDate: string
  data: any
  generatedAt: string
  generatedBy: string
}

export enum ReportType {
  BALANCE_SHEET = 'balance_sheet',
  INCOME_STATEMENT = 'income_statement',
  CASH_FLOW = 'cash_flow',
  TRIAL_BALANCE = 'trial_balance',
  GENERAL_LEDGER = 'general_ledger'
}

export enum ReportPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export interface TrialBalance {
  accounts: TrialBalanceAccount[]
  totalDebits: number
  totalCredits: number
  isBalanced: boolean
  asOfDate: string
}

export interface TrialBalanceAccount {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  debitBalance: number
  creditBalance: number
}

export interface BalanceSheet {
  asOfDate: string
  assets: BalanceSheetSection
  liabilities: BalanceSheetSection
  equity: BalanceSheetSection
  totalAssets: number
  totalLiabilitiesAndEquity: number
  isBalanced: boolean
}

export interface BalanceSheetSection {
  title: string
  accounts: BalanceSheetAccount[]
  total: number
  subsections?: BalanceSheetSection[]
}

export interface BalanceSheetAccount {
  accountId: string
  accountCode: string
  accountName: string
  balance: number
}

export interface IncomeStatement {
  startDate: string
  endDate: string
  revenue: IncomeStatementSection
  expenses: IncomeStatementSection
  grossProfit: number
  operatingIncome: number
  netIncome: number
}

export interface IncomeStatementSection {
  title: string
  accounts: IncomeStatementAccount[]
  total: number
  subsections?: IncomeStatementSection[]
}

export interface IncomeStatementAccount {
  accountId: string
  accountCode: string
  accountName: string
  amount: number
}

export interface CashFlow {
  startDate: string
  endDate: string
  operatingActivities: CashFlowSection
  investingActivities: CashFlowSection
  financingActivities: CashFlowSection
  netCashFlow: number
  beginningCash: number
  endingCash: number
}

export interface CashFlowSection {
  title: string
  items: CashFlowItem[]
  total: number
}

export interface CashFlowItem {
  description: string
  amount: number
}

// Form interfaces
export interface AccountFormData {
  code: string
  name: string
  type: AccountType
  subType: AccountSubType
  parentId?: string
  description?: string
}

export interface JournalEntryFormData {
  date: string
  description: string
  reference?: string
  type: TransactionType
  lineItems: JournalLineItemFormData[]
}

export interface JournalLineItemFormData {
  accountId: string
  description?: string
  debitAmount: number
  creditAmount: number
}

// API Response interfaces
export interface AccountsResponse {
  accounts: Account[]
  total: number
  page: number
  limit: number
}

export interface JournalEntriesResponse {
  entries: JournalEntry[]
  total: number
  page: number
  limit: number
}

// Utility functions
export const getAccountTypeDisplayName = (type: AccountType): string => {
  const names = {
    [AccountType.ASSET]: 'Asset',
    [AccountType.LIABILITY]: 'Liability',
    [AccountType.EQUITY]: 'Equity',
    [AccountType.REVENUE]: 'Revenue',
    [AccountType.EXPENSE]: 'Expense'
  }
  return names[type]
}

export const getAccountSubTypeDisplayName = (subType: AccountSubType): string => {
  const names = {
    [AccountSubType.CURRENT_ASSET]: 'Current Asset',
    [AccountSubType.FIXED_ASSET]: 'Fixed Asset',
    [AccountSubType.INTANGIBLE_ASSET]: 'Intangible Asset',
    [AccountSubType.CURRENT_LIABILITY]: 'Current Liability',
    [AccountSubType.LONG_TERM_LIABILITY]: 'Long-term Liability',
    [AccountSubType.OWNER_EQUITY]: 'Owner Equity',
    [AccountSubType.RETAINED_EARNINGS]: 'Retained Earnings',
    [AccountSubType.OPERATING_REVENUE]: 'Operating Revenue',
    [AccountSubType.NON_OPERATING_REVENUE]: 'Non-operating Revenue',
    [AccountSubType.OPERATING_EXPENSE]: 'Operating Expense',
    [AccountSubType.NON_OPERATING_EXPENSE]: 'Non-operating Expense',
    [AccountSubType.COST_OF_GOODS_SOLD]: 'Cost of Goods Sold'
  }
  return names[subType]
}

export const getTransactionTypeDisplayName = (type: TransactionType): string => {
  const names = {
    [TransactionType.JOURNAL_ENTRY]: 'Journal Entry',
    [TransactionType.INVOICE]: 'Invoice',
    [TransactionType.PAYMENT]: 'Payment',
    [TransactionType.RECEIPT]: 'Receipt',
    [TransactionType.ADJUSTMENT]: 'Adjustment'
  }
  return names[type]
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const isDebitAccount = (accountType: AccountType): boolean => {
  return [AccountType.ASSET, AccountType.EXPENSE].includes(accountType)
}

export const isCreditAccount = (accountType: AccountType): boolean => {
  return [AccountType.LIABILITY, AccountType.EQUITY, AccountType.REVENUE].includes(accountType)
}
