import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["patient"])
    .withMessage("Only patient registration allowed"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const appointmentValidation = [
  body("doctorId").notEmpty().withMessage("Doctor ID is required"),
  body("appointmentDate").isISO8601().withMessage("Valid date is required"),
  body("reason").trim().notEmpty().withMessage("Reason is required"),
];
