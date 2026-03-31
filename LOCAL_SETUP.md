# Local Development Setup Guide

## 🏠 Running Nourish Locally

This guide will help you set up and run the Nourish application on your local machine.

## Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd nourish
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment (Optional but Recommended)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2.2 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.3 Configure Backend Environment
Create a `.env` file in the `backend/` directory:
```bash
cd backend
cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="http://localhost:3000"
EOF
```

#### 2.4 Start MongoDB Locally
**Option A: Using Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Using Homebrew (macOS)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option C: Using apt (Ubuntu/Debian)**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### 2.5 Run the Backend Server
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

The backend will be available at: `http://localhost:8001`

### Step 3: Frontend Setup

#### 3.1 Install Node Dependencies
```bash
cd frontend
yarn install
```

#### 3.2 Configure Frontend Environment
Create a `.env` file in the `frontend/` directory:
```bash
cd frontend
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
EOF
```

#### 3.3 Start the Frontend Development Server
```bash
cd frontend
yarn start
```

The frontend will be available at: `http://localhost:3000`

## 🧪 Verify the Setup

### Test Backend API
Open a new terminal and run:
```bash
# Test root endpoint
curl http://localhost:8001/api/

# Expected response: {"message":"Hello World"}
```

### Test Frontend
1. Open your browser and navigate to `http://localhost:3000`
2. Open the browser console (F12)
3. You should see "Hello World" logged in the console

### Test Database Connection
```bash
# Create a test status check
curl -X POST http://localhost:8001/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "test_user"}'

# Retrieve all status checks
curl http://localhost:8001/api/status
```

## 🔄 Development Workflow

### Making Changes

#### Backend Changes
1. Edit files in `backend/`
2. The server will automatically reload (hot reload enabled)
3. Test your changes via API calls

#### Frontend Changes
1. Edit files in `frontend/src/`
2. The browser will automatically refresh
3. Check changes in the browser

### Adding Dependencies

#### Backend (Python)
```bash
cd backend
pip install <package-name>
pip freeze > requirements.txt
```

#### Frontend (JavaScript)
```bash
cd frontend
yarn add <package-name>
```

## 📊 Database Management

### Connect to MongoDB
```bash
mongosh
```

### View Collections
```javascript
use nourish_db
show collections
db.status_checks.find()
```

### Clear Data
```javascript
use nourish_db
db.status_checks.deleteMany({})
```

## 🐛 Common Issues & Solutions

### Issue: Port Already in Use

**Backend (Port 8001)**
```bash
# Find process using port 8001
lsof -ti:8001 | xargs kill -9

# Or use a different port
uvicorn server:app --reload --port 8002
```

**Frontend (Port 3000)**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or set PORT in .env
echo "PORT=3001" >> frontend/.env
```

### Issue: MongoDB Connection Failed

**Check if MongoDB is running:**
```bash
# macOS/Linux
ps aux | grep mongo

# Check MongoDB status (if installed as service)
sudo systemctl status mongodb
```

**Start MongoDB:**
```bash
# Docker
docker start mongodb

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Issue: Module Not Found

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules
yarn install
```

### Issue: CORS Errors

Make sure your frontend `.env` file has the correct backend URL and your backend `.env` has the correct CORS origins:

**backend/.env:**
```
CORS_ORIGINS="http://localhost:3000"
```

**frontend/.env:**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🚀 Production Considerations

When running in production:

1. **Use environment-specific .env files**
2. **Enable authentication/authorization**
3. **Set specific CORS origins** (not "*")
4. **Use HTTPS**
5. **Set up proper database credentials**
6. **Enable logging and monitoring**

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URL | MongoDB connection string | mongodb://localhost:27017 |
| DB_NAME | Database name | nourish_db |
| CORS_ORIGINS | Allowed CORS origins | http://localhost:3000 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_BACKEND_URL | Backend API URL | http://localhost:8001 |
| WDS_SOCKET_PORT | Webpack dev server socket port | 3000 |
| ENABLE_HEALTH_CHECK | Enable health check plugin | false |

## 🎯 Next Steps

1. ✅ Set up the local environment
2. ✅ Test the basic functionality
3. 📝 Add your custom features
4. 🧪 Write tests
5. 🚀 Deploy to production

For any issues or questions, refer to the main README.md or create an issue in the repository.
