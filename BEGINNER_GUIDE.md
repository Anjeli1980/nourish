# 🎓 Complete Beginner's Guide to Running Nourish

This guide assumes you know NOTHING and will walk you through EVERYTHING step by step.

## 📋 What You'll Need to Install

### 1. Install Python (if not already installed)

**For Windows:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or higher
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Click "Install Now"

**For Mac:**
```bash
# Open Terminal (Press Cmd + Space, type "Terminal", press Enter)
# Install Homebrew first (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Python
brew install python@3.11
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.11 python3-pip
```

**Verify Python is installed:**
```bash
python3 --version
# Should show: Python 3.11.x or higher
```

---

### 2. Install Node.js (JavaScript runtime)

**For Windows/Mac:**
1. Go to https://nodejs.org/
2. Download the LTS version (20.x)
3. Run the installer
4. Click "Next" through all steps

**For Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Node.js is installed:**
```bash
node --version
# Should show: v20.x.x
```

---

### 3. Install Yarn (Package Manager)

**After Node.js is installed, run:**
```bash
npm install -g yarn
```

**Verify Yarn is installed:**
```bash
yarn --version
# Should show: 1.22.x
```

---

### 4. Install MongoDB Database

**Choose ONE option:**

#### Option A: Install Docker (EASIEST - RECOMMENDED)

**For Windows/Mac:**
1. Go to https://www.docker.com/products/docker-desktop
2. Download Docker Desktop
3. Install and start Docker Desktop
4. Wait for it to say "Docker Desktop is running"

**For Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo usermod -aG docker $USER
# Log out and log back in for this to take effect
```

**Verify Docker is installed:**
```bash
docker --version
# Should show: Docker version 24.x.x or higher
```

#### Option B: Install MongoDB Directly

**For Windows:**
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Run installer, choose "Complete" installation
4. Check "Install MongoDB as a Service"

**For Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## 🚀 Setting Up the Nourish Project

### Step 1: Get the Code

**If you already have the code in a folder, skip to Step 2.**

**If you need to download from GitHub:**

```bash
# Open Terminal (Mac/Linux) or Command Prompt (Windows)

# Go to where you want to save the project
# For example, your Desktop:
cd ~/Desktop  # Mac/Linux
# OR
cd C:\Users\YourName\Desktop  # Windows (replace YourName with your username)

# Clone the repository (replace with your actual repository URL)
git clone https://github.com/yourusername/nourish.git

# Go into the project folder
cd nourish
```

---

### Step 2: Start MongoDB

**Choose the option you installed:**

#### If you installed Docker:
```bash
# This will download and start MongoDB in a container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Verify it's running:**
```bash
docker ps
# You should see a container named "mongodb" in the list
```

#### If you installed MongoDB directly:

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- MongoDB should already be running as a service
- If not, open "Services" and start "MongoDB Server"

---

### Step 3: Setup Backend (The Server Part)

```bash
# Make sure you're in the nourish folder
# You can check with: pwd (Mac/Linux) or cd (Windows)

# Go to the backend folder
cd backend

# You should now be in: /path/to/nourish/backend
```

**Create the environment file:**

**Mac/Linux:**
```bash
cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="http://localhost:3000"
EOF
```

**Windows (PowerShell):**
```powershell
@"
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="http://localhost:3000"
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Or create it manually:**
1. In the `backend` folder, create a new file called `.env` (yes, just .env with a dot)
2. Open it with Notepad (Windows) or TextEdit (Mac)
3. Paste this:
   ```
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="nourish_db"
   CORS_ORIGINS="http://localhost:3000"
   ```
4. Save the file

**Install Python dependencies:**
```bash
# Still in the backend folder
pip install -r requirements.txt

# This will take a few minutes - don't panic!
# You'll see lots of text scrolling by - that's normal
```

**Wait for it to finish. You should see "Successfully installed..." at the end.**

---

### Step 4: Setup Frontend (The Website Part)

```bash
# Go back to the main project folder
cd ..

# Now go to the frontend folder
cd frontend

# You should now be in: /path/to/nourish/frontend
```

**Create the environment file:**

**Mac/Linux:**
```bash
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
EOF
```

**Windows (PowerShell):**
```powershell
@"
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Or create it manually:**
1. In the `frontend` folder, create a new file called `.env`
2. Open it with Notepad (Windows) or TextEdit (Mac)
3. Paste this:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   WDS_SOCKET_PORT=3000
   ENABLE_HEALTH_CHECK=false
   ```
4. Save the file

**Install JavaScript dependencies:**
```bash
# Still in the frontend folder
yarn install

# This will take 3-5 minutes
# You'll see a progress bar
# Wait until it says "Done"
```

---

## 🎮 Running the Application

You need to run TWO things: Backend and Frontend (in separate terminal windows)

### Terminal 1: Start the Backend

**Open a NEW terminal/command prompt window**

```bash
# Go to your project folder
cd ~/Desktop/nourish  # Mac/Linux (adjust path as needed)
# OR
cd C:\Users\YourName\Desktop\nourish  # Windows (adjust path as needed)

# Go to backend folder
cd backend

# Start the backend server
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**What you should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Leave this terminal window open! Don't close it!**

---

### Terminal 2: Start the Frontend

**Open ANOTHER new terminal/command prompt window**

```bash
# Go to your project folder
cd ~/Desktop/nourish  # Mac/Linux (adjust path as needed)
# OR
cd C:\Users\YourName\Desktop\nourish  # Windows (adjust path as needed)

# Go to frontend folder
cd frontend

# Start the frontend server
yarn start
```

**What you should see:**
```
Starting the development server...

Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

**Your browser should automatically open to http://localhost:3000**

If it doesn't, manually open your browser and go to: **http://localhost:3000**

**Leave this terminal window open too!**

---

## ✅ Verify Everything is Working

### Test 1: Check the Frontend
1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see your application!

### Test 2: Check the Backend API
1. Open a NEW terminal window
2. Run this command:
```bash
curl http://localhost:8001/api/
```

**You should see:**
```json
{"message":"Hello World"}
```

**If you don't have curl, open your browser and go to:**
**http://localhost:8001/api/**

You should see the same message.

### Test 3: Check the Database
```bash
# Create a test entry
curl -X POST http://localhost:8001/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "my_first_test"}'

# Get all entries
curl http://localhost:8001/api/status
```

**You should see your test entry in the response!**

---

## 🛑 How to Stop the Application

### To stop the backend:
1. Go to the terminal window running the backend
2. Press `Ctrl + C` (both Mac and Windows)

### To stop the frontend:
1. Go to the terminal window running the frontend
2. Press `Ctrl + C` (both Mac and Windows)

### To stop MongoDB (if using Docker):
```bash
docker stop mongodb
```

---

## 🔄 How to Start Again Later

**Every time you want to work on your project:**

1. **Start MongoDB:**
   ```bash
   # If using Docker:
   docker start mongodb
   
   # If using installed MongoDB, it's probably already running
   ```

2. **Terminal 1 - Start Backend:**
   ```bash
   cd /path/to/nourish/backend
   python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

3. **Terminal 2 - Start Frontend:**
   ```bash
   cd /path/to/nourish/frontend
   yarn start
   ```

4. **Open browser to: http://localhost:3000**

---

## 🆘 Common Problems and Solutions

### Problem: "Command not found: python3"
**Solution:**
- Try `python` instead of `python3`
- Or reinstall Python and make sure to check "Add to PATH"

### Problem: "Command not found: yarn"
**Solution:**
```bash
npm install -g yarn
```

### Problem: "Port 3000 is already in use"
**Solution:**
```bash
# Find what's using the port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill it
kill -9 <PID>  # Mac/Linux (replace <PID> with the number you see)
# Or just restart your computer
```

### Problem: "Cannot connect to MongoDB"
**Solution:**
```bash
# If using Docker, make sure it's running:
docker ps

# If you don't see mongodb, start it:
docker start mongodb

# Or restart it:
docker restart mongodb
```

### Problem: "Module not found"
**Solution:**
```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
cd frontend
rm -rf node_modules
yarn install
```

### Problem: Backend shows errors about .env
**Solution:**
- Make sure the `.env` file exists in the `backend` folder
- Check that there are no extra spaces or quotes
- Make sure the file is named exactly `.env` (not `.env.txt`)

---

## 📁 Your Project Structure

```
nourish/                          ← Main folder
├── backend/                      ← Backend code folder
│   ├── server.py                ← Main server file
│   ├── requirements.txt         ← Python packages list
│   └── .env                     ← Backend settings (YOU CREATE THIS)
│
├── frontend/                     ← Frontend code folder
│   ├── src/                     ← Your React code
│   │   └── App.js              ← Main page
│   ├── package.json            ← JavaScript packages list
│   └── .env                    ← Frontend settings (YOU CREATE THIS)
│
└── README.md                    ← Documentation
```

---

## 🎯 Quick Reference Card

**Start Everything:**
```bash
# Terminal 1: Backend
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2: Frontend
cd frontend
yarn start
```

**Important URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

**Stop Everything:**
- Press `Ctrl + C` in both terminal windows

---

## 💡 Tips for Beginners

1. **Always run backend AND frontend** - You need both!
2. **Don't close the terminal windows** - They need to stay open
3. **If something breaks** - Try stopping everything and starting again
4. **Save your work often** - Press `Ctrl + S` in your code editor
5. **Use a code editor** - Download VS Code (free) for easier coding

---

## 🎉 You're Ready!

If you got here and everything is working - **CONGRATULATIONS!** 🎊

You now have:
- ✅ A working backend server
- ✅ A working frontend website
- ✅ A working database
- ✅ Everything connected together

**Now you can start building your application!**

---

## 📞 Still Stuck?

If something doesn't work:
1. Read the error message carefully
2. Check the "Common Problems" section above
3. Make sure all terminals are still open
4. Try restarting everything
5. Google the error message
6. Ask for help with the EXACT error message you see

**Remember: Everyone was a beginner once. You got this! 💪**
