# 🚀 Deployment Guide

## Overview

This guide covers deploying the Healthcare Management System to production using popular hosting platforms.

## Architecture

```
Frontend (Vercel/Netlify) → Backend (Render/Railway) → Database (MongoDB Atlas)
```

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Hosting platform accounts (Vercel, Render, etc.)

---

## 1. Database Deployment (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization

### Step 2: Create Cluster

1. Click "Build a Cluster"
2. Choose "Shared" (Free tier)
3. Select your preferred cloud provider and region
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `healthcare_db`

Example:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare_db?retryWrites=true&w=majority
```

---

## 2. Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure `package.json` has correct scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create `.gitignore` if not exists:

```
node_modules/
.env
uploads/
*.log
```

3. Push code to GitHub

### Step 2: Deploy on Render

1. Go to [Render](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: healthcare-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

Click "Advanced" → "Add Environment Variable":

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare_db
JWT_SECRET=your_super_secret_production_key_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://healthcare-backend.onrender.com`

### Step 5: Test Backend

Visit: `https://healthcare-backend.onrender.com/health`

Should return:

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 3. Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. Update API configuration in `frontend/src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

2. Create `.env.production` in frontend directory:

```
VITE_API_URL=https://healthcare-backend.onrender.com/api
```

3. Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

4. Push changes to GitHub

### Step 2: Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

In Vercel dashboard:

```
VITE_API_URL=https://healthcare-backend.onrender.com/api
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

---

## Alternative: Frontend on Netlify

### Step 1: Prepare Build

Same as Vercel preparation above.

### Step 2: Deploy on Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select repository
5. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Step 3: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://healthcare-backend.onrender.com/api
```

### Step 4: Deploy

Click "Deploy site" and wait for completion.

---

## Alternative: Backend on Railway

### Step 1: Deploy on Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Select backend directory

### Step 2: Add Environment Variables

In Railway dashboard → Variables:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### Step 3: Deploy

Railway will automatically deploy. Get your URL from the dashboard.

---

## 4. Post-Deployment Configuration

### Update CORS Settings

In `backend/server.js`, update CORS configuration:

```javascript
app.use(
  cors({
    origin: ["https://your-app.vercel.app", "http://localhost:3000"],
    credentials: true,
  }),
);
```

### Create Admin User

Connect to MongoDB Atlas using MongoDB Compass or shell:

```javascript
use healthcare_db

// Hash password first using bcrypt
// Then insert admin user
db.users.insertOne({
  name: "Admin",
  email: "admin@healthcare.com",
  password: "$2a$10$hashedPasswordHere",
  role: "admin",
  phone: "1234567890",
  isActive: true,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 5. Custom Domain (Optional)

### For Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render:

1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 6. Monitoring and Maintenance

### Backend Monitoring (Render)

- View logs in Render dashboard
- Set up health checks
- Monitor resource usage

### Frontend Monitoring (Vercel)

- View deployment logs
- Monitor analytics
- Check performance metrics

### Database Monitoring (MongoDB Atlas)

- Monitor cluster metrics
- Set up alerts
- Review slow queries

---

## 7. Environment Variables Summary

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthcare_db
JWT_SECRET=min_32_character_secret_key_for_production
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 8. Troubleshooting

### Issue: CORS Error

**Solution**: Update CORS settings in backend to include frontend URL

### Issue: API Not Connecting

**Solution**:

- Check backend URL in frontend env variables
- Verify backend is running
- Check network tab in browser dev tools

### Issue: Database Connection Failed

**Solution**:

- Verify MongoDB Atlas connection string
- Check network access settings (0.0.0.0/0)
- Verify database user credentials

### Issue: Build Failed

**Solution**:

- Check build logs
- Verify all dependencies in package.json
- Ensure Node version compatibility

---

## 9. Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS for all connections
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up proper CORS configuration
- [ ] Use strong database passwords
- [ ] Enable 2FA on hosting accounts
- [ ] Regular security updates

---

## 10. Cost Estimation

### Free Tier Limits:

- **MongoDB Atlas**: 512MB storage
- **Render**: 750 hours/month (1 instance)
- **Vercel**: Unlimited deployments
- **Railway**: $5 credit/month

### Paid Plans (if needed):

- **MongoDB Atlas**: $9/month (Shared M2)
- **Render**: $7/month (Starter)
- **Vercel**: $20/month (Pro)

---

## Success! 🎉

Your Healthcare Management System is now deployed and accessible worldwide!

**Frontend URL**: https://your-app.vercel.app
**Backend URL**: https://your-backend.onrender.com
**Database**: MongoDB Atlas

Test all features and monitor for any issues.
