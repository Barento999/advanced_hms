# Healthcare Management System - Backend

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "patient"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get Dashboard Stats

```http
GET /admin/dashboard
Authorization: Bearer <token>
```

#### Get All Users

```http
GET /admin/users?page=1&limit=10
Authorization: Bearer <token>
```

#### Delete User

```http
DELETE /admin/users/:id
Authorization: Bearer <token>
```

#### Toggle User Status

```http
PATCH /admin/users/:id/toggle-status
Authorization: Bearer <token>
```

### Doctor Endpoints

All doctor endpoints require authentication and doctor role.

#### Get Doctor Profile

```http
GET /doctor/profile
Authorization: Bearer <token>
```

#### Update Doctor Profile

```http
PUT /doctor/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialization": "Cardiology",
  "consultationFee": 100,
  "experience": 5
}
```

#### Get Appointments

```http
GET /doctor/appointments?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Appointment Status

```http
PATCH /doctor/appointments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Add Medical Record

```http
POST /doctor/medical-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "patient_id",
  "diagnosis": "Common cold",
  "symptoms": ["fever", "cough"],
  "prescription": [
    {
      "medicine": "Paracetamol",
      "dosage": "500mg",
      "duration": "3 days"
    }
  ]
}
```

### Patient Endpoints

All patient endpoints require authentication and patient role.

#### Get Patient Profile

```http
GET /patient/profile
Authorization: Bearer <token>
```

#### Update Patient Profile

```http
PUT /patient/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bloodGroup": "A+"
}
```

#### Get All Doctors

```http
GET /patient/doctors?specialization=Cardiology&page=1&limit=10
Authorization: Bearer <token>
```

#### Book Appointment

```http
POST /patient/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "doctor_id",
  "appointmentDate": "2024-12-25",
  "timeSlot": {
    "startTime": "10:00",
    "endTime": "10:30"
  },
  "reason": "Regular checkup"
}
```

#### Get My Appointments

```http
GET /patient/appointments?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Cancel Appointment

```http
PATCH /patient/appointments/:id/cancel
Authorization: Bearer <token>
```

#### Get Medical Records

```http
GET /patient/medical-records
Authorization: Bearer <token>
```

#### Get Payment History

```http
GET /patient/payments
Authorization: Bearer <token>
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Success Responses

All endpoints return success responses in the following format:

```json
{
  "success": true,
  "data": { ... }
}
```

For paginated endpoints:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```
