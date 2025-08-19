#!/bin/bash

# Development script for ERP Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Copying from .env.example"
        cp .env.example .env
        print_status ".env file created. Please review and update the configuration."
    fi
}

# Start development environment
start_dev() {
    print_status "Starting development environment..."
    
    check_docker
    check_env
    
    # Start infrastructure services
    print_status "Starting infrastructure services (PostgreSQL, Redis, MailHog)..."
    docker-compose up -d postgres redis mailhog
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    cd apps/api
    sqlx migrate run
    cd ../..
    
    print_status "Development environment is ready!"
    print_status "PostgreSQL: localhost:5432"
    print_status "Redis: localhost:6379"
    print_status "MailHog UI: http://localhost:8025"
    print_status ""
    print_status "To start the API server: cargo run --bin api"
    print_status "To start the web frontend: cd apps/web && npm run dev"
}

# Stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose down
    print_status "Development environment stopped."
}

# Reset development environment
reset_dev() {
    print_warning "This will destroy all data in the development environment."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting development environment..."
        docker-compose down -v
        docker-compose up -d postgres redis mailhog
        sleep 10
        cd apps/api
        sqlx migrate run
        cd ../..
        print_status "Development environment reset complete."
    else
        print_status "Reset cancelled."
    fi
}

# Show logs
show_logs() {
    docker-compose logs -f
}

# Run tests
run_tests() {
    print_status "Running tests..."
    cargo test
    print_status "Tests completed."
}

# Lint code
lint_code() {
    print_status "Running linters..."
    cargo fmt --check
    cargo clippy -- -D warnings
    print_status "Linting completed."
}

# Format code
format_code() {
    print_status "Formatting code..."
    cargo fmt
    print_status "Code formatted."
}

# Show help
show_help() {
    echo "ERP Platform Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start development environment"
    echo "  stop      Stop development environment"
    echo "  reset     Reset development environment (destroys data)"
    echo "  logs      Show logs from all services"
    echo "  test      Run tests"
    echo "  lint      Run linters"
    echo "  format    Format code"
    echo "  help      Show this help message"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    reset)
        reset_dev
        ;;
    logs)
        show_logs
        ;;
    test)
        run_tests
        ;;
    lint)
        lint_code
        ;;
    format)
        format_code
        ;;
    help|*)
        show_help
        ;;
esac
