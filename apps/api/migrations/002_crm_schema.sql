-- CRM schema: companies and contacts with tenant_id and RLS policies

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address JSONB DEFAULT '{}' NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS policies per tenant
CREATE POLICY tenant_isolation_companies ON companies
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_contacts ON contacts
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- updated_at trigger
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

