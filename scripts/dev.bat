@echo off
REM Development script for ERP Platform (Windows)

setlocal enabledelayedexpansion

REM Colors for output (Windows doesn't support colors in batch easily, so we'll use echo)
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "NC=[0m"

REM Function to print status
:print_status
echo [INFO] %~1
goto :eof

:print_warning
echo [WARN] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not running. Please start Docker and try again."
    exit /b 1
)
goto :eof

REM Check if .env file exists
:check_env
if not exist .env (
    call :print_warning ".env file not found. Copying from .env.example"
    copy .env.example .env >nul
    call :print_status ".env file created. Please review and update the configuration."
)
goto :eof

REM Start development environment
:start_dev
call :print_status "Starting development environment..."

call :check_docker
call :check_env

call :print_status "Starting infrastructure services (PostgreSQL, Redis, MailHog)..."
docker-compose up -d postgres redis mailhog

call :print_status "Waiting for services to be ready..."
timeout /t 10 /nobreak >nul

call :print_status "Development environment is ready!"
call :print_status "PostgreSQL: localhost:5432"
call :print_status "Redis: localhost:6379"
call :print_status "MailHog UI: http://localhost:8025"
call :print_status ""
call :print_status "To start the API server: cargo run --bin api"
call :print_status "To start the web frontend: cd apps/web && npm run dev"
goto :eof

REM Stop development environment
:stop_dev
call :print_status "Stopping development environment..."
docker-compose down
call :print_status "Development environment stopped."
goto :eof

REM Reset development environment
:reset_dev
call :print_warning "This will destroy all data in the development environment."
set /p "confirm=Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    call :print_status "Resetting development environment..."
    docker-compose down -v
    docker-compose up -d postgres redis mailhog
    timeout /t 10 /nobreak >nul
    call :print_status "Development environment reset complete."
) else (
    call :print_status "Reset cancelled."
)
goto :eof

REM Show logs
:show_logs
docker-compose logs -f
goto :eof

REM Run tests
:run_tests
call :print_status "Running tests..."
cargo test
call :print_status "Tests completed."
goto :eof

REM Lint code
:lint_code
call :print_status "Running linters..."
cargo fmt --check
cargo clippy -- -D warnings
call :print_status "Linting completed."
goto :eof

REM Format code
:format_code
call :print_status "Formatting code..."
cargo fmt
call :print_status "Code formatted."
goto :eof

REM Show help
:show_help
echo ERP Platform Development Script (Windows)
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   start     Start development environment
echo   stop      Stop development environment
echo   reset     Reset development environment (destroys data)
echo   logs      Show logs from all services
echo   test      Run tests
echo   lint      Run linters
echo   format    Format code
echo   help      Show this help message
echo.
goto :eof

REM Main script logic
if "%1"=="start" (
    call :start_dev
) else if "%1"=="stop" (
    call :stop_dev
) else if "%1"=="reset" (
    call :reset_dev
) else if "%1"=="logs" (
    call :show_logs
) else if "%1"=="test" (
    call :run_tests
) else if "%1"=="lint" (
    call :lint_code
) else if "%1"=="format" (
    call :format_code
) else (
    call :show_help
)
