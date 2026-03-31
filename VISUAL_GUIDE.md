# 🎬 Visual Step-by-Step Guide

## 🖥️ What Your Screen Should Look Like

### Step 1: Opening Terminal

**Mac:**
```
Press: Cmd + Space
Type: Terminal
Press: Enter
```

**Windows:**
```
Press: Windows Key
Type: cmd
Press: Enter
```

**What you'll see:**
```
Your Computer Name ~ %
```
This is where you type commands!

---

### Step 2: Navigate to Project

**Type this command:**
```bash
cd Desktop/nourish
```

**Press Enter**

**What you'll see:**
```
Your Computer Name ~/Desktop/nourish %
```

✅ Notice "nourish" at the end? You're in the right place!

---

### Step 3: Start Backend - Terminal 1

**What to type:**
```bash
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**What you'll see (SUCCESS):**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ If you see this = Backend is RUNNING! ✅

❌ If you see ERROR, scroll down to "Common Errors" section

**⚠️ IMPORTANT: Leave this window OPEN! Don't close it!**

---

### Step 4: Start Frontend - Terminal 2

**Open a NEW terminal window** (repeat Step 1)

**What to type:**
```bash
cd Desktop/nourish
cd frontend
yarn start
```

**What you'll see (SUCCESS):**
```
Starting the development server...

Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.0.0.5:3000

Note that the development build is not optimized.
To create a production build, use yarn build.

webpack compiled successfully
```

✅ If you see "Compiled successfully!" = Frontend is RUNNING! ✅

**Your browser should automatically open to http://localhost:3000**

**⚠️ IMPORTANT: Leave this window OPEN too!**

---

### Step 5: Your Browser

**What you should see in your browser:**

```
┌─────────────────────────────────────────┐
│ ← → ⟳ http://localhost:3000            │
├─────────────────────────────────────────┤
│                                         │
│         [Your Application!]             │
│                                         │
│    🎉 If you see this page,            │
│       EVERYTHING IS WORKING! 🎉         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 What Your Desktop Should Look Like When Running

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│   Terminal 1       │  │   Terminal 2       │  │   Browser          │
│   (Backend)        │  │   (Frontend)       │  │                    │
├────────────────────┤  ├────────────────────┤  ├────────────────────┤
│ ~/nourish/backend  │  │ ~/nourish/frontend │  │ localhost:3000     │
│                    │  │                    │  │                    │
│ Uvicorn running    │  │ Compiled success!  │  │ [Your Website]     │
│ on port 8001       │  │ webpack compiled   │  │                    │
│ ✅ RUNNING         │  │ ✅ RUNNING         │  │ ✅ WORKING         │
│                    │  │                    │  │                    │
│ [Cursor blinking]  │  │ [Cursor blinking]  │  │                    │
└────────────────────┘  └────────────────────┘  └────────────────────┘

   DON'T CLOSE ↑          DON'T CLOSE ↑           This is your app!
```

---

## ❌ Common Errors and What They Look Like

### Error 1: "python3: command not found"

**What you see:**
```
bash: python3: command not found
```

**Fix:**
```bash
# Try this instead:
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001

# If that doesn't work, Python isn't installed
# Go to: https://www.python.org/downloads/
```

---

### Error 2: "Port 8001 is already in use"

**What you see:**
```
ERROR:    [Errno 48] Address already in use
```

**Fix:**
```bash
# Kill whatever is using port 8001:
lsof -ti:8001 | xargs kill -9

# Then try starting backend again
```

---

### Error 3: "yarn: command not found"

**What you see:**
```
bash: yarn: command not found
```

**Fix:**
```bash
npm install -g yarn

# Then try: yarn start
```

---

### Error 4: "Cannot connect to MongoDB"

**What you see in backend:**
```
pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 61] Connection refused
```

**Fix:**
```bash
# Start MongoDB with Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or if already created:
docker start mongodb

# Then restart backend (Ctrl+C, then start again)
```

---

### Error 5: Frontend doesn't open automatically

**What to do:**
1. Don't panic! 😊
2. Open your browser manually
3. Type in address bar: `localhost:3000`
4. Press Enter

---

## 🎯 Quick Success Checklist

**Before you start coding, make sure you see:**

✅ Terminal 1 shows: "Uvicorn running on http://0.0.0.0:8001"
✅ Terminal 2 shows: "Compiled successfully!"
✅ Browser shows: Your application at localhost:3000
✅ Both terminals are OPEN (not closed)

**If ALL of these are ✅ = You're ready to code!** 🎉

---

## 🔄 Starting Fresh (When Something is Stuck)

**Close everything and start over:**

1. **Close both terminal windows** (or press Ctrl+C in each)

2. **Restart Docker Desktop** (if you're using it)

3. **Open new terminal → Start MongoDB:**
   ```bash
   docker start mongodb
   ```

4. **Open Terminal 1 → Start Backend:**
   ```bash
   cd Desktop/nourish/backend
   python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

5. **Open Terminal 2 → Start Frontend:**
   ```bash
   cd Desktop/nourish/frontend
   yarn start
   ```

6. **Check browser:** http://localhost:3000

---

## 💡 Understanding What's Happening

**Terminal 1 (Backend):**
- This is your "server"
- It handles data and talks to the database
- Runs on port 8001

**Terminal 2 (Frontend):**
- This is your "website"
- What users see in their browser
- Runs on port 3000

**MongoDB:**
- This is your "database"
- Stores all your data
- Runs on port 27017

**They all work TOGETHER:**
```
Browser (You)
    ↕️
Frontend (Terminal 2, Port 3000)
    ↕️
Backend (Terminal 1, Port 8001)
    ↕️
MongoDB (Docker, Port 27017)
```

---

## 📝 Copy-Paste Commands Summary

**Start everything (in order):**

```bash
# 1. Start MongoDB
docker start mongodb

# 2. Terminal 1 - Backend
cd Desktop/nourish/backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001

# 3. Terminal 2 - Frontend (NEW window)
cd Desktop/nourish/frontend
yarn start

# 4. Open browser to: http://localhost:3000
```

**Stop everything:**
```bash
# In each terminal: Ctrl + C
# Stop MongoDB: docker stop mongodb
```

---

## 🎓 Remember

1. **You need TWO terminal windows open** - Don't close them!
2. **Changes save automatically** - Just edit your code and refresh browser
3. **Errors are normal** - Read them, they tell you what's wrong
4. **Google is your friend** - Copy the error and search it

---

## 🆘 Still Stuck?

**Check these:**
- [ ] Docker Desktop is running (if using MongoDB)
- [ ] Both terminal windows are open
- [ ] No errors showing in terminals
- [ ] You're in the right folder (check with `pwd` command)

**Take a screenshot of your error and search Google for it!**

---

🎉 **You're doing great! Keep going!** 🚀
