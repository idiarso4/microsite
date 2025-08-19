-- Initial database schema for ERP Platform
-- This migration creates the core tables for multi-tenant architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE erp_platform SET row_security = on;

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'basic' NOT NULL,
    settings JSONB DEFAULT '{}' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tenant memberships (many-to-many relationship between users and tenants)
CREATE TABLE tenant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, user_id)
);

-- Roles table (tenant-specific roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, name)
);

-- Permissions table (global permissions)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL
);

-- Role permissions (many-to-many relationship)
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on tenant-specific tables
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_memberships ON tenant_memberships
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_roles ON roles
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_invitations ON invitations
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Create indexes for performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tenant_memberships_tenant_id ON tenant_memberships(tenant_id);
CREATE INDEX idx_tenant_memberships_user_id ON tenant_memberships(user_id);
CREATE INDEX idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX idx_invitations_tenant_id ON invitations(tenant_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default permissions
INSERT INTO permissions (key, name, description, module) VALUES
-- Auth permissions
('auth:login', 'Login', 'Can login to the system', 'auth'),
('auth:logout', 'Logout', 'Can logout from the system', 'auth'),

-- User management permissions
('users:read', 'Read Users', 'Can view user information', 'users'),
('users:write', 'Write Users', 'Can create and update users', 'users'),
('users:delete', 'Delete Users', 'Can delete users', 'users'),
('users:invite', 'Invite Users', 'Can invite new users', 'users'),

-- Tenant management permissions
('tenants:read', 'Read Tenant', 'Can view tenant information', 'tenants'),
('tenants:write', 'Write Tenant', 'Can update tenant information', 'tenants'),
('tenants:manage', 'Manage Tenant', 'Can manage tenant settings and members', 'tenants'),

-- Role management permissions
('roles:read', 'Read Roles', 'Can view roles and permissions', 'roles'),
('roles:write', 'Write Roles', 'Can create and update roles', 'roles'),
('roles:delete', 'Delete Roles', 'Can delete roles', 'roles'),
('roles:assign', 'Assign Roles', 'Can assign roles to users', 'roles'),

-- CRM permissions (placeholder)
('crm:companies:read', 'Read Companies', 'Can view companies', 'crm'),
('crm:companies:write', 'Write Companies', 'Can create and update companies', 'crm'),
('crm:companies:delete', 'Delete Companies', 'Can delete companies', 'crm'),
('crm:contacts:read', 'Read Contacts', 'Can view contacts', 'crm'),
('crm:contacts:write', 'Write Contacts', 'Can create and update contacts', 'crm'),
('crm:contacts:delete', 'Delete Contacts', 'Can delete contacts', 'crm'),

-- Inventory permissions (placeholder)
('inventory:products:read', 'Read Products', 'Can view products', 'inventory'),
('inventory:products:write', 'Write Products', 'Can create and update products', 'inventory'),
('inventory:products:delete', 'Delete Products', 'Can delete products', 'inventory'),
('inventory:stock:read', 'Read Stock', 'Can view stock levels', 'inventory'),
('inventory:stock:write', 'Write Stock', 'Can update stock levels', 'inventory'),

-- Procurement permissions (placeholder)
('procurement:vendors:read', 'Read Vendors', 'Can view vendors', 'procurement'),
('procurement:vendors:write', 'Write Vendors', 'Can create and update vendors', 'procurement'),
('procurement:orders:read', 'Read Purchase Orders', 'Can view purchase orders', 'procurement'),
('procurement:orders:write', 'Write Purchase Orders', 'Can create and update purchase orders', 'procurement'),

-- Accounting permissions (placeholder)
('accounting:accounts:read', 'Read Accounts', 'Can view chart of accounts', 'accounting'),
('accounting:accounts:write', 'Write Accounts', 'Can create and update accounts', 'accounting'),
('accounting:journals:read', 'Read Journals', 'Can view journal entries', 'accounting'),
('accounting:journals:write', 'Write Journals', 'Can create journal entries', 'accounting'),

-- HRM permissions (placeholder)
('hrm:employees:read', 'Read Employees', 'Can view employees', 'hrm'),
('hrm:employees:write', 'Write Employees', 'Can create and update employees', 'hrm'),
('hrm:leaves:read', 'Read Leaves', 'Can view leave requests', 'hrm'),
('hrm:leaves:write', 'Write Leaves', 'Can create and manage leave requests', 'hrm');

-- Insert system roles (these will be created for each tenant)
-- Note: Actual role creation happens in application code during tenant setup
