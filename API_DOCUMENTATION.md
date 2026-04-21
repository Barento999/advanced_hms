# 📡 API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url.onrender.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "patient"
}
```

**Validation Rules:**

- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `role`: Required, one of: "admin", "doctor", "patient"
- `phone`: Optional, string

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "jwt_token_here"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "jwt_token_here"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "1234567890",
    "isActive": true
  }
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require authentication and admin role.

### Get Dashboard Statistics

**Endpoint:** `GET /admin/dashboard`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalDoctors": 25,
    "totalPatients": 120,
    "totalAppointments": 450,
    "totalRevenue": 45000,
    "recentAppointments": [
      {
        "_id": "apt_id",
        "patientId": "patient_id",
        "doctorId": "doctor_id",
        "appointmentDate": "2024-12-25T10:00:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

---

### Get All Users (Paginated)

**Endpoint:** `GET /admin/users`

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:** `GET /admin/users?page=1&limit=10`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "phone": "1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

### Delete User (Soft Delete)

**Endpoint:** `DELETE /admin/users/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Toggle User Status

**Endpoint:** `PATCH /admin/users/:id/toggle-status`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "isActive": false
  }
}
```

---

## 👨‍⚕️ Doctor Endpoints

All doctor endpoints require authentication and doctor role.

### Get Doctor Profile

**Endpoint:** `GET /doctor/profile`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "doctor_id",
    "userId": {
      "_id": "user_id",
      "name": "Dr. Smith",
      "email": "smith@example.com"
    },
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experience": 10,
    "consultationFee": 100,
    "availableDays": ["Monday", "Tuesday", "Wednesday"],
    "availableTimeSlots": [
      {
        "startTime": "09:00",
        "endTime": "17:00"
      }
    ],
    "rating": 4.5,
    "totalPatients": 250
  }
}
```

---

### Update Doctor Profile

**Endpoint:** `PUT /doctor/profile`

**Request Body:**

```json
{
  "specialization": "Cardiology",
  "qualification": "MBBS, MD, DM",
  "experience": 12,
  "consultationFee": 150,
  "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday"],
  "availableTimeSlots": [
    {
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    // Updated doctor profile
  }
}
```

---

### Get Doctor Appointments

**Endpoint:** `GET /doctor/appointments`

**Query Parameters:**

- `status`: Filter by status (pending, confirmed, completed, cancelled)
- `page`: Page number
- `limit`: Items per page

**Example:** `GET /doctor/appointments?status=pending&page=1&limit=10`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "apt_id",
      "patientId": {
        "_id": "patient_id",
        "userId": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "1234567890"
        }
      },
      "appointmentDate": "2024-12-25T10:00:00.000Z",
      "timeSlot": {
        "startTime": "10:00",
        "endTime": "10:30"
      },
      "reason": "Regular checkup",
      "status": "pending",
      "createdAt": "2024-12-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### Update Appointment Status

**Endpoint:** `PATCH /doctor/appointments/:id/status`

**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**

- `pending`
- `confirmed`
- `completed`
- `cancelled`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "apt_id",
    "status": "confirmed"
  }
}
```

---

### Add Medical Record

**Endpoint:** `POST /doctor/medical-records`

**Request Body:**

```json
{
  "patientId": "patient_id",
  "appointmentId": "appointment_id",
  "diagnosis": "Common cold with mild fever",
  "symptoms": ["fever", "cough", "headache"],
  "prescription": [
    {
      "medicine": "Paracetamol",
      "dosage": "500mg",
      "duration": "3 days",
      "instructions": "Take after meals"
    },
    {
      "medicine": "Cough Syrup",
      "dosage": "10ml",
      "duration": "5 days",
      "instructions": "Take before sleep"
    }
  ],
  "labTests": [
    {
      "testName": "Blood Test",
      "result": "Normal",
      "date": "2024-12-20"
    }
  ],
  "notes": "Patient advised to rest and drink plenty of fluids"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "record_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "diagnosis": "Common cold with mild fever",
    "prescription": [...],
    "createdAt": "2024-12-20T00:00:00.000Z"
  }
}
```

---

### Get Patients List

**Endpoint:** `GET /doctor/patients`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "patient_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      },
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "bloodGroup": "A+"
    }
  ]
}
```

---

## 🏥 Patient Endpoints

All patient endpoints require authentication and patient role.

### Get Patient Profile

**Endpoint:** `GET /patient/profile`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "patient_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodGroup": "A+",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "0987654321",
      "relation": "Spouse"
    },
    "medicalHistory": [
      {
        "condition": "Diabetes",
        "diagnosedDate": "2020-01-01",
        "notes": "Type 2, controlled with medication"
      }
    ],
    "allergies": ["Penicillin", "Peanuts"]
  }
}
```

---

### Update Patient Profile

**Endpoint:** `PUT /patient/profile`

**Request Body:**

```json
{
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bloodGroup": "A+",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "0987654321",
    "relation": "Spouse"
  },
  "allergies": ["Penicillin"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    // Updated patient profile
  }
}
```

---

### Get All Doctors

**Endpoint:** `GET /patient/doctors`

**Query Parameters:**

- `specialization`: Filter by specialization
- `page`: Page number
- `limit`: Items per page

**Example:** `GET /patient/doctors?specialization=Cardiology&page=1&limit=10`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "doctor_id",
      "userId": {
        "name": "Dr. Smith",
        "email": "smith@example.com",
        "phone": "1234567890"
      },
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 10,
      "consultationFee": 100,
      "rating": 4.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Book Appointment

**Endpoint:** `POST /patient/appointments`

**Request Body:**

```json
{
  "doctorId": "doctor_id",
  "appointmentDate": "2024-12-25",
  "timeSlot": {
    "startTime": "10:00",
    "endTime": "10:30"
  },
  "reason": "Regular checkup and consultation"
}
```

**Validation Rules:**

- `doctorId`: Required, valid ObjectId
- `appointmentDate`: Required, valid ISO date
- `reason`: Required, string

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "apt_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "appointmentDate": "2024-12-25T10:00:00.000Z",
    "timeSlot": {
      "startTime": "10:00",
      "endTime": "10:30"
    },
    "reason": "Regular checkup",
    "status": "pending",
    "createdAt": "2024-12-20T00:00:00.000Z"
  }
}
```

---

### Get My Appointments

**Endpoint:** `GET /patient/appointments`

**Query Parameters:**

- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "apt_id",
      "doctorId": {
        "_id": "doctor_id",
        "userId": {
          "name": "Dr. Smith",
          "email": "smith@example.com"
        },
        "specialization": "Cardiology"
      },
      "appointmentDate": "2024-12-25T10:00:00.000Z",
      "timeSlot": {
        "startTime": "10:00",
        "endTime": "10:30"
      },
      "reason": "Regular checkup",
      "status": "pending"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

### Cancel Appointment

**Endpoint:** `PATCH /patient/appointments/:id/cancel`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "apt_id",
    "status": "cancelled"
  }
}
```

---

### Get Medical Records

**Endpoint:** `GET /patient/medical-records`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "record_id",
      "doctorId": {
        "_id": "doctor_id",
        "userId": {
          "name": "Dr. Smith"
        }
      },
      "diagnosis": "Common cold",
      "symptoms": ["fever", "cough"],
      "prescription": [
        {
          "medicine": "Paracetamol",
          "dosage": "500mg",
          "duration": "3 days",
          "instructions": "Take after meals"
        }
      ],
      "notes": "Rest and drink fluids",
      "createdAt": "2024-12-20T00:00:00.000Z"
    }
  ]
}
```

---

### Get Payment History

**Endpoint:** `GET /patient/payments`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "payment_id",
      "appointmentId": "apt_id",
      "amount": 100,
      "paymentMethod": "card",
      "status": "completed",
      "transactionId": "TXN123456",
      "createdAt": "2024-12-20T00:00:00.000Z"
    }
  ]
}
```

---

## 🔧 Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "User role patient is not authorized to access this route"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 📊 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes

---

## 🔒 Security Headers

All responses include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 📝 Notes

1. All dates are in ISO 8601 format
2. All timestamps are in UTC
3. Pagination starts at page 1
4. Default limit is 10 items per page
5. Soft delete is used (isDeleted flag)
6. All IDs are MongoDB ObjectIds

---

## 🧪 Testing with Postman

1. Import the API endpoints
2. Create environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: Your JWT token
3. Use `{{base_url}}` and `{{token}}` in requests
4. Test all endpoints systematically

---

## 📞 Support

For API issues or questions, check:

- Server logs
- Network tab in browser
- Postman console
- MongoDB logs
