import express from "express";
import {
  getPatientProfile,
  updatePatientProfile,
  getAllDoctors,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getMedicalRecords,
  getPaymentHistory,
} from "../controllers/patientController.js";
import { protect, authorize } from "../middlewares/auth.js";
import { appointmentValidation, validate } from "../middlewares/validator.js";

const router = express.Router();

router.use(protect);
router.use(authorize("patient"));

router.get("/profile", getPatientProfile);
router.put("/profile", updatePatientProfile);
router.get("/doctors", getAllDoctors);
router.post("/appointments", appointmentValidation, validate, bookAppointment);
router.get("/appointments", getMyAppointments);
router.patch("/appointments/:id/cancel", cancelAppointment);
router.get("/medical-records", getMedicalRecords);
router.get("/payments", getPaymentHistory);

export default router;
