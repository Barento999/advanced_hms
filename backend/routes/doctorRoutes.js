import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  changeDoctorPassword,
  getDoctorAppointments,
  updateAppointmentStatus,
  addMedicalRecord,
  getPatientsList,
  updateSchedule,
  getSchedule,
  getDoctorMedicalRecords,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("doctor"));

router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.put("/change-password", changeDoctorPassword);
router.get("/appointments", getDoctorAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.post("/medical-records", addMedicalRecord);
router.get("/medical-records", getDoctorMedicalRecords);
router.get("/patients", getPatientsList);
router.get("/schedule", getSchedule);
router.put("/schedule", updateSchedule);

export default router;
