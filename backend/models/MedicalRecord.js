import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: [String],
    prescription: [
      {
        medicine: String,
        dosage: String,
        duration: String,
        instructions: String,
      },
    ],
    labTests: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    attachments: [String],
    notes: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

export default MedicalRecord;
