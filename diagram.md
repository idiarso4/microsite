# Flowchart & Diagram - Multi-Service ERP Platform

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser<br/>React + TypeScript]
        MOB[Mobile App<br/>Future]
        API_CLIENT[API Client<br/>3rd Party]
    end
    
    subgraph "Load Balancer"
        LB[Nginx/Caddy<br/>SSL Termination]
    end
    
    subgraph "Application Layer"
        GATEWAY[API Gateway<br/>Rust + Axum]
        AUTH[Auth Service<br/>JWT + RBAC]
        CORE[Core Service<br/>Business Logic]
        NOTIF[Notification<br/>Service]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL<br/>Multi-tenant + RLS)]
        REDIS[(Redis<br/>Cache + Sessions)]
        FILES[File Storage<br/>S3/Local]
    end
    
    subgraph "External Services"
        SMTP[Email Service<br/>SMTP]
        PAYMENT[Payment Gateway<br/>Future]
    end
    
    WEB --> LB
    MOB --> LB
    API_CLIENT --> LB
    
    LB --> GATEWAY
    GATEWAY --> AUTH
    GATEWAY --> CORE
    GATEWAY --> NOTIF
    
    AUTH --> PG
    AUTH --> REDIS
    CORE --> PG
    CORE --> REDIS
    NOTIF --> SMTP
    CORE --> FILES
```

## 2. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant DB as Database
    participant R as Redis
    
    U->>F: Enter email/password
    F->>A: POST /api/v1/auth/login
    A->>DB: Validate credentials
    DB-->>A: User data + tenant info
    A->>A: Generate JWT tokens
    A->>R: Store refresh token
    A-->>F: Set httpOnly cookies
    F-->>U: Redirect to dashboard
    
    Note over F,A: Subsequent requests
    F->>A: API request with cookies
    A->>A: Validate JWT
    A->>DB: Set tenant context (RLS)
    A-->>F: Authorized response
```

## 3. Multi-Tenant Data Access Flow

```mermaid
flowchart TD
    START([API Request]) --> AUTH{JWT Valid?}
    AUTH -->|No| REJECT[Return 401]
    AUTH -->|Yes| EXTRACT[Extract tenant_id from JWT]
    EXTRACT --> SET_CONTEXT[Set PostgreSQL session:<br/>app.current_tenant_id]
    SET_CONTEXT --> QUERY[Execute SQL Query]
    QUERY --> RLS{Row Level Security<br/>Policy Check}
    RLS -->|Pass| RETURN[Return filtered data]
    RLS -->|Fail| EMPTY[Return empty result]
    RETURN --> END([Response])
    EMPTY --> END
    REJECT --> END
```

## 4. Business Process Flow - Lead to Cash

```mermaid
flowchart LR
    subgraph "CRM Module"
        LEAD[Lead Capture] --> QUALIFY[Lead Qualification]
        QUALIFY --> CONTACT[Contact Creation]
        CONTACT --> DEAL[Deal Creation]
        DEAL --> PIPELINE[Sales Pipeline]
        PIPELINE --> WON{Deal Won?}
    end
    
    subgraph "Sales Module"
        WON -->|Yes| QUOTE[Generate Quote]
        QUOTE --> ORDER[Sales Order]
        ORDER --> INVOICE[Invoice Creation]
    end
    
    subgraph "Inventory Module"
        ORDER --> RESERVE[Reserve Stock]
        RESERVE --> PICK[Pick Items]
        PICK --> SHIP[Ship Order]
    end
    
    subgraph "Accounting Module"
        INVOICE --> JOURNAL[Auto Journal Entry]
        JOURNAL --> AR[Accounts Receivable]
        AR --> PAYMENT[Payment Receipt]
        PAYMENT --> CLOSE[Close Transaction]
    end
    
    WON -->|No| LOST[Deal Lost]
    LOST --> ANALYZE[Analyze Reasons]
```

## 5. Procurement Process Flow - Purchase to Pay

```mermaid
flowchart TD
    START([Need Identified]) --> PR[Create Purchase Request]
    PR --> APPROVE_PR{PR Approval<br/>Required?}
    APPROVE_PR -->|Yes| WAIT_APPROVAL[Wait for Approval]
    APPROVE_PR -->|No| CREATE_PO[Create Purchase Order]
    WAIT_APPROVAL --> APPROVED{Approved?}
    APPROVED -->|No| REJECT_PR[Reject PR]
    APPROVED -->|Yes| CREATE_PO
    
    CREATE_PO --> SEND_PO[Send PO to Vendor]
    SEND_PO --> WAIT_DELIVERY[Wait for Delivery]
    WAIT_DELIVERY --> RECEIVE[Goods Receipt Note]
    RECEIVE --> QC{Quality Check<br/>Pass?}
    QC -->|No| RETURN[Return to Vendor]
    QC -->|Yes| UPDATE_STOCK[Update Inventory]
    UPDATE_STOCK --> INVOICE_MATCH[3-Way Matching:<br/>PO + GRN + Invoice]
    INVOICE_MATCH --> PAYMENT_APPROVAL[Payment Approval]
    PAYMENT_APPROVAL --> PAY_VENDOR[Pay Vendor]
    PAY_VENDOR --> CLOSE_PO[Close PO]
    
    REJECT_PR --> END([End])
    RETURN --> WAIT_DELIVERY
    CLOSE_PO --> END
```

## 6. Inventory Management Flow

```mermaid
flowchart LR
    subgraph "Inbound"
        PURCHASE[Purchase Order] --> RECEIVE[Goods Receipt]
        RECEIVE --> QC[Quality Check]
        QC --> PUT_AWAY[Put Away to Location]
        PUT_AWAY --> UPDATE_STOCK[Update Stock Levels]
    end
    
    subgraph "Stock Management"
        UPDATE_STOCK --> TRACK[Real-time Tracking]
        TRACK --> ALERT{Stock Below<br/>Minimum?}
        ALERT -->|Yes| REORDER[Generate Reorder Alert]
        ALERT -->|No| MONITOR[Continue Monitoring]
        REORDER --> PURCHASE
    end
    
    subgraph "Outbound"
        SALES_ORDER[Sales Order] --> RESERVE[Reserve Stock]
        RESERVE --> PICK[Pick Items]
        PICK --> PACK[Pack Order]
        PACK --> SHIP[Ship to Customer]
        SHIP --> REDUCE_STOCK[Reduce Stock Levels]
    end
    
    MONITOR --> RESERVE
    REDUCE_STOCK --> TRACK
```

## 7. User Registration & Tenant Setup Flow

```mermaid
flowchart TD
    START([User Visits Site]) --> REGISTER[Click Register]
    REGISTER --> FORM[Fill Registration Form:<br/>Company Name, Admin Email, Password]
    FORM --> VALIDATE{Form Valid?}
    VALIDATE -->|No| FORM
    VALIDATE -->|Yes| CREATE_TENANT[Create Tenant Record]
    CREATE_TENANT --> CREATE_USER[Create Admin User]
    CREATE_USER --> ASSIGN_ROLE[Assign Owner Role]
    ASSIGN_ROLE --> SEND_EMAIL[Send Verification Email]
    SEND_EMAIL --> WAIT[Wait for Email Verification]
    WAIT --> VERIFY{Email Verified?}
    VERIFY -->|No| RESEND{Resend Email?}
    VERIFY -->|Yes| SETUP[Initial Setup Wizard]
    SETUP --> COMPLETE[Registration Complete]
    RESEND -->|Yes| SEND_EMAIL
    RESEND -->|No| EXPIRE[Account Expires]
```

## 8. Role-Based Access Control (RBAC) Flow

```mermaid
flowchart TD
    REQUEST[API Request] --> AUTH[Authenticate User]
    AUTH --> EXTRACT[Extract User Roles & Permissions]
    EXTRACT --> CHECK[Check Required Permission]
    CHECK --> HAS_PERM{Has Permission?}
    HAS_PERM -->|Yes| TENANT_CHECK[Check Tenant Access]
    HAS_PERM -->|No| DENY[Access Denied - 403]
    TENANT_CHECK --> SAME_TENANT{Same Tenant?}
    SAME_TENANT -->|Yes| ALLOW[Allow Access]
    SAME_TENANT -->|No| DENY
    
    subgraph "Permission Examples"
        PERM1[crm:companies:read]
        PERM2[inventory:products:write]
        PERM3[accounting:reports:read]
        PERM4[admin:users:manage]
    end
```

## 9. Data Integration Flow Between Modules

```mermaid
flowchart LR
    subgraph "CRM"
        COMPANY[Company] --> CONTACT[Contact]
        CONTACT --> LEAD[Lead]
        LEAD --> DEAL[Deal]
    end
    
    subgraph "Sales"
        DEAL -->|Won| CUSTOMER[Customer]
        CUSTOMER --> QUOTE[Quote]
        QUOTE --> SO[Sales Order]
    end
    
    subgraph "Inventory"
        SO --> RESERVE[Stock Reservation]
        RESERVE --> PICK[Picking List]
        PICK --> DELIVERY[Delivery Note]
    end
    
    subgraph "Procurement"
        PRODUCT[Product] --> VENDOR[Vendor]
        VENDOR --> PO[Purchase Order]
        PO --> GRN[Goods Receipt]
        GRN --> STOCK[Stock Update]
    end
    
    subgraph "Accounting"
        SO --> INVOICE[Sales Invoice]
        PO --> BILL[Purchase Bill]
        INVOICE --> AR[Accounts Receivable]
        BILL --> AP[Accounts Payable]
        AR --> PAYMENT_IN[Payment Receipt]
        AP --> PAYMENT_OUT[Payment Made]
    end
    
    STOCK --> PRODUCT
    DELIVERY --> INVOICE
```

## 10. Error Handling & Recovery Flow

```mermaid
flowchart TD
    REQUEST[API Request] --> VALIDATE[Input Validation]
    VALIDATE --> VALID{Valid Input?}
    VALID -->|No| VALIDATION_ERROR[Return 400<br/>Validation Error]
    VALID -->|Yes| AUTHORIZE[Authorization Check]
    AUTHORIZE --> AUTHORIZED{Authorized?}
    AUTHORIZED -->|No| AUTH_ERROR[Return 403<br/>Forbidden]
    AUTHORIZED -->|Yes| PROCESS[Process Request]
    PROCESS --> SUCCESS{Success?}
    SUCCESS -->|Yes| RESPONSE[Return Success Response]
    SUCCESS -->|No| ERROR_TYPE{Error Type?}
    
    ERROR_TYPE -->|Business Logic| BIZ_ERROR[Return 422<br/>Business Error]
    ERROR_TYPE -->|Database| DB_ERROR[Return 500<br/>Database Error]
    ERROR_TYPE -->|External Service| EXT_ERROR[Return 502<br/>Service Unavailable]
    ERROR_TYPE -->|Unknown| UNKNOWN_ERROR[Return 500<br/>Internal Error]
    
    DB_ERROR --> LOG[Log Error Details]
    EXT_ERROR --> LOG
    UNKNOWN_ERROR --> LOG
    LOG --> ALERT[Send Alert to Team]
```

## 11. Deployment & CI/CD Flow

```mermaid
flowchart LR
    subgraph "Development"
        DEV[Developer] --> COMMIT[Git Commit]
        COMMIT --> PUSH[Git Push]
    end
    
    subgraph "CI Pipeline"
        PUSH --> TRIGGER[Trigger CI]
        TRIGGER --> LINT[Lint & Format Check]
        LINT --> TEST[Run Tests]
        TEST --> BUILD[Build Application]
        BUILD --> SECURITY[Security Scan]
    end
    
    subgraph "CD Pipeline"
        SECURITY --> PASS{All Checks Pass?}
        PASS -->|No| FAIL[Pipeline Failed]
        PASS -->|Yes| BUILD_IMAGE[Build Docker Image]
        BUILD_IMAGE --> PUSH_REGISTRY[Push to Registry]
        PUSH_REGISTRY --> DEPLOY_STAGING[Deploy to Staging]
        DEPLOY_STAGING --> E2E_TEST[E2E Tests]
        E2E_TEST --> STAGING_PASS{Tests Pass?}
        STAGING_PASS -->|No| ROLLBACK[Rollback Staging]
        STAGING_PASS -->|Yes| MANUAL_APPROVAL[Manual Approval for Prod]
        MANUAL_APPROVAL --> DEPLOY_PROD[Deploy to Production]
        DEPLOY_PROD --> HEALTH_CHECK[Health Check]
        HEALTH_CHECK --> MONITOR[Monitor Metrics]
    end
    
    FAIL --> NOTIFY[Notify Developer]
    ROLLBACK --> NOTIFY
```

## 12. Database Schema Relationship

```mermaid
erDiagram
    TENANTS ||--o{ TENANT_MEMBERSHIPS : has
    USERS ||--o{ TENANT_MEMBERSHIPS : belongs_to
    TENANTS ||--o{ ROLES : has
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : belongs_to
    
    TENANTS ||--o{ CRM_COMPANIES : owns
    CRM_COMPANIES ||--o{ CRM_CONTACTS : has
    CRM_CONTACTS ||--o{ CRM_LEADS : generates
    CRM_LEADS ||--o{ CRM_DEALS : converts_to
    
    TENANTS ||--o{ INV_PRODUCTS : owns
    TENANTS ||--o{ INV_WAREHOUSES : owns
    INV_PRODUCTS ||--o{ INV_STOCK : stored_in
    INV_WAREHOUSES ||--o{ INV_STOCK : contains
    
    TENANTS ||--o{ PROC_VENDORS : owns
    PROC_VENDORS ||--o{ PROC_PURCHASE_ORDERS : receives
    INV_PRODUCTS ||--o{ PROC_PO_ITEMS : ordered
    
    TENANTS ||--o{ ACC_ACCOUNTS : owns
    TENANTS ||--o{ ACC_JOURNALS : owns
    ACC_ACCOUNTS ||--o{ ACC_JOURNAL_LINES : affects
    
    TENANTS {
        uuid id PK
        string name
        string slug UK
        string plan
        jsonb settings
        timestamp created_at
    }
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        boolean is_active
        timestamp created_at
    }
    
    TENANT_MEMBERSHIPS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string role
        boolean is_active
    }
```

## 13. Security Architecture Flow

```mermaid
flowchart TD
    subgraph "Client Security"
        HTTPS[HTTPS Only]
        CSP[Content Security Policy]
        CSRF[CSRF Protection]
    end
    
    subgraph "API Security"
        RATE_LIMIT[Rate Limiting]
        INPUT_VAL[Input Validation]
        JWT_AUTH[JWT Authentication]
        RBAC_CHECK[RBAC Authorization]
    end
    
    subgraph "Data Security"
        RLS[Row Level Security]
        ENCRYPT_REST[Encryption at Rest]
        ENCRYPT_TRANSIT[Encryption in Transit]
        AUDIT_LOG[Audit Logging]
    end
    
    subgraph "Infrastructure Security"
        FIREWALL[Firewall Rules]
        VPC[Private Network]
        SECRETS[Secret Management]
        BACKUP[Encrypted Backups]
    end
    
    CLIENT[Client Request] --> HTTPS
    HTTPS --> RATE_LIMIT
    RATE_LIMIT --> INPUT_VAL
    INPUT_VAL --> JWT_AUTH
    JWT_AUTH --> RBAC_CHECK
    RBAC_CHECK --> RLS
    RLS --> AUDIT_LOG
```

## 14. Monitoring & Observability Flow

```mermaid
flowchart LR
    subgraph "Application"
        APP[Application Code]
        METRICS[Metrics Collection]
        LOGS[Structured Logging]
        TRACES[Distributed Tracing]
    end
    
    subgraph "Collection"
        PROMETHEUS[Prometheus]
        LOKI[Loki/ELK]
        JAEGER[Jaeger]
    end
    
    subgraph "Visualization"
        GRAFANA[Grafana Dashboards]
        ALERTS[Alert Manager]
        KIBANA[Kibana/Logs UI]
    end
    
    subgraph "Notification"
        EMAIL[Email Alerts]
        SLACK[Slack Notifications]
        PAGER[PagerDuty]
    end
    
    APP --> METRICS
    APP --> LOGS
    APP --> TRACES
    
    METRICS --> PROMETHEUS
    LOGS --> LOKI
    TRACES --> JAEGER
    
    PROMETHEUS --> GRAFANA
    PROMETHEUS --> ALERTS
    LOKI --> KIBANA
    JAEGER --> GRAFANA
    
    ALERTS --> EMAIL
    ALERTS --> SLACK
    ALERTS --> PAGER
```

## 15. Mobile App Architecture (Future)

```mermaid
flowchart TD
    subgraph "Mobile Client"
        REACT_NATIVE[React Native]
        OFFLINE[Offline Storage]
        SYNC[Data Synchronization]
    end
    
    subgraph "API Layer"
        MOBILE_API[Mobile API Endpoints]
        PUSH[Push Notifications]
        FILE_UPLOAD[File Upload Service]
    end
    
    subgraph "Backend Services"
        CORE_API[Core API]
        NOTIFICATION[Notification Service]
        FILE_SERVICE[File Service]
    end
    
    REACT_NATIVE --> MOBILE_API
    OFFLINE --> SYNC
    SYNC --> MOBILE_API
    
    MOBILE_API --> CORE_API
    PUSH --> NOTIFICATION
    FILE_UPLOAD --> FILE_SERVICE
    
    NOTIFICATION --> FCM[Firebase Cloud Messaging]
    FILE_SERVICE --> S3[S3 Storage]
```

Diagram-diagram di atas memberikan visualisasi lengkap tentang:

1. **Arsitektur sistem** secara keseluruhan
2. **Alur autentikasi** dan keamanan multi-tenant
3. **Proses bisnis** end-to-end dari lead hingga payment
4. **Integrasi antar modul** dan flow data
5. **Error handling** dan recovery mechanisms
6. **CI/CD pipeline** untuk deployment
7. **Database relationships** dan struktur data
8. **Security layers** di semua tingkatan
9. **Monitoring** dan observability
10. **Future mobile architecture**

Setiap diagram menggunakan Mermaid syntax yang dapat di-render langsung di GitHub, GitLab, atau tools dokumentasi lainnya. Apakah ada diagram spesifik yang perlu diperjelas atau ditambahkan?
