import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        throw new Error("Date of birth cannot be in the future");
      }
      if (age > 120) {
        throw new Error("Please enter a valid date of birth");
      }
      if (age < 13) {
        throw new Error("You must be at least 13 years old to register");
      }
      return true;
    }),
  body("role")
    .isIn(["patient"])
    .withMessage("Only patient registration allowed"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const createDoctorValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .isIn([
      "Cardiology",
      "Dermatology",
      "Emergency Medicine",
      "Endocrinology",
      "Gastroenterology",
      "General Practice",
      "Gynecology",
      "Neurology",
      "Oncology",
      "Orthopedics",
      "Pediatrics",
      "Psychiatry",
      "Radiology",
      "Surgery",
      "Urology",
    ])
    .withMessage("Please select a valid specialization"),
  body("qualification")
    .trim()
    .notEmpty()
    .withMessage("Qualification is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Qualification must be between 2 and 100 characters"),
  body("experience")
    .isInt({ min: 0, max: 50 })
    .withMessage("Experience must be a number between 0 and 50 years"),
  body("consultationFee")
    .isFloat({ min: 0 })
    .withMessage("Consultation fee must be a positive number"),
];

export const createPatientValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        throw new Error("Date of birth cannot be in the future");
      }
      if (age > 120) {
        throw new Error("Please enter a valid date of birth");
      }
      return true;
    }),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Please select a valid gender"),
  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Please select a valid blood group"),
];

export const appointmentValidation = [
  body("doctorId").notEmpty().withMessage("Doctor ID is required"),
  body("appointmentDate").isISO8601().withMessage("Valid date is required"),
  body("reason").trim().notEmpty().withMessage("Reason is required"),
];
