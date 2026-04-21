import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Payment from "../models/Payment.js";

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).populate(
      "userId",
      "-password",
    );
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
    const patient = await Patient.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (specialization) query.specialization = specialization;

    const doctors = await Doctor.find(query)
      .populate("userId", "name email phone avatar")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    const appointment = await Appointment.create({
      ...req.body,
      patientId: patient._id,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { patientId: patient._id, isDeleted: false };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone" },
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMedicalRecords = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    const records = await MedicalRecord.find({
      patientId: patient._id,
      isDeleted: false,
    })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    const payments = await Payment.find({
      patientId: patient._id,
      isDeleted: false,
    })
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
