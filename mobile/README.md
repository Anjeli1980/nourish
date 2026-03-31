# 📱 Nourish Mobile App (React Native + Expo)

A React Native mobile application that connects to the Nourish FastAPI backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- Expo Go app on your phone
- Backend running on your laptop

### Setup (First Time)

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your laptop IP:**
Edit `config.js` and update `LAPTOP_IP`:
```javascript
export const LAPTOP_IP = 'YOUR_LAPTOP_IP_HERE';  // e.g., '192.168.1.100'
```

3. **Find your IP:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig | grep "inet "
```

### Run the App

1. **Start backend first** (in another terminal):
```bash
cd ../backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

2. **Start mobile app:**
```bash
npx expo start
```

3. **Scan QR code** with Expo Go app on your phone

## 📱 Testing on Your Phone

1. Install "Expo Go" from App Store (iPhone) or Play Store (Android)
2. Make sure phone and laptop are on the **same WiFi**
3. Open Expo Go → Scan QR code from terminal
4. App loads on your phone!

## 🔧 Configuration

### Backend URL
- Edit `config.js` to change backend URL
- Default: `http://YOUR_LAPTOP_IP:8001/api`

### Important Files
- `App.js` - Main application code
- `config.js` - Backend URL configuration
- `app.json` - Expo configuration

## 🐛 Troubleshooting

### "Cannot connect to backend"
1. Check backend is running: `curl http://localhost:8001/api/`
2. Update IP in `config.js`
3. Ensure phone and laptop on same WiFi

### "QR code not showing"
```bash
npx expo start -c  # Clear cache
```

### "Unable to resolve..."
1. Stop expo (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Or restart: `npx expo start --tunnel`

## 📚 Documentation

See the main project README for complete setup instructions:
- [MOBILE_APP_SETUP.md](../MOBILE_APP_SETUP.md) - Complete setup guide
- [MOBILE_QUICK_START.txt](../MOBILE_QUICK_START.txt) - Quick commands

## 🎯 Features

- ✅ Connect to FastAPI backend
- ✅ Create status checks
- ✅ View status check list
- ✅ Real-time updates
- ✅ Beautiful UI with React Native Paper

## 🔄 Development

Changes are reflected instantly! Just:
1. Edit `App.js`
2. Save file
3. App reloads automatically on phone

Or manually reload:
- Shake phone → Tap "Reload"

## 📦 Scripts

```bash
# Start development server
npm start

# Start with cache clear
npx expo start -c

# Start in tunnel mode (if local network has issues)
npx expo start --tunnel
```

## 🌐 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Go App](https://expo.dev/client)

## 💡 Tips

- Keep backend running while developing mobile app
- Use `console.log()` - output appears in terminal
- Shake phone to access developer menu
- Hot reload is enabled by default

---

**Happy coding!** 🚀
