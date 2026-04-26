import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Payment from "../models/Payment.js";
import { sendNotification } from "../utils/sendNotification.js";

export const getPatientProfile = async (req, res) => {
  try {
    // Ensure user can only access their own profile
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    }).populate("userId", "-password");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    // Define fields that patients are allowed to modify
    const allowedFields = ["address", "emergencyContact"];

    // Filter the request body to only include allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // If no allowed fields are provided, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid fields provided for update. Patients can only modify address and emergency contact information.",
      });
    }

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user._id, isDeleted: false },
      updateData,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    res.json({
      success: true,
      data: patient,
      message:
        "Profile updated successfully. Note: Critical medical information can only be modified by healthcare staff.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completePatientProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      currentMedications,
      medicalHistory,
    } = req.body;

    // Check if patient profile already exists
    let patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (patient) {
      // Update existing profile
      patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
      patient.gender = gender || patient.gender;
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      patient.address = address || patient.address;
      patient.emergencyContact = emergencyContact || patient.emergencyContact;
      patient.allergies = allergies || patient.allergies;

      // Add medical history if provided
      if (medicalHistory) {
        patient.medicalHistory.push({
          condition: "Initial Registration",
          notes: medicalHistory,
          diagnosedDate: new Date(),
        });
      }

      // Add current medications to medical history if provided
      if (currentMedications) {
        patient.medicalHistory.push({
          condition: "Current Medications (Self-Reported)",
          notes: `Patient-reported current medications: ${currentMedications}`,
          diagnosedDate: new Date(),
        });
      }

      await patient.save();
    } else {
      // Create new patient profile
      const medicalHistoryArray = [];
      if (medicalHistory) {
        medicalHistoryArray.push({
          condition: "Initial Registration",
          notes: medicalHistory,
          diagnosedDate: new Date(),
        });
      }

      // Add current medications to medical history if provided
      if (currentMedications) {
        medicalHistoryArray.push({
          condition: "Current Medications (Self-Reported)",
          notes: `Patient-reported current medications: ${currentMedications}`,
          diagnosedDate: new Date(),
        });
      }

      patient = new Patient({
        userId: req.user._id,
        dateOfBirth,
        gender,
        bloodGroup,
        address,
        emergencyContact,
        allergies: allergies || [],
        medicalHistory: medicalHistoryArray,
      });

      await patient.save();
    }

    const populatedPatient = await Patient.findById(patient._id).populate(
      "userId",
      "-password",
    );

    res.status(201).json({
      success: true,
      data: populatedPatient,
      message: "Medical profile completed successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (specialization) query.specialization = specialization;

    // Add search functionality
    if (search) {
      query.$or = [
        { specialization: { $regex: search, $options: "i" } },
        { "userId.name": { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate("userId", "name email phone isActive avatar")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const { doctorId, appointmentDate, timeSlot } = req.body;

    // Get doctor's schedule
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Validate day of week
    const appointmentDay = new Date(appointmentDate).toLocaleDateString(
      "en-US",
      { weekday: "long" },
    );
    if (!doctor.availableDays.includes(appointmentDay)) {
      return res.status(400).json({
        success: false,
        message: `Doctor is not available on ${appointmentDay}. Available days: ${doctor.availableDays.join(", ")}`,
      });
    }

    // Validate time slot
    const isTimeSlotValid = doctor.availableTimeSlots.some((slot) => {
      const requestedStart = timeSlot.startTime;
      const requestedEnd = timeSlot.endTime;
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;

      // Check if requested time is within any available slot
      return requestedStart >= slotStart && requestedEnd <= slotEnd;
    });

    if (!isTimeSlotValid) {
      return res.status(400).json({
        success: false,
        message: `Selected time slot is not available. Doctor's available time slots: ${doctor.availableTimeSlots.map((s) => `${s.startTime}-${s.endTime}`).join(", ")}`,
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      status: { $in: ["pending", "confirmed"] },
      isDeleted: false,
      $or: [
        {
          "timeSlot.startTime": { $lt: timeSlot.endTime },
          "timeSlot.endTime": { $gt: timeSlot.startTime },
        },
      ],
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "This time slot is already booked. Please choose a different time.",
      });
    }

    const appointment = await Appointment.create({
      ...req.body,
      patientId: patient._id,
    });

    console.log("Appointment created:", appointment._id);

    // Get io instance
    const io = req.app.get("io");
    console.log("IO instance:", io ? "Found" : "Not found");

    // Send notification to doctor (reuse doctor variable from above)
    const doctorWithUser = await Doctor.findById(req.body.doctorId).populate(
      "userId",
    );

    console.log("Doctor found:", doctorWithUser ? "Yes" : "No");
    console.log("Doctor userId:", doctorWithUser?.userId?._id);

    if (doctorWithUser && doctorWithUser.userId) {
      console.log("Sending notification to doctor:", doctorWithUser.userId._id);
      await sendNotification(io, doctorWithUser.userId._id, {
        title: "New Appointment Request",
        message: `New appointment request from ${req.user.name}`,
        type: "appointment",
      });
      console.log("Notification sent successfully");
    }

    res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const { status, page = 1, limit = 10, all } = req.query;

    const query = { patientId: patient._id, isDeleted: false };
    if (status) query.status = status;

    // If 'all' parameter is provided, return all appointments without pagination
    if (all === "true") {
      const appointments = await Appointment.find(query)
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email phone isActive" },
        })
        .sort({ appointmentDate: -1 });

      return res.json({
        success: true,
        data: appointments,
      });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone isActive" },
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    // Find appointment and verify ownership
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: patient._id,
      isDeleted: false,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you do not have permission to cancel it",
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed appointment",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    // Update appointment status
    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      data: appointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMedicalRecords = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const { page = 1, limit = 5, all } = req.query;

    // If 'all' parameter is provided, return all records without pagination
    if (all === "true") {
      const records = await MedicalRecord.find({
        patientId: patient._id,
        isDeleted: false,
      })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email phone" },
          select: "specialization experience rating",
        })
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "name email phone" },
          select: "gender bloodGroup dateOfBirth",
        })
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: records });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const records = await MedicalRecord.find({
      patientId: patient._id,
      isDeleted: false,
    })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone" },
        select: "specialization experience rating",
      })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email phone" },
        select: "gender bloodGroup dateOfBirth",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await MedicalRecord.countDocuments({
      patientId: patient._id,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: records,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const { page = 1, limit = 10, all } = req.query;

    // If 'all' parameter is provided, return all payments for stats calculation
    if (all === "true") {
      const payments = await Payment.find({
        patientId: patient._id,
        isDeleted: false,
      })
        .populate("appointmentId")
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: payments });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const payments = await Payment.find({
      patientId: patient._id,
      isDeleted: false,
    })
      .populate("appointmentId")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({
      patientId: patient._id,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: payments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user with password field
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password is correct
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
