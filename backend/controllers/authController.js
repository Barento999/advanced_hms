import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, drugAllergies } =
      req.body;

    const userExists = await User.findOne({ email, isDeleted: false });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    // Create patient profile with initial registration data
    if (role === "patient") {
      const allergiesArray = drugAllergies
        ? drugAllergies
            .split(",")
            .map((allergy) => allergy.trim())
            .filter(Boolean)
        : [];

      await Patient.create({
        userId: user._id,
        dateOfBirth: dateOfBirth || undefined,
        allergies: allergiesArray,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        isActive: user.isActive,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false }).select(
      "+password",
    );

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive || user.isDeleted) {
      return res
        .status(401)
        .json({ success: false, message: "Account is inactive" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        isActive: user.isActive,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update user fields
    user.name = name.trim();
    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password is correct
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get landing page statistics
// @route   GET /api/auth/landing-stats
// @access  Public
export const getLandingStats = async (req, res) => {
  try {
    // Get counts from database
    const [doctorCount, patientCount, appointmentCount, reviewCount] =
      await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        (async () => {
          const Appointment = (await import("../models/Appointment.js"))
            .default;
          return Appointment.countDocuments({ status: "completed" });
        })(),
        (async () => {
          const Review = (await import("../models/Review.js")).default;
          return Review.countDocuments();
        })(),
      ]);

    // Get specialization counts
    const specializationCounts = await Doctor.aggregate([
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get top-rated reviews for testimonials
    const Review = (await import("../models/Review.js")).default;
    const topReviews = await Review.find({
      rating: { $gte: 4 },
      isDeleted: false,
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .populate("patientId")
      .populate("doctorId");

    // Format testimonials with proper data
    const testimonialsPromises = topReviews.map(async (review) => {
      if (!review.patientId || !review.doctorId) return null;

      const patient = await User.findById(review.patientId.userId);
      const doctor = await User.findById(review.doctorId.userId);

      if (!patient || !doctor) return null;

      return {
        name: patient.name,
        role: "Patient",
        rating: review.rating,
        text: review.comment,
        doctorName: doctor.name,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          patient.name,
        )}&background=random`,
      };
    });

    const testimonialsResults = await Promise.all(testimonialsPromises);
    const testimonials = testimonialsResults
      .filter((t) => t !== null)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        stats: {
          doctors: doctorCount,
          patients: patientCount,
          appointments: appointmentCount,
          reviews: reviewCount,
        },
        specializations: specializationCounts.map((spec) => ({
          name: spec._id,
          count: spec.count,
        })),
        testimonials,
      },
    });
  } catch (error) {
    console.error("Error fetching landing stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching landing page statistics",
    });
  }
};
