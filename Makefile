.PHONY: help setup install-backend install-frontend install start-backend start-frontend start test-api clean docker-up docker-down docker-logs status

help:
	@echo "Nourish - Development Commands"
	@echo "=============================="
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup          - Complete automated setup"
	@echo "  make install        - Install all dependencies"
	@echo "  make install-backend - Install backend dependencies only"
	@echo "  make install-frontend - Install frontend dependencies only"
	@echo ""
	@echo "Development Commands:"
	@echo "  make start-backend  - Start backend server"
	@echo "  make start-frontend - Start frontend server"
	@echo "  make start          - Start both backend and frontend (in parallel)"
	@echo "  make status         - Show application status"
	@echo ""
	@echo "Testing Commands:"
	@echo "  make test-api       - Test all API endpoints"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-up      - Start all services with Docker"
	@echo "  make docker-down    - Stop all Docker services"
	@echo "  make docker-logs    - View Docker logs"
	@echo "  make docker-restart - Restart all Docker services"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean          - Clean up temporary files"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"

# Setup
setup:
	@./setup_local.sh

# Installation
install: install-backend install-frontend

install-backend:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && yarn install

# Development
start-backend:
	@./scripts/start_backend.sh

start-frontend:
	@./scripts/start_frontend.sh

start:
	@echo "Starting backend and frontend..."
	@make -j2 start-backend start-frontend

# Testing
test-api:
	@./scripts/test_api.sh

# Status
status:
	@./scripts/status.sh

# Docker
docker-up:
	docker-compose up

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-rebuild:
	docker-compose up --build

# Logs (for supervisor setup)
logs-backend:
	@tail -f /var/log/supervisor/backend.*.log

logs-frontend:
	@tail -f /var/log/supervisor/frontend.*.log

# Clean
clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf frontend/build 2>/dev/null || true
	rm -rf backend/.pytest_cache 2>/dev/null || true
	@echo "✓ Cleanup complete"
