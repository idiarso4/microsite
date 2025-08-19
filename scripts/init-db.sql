-- Database initialization script for development
-- This script is run when the PostgreSQL container starts

-- Create the main database (if not exists)
SELECT 'CREATE DATABASE erp_platform'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'erp_platform')\gexec

-- Create test database for running tests
SELECT 'CREATE DATABASE erp_platform_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'erp_platform_test')\gexec

-- Connect to the main database
\c erp_platform;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';

-- Create a function to generate random strings (useful for tokens)
CREATE OR REPLACE FUNCTION generate_random_string(length INTEGER)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to set tenant context (for RLS)
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_uuid UUID)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_uuid::TEXT, false);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get current tenant context
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a function to clear tenant context
CREATE OR REPLACE FUNCTION clear_tenant_context()
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', '', false);
END;
$$ LANGUAGE plpgsql;
