# 🔧 Troubleshooting Guide

Common issues and their solutions for the Healthcare Management System.

---

## 🚨 Backend Issues

### Issue 1: MongoDB Connection Failed

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongooseServerSelectionError: connect ECONNREFUSED
```

**Possible Causes:**

1. MongoDB is not running
2. Wrong connection string
3. MongoDB not installed

**Solutions:**

**Windows:**

```bash
# Check if MongoDB is running
net start | findstr MongoDB

# Start MongoDB
net start MongoDB

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

**Mac:**

```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# If not installed:
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**

```bash
# Check status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

**Using MongoDB Atlas:**

1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`
4. Whitelist IP: 0.0.0.0/0

---

### Issue 2: Port Already in Use

**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution 1: Kill the Process**

**Windows:**

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or kill all node processes
taskkill /F /IM node.exe
```

**Mac/Linux:**

```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or
sudo kill -9 $(sudo lsof -t -i:5000)
```

**Solution 2: Change Port**

Edit `backend/.env`:

```env
PORT=5001
```

---

### Issue 3: JWT Token Invalid

**Error Message:**

```
Error: Not authorized to access this route
JsonWebTokenError: invalid token
```

**Solutions:**

1. **Clear Browser Storage:**

```javascript
// Open browser console (F12)
localStorage.clear();
// Refresh page and login again
```

2. **Check JWT_SECRET:**

- Ensure `JWT_SECRET` in `.env` is set
- Must be at least 32 characters
- Same secret for all environments

3. **Token Expired:**

- Login again to get new token
- Check `JWT_EXPIRE` in `.env`

---

### Issue 4: Module Not Found

**Error Message:**

```
Error: Cannot find module 'express'
Error: Cannot find module 'mongoose'
```

**Solution:**

```bash
# Navigate to backend
cd backend

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, clear npm cache
npm cache clean --force
npm install
```

---

### Issue 5: Environment Variables Not Loading

**Error Message:**

```
undefined
process.env.MONGODB_URI is undefined
```

**Solutions:**

1. **Check .env file exists:**

```bash
# In backend directory
ls -la .env
# or
dir .env
```

2. **Create .env file:**

```bash
cp .env.example .env
```

3. **Verify .env content:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Restart server** after changing .env

---

### Issue 6: CORS Error

**Error Message:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Check backend is running** on port 5000

2. **Verify CORS configuration** in `backend/server.js`:

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
```

3. **Check Vite proxy** in `frontend/vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

---

### Issue 7: Validation Errors

**Error Message:**

```
ValidationError: User validation failed
```

**Solutions:**

1. **Check required fields** in request body
2. **Verify data types** match schema
3. **Check password length** (minimum 6 characters)
4. **Verify email format**

**Example correct request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

---

## 🎨 Frontend Issues

### Issue 8: Blank White Screen

**Possible Causes:**

1. JavaScript error
2. Build error
3. Missing dependencies

**Solutions:**

1. **Check browser console** (F12)
2. **Check terminal** for errors
3. **Reinstall dependencies:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

4. **Clear browser cache:**

- Ctrl + Shift + Delete
- Clear cache and reload

---

### Issue 9: API Calls Failing

**Error Message:**

```
Network Error
Request failed with status code 404
```

**Solutions:**

1. **Verify backend is running:**

```bash
# Test health endpoint
curl http://localhost:5000/health
```

2. **Check API base URL** in `frontend/src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: "/api",
});
```

3. **Check network tab** in browser DevTools
4. **Verify endpoint exists** in backend routes

---

### Issue 10: Login Not Working

**Symptoms:**

- Login button does nothing
- No error message
- Redirects to login again

**Solutions:**

1. **Check browser console** for errors

2. **Verify credentials:**

- Email format correct
- Password correct
- User exists in database

3. **Check token storage:**

```javascript
// Browser console
console.log(localStorage.getItem("token"));
console.log(localStorage.getItem("user"));
```

4. **Clear localStorage and try again:**

```javascript
localStorage.clear();
```

---

### Issue 11: Tailwind Styles Not Working

**Symptoms:**

- No styling
- Plain HTML appearance

**Solutions:**

1. **Check Tailwind is installed:**

```bash
npm list tailwindcss
```

2. **Verify tailwind.config.js:**

```javascript
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
```

3. **Check index.css imports:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Restart dev server:**

```bash
npm run dev
```

---

### Issue 12: Routes Not Working

**Error Message:**

```
Cannot GET /admin
404 Not Found
```

**Solutions:**

1. **Check React Router setup** in App.jsx

2. **Verify route paths** match navigation

3. **Check protected routes:**

- User is logged in
- User has correct role

4. **Clear browser cache** and reload

---

## 🗄️ Database Issues

### Issue 13: Database Not Creating

**Solution:**

MongoDB creates database automatically on first write.

**Verify:**

```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use database
use healthcare_db

# List collections
show collections
```

---

### Issue 14: Data Not Saving

**Possible Causes:**

1. Validation errors
2. Connection issues
3. Permission issues

**Solutions:**

1. **Check validation** in models
2. **Verify connection** is established
3. **Check MongoDB logs**
4. **Test with simple insert:**

```javascript
// In MongoDB shell
db.users.insertOne({
  name: "Test",
  email: "test@test.com",
});
```

---

### Issue 15: Cannot Find Collection

**Error Message:**

```
Collection not found
```

**Solution:**

Collections are created automatically. If missing:

1. **Restart application**
2. **Create test document**
3. **Check model names** match collection names

---

## 🔐 Authentication Issues

### Issue 16: Always Redirected to Login

**Solutions:**

1. **Check token exists:**

```javascript
localStorage.getItem("token");
```

2. **Verify token is valid:**

- Not expired
- Correct format
- Valid signature

3. **Check AuthContext:**

- User state is set
- Token is in headers

4. **Login again** to get fresh token

---

### Issue 17: Unauthorized After Login

**Error Message:**

```
401 Unauthorized
Not authorized to access this route
```

**Solutions:**

1. **Check Authorization header:**

```javascript
// Should be: Bearer <token>
```

2. **Verify token in request:**

- Open Network tab
- Check request headers
- Verify Authorization header exists

3. **Check middleware** in backend

---

## 📦 Installation Issues

### Issue 18: npm install Fails

**Error Message:**

```
npm ERR! code EACCES
npm ERR! permission denied
```

**Solutions:**

**Windows:**

```bash
# Run as administrator
# Or use:
npm install --force
```

**Mac/Linux:**

```bash
# Don't use sudo with npm
# Fix permissions:
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Then:
npm install
```

---

### Issue 19: Version Conflicts

**Error Message:**

```
npm ERR! peer dependency conflict
```

**Solutions:**

```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force

# Or update npm
npm install -g npm@latest
```

---

## 🚀 Deployment Issues

### Issue 20: Build Fails

**Error Message:**

```
Build failed
Module not found
```

**Solutions:**

1. **Check all imports** are correct
2. **Verify all dependencies** are in package.json
3. **Check file paths** are correct
4. **Try local build:**

```bash
npm run build
```

---

### Issue 21: Environment Variables in Production

**Problem:**
Environment variables not working in production

**Solutions:**

1. **Set variables in hosting platform:**

- Render: Environment tab
- Vercel: Settings → Environment Variables
- Netlify: Site settings → Environment

2. **Don't commit .env** to git

3. **Use platform-specific variables**

---

## 🔍 Debugging Tips

### General Debugging Steps

1. **Check Console Logs:**
   - Browser console (F12)
   - Terminal output
   - Server logs

2. **Use Debugger:**

```javascript
debugger; // Add this line
console.log("Debug:", variable);
```

3. **Check Network Tab:**
   - Request/Response
   - Status codes
   - Headers

4. **Verify Data:**
   - Check database
   - Verify API responses
   - Test with Postman

5. **Isolate Problem:**
   - Test one thing at a time
   - Comment out code
   - Use minimal example

---

## 📞 Getting Help

### Before Asking for Help:

1. ✅ Read error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Search error message online
4. ✅ Check documentation
5. ✅ Try solutions above

### When Asking for Help:

Include:

- Error message (full text)
- What you tried
- Your environment (OS, Node version)
- Relevant code
- Steps to reproduce

---

## 🛠️ Useful Commands

### Check Versions

```bash
node --version
npm --version
mongod --version
```

### Clear Everything

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database

```bash
# MongoDB shell
mongosh
use healthcare_db
db.dropDatabase()
```

### Check Ports

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :5000
lsof -i :3000
```

---

## ✅ Prevention Tips

1. **Always check .env file** exists and is configured
2. **Keep dependencies updated** regularly
3. **Use version control** (Git)
4. **Test locally** before deploying
5. **Read error messages** carefully
6. **Keep backups** of database
7. **Document changes** you make
8. **Use consistent** Node versions

---

## 🎯 Quick Fixes Checklist

When something breaks, try these in order:

- [ ] Restart backend server
- [ ] Restart frontend server
- [ ] Clear browser cache
- [ ] Clear localStorage
- [ ] Check .env file
- [ ] Verify MongoDB is running
- [ ] Check console for errors
- [ ] Verify all dependencies installed
- [ ] Check network tab
- [ ] Try different browser
- [ ] Restart computer (last resort!)

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [React Documentation](https://react.dev)
- [MongoDB Manual](https://docs.mongodb.com)
- [Stack Overflow](https://stackoverflow.com)

---

**Remember:** Most issues are simple configuration problems. Stay calm, read error messages, and work through solutions systematically! 🚀
