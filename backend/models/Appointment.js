import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      startTime: String,
      endTime: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
      required: true,
    },
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

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
