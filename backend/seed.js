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
      // Additional doctors for pagination testing
      {
        name: "Dr. David Kim",
        email: "david.kim@healthcare.com",
        password: password,
        role: "doctor",
        phone: "7890123456",
        isActive: true,
      },
      {
        name: "Dr. Rachel Green",
        email: "rachel.green@healthcare.com",
        password: password,
        role: "doctor",
        phone: "8901234567",
        isActive: true,
      },
      {
        name: "Dr. Mark Thompson",
        email: "mark.thompson@healthcare.com",
        password: password,
        role: "doctor",
        phone: "9012345678",
        isActive: true,
      },
      {
        name: "Dr. Jennifer Lee",
        email: "jennifer.lee@healthcare.com",
        password: password,
        role: "doctor",
        phone: "0123456789",
        isActive: true,
      },
      {
        name: "Dr. Christopher Davis",
        email: "christopher.davis@healthcare.com",
        password: password,
        role: "doctor",
        phone: "1234567890",
        isActive: true,
      },
      {
        name: "Dr. Amanda Miller",
        email: "amanda.miller@healthcare.com",
        password: password,
        role: "doctor",
        phone: "2345678901",
        isActive: true,
      },
      {
        name: "Dr. Kevin Brown",
        email: "kevin.brown@healthcare.com",
        password: password,
        role: "doctor",
        phone: "3456789012",
        isActive: true,
      },
      {
        name: "Dr. Michelle Garcia",
        email: "michelle.garcia@healthcare.com",
        password: password,
        role: "doctor",
        phone: "4567890123",
        isActive: true,
      },
    ];

    const doctorUsers = [];
    for (const doc of doctorData) {
      const user = await User.create(doc);
      doctorUsers.push(user);
    }
    console.log(`✅ ${doctorUsers.length} Doctor users created`);

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
      // Additional doctors for pagination testing
      {
        userId: doctorUsers[5]._id,
        specialization: "Neurology",
        qualification: "MBBS, MD (Neurology)",
        experience: 14,
        consultationFee: 200,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.8,
        totalPatients: 280,
      },
      {
        userId: doctorUsers[6]._id,
        specialization: "Psychiatry",
        qualification: "MBBS, MD (Psychiatry)",
        experience: 11,
        consultationFee: 160,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableTimeSlots: [
          { startTime: "10:00", endTime: "13:00" },
          { startTime: "15:00", endTime: "18:00" },
        ],
        rating: 4.7,
        totalPatients: 220,
      },
      {
        userId: doctorUsers[7]._id,
        specialization: "Oncology",
        qualification: "MBBS, MD (Oncology)",
        experience: 16,
        consultationFee: 250,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        availableTimeSlots: [
          { startTime: "08:00", endTime: "11:00" },
          { startTime: "13:00", endTime: "16:00" },
        ],
        rating: 4.9,
        totalPatients: 150,
      },
      {
        userId: doctorUsers[8]._id,
        specialization: "Gynecology",
        qualification: "MBBS, MD (Gynecology)",
        experience: 13,
        consultationFee: 140,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.8,
        totalPatients: 300,
      },
      {
        userId: doctorUsers[9]._id,
        specialization: "Ophthalmology",
        qualification: "MBBS, MS (Ophthalmology)",
        experience: 9,
        consultationFee: 110,
        availableDays: ["Tuesday", "Thursday", "Friday"],
        availableTimeSlots: [
          { startTime: "10:00", endTime: "13:00" },
          { startTime: "15:00", endTime: "18:00" },
        ],
        rating: 4.6,
        totalPatients: 190,
      },
      {
        userId: doctorUsers[10]._id,
        specialization: "ENT",
        qualification: "MBBS, MS (ENT)",
        experience: 7,
        consultationFee: 90,
        availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.5,
        totalPatients: 160,
      },
      {
        userId: doctorUsers[11]._id,
        specialization: "Radiology",
        qualification: "MBBS, MD (Radiology)",
        experience: 12,
        consultationFee: 130,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableTimeSlots: [
          { startTime: "08:00", endTime: "11:00" },
          { startTime: "13:00", endTime: "16:00" },
        ],
        rating: 4.7,
        totalPatients: 240,
      },
      {
        userId: doctorUsers[12]._id,
        specialization: "Anesthesiology",
        qualification: "MBBS, MD (Anesthesiology)",
        experience: 10,
        consultationFee: 120,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableTimeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
        ],
        rating: 4.6,
        totalPatients: 180,
      },
    ]);
    console.log("✅ 13 Doctors created");

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
      // Additional patients for pagination testing
      {
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        password: password,
        role: "patient",
        phone: "5678909876",
        isActive: true,
      },
      {
        name: "Isabella Moore",
        email: "isabella.moore@email.com",
        password: password,
        role: "patient",
        phone: "6789009876",
        isActive: true,
      },
      {
        name: "Liam Taylor",
        email: "liam.taylor@email.com",
        password: password,
        role: "patient",
        phone: "7890109876",
        isActive: true,
      },
      {
        name: "Mia Anderson",
        email: "mia.anderson@email.com",
        password: password,
        role: "patient",
        phone: "8901209876",
        isActive: true,
      },
      {
        name: "Ethan Thomas",
        email: "ethan.thomas@email.com",
        password: password,
        role: "patient",
        phone: "9012309876",
        isActive: true,
      },
      {
        name: "Charlotte Jackson",
        email: "charlotte.jackson@email.com",
        password: password,
        role: "patient",
        phone: "0123409876",
        isActive: true,
      },
      {
        name: "Alexander White",
        email: "alexander.white@email.com",
        password: password,
        role: "patient",
        phone: "1234509877",
        isActive: true,
      },
      {
        name: "Amelia Harris",
        email: "amelia.harris@email.com",
        password: password,
        role: "patient",
        phone: "2345609877",
        isActive: true,
      },
      {
        name: "Benjamin Martin",
        email: "benjamin.martin@email.com",
        password: password,
        role: "patient",
        phone: "3456709877",
        isActive: true,
      },
      {
        name: "Harper Thompson",
        email: "harper.thompson@email.com",
        password: password,
        role: "patient",
        phone: "4567809877",
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
      // Additional patients for pagination testing
      {
        userId: patientUsers[8]._id,
        dateOfBirth: new Date("1987-08-12"),
        gender: "male",
        bloodGroup: "A+",
        address: {
          street: "369 Oak Street",
          city: "Dallas",
          state: "TX",
          zipCode: "75201",
        },
        emergencyContact: {
          name: "Sarah Wilson",
          phone: "1098765432",
          relation: "Wife",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[9]._id,
        dateOfBirth: new Date("1993-01-30"),
        gender: "female",
        bloodGroup: "B+",
        address: {
          street: "741 Pine Avenue",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
        },
        emergencyContact: {
          name: "John Moore",
          phone: "0987654321",
          relation: "Father",
        },
        allergies: ["Codeine"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[10]._id,
        dateOfBirth: new Date("1980-05-17"),
        gender: "male",
        bloodGroup: "O+",
        address: {
          street: "852 Elm Drive",
          city: "Jacksonville",
          state: "FL",
          zipCode: "32201",
        },
        emergencyContact: {
          name: "Lisa Taylor",
          phone: "9876543210",
          relation: "Sister",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[11]._id,
        dateOfBirth: new Date("1991-11-08"),
        gender: "female",
        bloodGroup: "AB+",
        address: {
          street: "963 Maple Court",
          city: "Columbus",
          state: "OH",
          zipCode: "43201",
        },
        emergencyContact: {
          name: "Mark Anderson",
          phone: "8765432109",
          relation: "Husband",
        },
        allergies: ["Morphine"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[12]._id,
        dateOfBirth: new Date("1984-03-22"),
        gender: "male",
        bloodGroup: "A-",
        address: {
          street: "159 Cedar Street",
          city: "Charlotte",
          state: "NC",
          zipCode: "28201",
        },
        emergencyContact: {
          name: "Jennifer Thomas",
          phone: "7654321098",
          relation: "Wife",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[13]._id,
        dateOfBirth: new Date("1989-07-14"),
        gender: "female",
        bloodGroup: "O-",
        address: {
          street: "357 Birch Lane",
          city: "San Francisco",
          state: "CA",
          zipCode: "94101",
        },
        emergencyContact: {
          name: "Chris Jackson",
          phone: "6543210987",
          relation: "Brother",
        },
        allergies: ["Penicillin"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[14]._id,
        dateOfBirth: new Date("1986-12-03"),
        gender: "male",
        bloodGroup: "B-",
        address: {
          street: "468 Willow Street",
          city: "Indianapolis",
          state: "IN",
          zipCode: "46201",
        },
        emergencyContact: {
          name: "Amanda White",
          phone: "5432109876",
          relation: "Sister",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[15]._id,
        dateOfBirth: new Date("1994-09-26"),
        gender: "female",
        bloodGroup: "AB-",
        address: {
          street: "579 Oak Lane",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
        },
        emergencyContact: {
          name: "Kevin Harris",
          phone: "4321098765",
          relation: "Boyfriend",
        },
        allergies: ["Latex"],
        medicalHistory: [],
      },
      {
        userId: patientUsers[16]._id,
        dateOfBirth: new Date("1981-06-11"),
        gender: "male",
        bloodGroup: "A+",
        address: {
          street: "680 Pine Court",
          city: "Denver",
          state: "CO",
          zipCode: "80201",
        },
        emergencyContact: {
          name: "Michelle Martin",
          phone: "3210987654",
          relation: "Wife",
        },
        allergies: [],
        medicalHistory: [],
      },
      {
        userId: patientUsers[17]._id,
        dateOfBirth: new Date("1996-02-18"),
        gender: "female",
        bloodGroup: "B+",
        address: {
          street: "791 Elm Court",
          city: "Boston",
          state: "MA",
          zipCode: "02101",
        },
        emergencyContact: {
          name: "Daniel Thompson",
          phone: "2109876543",
          relation: "Father",
        },
        allergies: ["Aspirin"],
        medicalHistory: [],
      },
    ]);
    console.log("✅ 18 Patients created");

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
      // Additional appointments for pagination testing
      {
        patientId: patients[2]._id,
        doctorId: doctors[0]._id,
        appointmentDate: new Date("2024-05-01T09:00:00"),
        timeSlot: { startTime: "09:00", endTime: "09:30" },
        status: "confirmed",
        reason: "Heart checkup follow-up",
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[1]._id,
        appointmentDate: new Date("2024-05-02T10:00:00"),
        timeSlot: { startTime: "10:00", endTime: "10:30" },
        status: "pending",
        reason: "Child vaccination",
      },
      {
        patientId: patients[4]._id,
        doctorId: doctors[2]._id,
        appointmentDate: new Date("2024-05-03T11:00:00"),
        timeSlot: { startTime: "11:00", endTime: "11:30" },
        status: "completed",
        reason: "Skin rash treatment",
      },
      {
        patientId: patients[5]._id,
        doctorId: doctors[3]._id,
        appointmentDate: new Date("2024-05-04T14:00:00"),
        timeSlot: { startTime: "14:00", endTime: "14:30" },
        status: "confirmed",
        reason: "Joint pain consultation",
      },
      {
        patientId: patients[6]._id,
        doctorId: doctors[4]._id,
        appointmentDate: new Date("2024-05-05T15:00:00"),
        timeSlot: { startTime: "15:00", endTime: "15:30" },
        status: "pending",
        reason: "General health checkup",
      },
      {
        patientId: patients[7]._id,
        doctorId: doctors[0]._id,
        appointmentDate: new Date("2024-05-06T16:00:00"),
        timeSlot: { startTime: "16:00", endTime: "16:30" },
        status: "completed",
        reason: "Cardiac consultation",
      },
      {
        patientId: patients[8]._id,
        doctorId: doctors[1]._id,
        appointmentDate: new Date("2024-05-07T09:30:00"),
        timeSlot: { startTime: "09:30", endTime: "10:00" },
        status: "confirmed",
        reason: "Pediatric checkup",
      },
      {
        patientId: patients[9]._id,
        doctorId: doctors[2]._id,
        appointmentDate: new Date("2024-05-08T10:30:00"),
        timeSlot: { startTime: "10:30", endTime: "11:00" },
        status: "pending",
        reason: "Dermatology consultation",
      },
      {
        patientId: patients[10]._id,
        doctorId: doctors[3]._id,
        appointmentDate: new Date("2024-05-09T13:30:00"),
        timeSlot: { startTime: "13:30", endTime: "14:00" },
        status: "completed",
        reason: "Orthopedic follow-up",
      },
      {
        patientId: patients[11]._id,
        doctorId: doctors[4]._id,
        appointmentDate: new Date("2024-05-10T14:30:00"),
        timeSlot: { startTime: "14:30", endTime: "15:00" },
        status: "cancelled",
        reason: "General medicine consultation",
      },
      {
        patientId: patients[12]._id,
        doctorId: doctors[0]._id,
        appointmentDate: new Date("2024-05-11T08:00:00"),
        timeSlot: { startTime: "08:00", endTime: "08:30" },
        status: "confirmed",
        reason: "Heart rhythm check",
      },
      {
        patientId: patients[13]._id,
        doctorId: doctors[1]._id,
        appointmentDate: new Date("2024-05-12T11:30:00"),
        timeSlot: { startTime: "11:30", endTime: "12:00" },
        status: "pending",
        reason: "Child development assessment",
      },
      {
        patientId: patients[14]._id,
        doctorId: doctors[2]._id,
        appointmentDate: new Date("2024-05-13T12:00:00"),
        timeSlot: { startTime: "12:00", endTime: "12:30" },
        status: "completed",
        reason: "Acne treatment",
      },
      {
        patientId: patients[15]._id,
        doctorId: doctors[3]._id,
        appointmentDate: new Date("2024-05-14T15:30:00"),
        timeSlot: { startTime: "15:30", endTime: "16:00" },
        status: "confirmed",
        reason: "Knee pain evaluation",
      },
      {
        patientId: patients[16]._id,
        doctorId: doctors[4]._id,
        appointmentDate: new Date("2024-05-15T16:30:00"),
        timeSlot: { startTime: "16:30", endTime: "17:00" },
        status: "pending",
        reason: "Routine physical exam",
      },
    ]);
    console.log("✅ 25 Appointments created");

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
