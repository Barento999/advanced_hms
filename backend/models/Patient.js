import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String,
      },
    ],
    allergies: [String],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Method to check if profile is complete
patientSchema.methods.isProfileComplete = function () {
  return !!(
    this.dateOfBirth &&
    this.gender &&
    this.bloodGroup &&
    this.address?.street &&
    this.address?.city &&
    this.address?.state &&
    this.address?.zipCode &&
    this.emergencyContact?.name &&
    this.emergencyContact?.phone &&
    this.emergencyContact?.relation &&
    this.profileCompleted
  );
};

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
