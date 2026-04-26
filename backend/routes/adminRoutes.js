import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllAppointments,
  getAnalytics,
  getDetailedReports,
  getDataCounts,
  createDoctor,
  createPatient,
  updateDoctorProfile,
  getDoctorProfile,
  updatePatientProfile,
  getPatientProfile,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  validate,
  createDoctorValidation,
  createPatientValidation,
} from "../middlewares/validator.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/appointments", getAllAppointments);
router.get("/analytics", getAnalytics);
router.get("/reports", getDetailedReports);
router.get("/data-counts", getDataCounts);
router.post("/create-doctor", createDoctorValidation, validate, createDoctor);
router.post(
  "/create-patient",
  createPatientValidation,
  validate,
  createPatient,
);
router.get("/doctors/:doctorId", getDoctorProfile);
router.put("/doctors/:doctorId", updateDoctorProfile);
router.get("/patients/:patientId", getPatientProfile);
router.put("/patients/:patientId", updatePatientProfile);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-status", toggleUserStatus);

export default router;
