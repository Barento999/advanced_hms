# 🔒 Role-Based Access Control (RBAC) Implementation

## Overview

This Healthcare Management System implements a comprehensive Role-Based Access Control (RBAC) system with three distinct user roles: Admin, Doctor, and Patient. Each role has specific permissions and can only access resources they own or are authorized to view.

---

## 🎭 User Roles

### 1. Admin

**Full System Access**

- Manage all users (create, read, update, delete)
- View all appointments
- Access system analytics
- Monitor all activities
- Activate/deactivate users
- Access all resources

### 2. Doctor

**Medical Professional Access**

- Manage own profile
- View and update own appointments
- Access assigned patients only
- Create and manage medical records for own patients
- View patient list (only patients with appointments)
- Cannot access other doctors' data

### 3. Patient

**Personal Health Access**

- Manage own profile
- Book appointments
- View own appointments
- Cancel own pending appointments
- Access own medical records
- View payment history
- Browse all doctors
- Cannot access other patients' data

---

## 🛡️ Security Layers

### Layer 1: Authentication (JWT)

```javascript
// Middleware: protect
- Verifies JWT token
- Checks token expiration
- Validates user exists
- Ensures user is active
- Confirms user not deleted
```

**Features:**

- Token-based authentication
- Automatic token expiration
- Secure password storage (bcrypt)
- Token refresh capability
- Session management

### Layer 2: Authorization (Role Check)

```javascript
// Middleware: authorize(...roles)
- Verifies user role
- Checks role permissions
- Denies unauthorized access
- Returns clear error messages
```

**Features:**

- Role-based route protection
- Multiple role support
- Clear permission errors
- Role hierarchy

### Layer 3: Ownership Verification

```javascript
// Controller Level Checks
- Verifies resource ownership
- Prevents cross-user access
- Validates data relationships
- Ensures data integrity
```

**Features:**

- User can only access own data
- Doctors see only their patients
- Patients see only their records
- Admin has override access

---

## 🔐 Implementation Details

### Authentication Middleware

**File:** `backend/middlewares/auth.js`

#### 1. protect() Middleware

Verifies JWT token and authenticates user.

```javascript
export const protect = async (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify token with JWT_SECRET
  // 3. Find user by decoded ID
  // 4. Check user exists
  // 5. Check user is active
  // 6. Check user not deleted
  // 7. Attach user to request
  // 8. Continue to next middleware
};
```

**Error Handling:**

- No token → 401 "Please login"
- Invalid token → 401 "Invalid token"
- Expired token → 401 "Token expired"
- User not found → 401 "User not found"
- User inactive → 401 "Account deactivated"
- User deleted → 401 "Account no longer exists"

#### 2. authorize(...roles) Middleware

Checks if user role is authorized.

```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Check user exists
    // 2. Verify role in allowed roles
    // 3. Deny if not authorized
    // 4. Continue if authorized
  };
};
```

**Usage:**

```javascript
// Only admin can access
router.use(protect, authorize("admin"));

// Admin and doctor can access
router.use(protect, authorize("admin", "doctor"));

// All authenticated users
router.use(protect);
```

#### 3. checkOwnership(resourceType) Middleware

Verifies resource ownership.

```javascript
export const checkOwnership = (resourceType) => {
  // Admin: Full access
  // Doctor/Patient: Own resources only
};
```

#### 4. checkPermission(action, resource) Middleware

Fine-grained permission control.

```javascript
// Permission Matrix
const permissions = {
  admin: {
    users: ["create", "read", "update", "delete"],
    appointments: ["create", "read", "update", "delete"],
    // ... more resources
  },
  doctor: {
    appointments: ["read", "update"],
    medicalRecords: ["create", "read", "update"],
    // ... more resources
  },
  patient: {
    appointments: ["create", "read", "update"],
    medicalRecords: ["read"],
    // ... more resources
  },
};
```

---

## 🔒 Controller-Level Security

### Patient Controller

#### getPatientProfile()

```javascript
// ✅ Security: User can only access own profile
const patient = await Patient.findOne({
  userId: req.user._id, // Logged-in user ID
  isDeleted: false,
});
```

#### getMyAppointments()

```javascript
// ✅ Security: User can only see own appointments
const patient = await Patient.findOne({ userId: req.user._id });
const appointments = await Appointment.find({
  patientId: patient._id, // Only this patient's appointments
});
```

#### cancelAppointment()

```javascript
// ✅ Security: Verify ownership before cancellation
const appointment = await Appointment.findOne({
  _id: req.params.id,
  patientId: patient._id, // Must belong to this patient
  isDeleted: false,
});

// ✅ Business logic: Prevent invalid cancellations
if (appointment.status === "completed") {
  return res
    .status(400)
    .json({ message: "Cannot cancel completed appointment" });
}
```

### Doctor Controller

#### getDoctorAppointments()

```javascript
// ✅ Security: Doctor sees only their appointments
const doctor = await Doctor.findOne({ userId: req.user._id });
const appointments = await Appointment.find({
  doctorId: doctor._id, // Only this doctor's appointments
});
```

#### updateAppointmentStatus()

```javascript
// ✅ Security: Verify appointment belongs to doctor
const appointment = await Appointment.findOne({
  _id: req.params.id,
  doctorId: doctor._id, // Must be doctor's appointment
  isDeleted: false,
});

// ✅ Validation: Check valid status
const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
if (!validStatuses.includes(status)) {
  return res.status(400).json({ message: "Invalid status" });
}
```

#### getPatientsList()

```javascript
// ✅ Security: Doctor sees only patients they've treated
const appointments = await Appointment.find({
  doctorId: doctor._id, // Only this doctor's appointments
}).distinct("patientId");

const patients = await Patient.find({
  _id: { $in: appointments }, // Only patients from appointments
});
```

---

## 🛣️ Route Protection

### Admin Routes

```javascript
// All routes require admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
```

### Doctor Routes

```javascript
// All routes require doctor role
router.use(protect);
router.use(authorize("doctor"));

router.get("/profile", getDoctorProfile);
router.get("/appointments", getDoctorAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
```

### Patient Routes

```javascript
// All routes require patient role
router.use(protect);
router.use(authorize("patient"));

router.get("/profile", getPatientProfile);
router.post("/appointments", bookAppointment);
router.patch("/appointments/:id/cancel", cancelAppointment);
```

---

## 🔍 Permission Matrix

| Resource            | Admin | Doctor | Patient |
| ------------------- | ----- | ------ | ------- |
| **Users**           |
| Create              | ✅    | ❌     | ❌      |
| Read All            | ✅    | ❌     | ❌      |
| Update Any          | ✅    | ❌     | ❌      |
| Delete Any          | ✅    | ❌     | ❌      |
| **Own Profile**     |
| Read                | ✅    | ✅     | ✅      |
| Update              | ✅    | ✅     | ✅      |
| **Appointments**    |
| Create              | ✅    | ❌     | ✅      |
| Read All            | ✅    | ❌     | ❌      |
| Read Own            | ✅    | ✅     | ✅      |
| Update Own          | ✅    | ✅     | ✅      |
| Cancel Own          | ✅    | ✅     | ✅      |
| **Medical Records** |
| Create              | ✅    | ✅     | ❌      |
| Read All            | ✅    | ❌     | ❌      |
| Read Own            | ✅    | ✅     | ✅      |
| Update              | ✅    | ✅     | ❌      |
| **Doctors**         |
| Browse              | ✅    | ✅     | ✅      |
| View Details        | ✅    | ✅     | ✅      |
| **Patients**        |
| View All            | ✅    | ❌     | ❌      |
| View Own Patients   | ✅    | ✅     | ❌      |
| **Payments**        |
| View All            | ✅    | ❌     | ❌      |
| View Own            | ✅    | ❌     | ✅      |

---

## 🚨 Security Best Practices

### 1. Token Security

- ✅ JWT tokens stored securely
- ✅ Token expiration (7 days default)
- ✅ Secure token generation
- ✅ Token validation on every request
- ✅ Automatic token refresh

### 2. Password Security

- ✅ Bcrypt hashing (10 salt rounds)
- ✅ Passwords never returned in responses
- ✅ Password validation (min 6 characters)
- ✅ Secure password comparison

### 3. Data Access Control

- ✅ User can only access own data
- ✅ Cross-user access prevented
- ✅ Soft delete for data retention
- ✅ Active/inactive user checks
- ✅ Deleted user checks

### 4. Input Validation

- ✅ Express-validator for inputs
- ✅ Mongoose schema validation
- ✅ Status validation
- ✅ ID validation
- ✅ Required field checks

### 5. Error Handling

- ✅ Clear error messages
- ✅ Appropriate status codes
- ✅ No sensitive data in errors
- ✅ Consistent error format
- ✅ Logging for debugging

---

## 🧪 Testing RBAC

### Test Scenarios

#### 1. Authentication Tests

```bash
# Test without token
curl http://localhost:5000/api/patient/profile
# Expected: 401 "Please login"

# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:5000/api/patient/profile
# Expected: 401 "Invalid token"

# Test with expired token
# Expected: 401 "Token expired"
```

#### 2. Authorization Tests

```bash
# Patient trying to access admin route
curl -H "Authorization: Bearer <patient_token>" \
  http://localhost:5000/api/admin/users
# Expected: 403 "Access denied"

# Doctor trying to access patient route
curl -H "Authorization: Bearer <doctor_token>" \
  http://localhost:5000/api/patient/appointments
# Expected: 403 "Access denied"
```

#### 3. Ownership Tests

```bash
# Patient A trying to cancel Patient B's appointment
curl -X PATCH \
  -H "Authorization: Bearer <patient_a_token>" \
  http://localhost:5000/api/patient/appointments/<patient_b_appointment_id>/cancel
# Expected: 404 "Appointment not found or no permission"

# Doctor A trying to update Doctor B's appointment
curl -X PATCH \
  -H "Authorization: Bearer <doctor_a_token>" \
  http://localhost:5000/api/doctor/appointments/<doctor_b_appointment_id>/status
# Expected: 404 "Appointment not found or no permission"
```

---

## 📝 Implementation Checklist

### Backend

- [x] JWT authentication middleware
- [x] Role authorization middleware
- [x] Ownership verification in controllers
- [x] Permission matrix implementation
- [x] Token expiration handling
- [x] Error handling for auth failures
- [x] Secure password hashing
- [x] Input validation
- [x] Soft delete support
- [x] Active/inactive user checks

### Frontend

- [x] Token storage (localStorage)
- [x] Token in API requests
- [x] Protected routes
- [x] Role-based navigation
- [x] Automatic logout on 401
- [x] Error handling
- [x] Loading states
- [x] User context management

---

## 🔄 Token Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Token sent to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client includes token in requests
   ↓
7. Server validates token
   ↓
8. Server checks user role
   ↓
9. Server verifies ownership
   ↓
10. Request processed or denied
```

---

## 🎯 Key Improvements

### Enhanced Security

1. **Token Expiration Handling** - Clear error messages
2. **Ownership Verification** - Users can only access own data
3. **Status Validation** - Prevent invalid state changes
4. **Business Logic Checks** - E.g., can't cancel completed appointments
5. **Deleted User Checks** - Prevent access by deleted accounts
6. **Active User Checks** - Prevent access by inactive accounts

### Better Error Messages

- Clear indication of what went wrong
- Helpful messages for debugging
- Appropriate HTTP status codes
- No sensitive information leaked

### Comprehensive Protection

- Route-level protection
- Controller-level verification
- Database-level constraints
- Frontend route guards

---

## 📚 Related Files

- `backend/middlewares/auth.js` - Authentication & authorization
- `backend/controllers/patientController.js` - Patient security
- `backend/controllers/doctorController.js` - Doctor security
- `backend/controllers/adminController.js` - Admin security
- `frontend/src/components/ProtectedRoute.jsx` - Frontend guards
- `frontend/src/context/AuthContext.jsx` - Auth state management

---

## ✅ Security Compliance

This RBAC implementation follows:

- ✅ OWASP Security Guidelines
- ✅ JWT Best Practices
- ✅ RESTful API Security Standards
- ✅ Healthcare Data Protection Standards
- ✅ Principle of Least Privilege
- ✅ Defense in Depth Strategy

---

**Your Healthcare Management System now has enterprise-grade Role-Based Access Control!** 🔒
