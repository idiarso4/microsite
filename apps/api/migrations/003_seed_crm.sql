-- Seed data for one default tenant, one user, membership, and sample CRM data

-- Create tenant
WITH t AS (
    INSERT INTO tenants (name, slug, plan, settings, is_active)
    VALUES ('Acme Corp', 'acme', 'basic', '{}', true)
    RETURNING id
),
-- Create user with Argon2 hashed password (plaintext: TestPassword123!)
u AS (
    INSERT INTO users (email, password_hash, first_name, last_name, is_active)
    VALUES (
        'admin@acme.test',
        '$argon2id$v=19$m=19456,t=2,p=1$ZkYwT2VtT3pZb0VsQmZKSQ$2lM0rK2r0a0wQ3M0GQx0V0Q4b3gA8Z7v/1x3o9KQ9iE',
        'Admin',
        'Acme',
        true
    )
    RETURNING id
),
-- Create membership as owner
m AS (
    INSERT INTO tenant_memberships (tenant_id, user_id, role, is_active)
    SELECT t.id, u.id, 'owner', true FROM t, u
    RETURNING tenant_id
)
-- Seed companies and contacts
INSERT INTO companies (tenant_id, name, website, email, phone, address, tags)
SELECT tenant_id, 'Wayne Enterprises', 'https://wayne.example', 'contact@wayne.example', '+62-21-555-1001', '{"street":"Jl. Mawar 1","city":"Jakarta","country":"ID"}', ARRAY['partner','vip'] FROM m
UNION ALL
SELECT tenant_id, 'Stark Industries', 'https://stark.example', 'info@stark.example', '+62-21-555-1002', '{"street":"Jl. Melati 2","city":"Bandung","country":"ID"}', ARRAY['lead'] FROM m
UNION ALL
SELECT tenant_id, 'Oscorp', 'https://oscorp.example', 'hello@oscorp.example', '+62-21-555-1003', '{"street":"Jl. Anggrek 3","city":"Surabaya","country":"ID"}', ARRAY['supplier'] FROM m;

-- Link contacts to first company
WITH c AS (
    SELECT id AS company_id, tenant_id FROM companies WHERE name = 'Wayne Enterprises' LIMIT 1
)
INSERT INTO contacts (tenant_id, company_id, first_name, last_name, email, phone, position, notes)
SELECT c.tenant_id, c.company_id, 'Bruce', 'Wayne', 'bruce@wayne.example', '+62-21-555-2001', 'CEO', 'Top priority' FROM c
UNION ALL
SELECT c.tenant_id, c.company_id, 'Lucius', 'Fox', 'lucius@wayne.example', '+62-21-555-2002', 'CTO', NULL FROM c;

