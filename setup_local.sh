#!/bin/bash

# Nourish Local Setup Script
# This script automates the setup process for local development

set -e  # Exit on any error

echo "🚀 Nourish Local Setup"
echo "====================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check Prerequisites
echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_error "Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

if command_exists yarn; then
    YARN_VERSION=$(yarn --version)
    print_success "Yarn found: $YARN_VERSION"
else
    print_warning "Yarn is not installed. Installing yarn..."
    npm install -g yarn
fi

echo ""

# Step 2: Setup Backend
echo "Step 2: Setting up backend..."
echo "-----------------------------------"

cd backend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating default .env..."
    cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="http://localhost:3000"
EOF
    print_success "Created backend/.env"
else
    print_success "backend/.env already exists"
fi

# Install Python dependencies
print_warning "Installing Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
print_success "Python dependencies installed"

cd ..
echo ""

# Step 3: Setup Frontend
echo "Step 3: Setting up frontend..."
echo "-----------------------------------"

cd frontend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating default .env..."
    cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
EOF
    print_success "Created frontend/.env"
else
    print_success "frontend/.env already exists"
fi

# Install Node dependencies
print_warning "Installing Node.js dependencies (this may take a while)..."
yarn install > /dev/null 2>&1
print_success "Node.js dependencies installed"

cd ..
echo ""

# Step 4: Check MongoDB
echo "Step 4: Checking MongoDB..."
echo "-----------------------------------"

if command_exists mongod; then
    print_success "MongoDB is installed"
elif command_exists docker; then
    print_warning "MongoDB not found locally. Checking Docker..."
    if docker ps | grep -q mongodb; then
        print_success "MongoDB is running in Docker"
    else
        print_warning "Starting MongoDB in Docker..."
        docker run -d -p 27017:27017 --name mongodb mongo:latest > /dev/null 2>&1
        print_success "MongoDB started in Docker"
    fi
else
    print_error "MongoDB is not installed and Docker is not available."
    echo "Please install MongoDB or Docker to continue."
    echo "Visit: https://www.mongodb.com/docs/manual/installation/"
    exit 1
fi

echo ""

# Step 5: Summary
echo "✨ Setup Complete!"
echo "===================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   uvicorn server:app --reload --host 0.0.0.0 --port 8001"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   yarn start"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8001/api"
echo ""
print_success "Happy coding! 🎉"
