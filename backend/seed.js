import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import Patient from "./models/Patient.js";
import Appointment from "./models/Appointment.js";
import MedicalRecord from "./models/MedicalRecord.js";
import Payment from "./models/Payment.js";
import Notification from "./models/Notification.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log("✅ Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Password will be hashed by the User model pre-save hook
    const password = "password123";

    // ==================== CREATE ADMIN USER ====================
    console.log("Creating admin user...");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@healthcare.com",
      password: password,
      role: "admin",
      phone: "1234567890",
      isActive: true,
    });
    console.log("✅ Admin created");

    // ==================== CREATE DOCTORS ====================
    console.log("Creating doctors...");

    const doctorData = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@healthcare.com",
        password: password,
        role: "doctor",
        phone: "2345678901",
        isActive: true,
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@healthcare.com",
        password: password,
        role: "doctor",
        phone: "3456789012",
        isActive: true,
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@healthcare.com",
        password: password,
        role: "doctor",
        phone: "4567890123",
        isActive: true,
      },
      {
        name: "Dr. James Wilson",
        email: "james.wilson@healthcare.com",
        password: password,
        role: "doctor",
        phone: "5678901234",
        isActive: true,
      },
      {
        name: "Dr. Lisa Anderson",
        email: "lisa.anderson@healthcare.com",
        password: password,
        role: "doctor",
        phone: "6789012345",
        isActive: true,
      },
    ];

    const doctorUsers = [];
    for (const doc of doctorData) {
      const user = await User.create(doc);
      doctorUsers.push(user);
    }

    const doctors = await Doctor.insertMany([
      {
        userId: doctorUsers[0]._id,
        specialization: "Cardiology",
        qualification: "MBBS, MD (Cardiology)",
        experience: 15,
        consultationFee: 150,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.8,
        totalPatients: 250,
      },
      {
        userId: doctorUsers[1]._id,
        specialization: "Pediatrics",
        qualification: "MBBS, MD (Pediatrics)",
        experience: 12,
        consultationFee: 120,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: [
          { startTime: "10:00", endTime: "13:00" },
          { startTime: "15:00", endTime: "18:00" },
        ],
        rating: 4.9,
        totalPatients: 320,
      },
      {
        userId: doctorUsers[2]._id,
        specialization: "Dermatology",
        qualification: "MBBS, MD (Dermatology)",
        experience: 10,
        consultationFee: 100,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "16:00" },
        ],
        rating: 4.7,
        totalPatients: 180,
      },
      {
        userId: doctorUsers[3]._id,
        specialization: "Orthopedics",
        qualification: "MBBS, MS (Orthopedics)",
        experience: 18,
        consultationFee: 180,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
        availableTimeSlots: [
          { startTime: "08:00", endTime: "11:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.9,
        totalPatients: 400,
      },
      {
        userId: doctorUsers[4]._id,
        specialization: "General Medicine",
        qualification: "MBBS, MD (General Medicine)",
        experience: 8,
        consultationFee: 80,
        availableDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "13:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
        rating: 4.6,
        totalPatients: 500,
      },
    ]);
    console.log("✅ 5 Doctors created");

    // ==================== CREATE PATIENTS ====================
    console.log("Creating patients...");

    const patientData = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        password: password,
        role: "patient",
        phone: "7890123456",
        isActive: true,
      },
      {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        password: password,
        role: "patient",
        phone: "8901234567",
        isActive: true,
      },
      {
        name: "Robert Brown",
        email: "robert.brown@email.com",
        password: password,
        role: "patient",
        phone: "9012345678",
        isActive: true,
      },
      {
        name: "Sophia Martinez",
        email: "sophia.martinez@email.com",
        password: password,
        role: "patient",
        phone: "0123456789",
        isActive: true,
      },
      {
        name: "William Taylor",
        email: "william.taylor@email.com",
        password: password,
        role: "patient",
        phone: "1234509876",
        isActive: true,
      },
      {
        name: "Olivia Anderson",
        email: "olivia.anderson@email.com",
        password: password,
        role: "patient",
        phone: "2345609876",
        isActive: true,
      },
      {
        name: "James Thomas",
        email: "james.thomas@email.com",
        password: password,
        role: "patient",
        phone: "3456709876",
        isActive: true,
      },
      {
        name: "Ava Jackson",
        email: "ava.jackson@email.com",
        password: password,
        role: "patient",
        phone: "4567809876",
        isActive: true,
      },
    ];

    const patientUsers = [];
    for (const pat of patientData) {
      const user = await User.create(pat);
      patientUsers.push(user);
    }

    const patients = await Patient.insertMany([
      {
        userId: patientUsers[0]._id,
        dateOfBirth: new Date("1985-03-15"),
        gender: "male",
        bloodGroup: "A+",
        address: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        emergencyContact: {
          name: "Jane Smith",
          phone: "9876543210",
          relation: "Spouse",
        },
        allergies: ["Penicillin"],
        medicalHistory: [
          {
            condition: "Hypertension",
            diagnosedDate: new Date("2020-01-15"),
            notes: "Controlled with medication",
          },
        ],
      },
      {
        userId: patientUsers[1]._id,
        dateOfBirth: new Date("1990-07-22"),
        gender: "female",
        bloodGroup: "B+",
        address: {
          street: "456 Oak Avenue",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
        },
        emergencyContact: {
          name: "Michael Davis",
          phone: "8765432109",
          relation: "Father",
        },
        allergies: ["Peanuts", "Shellfish"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[2]._id,
        dateOfBirth: new Date("1978-11-30"),
        gender: "male",
        bloodGroup: "O+",
        address: {
          street: "789 Pine Road",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
        },
        emergencyContact: {
          name: "Sarah Brown",
          phone: "7654321098",
          relation: "Wife",
        },
        allergies: [],
        medicalHistory: [
          {
            condition: "Diabetes Type 2",
            diagnosedDate: new Date("2018-05-10"),
            notes: "Managed with diet and medication",
          },
        ],
      },
      {
        userId: patientUsers[3]._id,
        dateOfBirth: new Date("1995-02-14"),
        gender: "female",
        bloodGroup: "AB+",
        address: {
          street: "321 Elm Street",
          city: "Houston",
          state: "TX",
          zipCode: "77001",
        },
        emergencyContact: {
          name: "Carlos Martinez",
          phone: "6543210987",
          relation: "Brother",
        },
        allergies: ["Latex"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[4]._id,
        dateOfBirth: new Date("1982-09-05"),
        gender: "male",
        bloodGroup: "A-",
        address: {
          street: "654 Maple Drive",
          city: "Phoenix",
          state: "AZ",
          zipCode: "85001",
        },
        emergencyContact: {
          name: "Linda Taylor",
          phone: "5432109876",
          relation: "Mother",
        },
        allergies: ["Aspirin"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[5]._id,
        dateOfBirth: new Date("1988-12-20"),
        gender: "female",
        bloodGroup: "O-",
        address: {
          street: "987 Cedar Lane",
          city: "Philadelphia",
          state: "PA",
          zipCode: "19101",
        },
        emergencyContact: {
          name: "David Anderson",
          phone: "4321098765",
          relation: "Husband",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[6]._id,
        dateOfBirth: new Date("1975-06-18"),
        gender: "male",
        bloodGroup: "B-",
        address: {
          street: "147 Birch Court",
          city: "San Antonio",
          state: "TX",
          zipCode: "78201",
        },
        emergencyContact: {
          name: "Mary Thomas",
          phone: "3210987654",
          relation: "Sister",
        },
        allergies: ["Sulfa drugs"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[7]._id,
        dateOfBirth: new Date("1992-04-25"),
        gender: "female",
        bloodGroup: "AB-",
        address: {
          street: "258 Willow Way",
          city: "San Diego",
          state: "CA",
          zipCode: "92101",
        },
        emergencyContact: {
          name: "Robert Jackson",
          phone: "2109876543",
          relation: "Father",
        },
        allergies: ["Iodine"],
        medicalHistory: [],
      },
    ]);
    console.log("✅ 8 Patients created");

    // ==================== CREATE APPOINTMENTS ====================
    console.log("Creating appointments...");

    const appointments = await Appointment.insertMany([
      // Completed appointments
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        appointmentDate: new Date("2024-04-10T10:00:00"),
        timeSlot: { startTime: "10:00", endTime: "10:30" },
        status: "completed",
        reason: "Regular heart checkup",
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        appointmentDate: new Date("2024-04-12T11:00:00"),
        timeSlot: { startTime: "11:00", endTime: "11:30" },
        status: "completed",
        reason: "Child vaccination",
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[4]._id,
        appointmentDate: new Date("2024-04-15T09:00:00"),
        timeSlot: { startTime: "09:00", endTime: "09:30" },
        status: "completed",
        reason: "Diabetes follow-up",
      },
      // Confirmed appointments
      {
        patientId: patients[3]._id,
        doctorId: doctors[2]._id,
        appointmentDate: new Date("2024-04-25T14:00:00"),
        timeSlot: { startTime: "14:00", endTime: "14:30" },
        status: "confirmed",
        reason: "Skin rash consultation",
      },
      {
        patientId: patients[4]._id,
        doctorId: doctors[3]._id,
        appointmentDate: new Date("2024-04-26T10:00:00"),
        timeSlot: { startTime: "10:00", endTime: "10:30" },
        status: "confirmed",
        reason: "Knee pain evaluation",
      },
      {
        patientId: patients[5]._id,
        doctorId: doctors[0]._id,
        appointmentDate: new Date("2024-04-27T15:00:00"),
        timeSlot: { startTime: "15:00", endTime: "15:30" },
        status: "confirmed",
        reason: "Chest pain consultation",
      },
      // Pending appointments
      {
        patientId: patients[6]._id,
        doctorId: doctors[1]._id,
        appointmentDate: new Date("2024-04-28T11:00:00"),
        timeSlot: { startTime: "11:00", endTime: "11:30" },
        status: "pending",
        reason: "General checkup",
      },
      {
        patientId: patients[7]._id,
        doctorId: doctors[4]._id,
        appointmentDate: new Date("2024-04-29T09:30:00"),
        timeSlot: { startTime: "09:30", endTime: "10:00" },
        status: "pending",
        reason: "Fever and cough",
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[2]._id,
        appointmentDate: new Date("2024-04-30T13:00:00"),
        timeSlot: { startTime: "13:00", endTime: "13:30" },
        status: "pending",
        reason: "Skin allergy",
      },
      // Cancelled appointment
      {
        patientId: patients[1]._id,
        doctorId: doctors[3]._id,
        appointmentDate: new Date("2024-04-20T10:00:00"),
        timeSlot: { startTime: "10:00", endTime: "10:30" },
        status: "cancelled",
        reason: "Back pain consultation",
      },
    ]);
    console.log("✅ 10 Appointments created");

    // ==================== CREATE MEDICAL RECORDS ====================
    console.log("Creating medical records...");

    await MedicalRecord.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        appointmentId: appointments[0]._id,
        diagnosis: "Mild Hypertension",
        symptoms: ["High blood pressure", "Occasional headaches"],
        prescription: [
          {
            medicine: "Amlodipine",
            dosage: "5mg",
            duration: "30 days",
            instructions: "Take once daily in the morning",
          },
          {
            medicine: "Aspirin",
            dosage: "75mg",
            duration: "30 days",
            instructions: "Take once daily after dinner",
          },
        ],
        labTests: [
          {
            testName: "Blood Pressure Monitoring",
            result: "140/90 mmHg",
            date: new Date("2024-04-10"),
          },
        ],
        notes:
          "Patient advised to reduce salt intake and exercise regularly. Follow-up in 1 month.",
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        appointmentId: appointments[1]._id,
        diagnosis: "Routine Vaccination",
        symptoms: [],
        prescription: [],
        labTests: [],
        notes:
          "MMR vaccine administered. No adverse reactions observed. Next vaccination due in 6 months.",
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[4]._id,
        appointmentId: appointments[2]._id,
        diagnosis: "Type 2 Diabetes - Well Controlled",
        symptoms: ["Occasional fatigue"],
        prescription: [
          {
            medicine: "Metformin",
            dosage: "500mg",
            duration: "90 days",
            instructions: "Take twice daily with meals",
          },
        ],
        labTests: [
          {
            testName: "HbA1c",
            result: "6.5%",
            date: new Date("2024-04-15"),
          },
          {
            testName: "Fasting Blood Sugar",
            result: "110 mg/dL",
            date: new Date("2024-04-15"),
          },
        ],
        notes:
          "Blood sugar levels well controlled. Continue current medication. Maintain healthy diet and exercise routine.",
      },
    ]);
    console.log("✅ 3 Medical Records created");

    // ==================== CREATE PAYMENTS ====================
    console.log("Creating payments...");

    await Payment.insertMany([
      {
        appointmentId: appointments[0]._id,
        patientId: patients[0]._id,
        amount: 150,
        paymentMethod: "card",
        status: "completed",
        transactionId: "TXN001234567890",
      },
      {
        appointmentId: appointments[1]._id,
        patientId: patients[1]._id,
        amount: 120,
        paymentMethod: "online",
        status: "completed",
        transactionId: "TXN001234567891",
      },
      {
        appointmentId: appointments[2]._id,
        patientId: patients[2]._id,
        amount: 80,
        paymentMethod: "cash",
        status: "completed",
        transactionId: "TXN001234567892",
      },
      {
        appointmentId: appointments[3]._id,
        patientId: patients[3]._id,
        amount: 100,
        paymentMethod: "card",
        status: "pending",
        transactionId: "TXN001234567893",
      },
      {
        appointmentId: appointments[4]._id,
        patientId: patients[4]._id,
        amount: 180,
        paymentMethod: "online",
        status: "pending",
        transactionId: "TXN001234567894",
      },
    ]);
    console.log("✅ 5 Payments created");

    // ==================== CREATE NOTIFICATIONS ====================
    console.log("Creating notifications...");

    await Notification.insertMany([
      {
        userId: patientUsers[0]._id,
        title: "Appointment Confirmed",
        message:
          "Your appointment with Dr. Sarah Johnson has been confirmed for April 10, 2024",
        type: "appointment",
        isRead: true,
      },
      {
        userId: patientUsers[3]._id,
        title: "Appointment Reminder",
        message:
          "You have an upcoming appointment with Dr. Emily Rodriguez on April 25, 2024",
        type: "appointment",
        isRead: false,
      },
      {
        userId: doctorUsers[0]._id,
        title: "New Appointment",
        message: "New appointment request from Olivia Anderson",
        type: "appointment",
        isRead: false,
      },
      {
        userId: patientUsers[0]._id,
        title: "Payment Successful",
        message: "Your payment of $150 has been processed successfully",
        type: "payment",
        isRead: true,
      },
    ]);
    console.log("✅ 4 Notifications created");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log("- 1 Admin user");
    console.log("- 5 Doctors");
    console.log("- 8 Patients");
    console.log("- 10 Appointments");
    console.log("- 3 Medical Records");
    console.log("- 5 Payments");
    console.log("- 4 Notifications");
    console.log("\n🔑 Login Credentials:");
    console.log("\nAdmin:");
    console.log("  Email: admin@healthcare.com");
    console.log("  Password: password123");
    console.log("\nDoctor (example):");
    console.log("  Email: sarah.johnson@healthcare.com");
    console.log("  Password: password123");
    console.log("\nPatient (example):");
    console.log("  Email: john.smith@email.com");
    console.log("  Password: password123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await clearDatabase();
  await seedDatabase();
  mongoose.connection.close();
  console.log("\n✅ Database connection closed");
  process.exit(0);
};

runSeeder();
