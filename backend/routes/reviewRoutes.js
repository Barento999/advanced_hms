import express from "express";
import Review from "../models/Review.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

// Get reviews for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { page = 1, limit = 6, all } = req.query;

    // If 'all' parameter is provided, return all reviews for stats calculation
    if (all === "true") {
      const reviews = await Review.find({
        doctorId: req.params.doctorId,
        isDeleted: false,
      })
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "name" },
        })
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: reviews });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      doctorId: req.params.doctorId,
      isDeleted: false,
    })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      doctorId: req.params.doctorId,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: reviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all reviews (admin only)
router.get("/all", authorize("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isDeleted: false })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email" },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ isDeleted: false });

    res.json({
      success: true,
      data: reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a review (patients only)
router.post("/", authorize("patient"), async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    // Get patient
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    // Verify appointment exists and belongs to patient
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: patient._id,
      status: "completed",
      isDeleted: false,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or not completed. You can only review completed appointments.",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      appointmentId,
      isDeleted: false,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }

    // Create review
    const review = await Review.create({
      doctorId: appointment.doctorId,
      patientId: patient._id,
      appointmentId,
      rating,
      comment,
    });

    // Update doctor's average rating
    const allReviews = await Review.find({
      doctorId: appointment.doctorId,
      isDeleted: false,
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Doctor.findByIdAndUpdate(appointment.doctorId, {
      rating: avgRating.toFixed(1),
    });

    res.status(201).json({
      success: true,
      data: review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a review (patients only)
router.put("/:id", authorize("patient"), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      patientId: patient._id,
      isDeleted: false,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission to update it",
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update doctor's average rating
    const allReviews = await Review.find({
      doctorId: review.doctorId,
      isDeleted: false,
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Doctor.findByIdAndUpdate(review.doctorId, {
      rating: avgRating.toFixed(1),
    });

    res.json({
      success: true,
      data: review,
      message: "Review updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a review (patients only)
router.delete("/:id", authorize("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user._id,
      isDeleted: false,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      patientId: patient._id,
      isDeleted: false,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission to delete it",
      });
    }

    review.isDeleted = true;
    await review.save();

    // Update doctor's average rating
    const allReviews = await Review.find({
      doctorId: review.doctorId,
      isDeleted: false,
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await Doctor.findByIdAndUpdate(review.doctorId, {
      rating: avgRating.toFixed(1),
    });

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
