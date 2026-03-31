#!/bin/bash

# Nourish Status Check Script
# Displays the current status of all services and provides health information

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Nourish Application Status         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Check Prerequisites
echo -e "${YELLOW}Prerequisites:${NC}"
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    print_status 0 "Python: $PYTHON_VERSION"
else
    print_status 1 "Python: Not installed"
fi

if command_exists node; then
    NODE_VERSION=$(node --version 2>&1)
    print_status 0 "Node.js: $NODE_VERSION"
else
    print_status 1 "Node.js: Not installed"
fi

if command_exists yarn; then
    YARN_VERSION=$(yarn --version 2>&1)
    print_status 0 "Yarn: $YARN_VERSION"
else
    print_status 1 "Yarn: Not installed"
fi

echo ""

# Check Services
echo -e "${YELLOW}Services Status:${NC}"

# Check supervisor
if command_exists supervisorctl; then
    if supervisorctl status backend 2>/dev/null | grep -q "RUNNING"; then
        print_status 0 "Backend (Supervisor): RUNNING"
    else
        print_status 1 "Backend (Supervisor): NOT RUNNING"
    fi
    
    if supervisorctl status frontend 2>/dev/null | grep -q "RUNNING"; then
        print_status 0 "Frontend (Supervisor): RUNNING"
    else
        print_status 1 "Frontend (Supervisor): NOT RUNNING"
    fi
    
    if supervisorctl status mongodb 2>/dev/null | grep -q "RUNNING"; then
        print_status 0 "MongoDB (Supervisor): RUNNING"
    else
        print_status 1 "MongoDB (Supervisor): NOT RUNNING"
    fi
else
    # Check ports directly
    if check_port 8001; then
        print_status 0 "Backend: Running on port 8001"
    else
        print_status 1 "Backend: Not running on port 8001"
    fi
    
    if check_port 3000; then
        print_status 0 "Frontend: Running on port 3000"
    else
        print_status 1 "Frontend: Not running on port 3000"
    fi
    
    if check_port 27017; then
        print_status 0 "MongoDB: Running on port 27017"
    else
        print_status 1 "MongoDB: Not running on port 27017"
    fi
fi

echo ""

# Check API Health
echo -e "${YELLOW}API Health:${NC}"
if curl -s http://localhost:8001/api/ >/dev/null 2>&1; then
    API_RESPONSE=$(curl -s http://localhost:8001/api/ | jq -r '.message' 2>/dev/null || echo "Unknown")
    print_status 0 "Backend API: Responding (\"$API_RESPONSE\")"
else
    print_status 1 "Backend API: Not responding"
fi

echo ""

# Service URLs
echo -e "${YELLOW}Service URLs:${NC}"
echo -e "  Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:8001/api${NC}"
echo -e "  MongoDB:   ${BLUE}mongodb://localhost:27017${NC}"
echo ""

# Check Environment Files
echo -e "${YELLOW}Environment Configuration:${NC}"
if [ -f "/app/backend/.env" ]; then
    print_status 0 "Backend .env exists"
else
    print_status 1 "Backend .env missing"
fi

if [ -f "/app/frontend/.env" ]; then
    print_status 0 "Frontend .env exists"
else
    print_status 1 "Frontend .env missing"
fi

echo ""

# Quick Actions
echo -e "${YELLOW}Quick Actions:${NC}"
echo "  Restart all:        ${BLUE}sudo supervisorctl restart all${NC}"
echo "  View backend logs:  ${BLUE}tail -f /var/log/supervisor/backend.*.log${NC}"
echo "  View frontend logs: ${BLUE}tail -f /var/log/supervisor/frontend.*.log${NC}"
echo "  Test API:           ${BLUE}./scripts/test_api.sh${NC}"
echo "  Help:               ${BLUE}make help${NC}"
echo ""

# Documentation
echo -e "${YELLOW}Documentation:${NC}"
echo "  Getting Started:    ${BLUE}cat GETTING_STARTED.md${NC}"
echo "  Quick Reference:    ${BLUE}cat QUICK_REFERENCE.md${NC}"
echo "  Project Status:     ${BLUE}cat PROJECT_STATUS.md${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
