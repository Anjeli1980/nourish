# 🚀 QUICK START - Copy & Paste Commands

## ⚡ Setup Commands (Run Once)

### 1. Pull Latest Code
```powershell
cd C:\path\to\nourish
git pull origin main
```

### 2. Install Mobile Dependencies
```powershell
cd mobile
npm install
```

### 3. Install Backend Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 4. Update IP Address
```powershell
cd mobile
notepad config.js
```
Change `LAPTOP_IP` to your IP address (get it with `ipconfig`)

---

## 🏃 Daily Run Commands

### Terminal 1 - Start MongoDB
```powershell
docker start mongodb
```

### Terminal 2 - Start Backend
```powershell
cd C:\path\to\nourish\backend
python server.py
```

### Terminal 3 - Start Mobile App
```powershell
cd C:\path\to\nourish\mobile
npm start
```

---

## 📱 Open App
1. Open **Expo Go** on your phone
2. Scan the QR code
3. Wait for app to load (30-60 seconds first time)

---

## 🎯 First Time Usage
1. Go to **Profile** tab (bottom right)
2. Fill in your details and tap **"Create Profile"**
3. Go to **Dashboard** tab to see your stats
4. Start logging meals and water!

---

## 🔍 Quick Tests

### Test Backend (in browser)
```
http://YOUR_IP:8001/docs
```

### Test MongoDB
```powershell
docker ps | findstr mongodb
```

### Get Your IP
```powershell
ipconfig
```
Look for `IPv4 Address` under Wi-Fi adapter

---

## 🐛 Common Issues

**"Network request failed"**
- Check backend is running
- Check IP in `config.js` is correct
- Phone and laptop on same Wi-Fi

**"Create Your Profile First"**
- This is normal! Go to Profile tab and create profile

**AI "Budget exceeded"**
- Add balance to Emergent LLM Key
- Emergent → Profile → Universal Key → Add Balance

---

## ✅ Verification
- [ ] Code pulled from GitHub
- [ ] Dependencies installed
- [ ] IP updated in config.js
- [ ] MongoDB running
- [ ] Backend running (http://YOUR_IP:8001/docs works)
- [ ] Expo running and QR code showing
- [ ] Phone connected to same Wi-Fi
- [ ] App loaded in Expo Go
- [ ] Profile created
- [ ] Dashboard showing data

---

**Need detailed help?** See `SETUP_INSTRUCTIONS.md`

**AI not working?** See `AI_FEATURES_STATUS.md`
