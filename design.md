# Design Document - Multi-Service ERP Platform

## 1. System Architecture Overview

### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile Client  │    │   API Client    │
│   (React TS)    │    │   (Future)      │    │  (3rd Party)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (Nginx/Caddy) │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (Rust axum)   │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │  Core Service   │    │ Notification    │
│   (Rust axum)   │    │  (Rust axum)    │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   + Redis       │
                    └─────────────────┘
```

### 1.2 Deployment Architecture
- **Monorepo**: Single repository dengan multiple services
- **Modular Monolith**: Services terpisah tapi deploy bersama (fase awal)
- **Containerized**: Docker containers untuk semua services
- **Orchestration**: Docker Compose (dev), Kubernetes (production)

## 2. Technology Stack

### 2.1 Backend (Rust)
```toml
# Core dependencies
axum = "0.7"           # Web framework
tokio = "1.0"          # Async runtime
sqlx = "0.7"           # Database driver
serde = "1.0"          # Serialization
uuid = "1.0"           # UUID generation
chrono = "0.4"         # Date/time handling
tracing = "0.1"        # Logging/observability
tower = "0.4"          # Middleware
tower-http = "0.5"     # HTTP middleware
jsonwebtoken = "9.0"   # JWT handling
argon2 = "0.5"         # Password hashing
redis = "0.24"         # Redis client
utoipa = "4.0"         # OpenAPI generation
validator = "0.18"     # Input validation
```

### 2.2 Frontend (React TypeScript)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "@mui/material": "^5.15.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

### 2.3 Database & Infrastructure
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Message Queue**: Redis (simple jobs), future: RabbitMQ/NATS
- **File Storage**: Local filesystem (dev), S3-compatible (prod)
- **Monitoring**: Prometheus + Grafana
- **Tracing**: Jaeger/OpenTelemetry

## 3. Database Design

### 3.1 Multi-Tenant Strategy
**Approach**: Single Database + Row Level Security (RLS)

**Advantages**:
- Cost effective
- Easy maintenance
- Cross-tenant analytics possible
- Backup/restore simplified

**Implementation**:
```sql
-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation ON users
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3.2 Core Schema
```sql
-- Platform Core
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenant_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- RBAC
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### 3.3 Business Module Schemas
```sql
-- CRM Module
CREATE TABLE crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    company_id UUID REFERENCES crm_companies(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Module
CREATE TABLE inv_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(20),
    cost_price DECIMAL(15,2),
    selling_price DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, sku)
);

CREATE TABLE inv_warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);

CREATE TABLE inv_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    product_id UUID NOT NULL REFERENCES inv_products(id),
    warehouse_id UUID NOT NULL REFERENCES inv_warehouses(id),
    quantity DECIMAL(15,3) DEFAULT 0,
    reserved_quantity DECIMAL(15,3) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, product_id, warehouse_id)
);
```

## 4. API Design

### 4.1 REST API Conventions
- **Base URL**: `/api/v1`
- **Authentication**: Bearer JWT token
- **Content-Type**: `application/json`
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Status Codes**: Standard HTTP codes
- **Error Format**: RFC 7807 Problem Details

### 4.2 API Structure
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   └── POST /forgot-password
├── tenants/
│   ├── GET /current
│   ├── PUT /current
│   └── GET /members
├── users/
│   ├── GET /profile
│   ├── PUT /profile
│   └── POST /invite
├── crm/
│   ├── companies/
│   ├── contacts/
│   ├── leads/
│   └── deals/
├── inventory/
│   ├── products/
│   ├── warehouses/
│   └── stock/
└── procurement/
    ├── vendors/
    ├── purchase-requests/
    └── purchase-orders/
```

### 4.3 Request/Response Examples
```json
// POST /api/v1/crm/companies
{
  "name": "PT Example Corp",
  "industry": "Technology",
  "website": "https://example.com",
  "email": "contact@example.com",
  "phone": "+62-21-1234567",
  "address": {
    "street": "Jl. Sudirman No. 1",
    "city": "Jakarta",
    "postal_code": "12190",
    "country": "Indonesia"
  }
}

// Response 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "PT Example Corp",
  "industry": "Technology",
  "website": "https://example.com",
  "email": "contact@example.com",
  "phone": "+62-21-1234567",
  "address": {
    "street": "Jl. Sudirman No. 1",
    "city": "Jakarta",
    "postal_code": "12190",
    "country": "Indonesia"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## 5. Authentication & Authorization

### 5.1 Authentication Flow
```
1. User submits email/password
2. Server validates credentials
3. Server generates JWT access token (15 min) + refresh token (7 days)
4. Tokens stored in httpOnly secure cookies
5. Client includes cookies in subsequent requests
6. Server validates JWT and extracts user/tenant context
7. Server sets PostgreSQL session variable for RLS
```

### 5.2 JWT Payload
```json
{
  "sub": "user-uuid",
  "tenant_id": "tenant-uuid",
  "email": "user@example.com",
  "roles": ["admin", "sales_manager"],
  "permissions": ["crm:read", "crm:write", "inventory:read"],
  "iat": 1642234567,
  "exp": 1642235467
}
```

### 5.3 Authorization Middleware
```rust
pub async fn authorize(
    req: Request<Body>,
    next: Next<Body>,
    required_permission: &str,
) -> Result<Response, AuthError> {
    // 1. Extract JWT from cookie
    // 2. Validate JWT signature and expiry
    // 3. Check if user has required permission
    // 4. Set tenant context for RLS
    // 5. Continue to handler or return 403
}
```

## 6. Frontend Architecture

### 6.1 Project Structure
```
apps/web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   │   ├── auth/
│   │   ├── crm/
│   │   ├── inventory/
│   │   └── dashboard/
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── App.tsx
├── public/
└── package.json
```

### 6.2 State Management Strategy
- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand for UI state
- **Form State**: React Hook Form
- **Authentication**: Context + Zustand

### 6.3 Component Architecture
```typescript
// Example: Company List Component
export function CompanyList() {
  const { data: companies, isLoading, error } = useCompanies();
  const [filters, setFilters] = useFilters();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <CompanyFilters filters={filters} onChange={setFilters} />
      <DataTable
        data={companies}
        columns={companyColumns}
        onRowClick={(company) => navigate(`/crm/companies/${company.id}`)}
      />
    </div>
  );
}
```

## 7. Security Considerations

### 7.1 Data Protection
- **Encryption at Rest**: PostgreSQL TDE
- **Encryption in Transit**: TLS 1.3
- **Password Hashing**: Argon2id
- **Sensitive Data**: Separate encryption for PII

### 7.2 Input Validation
- **Backend**: Serde + Validator crate
- **Frontend**: Zod schemas
- **SQL Injection**: Parameterized queries only
- **XSS**: Content Security Policy + input sanitization

### 7.3 Rate Limiting
```rust
// Example rate limiting configuration
RateLimitLayer::new(
    GovernorConfigBuilder::default()
        .per_second(10)
        .burst_size(20)
        .finish()
        .unwrap()
)
```

## 8. Monitoring & Observability

### 8.1 Logging Strategy
- **Structured Logging**: JSON format with tracing
- **Log Levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **Correlation IDs**: Request tracking across services
- **Sensitive Data**: Redaction of PII in logs

### 8.2 Metrics Collection
- **Application Metrics**: Request count, duration, errors
- **Business Metrics**: User registrations, active tenants
- **Infrastructure Metrics**: CPU, memory, disk, network
- **Database Metrics**: Connection pool, query performance

### 8.3 Health Checks
```rust
// Health check endpoint
async fn health_check() -> Json<HealthStatus> {
    Json(HealthStatus {
        status: "healthy",
        database: check_database().await,
        redis: check_redis().await,
        version: env!("CARGO_PKG_VERSION"),
        uptime: get_uptime(),
    })
}
```

## 9. Testing Strategy

### 9.1 Backend Testing
- **Unit Tests**: Domain logic, utilities
- **Integration Tests**: API endpoints, database operations
- **Contract Tests**: OpenAPI specification compliance
- **Load Tests**: Performance under load

### 9.2 Frontend Testing
- **Unit Tests**: Components, hooks, utilities
- **Integration Tests**: User flows, API integration
- **E2E Tests**: Critical business flows
- **Visual Tests**: Component snapshots

### 9.3 Test Data Management
- **Fixtures**: Predefined test data sets
- **Factories**: Dynamic test data generation
- **Database**: Isolated test database per test suite
- **Cleanup**: Automatic cleanup after tests

## 10. Deployment & DevOps

### 10.1 CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          cargo test
          npm test
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker images
        run: docker build -t app:${{ github.sha }} .
      
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: kubectl apply -f k8s/
```

### 10.2 Environment Configuration
- **Development**: Docker Compose with hot reload
- **Staging**: Kubernetes cluster, production-like data
- **Production**: Kubernetes cluster, high availability
- **Configuration**: Environment variables + secrets management
