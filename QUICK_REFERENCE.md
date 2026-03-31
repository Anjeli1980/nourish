# Nourish - Quick Reference Guide

## 🚀 One-Command Starts

```bash
# Automated setup
./setup_local.sh

# Docker setup
docker-compose up

# Using Make
make setup
```

## 📦 Common Commands

### Local Development

| Task | Command |
|------|---------|
| Setup everything | `./setup_local.sh` |
| Start backend | `./scripts/start_backend.sh` or `make start-backend` |
| Start frontend | `./scripts/start_frontend.sh` or `make start-frontend` |
| Test API | `./scripts/test_api.sh` or `make test-api` |
| Install backend deps | `cd backend && pip install -r requirements.txt` |
| Install frontend deps | `cd frontend && yarn install` |

### Docker

| Task | Command |
|------|---------|
| Start all services | `docker-compose up` |
| Start in background | `docker-compose up -d` |
| Stop services | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Restart | `docker-compose restart` |
| Rebuild | `docker-compose up --build` |

### Supervisor (Current Environment)

| Task | Command |
|------|---------|
| Check status | `supervisorctl status` |
| Restart all | `sudo supervisorctl restart all` |
| Restart backend | `sudo supervisorctl restart backend` |
| Restart frontend | `sudo supervisorctl restart frontend` |
| View backend logs | `tail -f /var/log/supervisor/backend.*.log` |
| View frontend logs | `tail -f /var/log/supervisor/frontend.*.log` |

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8001/api |
| MongoDB | mongodb://localhost:27017 |
| Current Live URL | https://nourish-form-debug.preview.emergentagent.com |

## 🧪 API Testing

### Root Endpoint
```bash
curl http://localhost:8001/api/
```

### Create Status Check
```bash
curl -X POST http://localhost:8001/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "test_user"}'
```

### Get All Status Checks
```bash
curl http://localhost:8001/api/status
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `/app/backend/server.py` | Main backend application |
| `/app/frontend/src/App.js` | Main frontend component |
| `/app/backend/.env` | Backend environment variables |
| `/app/frontend/.env` | Frontend environment variables |
| `/app/backend/requirements.txt` | Python dependencies |
| `/app/frontend/package.json` | Node.js dependencies |
| `/app/docker-compose.yml` | Docker configuration |

## 🔧 Quick Fixes

### Service Won't Start
```bash
sudo supervisorctl restart all
```

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 8001 (backend)
lsof -ti:8001 | xargs kill -9
```

### Dependencies Not Working
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend
cd frontend && rm -rf node_modules && yarn install
```

### Database Issues
```bash
# Check MongoDB status
supervisorctl status mongodb

# Restart MongoDB
sudo supervisorctl restart mongodb

# Using Docker
docker start mongodb
```

### Clear Everything and Start Fresh
```bash
# With Docker
docker-compose down -v
docker-compose up --build

# Without Docker (supervisor)
sudo supervisorctl restart all
```

## 📝 Environment Variables

### Backend (.env)
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="http://localhost:3000"
```

### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
```

## 🔍 Debugging

### Check Backend Logs
```bash
tail -f /var/log/supervisor/backend.*.log
```

### Check Frontend Logs
```bash
tail -f /var/log/supervisor/frontend.*.log
```

### Check if Services are Running
```bash
supervisorctl status
```

### Test Database Connection
```bash
mongosh
use nourish_db
show collections
db.status_checks.find()
```

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation |
| `LOCAL_SETUP.md` | Detailed local setup guide |
| `DOCKER_SETUP.md` | Docker setup and usage guide |
| `CONTRIBUTING.md` | Contribution guidelines |
| `QUICK_REFERENCE.md` | This file - quick commands |

## 🎯 Development Workflow

1. **Make changes** to code
2. **Services auto-reload** (hot reload enabled)
3. **Check logs** if something breaks
4. **Test** your changes
5. **Commit** when ready

## 💡 Tips

- **Hot reload is enabled** - most changes don't require restart
- **Only restart** when installing new dependencies or changing .env
- **Use Makefile** for common tasks (`make help`)
- **Check logs first** when debugging issues
- **Test API endpoints** with curl or Postman
- **Use Docker** for consistent environment

## 🆘 Need Help?

1. Check logs: `tail -f /var/log/supervisor/*.log`
2. Restart services: `sudo supervisorctl restart all`
3. Read documentation: `README.md`, `LOCAL_SETUP.md`
4. Check issues or create new one

---

**Remember:** Most issues can be solved by checking logs and restarting services!
