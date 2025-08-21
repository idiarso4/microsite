-- Accounting Module Schema
-- This migration creates tables for double-entry accounting system

-- Chart of Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, revenue, expense
    account_subtype VARCHAR(100), -- current_asset, fixed_asset, current_liability, etc.
    parent_id UUID REFERENCES accounts(id),
    is_active BOOLEAN DEFAULT true NOT NULL,
    description TEXT,
    balance_type VARCHAR(10) NOT NULL DEFAULT 'debit', -- debit or credit
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, code)
);

-- Journal Entries (Header)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entry_number VARCHAR(50) NOT NULL,
    entry_date DATE NOT NULL,
    reference VARCHAR(100),
    description TEXT NOT NULL,
    total_debit DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_credit DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, posted, reversed
    created_by UUID NOT NULL REFERENCES users(id),
    posted_by UUID REFERENCES users(id),
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, entry_number)
);

-- Journal Entry Lines (Details)
CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0 NOT NULL,
    credit_amount DECIMAL(15,2) DEFAULT 0 NOT NULL,
    line_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Account Balances (for performance - calculated from journal entries)
CREATE TABLE account_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    opening_balance DECIMAL(15,2) DEFAULT 0 NOT NULL,
    debit_total DECIMAL(15,2) DEFAULT 0 NOT NULL,
    credit_total DECIMAL(15,2) DEFAULT 0 NOT NULL,
    closing_balance DECIMAL(15,2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, account_id, period_year, period_month)
);

-- Financial Periods
CREATE TABLE financial_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'open' NOT NULL, -- open, closed
    is_current BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, name)
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_periods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_accounts ON accounts
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_journal_entries ON journal_entries
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_journal_entry_lines ON journal_entry_lines
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_account_balances ON account_balances
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_financial_periods ON financial_periods
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Create indexes for performance
CREATE INDEX idx_accounts_tenant_id ON accounts(tenant_id);
CREATE INDEX idx_accounts_code ON accounts(tenant_id, code);
CREATE INDEX idx_accounts_type ON accounts(tenant_id, account_type);
CREATE INDEX idx_accounts_parent ON accounts(parent_id);

CREATE INDEX idx_journal_entries_tenant_id ON journal_entries(tenant_id);
CREATE INDEX idx_journal_entries_date ON journal_entries(tenant_id, entry_date);
CREATE INDEX idx_journal_entries_number ON journal_entries(tenant_id, entry_number);
CREATE INDEX idx_journal_entries_status ON journal_entries(tenant_id, status);

CREATE INDEX idx_journal_entry_lines_tenant_id ON journal_entry_lines(tenant_id);
CREATE INDEX idx_journal_entry_lines_journal ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_journal_entry_lines_account ON journal_entry_lines(account_id);

CREATE INDEX idx_account_balances_tenant_id ON account_balances(tenant_id);
CREATE INDEX idx_account_balances_account ON account_balances(account_id);
CREATE INDEX idx_account_balances_period ON account_balances(tenant_id, period_year, period_month);

CREATE INDEX idx_financial_periods_tenant_id ON financial_periods(tenant_id);
CREATE INDEX idx_financial_periods_dates ON financial_periods(tenant_id, start_date, end_date);

-- Create triggers for updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_balances_updated_at BEFORE UPDATE ON account_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_periods_updated_at BEFORE UPDATE ON financial_periods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Constraint to ensure journal entries balance
ALTER TABLE journal_entries ADD CONSTRAINT check_journal_balance 
    CHECK (total_debit = total_credit);

-- Constraint to ensure journal entry lines have either debit or credit (not both)
ALTER TABLE journal_entry_lines ADD CONSTRAINT check_debit_or_credit 
    CHECK ((debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0));
