# 🏥 Advanced Healthcare Management System

A production-ready, full-stack healthcare management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Secure route protection

### 👥 Three User Roles

#### Admin

- View system analytics and dashboard
- Manage doctors and patients
- Monitor all appointments
- User management (activate/deactivate/delete)

#### Doctor

- Personal dashboard with appointment overview
- Manage appointments (confirm/complete/cancel)
- View patient list
- Add medical records and prescriptions
- Track completed consultations

#### Patient

- Book appointments with doctors
- View appointment history
- Access medical records
- Track payment history
- Cancel pending appointments

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **Morgan** - Logging

### Frontend

- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Vite** - Build tool

## 📁 Project Structure

```
healthcare-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   └── patientController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── patientRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── logger.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── StatCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   └── UserManagement.jsx
    │   │   ├── doctor/
    │   │   │   ├── DoctorDashboard.jsx
    │   │   │   └── Appointments.jsx
    │   │   └── patient/
    │   │       ├── PatientDashboard.jsx
    │   │       ├── BookAppointment.jsx
    │   │       └── MyAppointments.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin Routes

- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users (paginated)
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status

### Doctor Routes

- `GET /api/doctor/profile` - Get doctor profile
- `PUT /api/doctor/profile` - Update doctor profile
- `GET /api/doctor/appointments` - Get doctor appointments
- `PATCH /api/doctor/appointments/:id/status` - Update appointment status
- `POST /api/doctor/medical-records` - Add medical record
- `GET /api/doctor/patients` - Get patient list

### Patient Routes

- `GET /api/patient/profile` - Get patient profile
- `PUT /api/patient/profile` - Update patient profile
- `GET /api/patient/doctors` - Get all doctors
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get patient appointments
- `PATCH /api/patient/appointments/:id/cancel` - Cancel appointment
- `GET /api/patient/medical-records` - Get medical records
- `GET /api/patient/payments` - Get payment history

## 🎨 Design System

### Color Palette

- **Primary**: #2563EB (Professional Blue)
- **Secondary**: #0F172A (Dark Navy)
- **Background**: #F8FAFC (Light Gray)
- **Accent**: #22C55E (Success Green)
- **Danger**: #EF4444 (Alert Red)

### Typography

- **Font Family**: Inter
- Clean hierarchy with proper heading levels
- Consistent spacing and sizing

### Components

- Rounded corners (rounded-xl)
- Soft shadows (shadow-md)
- Smooth transitions
- Responsive design

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Role-based access control
- Protected routes
- Error handling middleware
- Environment variables for sensitive data

## 📦 Database Schema

### Collections

- **Users** - Base user information
- **Doctors** - Doctor-specific data
- **Patients** - Patient-specific data
- **Appointments** - Appointment bookings
- **MedicalRecords** - Patient medical history
- **Payments** - Payment transactions
- **Notifications** - User notifications

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Create new web service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 📝 Sample Test Accounts

After setting up, create test accounts:

**Admin:**

- Email: admin@healthcare.com
- Password: admin123

**Doctor:**

- Email: doctor@healthcare.com
- Password: doctor123

**Patient:**

- Email: patient@healthcare.com
- Password: patient123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for modern healthcare management

---

**Note**: This is a production-ready system with clean architecture, proper error handling, and security best practices. Perfect for real-world healthcare applications.
