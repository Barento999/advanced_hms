import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";
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
            doctorId: doctorProfile?._id || null, // Add the Doctor document ID
            specialization: doctorProfile?.specialization || "N/A",
            experience: doctorProfile?.experience || "N/A",
            rating: doctorProfile?.rating || 0,
            consultationFee: doctorProfile?.consultationFee || 0,
          };
        });
      }

      // If role is patient, populate with patient profile information
      if (role === "patient") {
        const userIds = users.map((user) => user._id);
        const patients = await Patient.find({
          userId: { $in: userIds },
          isDeleted: false,
        });

        // Merge user and patient data
        users = users.map((user) => {
          const patientProfile = patients.find(
            (pat) => pat.userId.toString() === user._id.toString(),
          );
          return {
            ...user.toObject(),
            patientId: patientProfile?._id || null, // Add the Patient document ID
            dateOfBirth: patientProfile?.dateOfBirth || null,
            gender: patientProfile?.gender || "N/A",
            bloodGroup: patientProfile?.bloodGroup || "N/A",
            address: patientProfile?.address || null,
            emergencyContact: patientProfile?.emergencyContact || null,
            allergies: patientProfile?.allergies || [],
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

    // If role is patient, populate with patient profile information
    if (role === "patient") {
      const userIds = users.map((user) => user._id);
      const patients = await Patient.find({
        userId: { $in: userIds },
        isDeleted: false,
      });

      // Merge user and patient data
      users = users.map((user) => {
        const patientProfile = patients.find(
          (pat) => pat.userId.toString() === user._id.toString(),
        );
        return {
          ...user.toObject(),
          patientId: patientProfile?._id || null, // Add the Patient document ID
          dateOfBirth: patientProfile?.dateOfBirth || null,
          gender: patientProfile?.gender || "N/A",
          bloodGroup: patientProfile?.bloodGroup || "N/A",
          address: patientProfile?.address || null,
          emergencyContact: patientProfile?.emergencyContact || null,
          allergies: patientProfile?.allergies || [],
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
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // User registration trends
    const userTrends = await User.aggregate([
      { $match: { isDeleted: false, ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Revenue trends
    const revenueTrends = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          isDeleted: false,
          ...(startDate && endDate
            ? {
                createdAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate + "T23:59:59.999Z"),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Appointment status distribution
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          isDeleted: false,
          ...(startDate && endDate
            ? {
                createdAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate + "T23:59:59.999Z"),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Doctor specialization breakdown
    const specializationStats = await Doctor.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performing doctors
    const topDoctors = await Doctor.find({ isDeleted: false })
      .populate("userId", "name")
      .sort({ rating: -1 })
      .limit(5)
      .select("specialization rating consultationFee");

    res.json({
      success: true,
      data: {
        userTrends,
        revenueTrends,
        appointmentStats,
        specializationStats,
        topDoctors,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDetailedReports = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    let reportData = {};

    if (!type || type === "users") {
      // User statistics
      const userStats = await User.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
            active: { $sum: { $cond: ["$isActive", 1, 0] } },
          },
        },
      ]);
      reportData.userStats = userStats;
    }

    if (!type || type === "appointments") {
      // Appointment trends
      const appointmentTrends = await Appointment.aggregate([
        {
          $match: {
            isDeleted: false,
            ...(startDate && endDate
              ? {
                  appointmentDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate + "T23:59:59.999Z"),
                  },
                }
              : {}),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$appointmentDate" },
              month: { $month: "$appointmentDate" },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
      reportData.appointmentTrends = appointmentTrends;
    }

    if (!type || type === "revenue") {
      // Revenue analysis
      const revenueAnalysis = await Payment.aggregate([
        {
          $match: {
            status: "completed",
            isDeleted: false,
            ...(startDate && endDate
              ? {
                  createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate + "T23:59:59.999Z"),
                  },
                }
              : {}),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: "$amount" },
            transactionCount: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
      reportData.revenueAnalysis = revenueAnalysis;
    }

    if (!type || type === "doctors") {
      // Doctor performance
      const doctorPerformance = await Doctor.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "doctorId",
            as: "appointments",
          },
        },
        {
          $project: {
            name: { $arrayElemAt: ["$user.name", 0] },
            specialization: 1,
            rating: 1,
            consultationFee: 1,
            totalAppointments: { $size: "$appointments" },
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
      ]);
      reportData.doctorPerformance = doctorPerformance;
    }

    res.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDataCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalDoctors = await Doctor.countDocuments({ isDeleted: false });
    const totalPatients = await Patient.countDocuments({ isDeleted: false });
    const totalAppointments = await Appointment.countDocuments({
      isDeleted: false,
    });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed", isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      qualification,
      experience,
      consultationFee,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Create user account
    const user = await User.create({
      name,
      email,
      phone,
      password, // Will be hashed by the pre-save hook
      role: "doctor",
      isActive: true,
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      qualification,
      experience: parseInt(experience),
      consultationFee: parseFloat(consultationFee),
      rating: 0,
      isAvailable: true,
    });

    // Populate user data for response
    await doctor.populate("userId", "name email phone isActive createdAt");

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
      },
    });
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create doctor",
    });
  }
};
export const createPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Create user account
    const user = await User.create({
      name,
      email,
      phone,
      password, // Will be hashed by the pre-save hook
      role: "patient",
      isActive: true,
    });

    // Create patient profile
    const patient = await Patient.create({
      userId: user._id,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      bloodGroup,
      address:
        address &&
        (address.street || address.city || address.state || address.zipCode)
          ? address
          : null,
      emergencyContact:
        emergencyContact && (emergencyContact.name || emergencyContact.phone)
          ? emergencyContact
          : null,
      allergies: allergies || [],
    });

    // Populate user data for response
    await patient.populate("userId", "name email phone isActive createdAt");

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies,
      },
    });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create patient",
    });
  }
};
// Admin function to update doctor profile (restricted fields)
export const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableDays,
      availableTimeSlots,
    } = req.body;

    console.log("Updating doctor profile for ID:", doctorId);
    console.log("Update data:", req.body);

    // Find the doctor by _id first, then by userId for backward compatibility
    let doctor = await Doctor.findById(doctorId).populate("userId");

    // If not found by _id, try to find by userId
    if (!doctor) {
      console.log("Doctor not found by _id, trying userId...");
      doctor = await Doctor.findOne({
        userId: doctorId,
        isDeleted: false,
      }).populate("userId");
    }

    if (!doctor) {
      console.log("Doctor not found with ID:", doctorId);
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    console.log("Found doctor:", doctor._id, "User:", doctor.userId._id);

    // Update User model fields (admin can modify all user fields)
    const userUpdateData = {};
    if (name !== undefined) userUpdateData.name = name;
    if (email !== undefined) userUpdateData.email = email;
    if (phone !== undefined) userUpdateData.phone = phone;

    if (Object.keys(userUpdateData).length > 0) {
      // Check if email is being changed and if it already exists
      if (email && email !== doctor.userId.email) {
        const existingUser = await User.findOne({
          email,
          _id: { $ne: doctor.userId._id },
          isDeleted: false,
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "A user with this email already exists",
          });
        }
      }

      await User.findByIdAndUpdate(doctor.userId._id, userUpdateData, {
        new: true,
        runValidators: true,
      });
    }

    // Update Doctor model fields (admin can modify all doctor fields)
    const doctorUpdateData = {};
    if (specialization !== undefined)
      doctorUpdateData.specialization = specialization;
    if (qualification !== undefined)
      doctorUpdateData.qualification = qualification;
    if (experience !== undefined) doctorUpdateData.experience = experience;
    if (consultationFee !== undefined)
      doctorUpdateData.consultationFee = consultationFee;
    if (availableDays !== undefined)
      doctorUpdateData.availableDays = availableDays;
    if (availableTimeSlots !== undefined)
      doctorUpdateData.availableTimeSlots = availableTimeSlots;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      doctorUpdateData,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    res.json({
      success: true,
      message: "Doctor profile updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update doctor profile",
    });
  }
};

// Admin function to get single doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;

    let doctor = await Doctor.findById(doctorId)
      .populate("userId", "-password")
      .where({ isDeleted: false });

    // If not found by _id, try to find by userId for backward compatibility
    if (!doctor) {
      doctor = await Doctor.findOne({
        userId: doctorId,
        isDeleted: false,
      }).populate("userId", "-password");
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Get additional statistics
    const totalPatients = await Patient.countDocuments({
      _id: {
        $in: await Appointment.distinct("patientId", {
          doctorId: doctor._id,
          isDeleted: false,
        }),
      },
      isDeleted: false,
    });

    const totalAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      isDeleted: false,
    });

    console.log(
      "Statistics - Patients:",
      totalPatients,
      "Appointments:",
      totalAppointments,
    );

    // Add statistics to the doctor profile
    const doctorProfile = doctor.toObject();
    doctorProfile.totalPatients = totalPatients;
    doctorProfile.totalAppointments = totalAppointments;

    res.json({
      success: true,
      data: doctorProfile,
    });
  } catch (error) {
    console.error("Get doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get doctor profile",
    });
  }
};

// Admin function to update patient profile (restricted fields)
export const updatePatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
    } = req.body;

    // Find the patient
    const patient = await Patient.findById(patientId).populate("userId");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Update User model fields (admin can modify all user fields)
    const userUpdateData = {};
    if (name !== undefined) userUpdateData.name = name;
    if (email !== undefined) userUpdateData.email = email;
    if (phone !== undefined) userUpdateData.phone = phone;

    if (Object.keys(userUpdateData).length > 0) {
      // Check if email is being changed and if it already exists
      if (email && email !== patient.userId.email) {
        const existingUser = await User.findOne({
          email,
          _id: { $ne: patient.userId._id },
          isDeleted: false,
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "A user with this email already exists",
          });
        }
      }

      await User.findByIdAndUpdate(patient.userId._id, userUpdateData, {
        new: true,
        runValidators: true,
      });
    }

    // Update Patient model fields (admin can modify all patient fields)
    const patientUpdateData = {};
    if (dateOfBirth !== undefined)
      patientUpdateData.dateOfBirth = dateOfBirth
        ? new Date(dateOfBirth)
        : null;
    if (gender !== undefined) patientUpdateData.gender = gender;
    if (bloodGroup !== undefined) patientUpdateData.bloodGroup = bloodGroup;
    if (address !== undefined) patientUpdateData.address = address;
    if (emergencyContact !== undefined)
      patientUpdateData.emergencyContact = emergencyContact;
    if (allergies !== undefined) patientUpdateData.allergies = allergies;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      patientUpdateData,
      { new: true, runValidators: true },
    ).populate("userId", "-password");

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.json({
      success: true,
      message: "Patient profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Update patient profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update patient profile",
    });
  }
};

// Admin function to get single patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;

    let patient = await Patient.findById(patientId)
      .populate("userId", "-password")
      .where({ isDeleted: false });

    // If not found by _id, try to find by userId for backward compatibility
    if (!patient) {
      patient = await Patient.findOne({
        userId: patientId,
        isDeleted: false,
      }).populate("userId", "-password");
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Get additional statistics
    const totalAppointments = await Appointment.countDocuments({
      patientId: patient._id,
      isDeleted: false,
    });

    const totalPayments = await Payment.countDocuments({
      patientId: patient._id,
      isDeleted: false,
    });

    const totalSpent = await Payment.aggregate([
      {
        $match: {
          patientId: patient._id,
          status: "completed",
          isDeleted: false,
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Add statistics to the patient profile
    const patientProfile = patient.toObject();
    patientProfile.totalAppointments = totalAppointments;
    patientProfile.totalPayments = totalPayments;
    patientProfile.totalSpent = totalSpent[0]?.total || 0;

    res.json({
      success: true,
      data: patientProfile,
    });
  } catch (error) {
    console.error("Get patient profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get patient profile",
    });
  }
};
