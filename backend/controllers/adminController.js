import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Review from "../models/Review.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalDoctors = await Doctor.countDocuments({ isDeleted: false });
    const totalPatients = await Patient.countDocuments({ isDeleted: false });
    const totalAppointments = await Appointment.countDocuments({
      isDeleted: false,
    });

    const revenue = await Payment.aggregate([
      { $match: { status: "completed", isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const recentAppointments = await Appointment.find({ isDeleted: false })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalRevenue: revenue[0]?.total || 0,
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { role, all } = req.query;

    const query = { isDeleted: false };
    if (role) {
      query.role = role;
    }

    let users;

    // If 'all' parameter is provided, return all users without pagination
    if (all === "true") {
      users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });

      // If role is doctor, populate with doctor profile information
      if (role === "doctor") {
        const userIds = users.map((user) => user._id);
        const doctors = await Doctor.find({
          userId: { $in: userIds },
          isDeleted: false,
        });

        // Merge user and doctor data
        users = users.map((user) => {
          const doctorProfile = doctors.find(
            (doc) => doc.userId.toString() === user._id.toString(),
          );
          return {
            ...user.toObject(),
            specialization: doctorProfile?.specialization || "N/A",
            experience: doctorProfile?.experience || "N/A",
            rating: doctorProfile?.rating || 0,
            consultationFee: doctorProfile?.consultationFee || 0,
          };
        });
      }

      return res.json({
        success: true,
        data: users,
      });
    }

    // Otherwise, return paginated results
    users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // If role is doctor, populate with doctor profile information
    if (role === "doctor") {
      const userIds = users.map((user) => user._id);
      const doctors = await Doctor.find({
        userId: { $in: userIds },
        isDeleted: false,
      });

      // Merge user and doctor data
      users = users.map((user) => {
        const doctorProfile = doctors.find(
          (doc) => doc.userId.toString() === user._id.toString(),
        );
        return {
          ...user.toObject(),
          specialization: doctorProfile?.specialization || "N/A",
          experience: doctorProfile?.experience || "N/A",
          rating: doctorProfile?.rating || 0,
          consultationFee: doctorProfile?.consultationFee || 0,
        };
      });
    }

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, all } = req.query;

    const query = { isDeleted: false };
    if (status) query.status = status;

    // If 'all' parameter is provided, return all appointments without pagination
    if (all === "true") {
      const appointments = await Appointment.find(query)
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "name email phone isActive" },
        })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email phone isActive" },
        })
        .sort({ appointmentDate: -1 });

      return res.json({
        success: true,
        data: appointments,
      });
    }

    // Otherwise, return paginated results
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email phone isActive" },
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone isActive" },
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analytics endpoints
export const getAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query; // month, quarter, year

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Appointment trends
    const appointmentTrends = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Revenue trends
    const revenueTrends = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "completed",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Doctor specialization distribution
    const specializationStats = await Doctor.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          avgFee: { $avg: "$consultationFee" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Appointment status distribution
    const appointmentStatusStats = await Appointment.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performing doctors
    const topDoctors = await Doctor.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "doctorId",
          as: "appointments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ["$user.name", 0] },
          specialization: 1,
          rating: 1,
          appointmentCount: { $size: "$appointments" },
          completedAppointments: {
            $size: {
              $filter: {
                input: "$appointments",
                cond: { $eq: ["$$this.status", "completed"] },
              },
            },
          },
        },
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 10 },
    ]);

    // Monthly revenue comparison (current vs previous period)
    const currentPeriodRevenue = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "completed",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const previousPeriodStart = new Date(
      startDate.getTime() - (now.getTime() - startDate.getTime()),
    );
    const previousPeriodRevenue = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: previousPeriodStart, $lt: startDate },
          status: "completed",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        userTrends,
        appointmentTrends,
        revenueTrends,
        specializationStats,
        appointmentStatusStats,
        topDoctors,
        revenueComparison: {
          current: currentPeriodRevenue[0] || { total: 0, count: 0 },
          previous: previousPeriodRevenue[0] || { total: 0, count: 0 },
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDetailedReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let reportData = {};

    switch (type) {
      case "users":
        reportData = await User.aggregate([
          { $match: { ...dateFilter, isDeleted: false } },
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
              active: { $sum: { $cond: ["$isActive", 1, 0] } },
              inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
            },
          },
        ]);
        break;

      case "appointments":
        reportData = await Appointment.aggregate([
          { $match: { ...dateFilter, isDeleted: false } },
          {
            $group: {
              _id: {
                status: "$status",
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);
        break;

      case "revenue":
        reportData = await Payment.aggregate([
          {
            $match: {
              ...dateFilter,
              status: "completed",
              isDeleted: false,
            },
          },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              totalRevenue: { $sum: "$amount" },
              transactionCount: { $sum: 1 },
              avgTransaction: { $avg: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);
        break;

      case "doctors":
        reportData = await Doctor.aggregate([
          { $match: { isDeleted: false } },
          {
            $lookup: {
              from: "appointments",
              let: { doctorId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$doctorId", "$$doctorId"] },
                    ...dateFilter,
                    isDeleted: false,
                  },
                },
              ],
              as: "appointments",
            },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "doctorId",
              as: "reviews",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $project: {
              name: { $arrayElemAt: ["$user.name", 0] },
              specialization: 1,
              experience: 1,
              consultationFee: 1,
              rating: 1,
              totalAppointments: { $size: "$appointments" },
              completedAppointments: {
                $size: {
                  $filter: {
                    input: "$appointments",
                    cond: { $eq: ["$$this.status", "completed"] },
                  },
                },
              },
              totalReviews: { $size: "$reviews" },
              avgReviewRating: { $avg: "$reviews.rating" },
            },
          },
          { $sort: { totalAppointments: -1 } },
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid report type. Use: users, appointments, revenue, or doctors",
        });
    }

    res.json({
      success: true,
      data: {
        type,
        dateRange: { startDate, endDate },
        report: reportData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
