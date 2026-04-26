import { useState, useEffect, useContext } from "react";
import {
  User,
  Calendar,
  Heart,
  AlertCircle,
  Phone,
  MapPin,
  Save,
  Mail,
  Shield,
  Activity,
  FileText,
  Edit3,
  Droplets,
  Users,
  Home,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { PatientProfileSkeleton } from "../../components/LoadingSkeleton";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profile, setProfile] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    medicalHistory: [],
    allergies: [],
  });

  const [editForm, setEditForm] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/patient/profile");
      if (data.success) {
        const profileData = {
          dateOfBirth: data.data.dateOfBirth
            ? new Date(data.data.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.data.gender || "",
          bloodGroup: data.data.bloodGroup || "",
          address: data.data.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
          },
          emergencyContact: data.data.emergencyContact || {
            name: "",
            phone: "",
            relation: "",
          },
          medicalHistory: data.data.medicalHistory || [],
          allergies: data.data.allergies || [],
        };

        setProfile(profileData);
        setEditForm({
          address: profileData.address,
          emergencyContact: profileData.emergencyContact,
        });
      }

      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.put("/patient/profile", editForm);
      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          address: editForm.address,
          emergencyContact: editForm.emergencyContact,
        }));
        toast.success("Profile updated successfully");
        // Refresh the profile data
        fetchProfile();
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
      const { data } = await api.put("/patient/change-password", {
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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <PatientProfileSkeleton />
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
              Patient Profile
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Manage your personal information and healthcare details
            </p>
          </div>
          {/* Professional Header Section */}
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.name || "Patient Name"}
                  </h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center gap-2">
                      <Activity size={16} />
                      {calculateAge(profile.dateOfBirth)} years old
                    </span>
                    <span className="flex items-center gap-2">
                      <Droplets size={16} />
                      {profile.bloodGroup || "Blood Type N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-blue-100">
                    <span className="flex items-center gap-2">
                      <Heart size={16} className="text-red-300" />
                      {profile.allergies.length} Allergies
                    </span>
                    <span className="flex items-center gap-2">
                      <FileText size={16} />
                      {profile.medicalHistory.length} Conditions
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-100 border border-green-400/30">
                  <Shield size={14} className="mr-1" />
                  Active Patient
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Patient ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
                </p>
                <p className="text-blue-100 text-sm">
                  Member since{" "}
                  {new Date(user?.createdAt).getFullYear() || "N/A"}
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
                    Age
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {calculateAge(profile.dateOfBirth)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar
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
                    Blood Type
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {profile.bloodGroup || "N/A"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Droplets
                    size={24}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Allergies
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {profile.allergies.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle
                    size={24}
                    className="text-orange-600 dark:text-orange-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Conditions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {profile.medicalHistory.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Heart
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
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
                onClick={() => setActiveTab("contact")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "contact"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Edit3 size={16} />
                Contact Info
              </button>
              <button
                onClick={() => setActiveTab("medical")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "medical"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                <Heart size={16} />
                Medical Info
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
              {/* Personal Information Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <User size={24} className="text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Full Name
                        </label>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {user?.name || "Not available"}
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
                            {user?.email || "Not available"}
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
                            {user?.phone || "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {formatDate(profile.dateOfBirth)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Gender
                        </label>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {profile.gender
                              ? profile.gender.charAt(0).toUpperCase() +
                                profile.gender.slice(1)
                              : "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                          Blood Group
                        </label>
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-primary" />
                          <span className="text-gray-900 dark:text-slate-100 font-medium">
                            {profile.bloodGroup || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Overview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Home size={24} className="text-primary" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Current Address
                      </label>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-primary mt-1" />
                        <div className="text-gray-900 dark:text-slate-100 font-medium">
                          {profile.address.street ? (
                            <>
                              {profile.address.street}
                              <br />
                              {profile.address.city}, {profile.address.state}{" "}
                              {profile.address.zipCode}
                            </>
                          ) : (
                            "No address on file"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Emergency Information */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Users size={24} className="text-primary" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Contact Name
                      </label>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          {profile.emergencyContact.name || "Not specified"}
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
                          {profile.emergencyContact.phone || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Relationship
                      </label>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          {profile.emergencyContact.relation || "Not specified"}
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
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        Active Patient
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                        Member Since
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatDate(user?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                        Patient ID
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        #{user?._id?.slice(-6).toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Edit3 size={24} className="text-primary" />
                  Editable Contact Information
                </h3>

                {/* Address Information */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <Home size={20} className="text-primary" />
                    Address Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={editForm.address.street}
                        onChange={handleAddressChange}
                        className="input"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editForm.address.city}
                          onChange={handleAddressChange}
                          className="input"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={editForm.address.state}
                          onChange={handleAddressChange}
                          className="input"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editForm.address.zipCode}
                          onChange={handleAddressChange}
                          className="input"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                        className="input"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        name="relation"
                        value={editForm.emergencyContact.relation}
                        onChange={handleEmergencyContactChange}
                        className="input"
                        placeholder="Spouse, Parent, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Read-only fields */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-amber-500" />
                    Protected Information (Healthcare Compliance)
                  </h4>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                      />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Healthcare Compliance:</strong> Personal and
                        medical information cannot be modified by patients for
                        safety and legal compliance. Contact administration for
                        changes.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user?.name || ""}
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Shield size={16} className="text-amber-500" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ""}
                          className="input bg-gray-50 dark:bg-slate-700 cursor-not-allowed border-gray-200 dark:border-slate-600"
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Shield size={16} className="text-amber-500" />
                        </div>
                      </div>
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

          {/* Medical Information Tab */}
          {activeTab === "medical" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Heart size={24} className="text-primary" />
                  Medical Information
                  <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                    (Read-only)
                  </span>
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={16}
                      className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <strong>Medical Records:</strong> Medical information is
                      managed by healthcare providers only to ensure accuracy
                      and safety.
                    </div>
                  </div>
                </div>

                {/* Medical Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Droplets
                          size={24}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Blood Type
                        </p>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                          {profile.bloodGroup || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <User
                          size={24}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          Gender
                        </p>
                        <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                          {profile.gender
                            ? profile.gender.charAt(0).toUpperCase() +
                              profile.gender.slice(1)
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Calendar
                          size={24}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          Age
                        </p>
                        <p className="text-xl font-bold text-green-900 dark:text-green-100">
                          {calculateAge(profile.dateOfBirth)} years
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-red-500" />
                    Allergies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800">
                        <AlertCircle size={14} className="mr-2" />
                        {allergy}
                      </span>
                    ))}
                    {profile.allergies.length === 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full text-sm">
                        <Shield size={14} />
                        No known allergies
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    Medical History
                  </h4>
                  <div className="space-y-4">
                    {profile.medicalHistory.map((item, index) => (
                      <div
                        key={index}
                        className="p-6 bg-blue-50 dark:bg-slate-700/30 rounded-xl border border-blue-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-blue-500" />
                              <h5 className="font-bold text-gray-900 dark:text-slate-100 text-lg">
                                {item.condition}
                              </h5>
                            </div>
                            {item.diagnosedDate && (
                              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                                <Calendar size={14} />
                                Diagnosed: {formatDate(item.diagnosedDate)}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {profile.medicalHistory.length === 0 && (
                      <div className="text-center py-12">
                        <FileText
                          size={48}
                          className="mx-auto text-gray-400 dark:text-slate-500 mb-4"
                        />
                        <p className="text-gray-500 dark:text-slate-400 text-lg mb-2">
                          No medical history on record
                        </p>
                        <p className="text-gray-400 dark:text-slate-500 text-sm">
                          Medical history will be added by your healthcare
                          providers
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
