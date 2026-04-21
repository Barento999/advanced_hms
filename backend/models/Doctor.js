import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    availableTimeSlots: [
      {
        startTime: String,
        endTime: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    totalPatients: {
      type: Number,
      default: 0,
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
