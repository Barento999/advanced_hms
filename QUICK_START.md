# ⚡ Quick Start Guide

Get the Healthcare Management System running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (should be v16+)
node --version

# Check npm
npm --version

# Check MongoDB (if using local)
mongod --version
```

## 🚀 Fast Setup

### 1. Backend (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start MongoDB (if local)
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start server
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 2. Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## 🎯 First Steps

### 1. Open Browser

```
http://localhost:3000
```

### 2. Register Account

- Click "Sign up"
- Fill in details
- Select role: Patient or Doctor
- Submit

### 3. Login

- Use your credentials
- Access your dashboard

## 🧪 Test Features

### As Patient:

1. View dashboard
2. Browse doctors
3. Book appointment
4. View appointments

### As Doctor:

1. View dashboard
2. See appointments
3. Update appointment status
4. Add medical records

### As Admin:

1. Create admin user in MongoDB
2. View system stats
3. Manage users

## 📝 Sample Data

### Test Patient Account

```
Email: patient@test.com
Password: patient123
```

### Test Doctor Account

```
Email: doctor@test.com
Password: doctor123
```

(Create these via registration page)

## 🔧 Common Commands

### Backend

```bash
# Development mode
npm run dev

# Production mode
npm start

# Check logs
# View terminal output
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Quick Troubleshooting

### Port Already in Use

```bash
# Change port in backend/.env
PORT=5001

# Or kill process
# Windows: taskkill /F /IM node.exe
# Mac/Linux: killall node
```

### MongoDB Not Running

```bash
# Start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Dependencies Error

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

- Ensure backend is running on port 5000
- Check Vite proxy in `frontend/vite.config.js`

## 📚 Next Steps

1. ✅ System running
2. 📖 Read [README.md](README.md) for full documentation
3. 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. 📡 Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

## 🎉 Success!

Your Healthcare Management System is now running!

**Frontend**: http://localhost:3000
**Backend**: http://localhost:5000
**API Health**: http://localhost:5000/health

Happy coding! 💻
