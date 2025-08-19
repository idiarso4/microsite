# Multi-Service ERP Platform

A modern, multi-tenant ERP platform built with Rust (backend) and React (frontend), designed for small to medium businesses across various industries.

## 🚀 Features

### Platform Core
- **Multi-tenant Architecture**: Secure data isolation using PostgreSQL Row Level Security (RLS)
- **Authentication & Authorization**: JWT-based auth with RBAC (Role-Based Access Control)
- **RESTful API**: Versioned API with OpenAPI documentation
- **Real-time Updates**: WebSocket support for live data updates

### Business Modules
- **CRM & Sales**: Lead management, contact database, sales pipeline
- **Inventory Management**: Multi-warehouse stock tracking, product catalog
- **Procurement**: Vendor management, purchase orders, goods receipt
- **Accounting**: Chart of accounts, journal entries, financial reports
- **Human Resources**: Employee management, leave tracking, timesheets

## 🛠 Technology Stack

### Backend (Rust)
- **Framework**: Axum (async web framework)
- **Database**: PostgreSQL with SQLx (compile-time checked queries)
- **Cache**: Redis (sessions, rate limiting, job queue)
- **Authentication**: JWT with Argon2 password hashing
- **Observability**: Tracing with OpenTelemetry support
- **Documentation**: OpenAPI/Swagger UI

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and building)
- **UI Library**: Material-UI (MUI) or Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15+ with Row Level Security
- **Cache**: Redis 7+
- **Email**: SMTP integration (MailHog for development)
- **Monitoring**: Prometheus metrics, structured logging

## 📋 Prerequisites

- **Rust**: 1.75+ (install via [rustup](https://rustup.rs/))
- **Node.js**: 18+ (for frontend development)
- **Docker**: For running infrastructure services
- **PostgreSQL**: 15+ (or use Docker)
- **Redis**: 7+ (or use Docker)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/multi-service-erp.git
cd multi-service-erp
```

### 2. Setup Environment
```bash
# Copy environment configuration
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Start Development Environment
```bash
# Make the development script executable
chmod +x scripts/dev.sh

# Start infrastructure services (PostgreSQL, Redis, MailHog)
./scripts/dev.sh start
```

### 4. Run Database Migrations
```bash
cd apps/api
sqlx migrate run
cd ../..
```

### 5. Start the API Server
```bash
# Install dependencies and start the API
cargo run --bin api
```

The API will be available at `http://localhost:3000`

### 6. Start the Frontend (Optional)
```bash
cd apps/web
npm install
npm run dev
```

The web interface will be available at `http://localhost:5173`

## 📚 Documentation

### API Documentation
- **Swagger UI**: http://localhost:3000/docs/swagger-ui
- **OpenAPI Spec**: http://localhost:3000/docs/api-docs/openapi.json

### Development Tools
- **MailHog UI**: http://localhost:8025 (email testing)
- **Health Check**: http://localhost:3000/health

## 🧪 Development

### Running Tests
```bash
# Run all tests
cargo test

# Run tests with coverage
cargo test --coverage
```

### Code Quality
```bash
# Format code
cargo fmt

# Run linter
cargo clippy

# Check for security vulnerabilities
cargo audit
```

### Database Operations
```bash
# Create a new migration
sqlx migrate add create_users_table

# Run migrations
sqlx migrate run

# Revert last migration
sqlx migrate revert
```

## 🏗 Project Structure

```
├── apps/
│   ├── api/                 # Rust API server
│   │   ├── src/
│   │   │   ├── handlers/    # HTTP request handlers
│   │   │   ├── middleware/  # Custom middleware
│   │   │   ├── routes/      # Route definitions
│   │   │   └── services/    # Business logic services
│   │   └── migrations/      # Database migrations
│   └── web/                 # React frontend (future)
├── crates/
│   ├── auth/               # Authentication & authorization
│   ├── core-domain/        # Domain models and business logic
│   ├── persistence/        # Database access layer
│   ├── shared-types/       # Shared type definitions
│   └── telemetry/          # Logging and monitoring
├── docs/                   # Documentation
├── scripts/                # Development scripts
└── deploy/                 # Deployment configurations
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | Required |
| `JWT_SECRET` | JWT signing secret (32+ chars) | Required |
| `SERVER__PORT` | API server port | 3000 |
| `EMAIL__SMTP_HOST` | SMTP server host | localhost |
| `EMAIL__SMTP_PORT` | SMTP server port | 1025 |

### Database Configuration
The application uses PostgreSQL with Row Level Security (RLS) for multi-tenant data isolation. Each tenant's data is automatically filtered based on the authenticated user's tenant context.

### Redis Configuration
Redis is used for:
- Session storage and refresh token blacklisting
- Rate limiting
- Background job queue
- Caching frequently accessed data

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Production Considerations
- Use strong JWT secrets (32+ characters)
- Enable SSL/TLS termination at load balancer
- Configure proper backup strategies for PostgreSQL
- Set up monitoring and alerting
- Use managed Redis and PostgreSQL services in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Rust naming conventions and best practices
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

### Phase 1 (Current) - MVP
- [x] Project setup and infrastructure
- [x] Authentication and multi-tenant foundation
- [ ] Core business modules (CRM, Inventory, Procurement)
- [ ] Basic reporting and dashboard

### Phase 2 - Enhancement
- [ ] Advanced reporting and analytics
- [ ] Workflow automation
- [ ] Mobile application
- [ ] Third-party integrations

### Phase 3 - Scale
- [ ] Multi-currency support
- [ ] Advanced manufacturing features
- [ ] API marketplace
- [ ] White-label solutions

---

**Built with ❤️ using Rust and React**
