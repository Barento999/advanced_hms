# 🚀 Complete Setup Guide - Healthcare Management System

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Step-by-Step Installation

### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd healthcare-management-system

# Or download and extract the ZIP file
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

This will install:

- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator
- express-rate-limit
- multer
- morgan

#### 2.3 Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important Notes:**

- Change `JWT_SECRET` to a random, secure string
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- For production, set `NODE_ENV=production`

#### 2.4 Start MongoDB

**Local MongoDB:**

```bash
# On Windows
net start MongoDB

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**

- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env`

#### 2.5 Start Backend Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

You should see:

```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### 3. Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

This will install:

- react
- react-dom
- react-router-dom
- axios
- react-hot-toast
- lucide-react
- tailwindcss
- vite

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

You should see:

```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## Creating Test Accounts

### Method 1: Using the Registration Page

1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Admin User
   - Email: admin@test.com
   - Phone: 1234567890
   - Password: admin123
   - Role: Patient (or Doctor)
3. Click "Sign Up"
4. Login with the credentials

### Method 2: Using MongoDB Compass or Shell

For creating an admin user directly in the database:

```javascript
// Connect to MongoDB
use healthcare_db

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@healthcare.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  phone: "1234567890",
  isActive: true,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Testing the Application

### 1. Register as Patient

- Go to registration page
- Select "Patient" role
- Complete registration
- Login

### 2. Register as Doctor

- Go to registration page
- Select "Doctor" role
- Complete registration
- Login
- Update profile with specialization and fees

### 3. Book an Appointment (as Patient)

- Login as patient
- Go to "Doctors" page
- Select a doctor
- Fill appointment form
- Submit

### 4. Manage Appointments (as Doctor)

- Login as doctor
- Go to "Appointments" page
- Confirm/Complete appointments
- Add medical records

### 5. Admin Functions

- Create admin user in database
- Login as admin
- View dashboard statistics
- Manage users

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

- Ensure MongoDB is running
- Check if MongoDB is installed correctly
- Verify `MONGODB_URI` in `.env`

### Issue 2: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Find and kill the process using the port
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in backend `.env`:

```env
PORT=5001
```

### Issue 3: CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

- Ensure backend is running on port 5000
- Check Vite proxy configuration in `frontend/vite.config.js`
- Verify CORS is enabled in backend `server.js`

### Issue 4: JWT Token Invalid

```
Error: Not authorized
```

**Solution:**

- Clear browser localStorage
- Login again
- Check if `JWT_SECRET` matches in `.env`

### Issue 5: Module Not Found

```
Error: Cannot find module 'express'
```

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import your repository
3. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Update API URL in frontend to point to your backend URL
5. Deploy

### Database (MongoDB Atlas)

1. Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGODB_URI` in backend environment variables

## Project Structure Overview

```
healthcare-management-system/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   ├── pages/         # Page components
│   │   └── utils/         # API configuration
│   └── public/            # Static assets
│
└── README.md              # Documentation
```

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Make Changes**: Edit files in respective directories
4. **Test**: Use the application in browser
5. **Commit**: Commit your changes to Git

## API Testing

Use tools like:

- **Postman** - [Download](https://www.postman.com/)
- **Thunder Client** - VS Code extension
- **Insomnia** - [Download](https://insomnia.rest/)

Import the API endpoints from `backend/README.md`

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues or questions:

1. Check the documentation
2. Review common issues above
3. Check console logs for errors
4. Verify all dependencies are installed

## Next Steps

After successful setup:

1. Customize the design and branding
2. Add more features (notifications, chat, etc.)
3. Implement payment gateway
4. Add email notifications
5. Enhance security features
6. Write tests
7. Deploy to production

---

**Congratulations!** 🎉 Your Healthcare Management System is now up and running!
