# Docker Setup Guide

Run the entire Nourish application with a single command using Docker Compose!

## Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
  - **macOS/Windows**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - **Linux**: Install Docker and Docker Compose separately

## Quick Start with Docker

### 1. Start Everything
```bash
docker-compose up
```

This single command will:
- Start MongoDB
- Start the Backend API
- Start the Frontend development server
- Set up networking between all services

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api
- **MongoDB**: mongodb://localhost:27017

### 3. Stop Everything
```bash
# Stop services (Ctrl+C in the terminal running docker-compose)
# Or in a new terminal:
docker-compose down
```

## Docker Commands Reference

### Start in Detached Mode (Background)
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

### Stop and Remove Everything (including volumes)
```bash
docker-compose down -v
```

### Rebuild Containers (after dependency changes)
```bash
docker-compose up --build
```

### Execute Commands in Running Containers
```bash
# Access backend shell
docker-compose exec backend bash

# Access frontend shell
docker-compose exec frontend sh

# Access MongoDB shell
docker-compose exec mongodb mongosh
```

## Service-Specific Commands

### Backend Only
```bash
docker-compose up backend
```

### Frontend Only
```bash
docker-compose up frontend
```

### MongoDB Only
```bash
docker-compose up mongodb
```

## Development Workflow with Docker

### Making Code Changes

#### Backend Changes
1. Edit files in `backend/`
2. Changes are automatically reloaded (volume mounted)
3. Check logs: `docker-compose logs -f backend`

#### Frontend Changes
1. Edit files in `frontend/src/`
2. Changes are automatically reloaded
3. Refresh browser to see changes

### Installing New Dependencies

#### Backend (Python)
```bash
# Add package to requirements.txt
echo "new-package==1.0.0" >> backend/requirements.txt

# Rebuild the backend container
docker-compose up --build backend
```

#### Frontend (Node.js)
```bash
# Access the frontend container
docker-compose exec frontend sh

# Install the package
yarn add <package-name>

# Exit the container
exit

# Restart the frontend
docker-compose restart frontend
```

## Database Management with Docker

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh
```

### View Database
```javascript
use nourish_db
show collections
db.status_checks.find()
```

### Backup Database
```bash
docker-compose exec mongodb mongodump --out /backup
```

### Clear Database
```bash
docker-compose exec mongodb mongosh --eval "db.dropDatabase()" nourish_db
```

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

```bash
# Find and kill processes using the ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8001 | xargs kill -9  # Backend
lsof -ti:27017 | xargs kill -9 # MongoDB
```

### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Clean Slate
```bash
# Remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

### Permission Issues
```bash
# Fix permissions on Linux
sudo chown -R $USER:$USER .
```

## Production Build with Docker

### Build Production Images
```bash
# Build optimized production images
docker-compose -f docker-compose.prod.yml build
```

### Run Production Stack
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Advantages of Docker Setup

✅ **Consistent Environment**: Same setup across all machines
✅ **Easy Onboarding**: New developers can start with one command
✅ **Isolated Services**: Each service runs in its own container
✅ **No Local Installation**: No need to install Python, Node, or MongoDB locally
✅ **Easy Cleanup**: Remove everything with one command

## When to Use Docker vs Local Setup

### Use Docker When:
- You want a quick, isolated setup
- Working with a team (consistent environment)
- You don't want to install dependencies locally
- Testing production-like environment

### Use Local Setup When:
- You prefer native performance
- You want more control over the environment
- You're already familiar with the local tools
- You need to debug system-level issues

## Next Steps

1. ✅ Start services: `docker-compose up`
2. 🌐 Open http://localhost:3000
3. 📝 Start coding!
4. 📊 Check logs as needed

For local setup without Docker, see [LOCAL_SETUP.md](LOCAL_SETUP.md)
