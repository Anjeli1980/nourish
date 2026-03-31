# Nourish - Full-Stack Application

A full-stack application built with React frontend, FastAPI backend, and MongoDB database.

## 🚀 Quick Start Options

Choose your preferred setup method:

### Option 1: Automated Setup Script (Recommended for Local)
```bash
./setup_local.sh
```

### Option 2: Docker (Easiest - One Command)
```bash
docker-compose up
```
See [DOCKER_SETUP.md](DOCKER_SETUP.md) for complete Docker guide.

### Option 3: Manual Local Setup
See [LOCAL_SETUP.md](LOCAL_SETUP.md) for step-by-step local installation guide.

## 📋 Prerequisites

**For Local Setup:**
- Python 3.11+
- Node.js 20+
- Yarn 1.22+
- MongoDB (or Docker)

**For Docker Setup:**
- Docker Desktop

### Project Structure
```
/app/
├── backend/         # FastAPI backend
│   ├── server.py    # Main application file
│   ├── requirements.txt
│   └── .env         # Backend environment variables
├── frontend/        # React frontend
│   ├── src/
│   ├── package.json
│   └── .env         # Frontend environment variables
├── tests/           # Test files
└── README.md        # This file
```

## 📦 Installation & Setup

### 1. Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd /app/frontend
yarn install
```

### 3. Environment Configuration

**Backend (.env):**
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://nourish-form-debug.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 🎮 Running the Application

The application uses Supervisor to manage all services. All services start automatically!

### Check Service Status
```bash
supervisorctl status
```

### Restart Services
```bash
# Restart all services
sudo supervisorctl restart all

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart mongodb
```

### Service URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **MongoDB:** mongodb://localhost:27017

## 🔍 Testing the API

### Test the root endpoint
```bash
curl http://localhost:8001/api/
```

### Create a status check
```bash
curl -X POST http://localhost:8001/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "test_client"}'
```

### Get all status checks
```bash
curl http://localhost:8001/api/status
```

## 📝 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Hello World message |
| POST | `/api/status` | Create a status check |
| GET | `/api/status` | Get all status checks |

## 🛠️ Development

### Backend Development
- Hot reload is enabled - changes are automatically detected
- Only restart when installing new dependencies or modifying .env

### Frontend Development
- Hot reload is enabled
- Changes are reflected automatically in the browser
- Only restart when installing new dependencies or modifying .env

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs
tail -f /var/log/supervisor/frontend.*.log

# MongoDB logs
tail -f /var/log/supervisor/mongodb.*.log
```

## 📚 Tech Stack

### Backend
- **Framework:** FastAPI 0.110.1
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT, Bcrypt
- **Validation:** Pydantic v2

### Frontend
- **Framework:** React 19
- **Router:** React Router DOM v7
- **HTTP Client:** Axios
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React

## 🔧 Troubleshooting

### Services not running?
```bash
sudo supervisorctl restart all
```

### Port conflicts?
Check if ports 3000, 8001, or 27017 are already in use:
```bash
lsof -i :3000
lsof -i :8001
lsof -i :27017
```

### Database connection issues?
Ensure MongoDB is running:
```bash
supervisorctl status mongodb
```

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a personal project. For any questions or issues, please contact the repository owner.
