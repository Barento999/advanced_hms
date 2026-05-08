import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  DollarSign,
  MapPin,
  Award,
  Edit3,
  Save,
  X,
  GraduationCap,
  Stethoscope,
  Shield,
  Activity,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AdminDoctorProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
  });

  const specializations = [
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
  ];

  useEffect(() => {
    fetchDoctorProfile();
  }, [id]);

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/doctors/${id}`);

      if (data.success) {
        setDoctor(data.data);
        setEditForm({
          name: data.data.userId?.name || "",
          email: data.data.userId?.email || "",
          phone: data.data.userId?.phone || "",
          specialization: data.data.specialization || "",
          qualification: data.data.qualification || "",
          experience: data.data.experience || "",
          consultationFee: data.data.consultationFee || "",
        });
      } else {
        toast.error("Doctor not found");
        navigate("/admin/doctors");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch doctor profile");
      navigate("/admin/doctors");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: doctor.userId?.name || "",
        email: doctor.userId?.email || "",
        phone: doctor.userId?.phone || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        consultationFee: doctor.consultationFee || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/doctors/${id}`, editForm);
      if (data.success) {
        toast.success("Doctor profile updated successfully");
        setIsEditing(false);
        fetchDoctorProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28">
            <AdminDoctorProfileSkeleton navigate={navigate} />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                Doctor Not Found
              </h2>
              <button
                onClick={() => navigate("/admin/doctors")}
                className="btn btn-primary">
                Back to Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 space-y-6 sm:space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/admin/doctors")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
              <ArrowLeft
                size={20}
                className="text-gray-600 dark:text-slate-400"
              />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 truncate">
                Doctor Profile Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1">
                {isEditing
                  ? "Edit doctor information"
                  : "Complete doctor profile and statistics"}
              </p>
            </div>
          </div>

          {/* Professional Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <Stethoscope size={32} className="text-white sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">
                    {doctor.userId?.name || "Unknown"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 text-sm sm:text-base">
                    <span className="flex items-center gap-1 sm:gap-2">
                      <GraduationCap size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{doctor.specialization || "General Practice"}</span>
                    </span>
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Award size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      {doctor.experience} years
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-blue-100 text-sm">
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Star size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      {doctor.rating !== undefined && doctor.rating !== null
                        ? doctor.rating.toFixed(1)
                        : "N/A"}{" "}
                      Rating
                    </span>
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Users size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      {doctor.totalPatients || 0} Patients
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.userId?.isActive
                      ? "bg-green-500/20 text-green-100 border border-green-400/30"
                      : "bg-red-500/20 text-red-100 border border-red-400/30"
                  }`}>
                  <Shield size={14} className="mr-1" />
                  {doctor.userId?.isActive ? "Active" : "Inactive"}
                </div>
                <p className="text-blue-100 text-xs sm:text-sm mt-2">
                  Doctor ID: #{doctor._id?.slice(-6).toUpperCase() || "N/A"}
                </p>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Member since {formatDate(doctor.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 truncate">
                    Consultation Fee
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 truncate">
                    ${doctor.consultationFee || 0}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <DollarSign
                    size={20}
                    className="text-green-600 dark:text-green-400 sm:w-6 sm:h-6"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 truncate">
                    Total Patients
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {doctor.totalPatients || 0}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <Users
                    size={20}
                    className="text-blue-600 dark:text-blue-400 sm:w-6 sm:h-6"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 truncate">
                    Total Appointments
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {doctor.totalAppointments || 0}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <Calendar
                    size={20}
                    className="text-purple-600 dark:text-purple-400 sm:w-6 sm:h-6"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 truncate">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {doctor.rating !== undefined && doctor.rating !== null
                        ? doctor.rating.toFixed(1)
                        : "N/A"}
                    </p>
                    <Star size={16} className="text-yellow-500 fill-current sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <Star
                    size={20}
                    className="text-yellow-600 dark:text-yellow-400 sm:w-6 sm:h-6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="flex justify-end">
            {isEditing ? (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="btn-secondary flex items-center gap-2 text-sm sm:text-base">
                  <X size={16} />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 text-sm sm:text-base">
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn-primary flex items-center gap-2 text-sm sm:text-base">
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Professional Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <GraduationCap size={24} className="text-primary" />
                  Professional Information
                  {isEditing && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Editing Mode
                    </span>
                  )}
                </h3>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Specialization
                        </label>
                        <select
                          name="specialization"
                          value={editForm.specialization}
                          onChange={handleInputChange}
                          className="input">
                          <option value="">Select Specialization</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Qualification
                        </label>
                        <input
                          type="text"
                          name="qualification"
                          value={editForm.qualification}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="e.g., MBBS, MD"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={editForm.experience}
                          onChange={handleInputChange}
                          className="input"
                          min="0"
                          max="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Consultation Fee ($)
                        </label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={editForm.consultationFee}
                          onChange={handleInputChange}
                          className="input"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Specialization
                        </label>
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {doctor.specialization || "Not specified"}
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
                            {doctor.qualification || "Not specified"}
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
                            {doctor.experience} years
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
                            ${doctor.consultationFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <User size={24} className="text-primary" />
                  Contact Information
                  {isEditing && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Editing Mode
                    </span>
                  )}
                </h3>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="doctor@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="+1-234-567-4567"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Full Name
                        </label>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {doctor.userId?.name || "Not available"}
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
                            {doctor.userId?.email || "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Phone Number
                        </label>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {doctor.userId?.phone || "Not available"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Member Since
                        </label>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {formatDate(doctor.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics & Status */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Activity size={24} className="text-primary" />
                  Performance Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Rating
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {doctor.rating !== undefined && doctor.rating !== null
                          ? doctor.rating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Total Reviews
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {doctor.totalReviews || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Total Appointments
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {doctor.totalAppointments || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Total Patients
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {doctor.totalPatients || 0}
                    </span>
                  </div>
                </div>
              </div>

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
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        doctor.userId?.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {doctor.userId?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Doctor ID
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      #{doctor._id?.slice(-6).toUpperCase() || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Joined Date
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {formatDate(doctor.createdAt || doctor.userId?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
