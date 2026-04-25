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
  Clock,
  MapPin,
  Award,
  Edit3,
  Save,
  X,
  GraduationCap,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { DetailedProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      // Use the new admin endpoint to get doctor profile with statistics
      const { data } = await api.get(`/admin/doctors/${id}`);

      if (data.success) {
        setDoctor(data.data);
        // Initialize edit form with current data
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

      // Delay to show skeleton
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/doctors/${id}`, editForm);

      if (data.success) {
        setDoctor(data.data);
        setIsEditing(false);
        toast.success("Doctor profile updated successfully");
        // Refresh the profile data
        fetchDoctorProfile();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update doctor profile",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20">
            <DetailedProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-4">
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/doctors")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft
                  size={20}
                  className="text-gray-600 dark:text-slate-400"
                />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                  Doctor Profile
                </h1>
                <p className="text-gray-600 dark:text-slate-400 mt-1">
                  {isEditing
                    ? "Edit doctor information"
                    : `Complete information about ${doctor.userId?.name || doctor.name}`}
                </p>
              </div>
            </div>

            {/* Edit Controls */}
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    disabled={saving}
                    className="btn-secondary flex items-center gap-2">
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2">
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="btn-primary flex items-center gap-2">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={48} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-2">
                    {doctor.userId?.name || doctor.name}
                  </h2>
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    {doctor.specialization || "General Practitioner"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="text-yellow-500" size={20} />
                    <span className="text-lg font-semibold text-dark dark:text-slate-100">
                      {doctor.rating !== undefined && doctor.rating !== null
                        ? doctor.rating.toFixed(1)
                        : "N/A"}
                    </span>
                    <span className="text-gray-500 dark:text-slate-400">
                      ({doctor.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div
                    className={`badge ${doctor.userId?.isActive ? "badge-completed" : "badge-cancelled"} text-lg px-4 py-2`}>
                    {doctor.userId?.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <User size={24} />
                    Basic Information
                    {isEditing && (
                      <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
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
                          onChange={handleFormChange}
                          className="input"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleFormChange}
                          className="input"
                          placeholder="Enter email address"
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
                          onChange={handleFormChange}
                          className="input"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Mail
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Email
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.userId?.email || doctor.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Phone
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Phone
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.userId?.phone || doctor.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Calendar
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Joined
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {formatDate(
                              doctor.userId?.createdAt || doctor.createdAt,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <User
                            size={20}
                            className="text-orange-600 dark:text-orange-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Role
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100 capitalize">
                            {doctor.userId?.role || doctor.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <GraduationCap size={24} />
                    Professional Information
                    {isEditing && (
                      <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Editing Mode
                      </span>
                    )}
                  </h3>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Specialization
                        </label>
                        <select
                          name="specialization"
                          value={editForm.specialization}
                          onChange={handleFormChange}
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
                          onChange={handleFormChange}
                          className="input"
                          placeholder="Enter qualification (e.g., MBBS, MD)"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Experience (Years)
                          </label>
                          <input
                            type="number"
                            name="experience"
                            value={editForm.experience}
                            onChange={handleFormChange}
                            className="input"
                            placeholder="Enter years of experience"
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
                            onChange={handleFormChange}
                            className="input"
                            placeholder="Enter consultation fee"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Award
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Specialization
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.specialization || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Award
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Qualification
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.qualification || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Clock
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Experience
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.experience
                              ? `${doctor.experience} years`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <DollarSign
                            size={20}
                            className="text-yellow-600 dark:text-yellow-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Consultation Fee
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.consultationFee
                              ? `$${doctor.consultationFee}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <Star
                            size={20}
                            className="text-red-600 dark:text-red-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Rating
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {doctor.rating !== undefined &&
                            doctor.rating !== null
                              ? `${doctor.rating.toFixed(1)} ⭐`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <MapPin size={24} />
                    Statistics & Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {doctor.totalAppointments || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Total Appointments
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {doctor.totalPatients || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Total Patients
                      </p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                        {doctor.rating !== undefined && doctor.rating !== null
                          ? doctor.rating.toFixed(1)
                          : "0.0"}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Average Rating
                      </p>
                    </div>
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
