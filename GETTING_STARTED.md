# Getting Started Checklist

Use this checklist to get your Nourish application running locally.

## 🎯 Quick Start Checklist

### Initial Setup

- [ ] **Clone the repository**
  ```bash
  git clone <your-repository-url>
  cd nourish
  ```

- [ ] **Choose your setup method:**
  - [ ] Option A: Automated script (`./setup_local.sh`)
  - [ ] Option B: Docker (`docker-compose up`)
  - [ ] Option C: Manual setup (follow LOCAL_SETUP.md)

### Prerequisites Check

- [ ] Python 3.11+ installed
  ```bash
  python3 --version
  ```

- [ ] Node.js 20+ installed
  ```bash
  node --version
  ```

- [ ] Yarn installed
  ```bash
  yarn --version
  # If not: npm install -g yarn
  ```

- [ ] MongoDB installed OR Docker available
  ```bash
  mongod --version
  # OR
  docker --version
  ```

### Backend Setup

- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Create `.env` file
  ```bash
  cp .env.example .env
  # Edit .env with your settings
  ```

- [ ] Install Python dependencies
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Verify installation
  ```bash
  python -c "import fastapi; print('FastAPI installed')"
  ```

### Frontend Setup

- [ ] Navigate to frontend directory
  ```bash
  cd frontend
  ```

- [ ] Create `.env` file
  ```bash
  cp .env.example .env
  # Edit .env with your settings
  ```

- [ ] Install Node dependencies
  ```bash
  yarn install
  ```

- [ ] Verify installation
  ```bash
  yarn --version
  ```

### Database Setup

Choose one option:

**Option A: Docker (Recommended)**
- [ ] Start MongoDB container
  ```bash
  ./scripts/start_mongodb.sh
  # OR
  docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```

**Option B: Local Installation**
- [ ] Start MongoDB service
  ```bash
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongodb
  ```

- [ ] Verify MongoDB is running
  ```bash
  mongosh
  # Type 'exit' to quit
  ```

### Start Development Servers

**Option 1: Using Scripts**
- [ ] Start backend (Terminal 1)
  ```bash
  ./scripts/start_backend.sh
  ```

- [ ] Start frontend (Terminal 2)
  ```bash
  ./scripts/start_frontend.sh
  ```

**Option 2: Using Make**
- [ ] Start both servers
  ```bash
  make start
  ```

**Option 3: Using Docker**
- [ ] Start all services
  ```bash
  docker-compose up
  ```

### Verify Everything Works

- [ ] **Backend is running**
  - Open: http://localhost:8001/api/
  - Should see: `{"message":"Hello World"}`

- [ ] **Frontend is running**
  - Open: http://localhost:3000
  - Should see the app interface

- [ ] **Database is connected**
  ```bash
  ./scripts/test_api.sh
  ```
  Should complete without errors

- [ ] **Test API endpoints**
  ```bash
  # Create a status check
  curl -X POST http://localhost:8001/api/status \
    -H "Content-Type: application/json" \
    -d '{"client_name": "test"}'
  
  # Should return created object with ID
  ```

### Development Workflow

- [ ] **Make a test change**
  - Edit `frontend/src/App.js`
  - Change a text
  - Browser should auto-refresh

- [ ] **Verify hot reload works**
  - Changes appear without manual restart

- [ ] **Check logs**
  ```bash
  # Backend logs
  tail -f /var/log/supervisor/backend.*.log
  
  # Frontend logs
  tail -f /var/log/supervisor/frontend.*.log
  ```

## 🎓 Learning Resources

- [ ] Read [README.md](README.md) - Project overview
- [ ] Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Common commands
- [ ] Read [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [ ] Explore API endpoints in `backend/server.py`
- [ ] Explore React components in `frontend/src/`

## 🚀 Next Steps

### Beginner Tasks
- [ ] Modify the homepage text
- [ ] Add a new component
- [ ] Create a new API endpoint
- [ ] Test with Postman or curl

### Intermediate Tasks
- [ ] Add a new database collection
- [ ] Create a form with validation
- [ ] Implement error handling
- [ ] Add loading states

### Advanced Tasks
- [ ] Implement authentication
- [ ] Add file upload
- [ ] Create admin dashboard
- [ ] Deploy to production

## 🐛 Troubleshooting Checklist

If something doesn't work:

- [ ] Check if all services are running
  ```bash
  supervisorctl status
  # OR
  docker-compose ps
  ```

- [ ] Check logs for errors
  ```bash
  tail -f /var/log/supervisor/*.log
  ```

- [ ] Verify environment variables are set
  ```bash
  cat backend/.env
  cat frontend/.env
  ```

- [ ] Restart services
  ```bash
  sudo supervisorctl restart all
  # OR
  docker-compose restart
  ```

- [ ] Clear and reinstall dependencies
  ```bash
  # Backend
  cd backend && pip install -r requirements.txt
  
  # Frontend
  cd frontend && rm -rf node_modules && yarn install
  ```

- [ ] Check port availability
  ```bash
  lsof -i :3000  # Frontend
  lsof -i :8001  # Backend
  lsof -i :27017 # MongoDB
  ```

## ✅ Setup Complete!

When all checkboxes are complete:

🎉 **Congratulations!** Your Nourish development environment is ready!

### You should now have:
- ✅ Backend running on http://localhost:8001
- ✅ Frontend running on http://localhost:3000
- ✅ Database connected and working
- ✅ Hot reload enabled
- ✅ All tests passing

### Start building:
```bash
# View available commands
make help

# Test API
./scripts/test_api.sh

# Check documentation
cat README.md
```

---

**Need help?** Check the troubleshooting section or read the documentation files!
