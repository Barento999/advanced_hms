import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
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

export default router;
