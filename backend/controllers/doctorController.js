import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
      "userId",
      "-password",
    );
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
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { doctorId: doctor._id, isDeleted: false };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate({
        path: "patientId",
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

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
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

export const addMedicalRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
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
    const doctor = await Doctor.findOne({ userId: req.user._id });

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      isDeleted: false,
    }).distinct("patientId");

    const patients = await Patient.find({
      _id: { $in: appointments },
      isDeleted: false,
    }).populate("userId", "name email phone");

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
