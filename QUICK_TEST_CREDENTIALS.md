# 🔑 Quick Test Credentials

## After Running Seed File

Run the seed command first:

```bash
cd backend
npm run seed
```

---

## 👨‍💼 ADMIN

```
Email: admin@healthcare.com
Password: password123
```

**Test Features:**

- ✅ View system dashboard
- ✅ Manage all users
- ✅ View all appointments
- ✅ Activate/deactivate users
- ✅ Delete users
- ✅ System analytics

---

## 👨‍⚕️ DOCTORS (All password: password123)

### Dr. Sarah Johnson - Cardiology

```
Email: sarah.johnson@healthcare.com
Specialization: Cardiology
Fee: $150
Experience: 15 years
```

### Dr. Michael Chen - Pediatrics

```
Email: michael.chen@healthcare.com
Specialization: Pediatrics
Fee: $120
Experience: 12 years
```

### Dr. Emily Rodriguez - Dermatology

```
Email: emily.rodriguez@healthcare.com
Specialization: Dermatology
Fee: $100
Experience: 10 years
```

### Dr. James Wilson - Orthopedics

```
Email: james.wilson@healthcare.com
Specialization: Orthopedics
Fee: $180
Experience: 18 years
```

### Dr. Lisa Anderson - General Medicine

```
Email: lisa.anderson@healthcare.com
Specialization: General Medicine
Fee: $80
Experience: 8 years
```

**Test Features:**

- ✅ View doctor dashboard
- ✅ Manage appointments
- ✅ Confirm/complete appointments
- ✅ View patient list
- ✅ Create medical records
- ✅ Add prescriptions

---

## 🏥 PATIENTS (All password: password123)

### John Smith

```
Email: john.smith@email.com
Blood Group: A+
Has: Medical history, appointments, medical records
```

### Emma Davis

```
Email: emma.davis@email.com
Blood Group: B+
Has: Appointments, medical records
```

### Robert Brown

```
Email: robert.brown@email.com
Blood Group: O+
Has: Diabetes history, appointments, medical records
```

### Sophia Martinez

```
Email: sophia.martinez@email.com
Blood Group: AB+
Has: Confirmed appointment
```

### William Taylor

```
Email: william.taylor@email.com
Blood Group: A-
Has: Confirmed appointment
```

### Olivia Anderson

```
Email: olivia.anderson@email.com
Blood Group: O-
Has: Confirmed appointment
```

### James Thomas

```
Email: james.thomas@email.com
Blood Group: B-
Has: Pending appointment
```

### Ava Jackson

```
Email: ava.jackson@email.com
Blood Group: AB-
Has: Pending appointment
```

**Test Features:**

- ✅ View patient dashboard
- ✅ Browse doctors
- ✅ Book appointments
- ✅ View my appointments
- ✅ Cancel appointments
- ✅ View medical records
- ✅ Check payment history

---

## 📊 Quick Stats

- **Total Users**: 14 (1 admin + 5 doctors + 8 patients)
- **Appointments**: 10 (3 completed, 3 confirmed, 3 pending, 1 cancelled)
- **Medical Records**: 3
- **Payments**: 5 (3 completed, 2 pending)
- **Notifications**: 4

---

## 🧪 Quick Test Scenarios

### 1. Admin Test (2 minutes)

```
1. Login: admin@healthcare.com / password123
2. View dashboard
3. Go to Users → See all 14 users
4. Go to Appointments → See all 10 appointments
5. Toggle user status
```

### 2. Doctor Test (3 minutes)

```
1. Login: sarah.johnson@healthcare.com / password123
2. View dashboard → See appointment stats
3. Go to Appointments → See your appointments
4. Confirm a pending appointment
5. Go to Patients → See patient list
6. Go to Medical Records → Create new record
```

### 3. Patient Test (3 minutes)

```
1. Login: john.smith@email.com / password123
2. View dashboard → See your stats
3. Go to Doctors → Browse available doctors
4. Book new appointment
5. Go to My Appointments → See all appointments
6. Go to Medical Records → View your records
7. Go to Payments → Check payment history
```

---

## 🎯 Feature Coverage

### ✅ Completed Appointments

- John Smith → Dr. Sarah Johnson (April 10)
- Emma Davis → Dr. Michael Chen (April 12)
- Robert Brown → Dr. Lisa Anderson (April 15)

### ✅ Confirmed Appointments

- Sophia Martinez → Dr. Emily Rodriguez (April 25)
- William Taylor → Dr. James Wilson (April 26)
- Olivia Anderson → Dr. Sarah Johnson (April 27)

### ✅ Pending Appointments

- James Thomas → Dr. Michael Chen (April 28)
- Ava Jackson → Dr. Lisa Anderson (April 29)
- John Smith → Dr. Emily Rodriguez (April 30)

### ✅ Medical Records

- John Smith: Hypertension with prescriptions
- Emma Davis: Vaccination record
- Robert Brown: Diabetes with lab tests

---

## 💡 Pro Tips

1. **Start with Admin** - See the full system overview
2. **Test Doctor Flow** - Manage appointments and create records
3. **Test Patient Flow** - Book appointments and view records
4. **Cross-Role Testing** - Book as patient, confirm as doctor, view as admin

---

## 🔄 Reset Data

To reset and get fresh seed data:

```bash
cd backend
npm run seed
```

This will clear all data and create fresh seed data.

---

**Happy Testing!** 🎉
