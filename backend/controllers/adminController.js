import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";

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
