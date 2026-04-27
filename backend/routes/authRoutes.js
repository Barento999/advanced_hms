import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getLandingStats,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../middlewares/validator.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.get("/landing-stats", getLandingStats); // Public endpoint

export default router;
