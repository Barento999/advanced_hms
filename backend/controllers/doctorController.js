import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";
import { sendNotification } from "../utils/sendNotification.js";

export const getDoctorProfile = async (req, res) => {
  try {
    // Ensure doctor can only access their own profile
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    }).populate("userId", "-password");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    const { status, page = 1, limit = 10, all } = req.query;

    const query = { doctorId: doctor._id, isDeleted: false };
    if (status) query.status = status;

    // If 'all' parameter is provided, return all appointments without pagination
    if (all === "true") {
      const appointments = await Appointment.find(query)
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "name email phone isActive" },
        })
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
        path: "patientId",
        populate: { path: "userId", select: "name email phone isActive" },
      })
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

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: pending, confirmed, completed, cancelled",
      });
    }

    // Find appointment and verify it belongs to this doctor
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: doctor._id,
      isDeleted: false,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you do not have permission to update it",
      });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    // Get io instance and send notification to patient
    const io = req.app.get("io");
    const patient = await Patient.findById(appointment.patientId).populate(
      "userId",
    );

    if (patient && patient.userId) {
      const statusMessages = {
        confirmed: "Your appointment has been confirmed",
        completed: "Your appointment has been completed",
        cancelled: "Your appointment has been cancelled",
      };

      await sendNotification(io, patient.userId._id, {
        title: "Appointment Status Updated",
        message:
          statusMessages[status] || "Your appointment status has changed",
        type: "appointment",
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMedicalRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    const medicalRecord = await MedicalRecord.create({
      ...req.body,
      doctorId: doctor._id,
    });

    res.status(201).json({ success: true, data: medicalRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientsList = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    const { page = 1, limit = 9, all } = req.query;

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      isDeleted: false,
    }).distinct("patientId");

    // If 'all' parameter is provided, return all patients without pagination
    if (all === "true") {
      const patients = await Patient.find({
        _id: { $in: appointments },
        isDeleted: false,
      })
        .populate("userId", "name email phone isActive")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: patients,
      });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const patients = await Patient.find({
      _id: { $in: appointments },
      isDeleted: false,
    })
      .populate("userId", "name email phone isActive")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments({
      _id: { $in: appointments },
      isDeleted: false,
    });

    res.json({
      success: true,
      data: patients,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { availableDays, availableTimeSlots } = req.body;

    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    // Update schedule
    if (availableDays) doctor.availableDays = availableDays;
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;

    await doctor.save();

    res.json({
      success: true,
      data: doctor,
      message: "Schedule updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    }).select("availableDays availableTimeSlots");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorMedicalRecords = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    const { page = 1, limit = 5, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { doctorId: doctor._id, isDeleted: false };
    let aggregationPipeline = [];

    if (search) {
      // Use aggregation pipeline for searching across populated fields
      aggregationPipeline = [
        { $match: query },
        {
          $lookup: {
            from: "patients",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "patient.userId",
            foreignField: "_id",
            as: "patientUser",
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "doctor.userId",
            foreignField: "_id",
            as: "doctorUser",
          },
        },
        {
          $match: {
            $or: [
              { diagnosis: { $regex: search, $options: "i" } },
              { notes: { $regex: search, $options: "i" } },
              { "patientUser.name": { $regex: search, $options: "i" } },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ];

      const records = await MedicalRecord.aggregate(aggregationPipeline);

      // Get total count for pagination
      const countPipeline = aggregationPipeline.slice(0, -2); // Remove skip and limit
      const totalResult = await MedicalRecord.aggregate([
        ...countPipeline,
        { $count: "total" },
      ]);
      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      // Populate the aggregated results manually
      const populatedRecords = await MedicalRecord.populate(records, [
        {
          path: "patientId",
          populate: { path: "userId", select: "name email phone" },
          select: "gender bloodGroup dateOfBirth",
        },
        {
          path: "doctorId",
          populate: { path: "userId", select: "name email phone" },
          select: "specialization experience rating",
        },
      ]);

      return res.json({
        success: true,
        data: populatedRecords,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      });
    }

    // Regular query without search
    const records = await MedicalRecord.find(query)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email phone" },
        select: "gender bloodGroup dateOfBirth",
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone" },
        select: "specialization experience rating",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await MedicalRecord.countDocuments(query);

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
