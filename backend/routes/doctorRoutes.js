import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  addMedicalRecord,
  getPatientsList,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("doctor"));

router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.get("/appointments", getDoctorAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.post("/medical-records", addMedicalRecord);
router.get("/patients", getPatientsList);

export default router;
