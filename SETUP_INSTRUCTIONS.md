# 🌱 Nourish Diet Planner - Complete Setup Guide

## ✅ What's Been Fixed

1. ✅ **Professional UI Implemented** - Beautiful animations, gradients, and modern design
2. ✅ **404 Error Fixed** - Proper error handling when profile doesn't exist
3. ✅ **AI Integration** - Backend ready with meal suggestions (requires LLM key balance)
4. ✅ **All Dependencies Updated** - package.json includes all required packages

---

## 📱 STEP-BY-STEP SETUP (Windows PowerShell)

### Step 1: Sync Code from GitHub

In your PowerShell terminal on your laptop:

```powershell
# Navigate to your project folder
cd C:\path\to\nourish

# Pull latest changes from GitHub
git pull origin main
```

> **Note:** Make sure to click **"Save to GitHub"** in the Emergent chat interface FIRST before running git pull!

---

### Step 2: Install Mobile App Dependencies

```powershell
# Navigate to mobile folder
cd mobile

# Install all dependencies
npm install

# Or if that doesn't work:
yarn install
```

**Expected packages to install:**
- `@react-navigation/native` & `@react-navigation/bottom-tabs` (Navigation)
- `expo-linear-gradient` (Gradients for beautiful UI)
- `react-native-animatable` (Smooth animations)
- `react-native-safe-area-context` & `react-native-screens` (Required for navigation)

---

### Step 3: Update Backend Dependencies

```powershell
# Navigate back to project root
cd ..

# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

**Key package:** `emergentintegrations` (for AI features)

---

### Step 4: Configure Your Laptop IP Address

```powershell
# Find your laptop's IP address
ipconfig
```

Look for `IPv4 Address` under your active network adapter (usually starts with `192.168.x.x` or `10.0.x.x`)

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

Now edit the config file:

```powershell
# Open config.js in notepad
cd mobile
notepad config.js
```

**Update this line:**
```javascript
export const LAPTOP_IP = '192.168.1.100';  // ← Change to YOUR IP!
```

Save and close.

---

### Step 5: Start MongoDB

```powershell
# Start MongoDB using Docker
docker start mongodb

# Or if MongoDB container doesn't exist:
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

---

### Step 6: Start Backend Server

```powershell
# Navigate to backend folder
cd backend

# Start FastAPI server
python server.py

# Or if using uvicorn:
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

> **Keep this terminal window open!** The backend needs to stay running.

---

### Step 7: Start Mobile App

**Open a NEW PowerShell terminal:**

```powershell
# Navigate to mobile folder
cd C:\path\to\nourish\mobile

# Start Expo
npm start

# Or:
npx expo start
```

**Expected output:**
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

### Step 8: Open App in Expo Go

1. **Download Expo Go** from Play Store (Android) or App Store (iOS)
2. **Make sure your phone and laptop are on the SAME Wi-Fi network**
3. **Scan the QR code** shown in the terminal
4. **Wait for the app to load** (first load takes 30-60 seconds)

---

## 🎯 How to Use the App

### First Time Setup:
1. **Tap the Profile tab** (bottom right)
2. **Fill in your details:**
   - Name
   - Age
   - Gender (male/female/other)
   - Height (cm)
   - Weight (kg)
   - Activity Level (sedentary/light/moderate/active/very_active)
   - Goal (lose_weight/maintain/gain_weight)
3. **Tap "Create Profile"**
4. **Go back to Dashboard** - Now you'll see your stats!

### Daily Usage:
- **Dashboard Tab:** View calories, macros, water intake, BMI, BMR, TDEE
- **Meals Tab:** Log your meals (breakfast/lunch/dinner/snack)
- **Water Tab:** Track water intake throughout the day
- **Profile Tab:** Update your profile or view progress

---

## 🤖 AI Features

### Meal Suggestions:
1. Go to **Meals Tab**
2. Select meal type (breakfast/lunch/dinner/snack)
3. Tap **"🤖 Get AI Suggestions"**
4. Get 3 personalized meal recommendations with macros!

### AI Nutritionist (Coming Soon):
- The AI advice endpoint requires LLM key balance to be topped up
- To add balance: Go to **Profile → Universal Key → Add Balance**

---

## 🐛 Troubleshooting

### "Network request failed" or "404 Error"

**Solution:**
1. Make sure backend is running: `http://YOUR_IP:8001/api`
2. Test backend: Open browser and go to `http://YOUR_IP:8001/docs`
3. Check if `mobile/config.js` has the correct IP address
4. Ensure phone and laptop are on the same Wi-Fi network

### "Unable to connect to Expo Go"

**Solution:**
1. Make sure your phone and laptop are on the SAME Wi-Fi
2. Disable VPN if you have one running
3. Try restarting Expo: Press `Ctrl+C` in terminal, then `npm start` again

### App shows "Create Your Profile First!"

**Solution:**
1. This is normal for first-time users!
2. Go to **Profile tab** and create your profile
3. Dashboard will load automatically after profile creation

### AI Suggestions show "Budget exceeded"

**Solution:**
1. Your Emergent LLM key needs more balance
2. Go to Emergent → Profile → Universal Key → Add Balance
3. Or enable Auto Top-Up to prevent this in future

### MongoDB connection error

**Solution:**
```powershell
# Check if MongoDB is running
docker ps | findstr mongodb

# If not running, start it:
docker start mongodb

# Or create new container:
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

---

## 📂 Project Structure

```
nourish/
├── backend/
│   ├── server.py          # FastAPI backend with AI features
│   ├── requirements.txt   # Python dependencies
│   └── .env               # MongoDB & CORS config
├── mobile/
│   ├── App.js             # Professional UI with animations ✨
│   ├── config.js          # Backend URL configuration
│   └── package.json       # Dependencies
└── README.md
```

---

## 🎨 What's New in Professional UI

✅ **Animated Gradients** - Beautiful color transitions
✅ **Smooth Animations** - Fade-in, slide, bounce effects
✅ **Welcome Screen** - First-time user onboarding
✅ **Better Error Handling** - No more crashes on 404
✅ **Loading Skeletons** - Professional loading states
✅ **Modern Card Design** - Glassmorphism effects
✅ **Progress Animations** - Animated progress bars
✅ **Better Empty States** - Clear messaging when no data

---

## 📊 App Features

### Profile Management:
- Calculate BMR (Basal Metabolic Rate)
- Calculate TDEE (Total Daily Energy Expenditure)
- Calculate BMI (Body Mass Index)
- Track weight goals

### Meal Tracking:
- Log meals with calories and macros
- Categorize by meal type
- View daily totals
- Delete individual meals

### Water Tracking:
- Log water intake
- Track daily progress toward 2L goal
- Visual progress bars

### Dashboard:
- Real-time calorie tracking
- Macro breakdown (Protein, Carbs, Fats)
- Water intake summary
- Health statistics (BMR, TDEE, BMI)

---

## 🔐 Backend Configuration

**MongoDB** is configured in `backend/.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-969B7Bf9bAa9f7d52A
```

**All database collections:**
- `profiles` - User profile data
- `meals` - Meal logs
- `water` - Water intake logs

---

## 💡 Tips

1. **First run takes longer** - Expo needs to bundle the app
2. **Use "Shake to reload"** - If app freezes, shake phone to open dev menu
3. **Check backend logs** - If something fails, check the backend terminal for errors
4. **Update IP after network change** - If you change Wi-Fi networks, update `config.js`

---

## ✅ Verification Checklist

- [ ] Git pull completed successfully
- [ ] Mobile dependencies installed (`npm install` in `/mobile`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt` in `/backend`)
- [ ] IP address updated in `mobile/config.js`
- [ ] MongoDB running (`docker ps | findstr mongodb`)
- [ ] Backend server running (visit `http://YOUR_IP:8001/docs`)
- [ ] Expo server started (`npm start` in `/mobile`)
- [ ] Phone and laptop on same Wi-Fi
- [ ] App loaded in Expo Go on phone
- [ ] Profile created successfully
- [ ] Dashboard showing stats
- [ ] Meals tab working
- [ ] Water tab working
- [ ] AI suggestions working (if LLM key has balance)

---

## 🚀 Next Steps

Once everything is working:
1. ✅ Create your profile
2. ✅ Log some meals
3. ✅ Track water intake
4. ✅ Try AI meal suggestions
5. ✅ Check dashboard for stats

---

## 📞 Need Help?

If you encounter any issues:
1. Check the **Troubleshooting section** above
2. Make sure all services are running (MongoDB, Backend, Expo)
3. Verify your IP address in `config.js`
4. Check backend terminal for error messages

---

**🎉 Enjoy your new professional diet planner app!**
