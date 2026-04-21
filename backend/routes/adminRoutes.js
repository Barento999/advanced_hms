import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllAppointments,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/appointments", getAllAppointments);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-status", toggleUserStatus);

export default router;
