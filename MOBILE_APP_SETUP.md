# 📱 React Native Expo Mobile App - Complete Setup Guide

## 🎯 What You'll Get

After following this guide, you'll have:
- ✅ Mobile app running on your phone via Expo Go
- ✅ Backend API running on your laptop
- ✅ Phone and laptop talking to each other
- ✅ Scan QR code to test on your phone

---

## 📋 STEP 1: Install Required Software (One-Time Setup)

### 1.1 Install Node.js (if not installed)

**Windows/Mac:**
1. Go to: https://nodejs.org/
2. Download LTS version (20.x)
3. Install it

**Verify:**
```bash
node --version
# Should show v20.x.x
```

### 1.2 Install Python (for Backend)

**Windows:**
- Download from: https://www.python.org/downloads/
- ⚠️ CHECK "Add Python to PATH"

**Mac:**
```bash
brew install python@3.11
```

**Verify:**
```bash
python3 --version
# Should show Python 3.11.x or higher
```

### 1.3 Install Expo CLI Globally

```bash
npm install -g expo-cli
```

**Verify:**
```bash
expo --version
```

### 1.4 Install VS Code (Code Editor)

Download from: https://code.visualstudio.com/

### 1.5 Install Expo Go App on Your Phone

**iPhone:**
- Open App Store
- Search "Expo Go"
- Install it

**Android:**
- Open Google Play Store
- Search "Expo Go"
- Install it

---

## 📦 STEP 2: Project Setup (One-Time)

### 2.1 Navigate to Your Project

```bash
# Open Terminal/Command Prompt
# Go to where you saved the nourish project

# For example, if it's on Desktop:
cd Desktop/nourish

# Or wherever you cloned it:
cd /path/to/nourish
```

### 2.2 Setup Backend

```bash
# Go to backend folder
cd backend

# Create .env file
# On Mac/Linux:
cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nourish_db"
CORS_ORIGINS="*"
EOF

# On Windows PowerShell:
# Use Notepad to create .env file with above content

# Install Python dependencies
pip install -r requirements.txt

# Go back to main folder
cd ..
```

### 2.3 Setup Mobile App

```bash
# Go to mobile folder
cd mobile

# Install dependencies
npm install

# Go back to main folder
cd ..
```

---

## 🚀 STEP 3: Find Your Laptop's IP Address

**This is VERY IMPORTANT!** Your phone needs to know your laptop's IP address.

### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.
Example: `192.168.1.100`

### On Mac:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Look for something like: `inet 192.168.1.100`

### On Linux:
```bash
hostname -I
```

**Write down this IP address!** You'll need it.

---

## ⚙️ STEP 4: Configure Mobile App with Your IP

### Open the mobile app code:

```bash
# Open VS Code in the project
code .

# Or open manually:
# VS Code → File → Open Folder → Select 'nourish' folder
```

### Edit the mobile/App.js file:

**Find this line (around line 7):**
```javascript
const BACKEND_URL = 'http://192.168.1.100:8001/api';
```

**Replace `192.168.1.100` with YOUR laptop's IP address:**
```javascript
const BACKEND_URL = 'http://YOUR_LAPTOP_IP:8001/api';
```

**For example, if your IP is 192.168.0.50:**
```javascript
const BACKEND_URL = 'http://192.168.0.50:8001/api';
```

**Save the file!** (Ctrl+S or Cmd+S)

---

## 🎮 STEP 5: Start Everything

You need to start 2 things:
1. Backend (on your laptop)
2. Mobile app (scans with your phone)

### Terminal 1: Start Backend

```bash
# Open Terminal/Command Prompt
cd nourish/backend

# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest
# Or if already created:
docker start mongodb

# Start backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**What you should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

✅ Backend is running! **Keep this terminal OPEN!**

### Terminal 2: Start Mobile App

**Open a NEW terminal window:**

```bash
cd nourish/mobile

# Start Expo
npx expo start
```

**What you should see:**
```
Metro waiting on exp://192.168.1.100:8081

› Press s │ switch to Expo Go
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to stop.
```

✅ **You should see a QR CODE in your terminal!**

---

## 📱 STEP 6: Scan QR Code on Your Phone

### iPhone:
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point camera at the QR code in your terminal
4. App will load!

### Android:
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Scan the QR code in your terminal
4. App will load!

**Alternative (if QR scan doesn't work):**
1. Make sure phone and laptop are on SAME WiFi
2. In Expo Go app, look for your project in the "Recent" section
3. Tap it to open

---

## ✅ STEP 7: Test If Everything Works

### On Your Phone:

You should see:
- ✅ "Nourish App" title at the top
- ✅ Backend Status showing "Hello World" (green dot)
- ✅ A form to enter client name
- ✅ List of status checks below

### Test Creating Data:

1. Type a name in the "Enter client name" field
2. Tap "Create Status Check" button
3. You should see:
   - "Success" message
   - New entry appears in the list below

**If this works = EVERYTHING IS WORKING!** 🎉

---

## 🛑 How to Stop Everything

### Stop Mobile App:
- In Terminal 2: Press `Ctrl + C`

### Stop Backend:
- In Terminal 1: Press `Ctrl + C`

### Stop MongoDB:
```bash
docker stop mongodb
```

---

## 🔄 Daily Workflow (After Initial Setup)

**Every time you want to work:**

### Step 1: Find Your IP Again (if it changed)
```bash
# Windows
ipconfig

# Mac
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Update App.js (if IP changed)
Edit `mobile/App.js` and update BACKEND_URL with new IP

### Step 3: Start Backend
```bash
cd nourish/backend
docker start mongodb
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Step 4: Start Mobile App (New Terminal)
```bash
cd nourish/mobile
npx expo start
```

### Step 5: Scan QR Code with Expo Go on Phone

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to backend"

**Check:**
1. ✅ Backend is running (check Terminal 1)
2. ✅ You updated BACKEND_URL with correct IP in App.js
3. ✅ Phone and laptop are on SAME WiFi network
4. ✅ No VPN is active on laptop or phone

**Test backend manually:**
```bash
# On your laptop:
curl http://localhost:8001/api/

# Should return: {"message":"Hello World"}
```

**Test from your phone's browser:**
- Open Safari/Chrome on your phone
- Go to: `http://YOUR_LAPTOP_IP:8001/api/`
- Should show: {"message":"Hello World"}

### Problem: "QR code not appearing"

**Solution:**
```bash
# Stop expo (Ctrl+C)
# Clear cache and restart:
npx expo start -c
```

### Problem: "Expo Go says 'Unable to resolve'"

**Solution:**
1. Make sure phone and laptop are on same WiFi
2. Try restarting Expo:
   ```bash
   # Stop: Ctrl+C
   # Start again:
   npx expo start
   ```

### Problem: "Port 8001 already in use"

**Solution:**
```bash
# Kill the process:
lsof -ti:8001 | xargs kill -9   # Mac/Linux
taskkill /F /IM python.exe       # Windows

# Then start backend again
```

### Problem: "MongoDB connection error"

**Solution:**
```bash
# Make sure MongoDB is running:
docker ps

# If not running:
docker start mongodb

# If doesn't exist:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Problem: App shows old code after making changes

**Solution:**
```bash
# In the Expo terminal, press 'r' to reload
# Or in Expo Go app, shake your phone → tap "Reload"
```

---

## 📱 Your Phone Should Show:

```
┌─────────────────────────────┐
│      🌱 Nourish App         │
│   React Native + FastAPI    │
├─────────────────────────────┤
│                             │
│  Backend Status             │
│  🟢 Hello World             │
│  [🔄 Refresh Connection]    │
│                             │
│  Create Status Check        │
│  [Enter client name...  ]   │
│  [✓ Create Status Check]    │
│                             │
│  Status Checks (2)          │
│  👤 John Doe                │
│      2025-03-31 10:30 AM    │
│  👤 Jane Smith              │
│      2025-03-31 10:25 AM    │
│                             │
│  📱 Connection Info         │
│  Backend URL: http://...    │
│                             │
└─────────────────────────────┘
```

---

## 🎯 Project Structure

```
nourish/
├── backend/                    # FastAPI backend
│   ├── server.py              # API server
│   ├── requirements.txt       # Python packages
│   └── .env                   # Backend config
│
├── mobile/                     # React Native app ← NEW!
│   ├── App.js                 # Main app code
│   ├── app.json               # Expo config
│   └── package.json           # Dependencies
│
└── frontend/                   # Old web app (can ignore)
```

---

## 💡 Tips

1. **WiFi Network:** Phone and laptop MUST be on same WiFi
2. **IP Address:** Update App.js if your laptop IP changes
3. **Hot Reload:** Code changes appear instantly - shake phone → reload
4. **Logs:** Check Terminal 1 for backend logs
5. **Expo Go:** Keep app updated in App Store/Play Store

---

## 🎓 What's Next?

Now you can:
- ✅ Modify `mobile/App.js` to add features
- ✅ Changes appear instantly on your phone
- ✅ Build your health/nutrition tracking features
- ✅ Add forms for height, weight, age, etc.

---

## 📞 Need Help?

**Check these in order:**
1. Both terminals are running without errors
2. IP address is correct in App.js
3. Phone and laptop on same WiFi
4. Backend responds at: http://YOUR_IP:8001/api/
5. Expo Go app is updated

**Still stuck?** Check the error message - it usually tells you what's wrong!

---

## 🎉 You Did It!

If you can see the app on your phone and create status checks, **EVERYTHING IS WORKING!** 

Now you're ready to build your nutrition/health tracking features! 💪

**Happy Coding!** 🚀
