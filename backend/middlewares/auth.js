import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. Please login.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Token is invalid.",
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // Check if user is deleted
      if (req.user.isDeleted) {
        return res.status(401).json({
          success: false,
          message: "Your account no longer exists.",
        });
      }

      // Attach user role to request for easy access
      req.userRole = req.user.role;
      req.userId = req.user._id;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again.",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again.",
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`,
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Check resource ownership (for patients and doctors accessing their own data)
export const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      const role = req.user.role;

      // Admin can access everything
      if (role === "admin") {
        return next();
      }

      // For doctors and patients, verify they're accessing their own resources
      if (resourceType === "profile") {
        // They can only access their own profile
        return next();
      }

      if (resourceType === "appointment") {
        // Will be checked in controller based on patientId or doctorId
        return next();
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking resource ownership",
      });
    }
  };
};

// Optional: Check if user can perform specific action
export const checkPermission = (action, resource) => {
  return (req, res, next) => {
    const role = req.user.role;

    // Define permissions matrix
    const permissions = {
      admin: {
        users: ["create", "read", "update", "delete"],
        appointments: ["create", "read", "update", "delete"],
        doctors: ["create", "read", "update", "delete"],
        patients: ["create", "read", "update", "delete"],
        payments: ["read", "update"],
        medicalRecords: ["read"],
      },
      doctor: {
        appointments: ["read", "update"],
        patients: ["read"],
        medicalRecords: ["create", "read", "update"],
        profile: ["read", "update"],
      },
      patient: {
        appointments: ["create", "read", "update"],
        doctors: ["read"],
        medicalRecords: ["read"],
        payments: ["read"],
        profile: ["read", "update"],
      },
    };

    // Check if role has permission
    const rolePermissions = permissions[role];
    if (!rolePermissions || !rolePermissions[resource]) {
      return res.status(403).json({
        success: false,
        message: `${role} does not have access to ${resource}`,
      });
    }

    if (!rolePermissions[resource].includes(action)) {
      return res.status(403).json({
        success: false,
        message: `${role} cannot ${action} ${resource}`,
      });
    }

    next();
  };
};
