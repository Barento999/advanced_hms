# 🌱 Seed Data Guide

## Overview

The seed file populates your database with sample data for testing and development purposes. This allows you to immediately test all features without manually creating users and data.

---

## 🚀 How to Run the Seed File

### Step 1: Ensure MongoDB is Running

**Local MongoDB:**

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**

- Ensure your connection string is in `backend/.env`

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

### Step 3: Run the Seed Command

```bash
npm run seed
```

### Expected Output:

```
MongoDB Connected for seeding...
✅ Database cleared
Creating admin user...
✅ Admin created
Creating doctors...
✅ 5 Doctors created
Creating patients...
✅ 8 Patients created
Creating appointments...
✅ 10 Appointments created
Creating medical records...
✅ 3 Medical Records created
Creating payments...
✅ 5 Payments created
Creating notifications...
✅ 4 Notifications created

🎉 Database seeding completed successfully!
```

---

## 📊 Seeded Data Summary

### 1 Admin User

- **Name**: Admin User
- **Email**: admin@healthcare.com
- **Password**: password123
- **Role**: admin

### 5 Doctors

| Name                | Email                          | Specialization   | Fee  | Experience |
| ------------------- | ------------------------------ | ---------------- | ---- | ---------- |
| Dr. Sarah Johnson   | sarah.johnson@healthcare.com   | Cardiology       | $150 | 15 years   |
| Dr. Michael Chen    | michael.chen@healthcare.com    | Pediatrics       | $120 | 12 years   |
| Dr. Emily Rodriguez | emily.rodriguez@healthcare.com | Dermatology      | $100 | 10 years   |
| Dr. James Wilson    | james.wilson@healthcare.com    | Orthopedics      | $180 | 18 years   |
| Dr. Lisa Anderson   | lisa.anderson@healthcare.com   | General Medicine | $80  | 8 years    |

**All doctors password**: password123

### 8 Patients

| Name            | Email                     | Blood Group | Gender |
| --------------- | ------------------------- | ----------- | ------ |
| John Smith      | john.smith@email.com      | A+          | Male   |
| Emma Davis      | emma.davis@email.com      | B+          | Female |
| Robert Brown    | robert.brown@email.com    | O+          | Male   |
| Sophia Martinez | sophia.martinez@email.com | AB+         | Female |
| William Taylor  | william.taylor@email.com  | A-          | Male   |
| Olivia Anderson | olivia.anderson@email.com | O-          | Female |
| James Thomas    | james.thomas@email.com    | B-          | Male   |
| Ava Jackson     | ava.jackson@email.com     | AB-         | Female |

**All patients password**: password123

### 10 Appointments

| Patient         | Doctor              | Date           | Status    |
| --------------- | ------------------- | -------------- | --------- |
| John Smith      | Dr. Sarah Johnson   | April 10, 2024 | Completed |
| Emma Davis      | Dr. Michael Chen    | April 12, 2024 | Completed |
| Robert Brown    | Dr. Lisa Anderson   | April 15, 2024 | Completed |
| Sophia Martinez | Dr. Emily Rodriguez | April 25, 2024 | Confirmed |
| William Taylor  | Dr. James Wilson    | April 26, 2024 | Confirmed |
| Olivia Anderson | Dr. Sarah Johnson   | April 27, 2024 | Confirmed |
| James Thomas    | Dr. Michael Chen    | April 28, 2024 | Pending   |
| Ava Jackson     | Dr. Lisa Anderson   | April 29, 2024 | Pending   |
| John Smith      | Dr. Emily Rodriguez | April 30, 2024 | Pending   |
| Emma Davis      | Dr. James Wilson    | April 20, 2024 | Cancelled |

### 3 Medical Records

1. **John Smith** - Mild Hypertension
   - Prescribed: Amlodipine, Aspirin
   - Lab Tests: Blood Pressure Monitoring

2. **Emma Davis** - Routine Vaccination
   - MMR vaccine administered

3. **Robert Brown** - Type 2 Diabetes
   - Prescribed: Metformin
   - Lab Tests: HbA1c, Fasting Blood Sugar

### 5 Payments

| Patient         | Amount | Method | Status    |
| --------------- | ------ | ------ | --------- |
| John Smith      | $150   | Card   | Completed |
| Emma Davis      | $120   | Online | Completed |
| Robert Brown    | $80    | Cash   | Completed |
| Sophia Martinez | $100   | Card   | Pending   |
| William Taylor  | $180   | Online | Pending   |

### 4 Notifications

- Appointment confirmations
- Appointment reminders
- Payment confirmations
- New appointment alerts

---

## 🔑 Test Login Credentials

### Admin Login

```
Email: admin@healthcare.com
Password: password123
```

**What you can test:**

- View system dashboard
- Manage all users
- View all appointments
- System analytics

### Doctor Login (Example)

```
Email: sarah.johnson@healthcare.com
Password: password123
```

**What you can test:**

- View doctor dashboard
- Manage appointments
- View patient list
- Create medical records

### Patient Login (Example)

```
Email: john.smith@email.com
Password: password123
```

**What you can test:**

- View patient dashboard
- Browse doctors
- Book appointments
- View medical records
- Check payment history

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Workflow

1. Login as admin
2. View dashboard statistics
3. Go to User Management
4. Activate/deactivate a user
5. View all appointments

### Scenario 2: Doctor Workflow

1. Login as Dr. Sarah Johnson
2. View dashboard with appointment stats
3. Go to Appointments
4. Confirm a pending appointment
5. Complete a confirmed appointment
6. Go to Patients to view patient list
7. Create a medical record

### Scenario 3: Patient Workflow

1. Login as John Smith
2. View dashboard
3. Browse available doctors
4. Book a new appointment
5. View my appointments
6. View medical records
7. Check payment history

### Scenario 4: Cross-Role Testing

1. Login as patient and book appointment
2. Logout and login as doctor
3. Confirm the appointment
4. Create medical record
5. Logout and login as admin
6. View all system data

---

## 🔄 Re-seeding the Database

If you want to reset the database and re-seed:

```bash
cd backend
npm run seed
```

**Warning**: This will delete ALL existing data and create fresh seed data.

---

## 📝 Customizing Seed Data

To customize the seed data, edit `backend/seed.js`:

### Add More Doctors

```javascript
const doctorUsers = await User.insertMany([
  {
    name: "Dr. Your Name",
    email: "your.email@healthcare.com",
    password: hashedPassword,
    role: "doctor",
    phone: "1234567890",
    isActive: true,
  },
  // ... more doctors
]);
```

### Add More Patients

```javascript
const patientUsers = await User.insertMany([
  {
    name: "Patient Name",
    email: "patient@email.com",
    password: hashedPassword,
    role: "patient",
    phone: "9876543210",
    isActive: true,
  },
  // ... more patients
]);
```

### Modify Appointments

```javascript
const appointments = await Appointment.insertMany([
  {
    patientId: patients[0]._id,
    doctorId: doctors[0]._id,
    appointmentDate: new Date("2024-05-01T10:00:00"),
    timeSlot: { startTime: "10:00", endTime: "10:30" },
    status: "pending",
    reason: "Your reason here",
  },
  // ... more appointments
]);
```

---

## 🐛 Troubleshooting

### Issue: "MongoDB not connected"

**Solution**: Ensure MongoDB is running and connection string in `.env` is correct

### Issue: "Duplicate key error"

**Solution**: The seed script clears the database first. If you get this error, manually clear collections:

```javascript
// In MongoDB shell
use healthcare_db
db.users.deleteMany({})
db.doctors.deleteMany({})
db.patients.deleteMany({})
db.appointments.deleteMany({})
```

### Issue: "Module not found"

**Solution**: Ensure all dependencies are installed:

```bash
cd backend
npm install
```

### Issue: "Password not hashing"

**Solution**: Ensure bcryptjs is installed:

```bash
npm install bcryptjs
```

---

## 📊 Database Collections After Seeding

```
healthcare_db
├── users (14 documents)
│   ├── 1 admin
│   ├── 5 doctors
│   └── 8 patients
├── doctors (5 documents)
├── patients (8 documents)
├── appointments (10 documents)
├── medicalrecords (3 documents)
├── payments (5 documents)
└── notifications (4 documents)
```

---

## ✅ Verification Checklist

After seeding, verify:

- [ ] Can login as admin
- [ ] Can login as doctor
- [ ] Can login as patient
- [ ] Admin can see all users
- [ ] Doctor can see appointments
- [ ] Patient can see medical records
- [ ] Appointments have correct statuses
- [ ] Payments are linked to appointments
- [ ] Medical records are linked to patients

---

## 🎯 Quick Start After Seeding

1. **Start Backend**:

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Login and Test**:
   - Open `http://localhost:3000`
   - Use any of the credentials above
   - Test all features

---

## 📚 Related Files

- `backend/seed.js` - Seed script
- `backend/models/*.js` - Database models
- `backend/.env` - Environment configuration

---

## 💡 Tips

1. **Development**: Run seed once at the start of development
2. **Testing**: Re-seed when you need fresh data
3. **Demo**: Use seeded data for demonstrations
4. **Production**: Never run seed in production!

---

**Your database is now populated with realistic test data!** 🎉

You can immediately start testing all features of the Healthcare Management System without manually creating users and data.
