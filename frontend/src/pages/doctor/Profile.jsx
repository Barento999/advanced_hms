import { useState, useEffect } from "react";
import {
  User,
  DollarSign,
  Phone,
  Lock,
  Calendar,
  Clock,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Award,
  Briefcase,
  Star,
  Shield,
  Edit3,
  UserCheck,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    consultationFee: 0,
    specialization: "",
    qualification: "",
    experience: 0,
    rating: 0,
    totalPatients: 0,
    totalAppointments: 0,
    isActive: true,
    createdAt: "",
  });

  const [scheduleInfo, setScheduleInfo] = useState({
    availableDays: [],
    availableTimeSlots: [],
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/doctor/profile");
      if (data.success) {
        const profile = data.data;

        setBasicInfo({
          name: profile.userId?.name || "",
          email: profile.userId?.email || "",
          phone: profile.userId?.phone || "",
        });

        setProfessionalInfo({
          consultationFee: profile.consultationFee || 0,
          specialization: profile.specialization || "",
          qualification: profile.qualification || "",
          experience: profile.experience || 0,
          rating: profile.rating || 0,
          totalPatients: profile.totalPatients || 0,
          totalAppointments: profile.totalAppointments || 0,
          isActive: profile.userId?.isActive || false,
          createdAt: profile.createdAt || "",
        });

        setScheduleInfo({
          availableDays: profile.availableDays || [],
          availableTimeSlots: profile.availableTimeSlots || [],
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalInfoChange = (e) => {
    const { name, value } = e.target;
    setProfessionalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setScheduleInfo((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const addTimeSlot = () => {
    setScheduleInfo((prev) => ({
      ...prev,
      availableTimeSlots: [
        ...prev.availableTimeSlots,
        { startTime: "09:00", endTime: "10:00" },
      ],
    }));
  };

  const removeTimeSlot = (index) => {
    setScheduleInfo((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setScheduleInfo((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only send fields that doctors are allowed to modify
      const updateData = {
        phone: basicInfo.phone,
        consultationFee: professionalInfo.consultationFee,
        availableDays: scheduleInfo.availableDays,
        availableTimeSlots: scheduleInfo.availableTimeSlots,
      };

      const { data } = await api.put("/doctor/profile", updateData);
      if (data.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordInfo.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    try {
      const { data } = await api.put("/doctor/change-password", {
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
      });

      if (data.success) {
        toast.success("Password changed successfully");
        setPasswordInfo({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          {/* Professional Header Section */}
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {basicInfo.name || "Doctor Name"}
                  </h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      {professionalInfo.specialization || "Specialization"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Award size={16} />
                      {professionalInfo.experience} years experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-blue-100">
                    <span className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-300" />
                      {professionalInfo.rating.toFixed(1)} Rating
                    </span>
                    <span className="flex items-center gap-2">
                      <UserCheck size={16} />
                      {professionalInfo.totalPatients} Patients
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    professionalInfo.isActive
                      ? "bg-green-500/20 text-green-100 border border-green-400/30"
                      : "bg-red-500/20 text-red-100 border border-red-400/30"
                  }`}>
                  <Shield size={14} className="mr-1" />
                  {professionalInfo.isActive ? "Active" : "Inactive"}
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Member since{" "}
                  {new Date(professionalInfo.createdAt).getFullYear() || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Consultation Fee
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    ${professionalInfo.consultationFee}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign
                    size={24}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Total Patients
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {professionalInfo.totalPatients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User
                    size={24}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {professionalInfo.totalAppointments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Calendar
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Rating
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {professionalInfo.rating.toFixed(1)}
                    </p>
                    <Star size={20} className="text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Star
                    size={24}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <User size={16} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "basic"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Edit3 size={16} />
                Contact Info
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "professional"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Briefcase size={16} />
                Practice Settings
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "schedule"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Calendar size={16} />
                Schedule
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "password"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Lock size={16} />
                Security
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Professional Information Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <GraduationCap size={24} className="text-primary" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Specialization
                        </label>
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {professionalInfo.specialization || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Qualification
                        </label>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {professionalInfo.qualification || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Experience
                        </label>
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {professionalInfo.experience} years
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Consultation Fee
                        </label>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            ${professionalInfo.consultationFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Overview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Calendar size={24} className="text-primary" />
                    Schedule Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Available Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {scheduleInfo.availableDays.length > 0 ? (
                          scheduleInfo.availableDays.map((day) => (
                            <span
                              key={day}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 dark:text-slate-400 text-sm">
                            No days selected
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Time Slots
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {scheduleInfo.availableTimeSlots.length > 0 ? (
                          scheduleInfo.availableTimeSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <Clock size={14} className="text-primary" />
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 dark:text-slate-400 text-sm">
                            No time slots configured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <User size={24} className="text-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          Dr. {basicInfo.name || "Not available"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          {basicInfo.email || "Not available"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          {basicInfo.phone || "Not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Shield size={24} className="text-primary" />
                    Account Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          professionalInfo.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        }`}>
                        {professionalInfo.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                        Member Since
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {professionalInfo.createdAt
                          ? new Date(
                              professionalInfo.createdAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Edit3 size={24} className="text-primary" />
                  Editable Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      <span className="flex items-center gap-2">
                        <Phone size={16} className="text-primary" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={basicInfo.phone}
                      onChange={handleBasicInfoChange}
                      className="input"
                      placeholder="Enter your phone number"
                    />
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Update your contact number for patient communication
                    </p>
                  </div>
                </div>

                {/* Read-only fields */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-amber-500" />
                    Protected Information (Admin Access Required)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={basicInfo.name}
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Shield size={16} className="text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Shield size={12} />
                        Name changes require admin verification for security
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={basicInfo.email || "Not available"}
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Shield size={16} className="text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Shield size={12} />
                        Email changes require admin verification for security
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Save Contact Info"}
                </button>
              </div>
            </form>
          )}

          {/* Professional Information Tab */}
          {activeTab === "professional" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <DollarSign size={24} className="text-primary" />
                  Practice Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      <span className="flex items-center gap-2">
                        <DollarSign size={16} className="text-primary" />
                        Consultation Fee (USD)
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        name="consultationFee"
                        value={professionalInfo.consultationFee}
                        onChange={handleProfessionalInfoChange}
                        className="input pl-8"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Set your consultation fee per appointment session
                    </p>
                  </div>
                </div>

                {/* Read-only professional fields */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-amber-500" />
                    Medical Credentials (Admin Controlled)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Medical Specialization
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            professionalInfo.specialization || "Not specified"
                          }
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Stethoscope size={16} className="text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <GraduationCap size={12} />
                        Requires medical board verification
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Professional Qualification
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            professionalInfo.qualification || "Not specified"
                          }
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Award size={16} className="text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Award size={12} />
                        Requires medical board verification
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            professionalInfo.experience
                              ? `${professionalInfo.experience} years`
                              : "Not specified"
                          }
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Briefcase size={16} className="text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Briefcase size={12} />
                        Verified by admin/HR department
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Save Practice Settings"}
                </button>
              </div>
            </form>
          )}

          {/* Schedule & Availability Tab */}
          {activeTab === "schedule" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Available Days */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Calendar size={24} className="text-primary" />
                  Available Days
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  Select the days when you are available for consultations
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        scheduleInfo.availableDays.includes(day)
                          ? "border-primary bg-primary text-white shadow-md transform scale-105"
                          : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5"
                      }`}>
                      <div className="text-center">
                        <div className="font-semibold">{day.slice(0, 3)}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {day.slice(3)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Time Slots */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock size={24} className="text-primary" />
                      Available Time Slots
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">
                      Configure your consultation time slots
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="btn-secondary flex items-center gap-2 px-4 py-2">
                    <Plus size={16} />
                    Add Time Slot
                  </button>
                </div>

                {scheduleInfo.availableTimeSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock
                      size={48}
                      className="mx-auto text-gray-400 dark:text-slate-500 mb-4"
                    />
                    <p className="text-gray-500 dark:text-slate-400 text-lg mb-2">
                      No time slots configured
                    </p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm">
                      Click "Add Time Slot" to set your availability hours
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduleInfo.availableTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 min-w-[40px]">
                              From:
                            </label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  index,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              className="input-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 min-w-[25px]">
                              To:
                            </label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(index, "endTime", e.target.value)
                              }
                              className="input-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                  <Save size={18} />
                  {saving ? "Saving Schedule..." : "Save Schedule"}
                </button>
              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Lock size={24} className="text-primary" />
                  Change Password
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Update your account password to keep your profile secure
                </p>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordInfo.currentPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showPassword.current ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        placeholder="Enter your new password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showPassword.new ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordInfo.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        placeholder="Confirm your new password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showPassword.confirm ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                  <Lock size={18} />
                  {saving ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
