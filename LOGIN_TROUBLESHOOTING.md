# Login Troubleshooting Guide

## Issue: Login Not Working

### ✅ What We've Fixed:

1. **Password Hashing Issue** - Fixed seed file to use `User.create()` instead of `insertMany()` to properly trigger password hashing
2. **Fixed Sidebar & Navbar** - Made them fixed position
3. **Color Scheme** - Updated to orange theme (#E76F2E)

### 🔍 Current Status:

- ✅ Backend API is working (tested successfully)
- ✅ Seed data is created correctly
- ✅ Frontend server is running on http://localhost:3000
- ✅ Backend server is running on http://localhost:5000

### 🧪 Test Credentials:

```
Admin:
Email: admin@healthcare.com
Password: password123

Patient:
Email: john.smith@email.com
Password: password123

Doctor:
Email: sarah.johnson@healthcare.com
Password: password123
```

### 🔧 Debugging Steps:

1. **Open Browser Console (F12)**
   - Go to http://localhost:3000
   - Open Developer Tools (F12)
   - Go to Console tab

2. **Try Login**
   - Enter email and password
   - Click "Sign In"
   - Check console for messages:
     - "Attempting login with: [email]"
     - "Login response: {...}"
     - "Navigating to: /[role]"

3. **Check Network Tab**
   - Go to Network tab in Developer Tools
   - Try login again
   - Look for POST request to `/api/auth/login`
   - Check if it returns 200 OK or an error

### 🐛 Common Issues:

#### Issue 1: "Too many login attempts"

**Solution:** Wait 15 minutes for rate limiter to reset, or restart backend server

#### Issue 2: "Invalid credentials"

**Solution:** Run seed file again:

```bash
cd backend
npm run seed
```

#### Issue 3: Network Error / CORS

**Solution:** Make sure both servers are running:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Issue 4: Page doesn't redirect after login

**Solution:** Check browser console for errors. The login might be successful but navigation failing.

### 📝 What to Check:

1. **Browser Console Errors**
   - Any red error messages?
   - What does the console log show?

2. **Network Request**
   - Does the login request reach the server?
   - What status code is returned?
   - What's in the response body?

3. **LocalStorage**
   - After login attempt, check Application > LocalStorage
   - Is there a 'token' and 'user' stored?

### 🚀 Quick Fix:

If nothing works, try this complete reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear browser cache and localStorage
# In browser: F12 > Application > Clear storage > Clear site data

# 3. Restart backend
cd backend
npm run seed
npm run dev

# 4. Restart frontend (in new terminal)
cd frontend
npm run dev

# 5. Try login again at http://localhost:3000
```

### 📞 Need More Help?

Please provide:

1. Screenshot of browser console (F12 > Console)
2. Screenshot of Network tab showing the login request
3. Any error messages you see
4. Which user role you're trying to login as
