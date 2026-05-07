import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  MapPin,
  AlertTriangle,
  Activity,
  Droplets,
  Shield,
  Users,
  Home,
  FileText,
  AlertCircle,
  Edit3,
  Save,
  X,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AdminPatientProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
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
    allergies: [],
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["male", "female", "other"];
  const relations = ["Parent", "Spouse", "Sibling", "Child", "Friend", "Other"];

  useEffect(() => {
    fetchPatientProfile();
  }, [id]);

  const fetchPatientProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/patients/${id}`);

      if (data.success) {
        setPatient(data.data);
        // Initialize edit form with current data
        setEditForm({
          name: data.data.userId?.name || "",
          email: data.data.userId?.email || "",
          phone: data.data.userId?.phone || "",
          dateOfBirth: data.data.dateOfBirth
            ? new Date(data.data.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.data.gender || "",
          bloodGroup: data.data.bloodGroup || "",
          address: {
            street: data.data.address?.street || "",
            city: data.data.address?.city || "",
            state: data.data.address?.state || "",
            zipCode: data.data.address?.zipCode || "",
          },
          emergencyContact: {
            name: data.data.emergencyContact?.name || "",
            phone: data.data.emergencyContact?.phone || "",
            relation: data.data.emergencyContact?.relation || "",
          },
          allergies: data.data.allergies || [],
        });
      } else {
        toast.error("Patient not found");
        navigate("/admin/patients");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patient profile");
      navigate("/admin/patients");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAllergyChange = (index, value) => {
    setEditForm((prev) => ({
      ...prev,
      allergies: prev.allergies.map((allergy, i) =>
        i === index ? value : allergy,
      ),
    }));
  };

  const addAllergy = () => {
    setEditForm((prev) => ({
      ...prev,
      allergies: [...prev.allergies, ""],
    }));
  };

  const removeAllergy = (index) => {
    setEditForm((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
      setEditForm({
        name: patient.userId?.name || "",
        email: patient.userId?.email || "",
        phone: patient.userId?.phone || "",
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: patient.gender || "",
        bloodGroup: patient.bloodGroup || "",
        address: {
          street: patient.address?.street || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          zipCode: patient.address?.zipCode || "",
        },
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          phone: patient.emergencyContact?.phone || "",
          relation: patient.emergencyContact?.relation || "",
        },
        allergies: patient.allergies || [],
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/patients/${id}`, editForm);
      if (data.success) {
        toast.success("Patient profile updated successfully");
        setIsEditing(false);
        fetchPatientProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28">
            <AdminPatientProfileSkeleton navigate={navigate} />
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                Patient Not Found
              </h2>
              <button
                onClick={() => navigate("/admin/patients")}
                className="btn btn-primary">
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin/patients")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft
                size={20}
                className="text-gray-600 dark:text-slate-400"
              />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                Patient Profile Management
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                {isEditing
                  ? "Edit patient information"
                  : "Complete patient profile and medical information"}
              </p>
            </div>
          </div>

          {/* Professional Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {patient.userId?.name || patient.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="flex items-center gap-2">
                      <Activity size={16} />
                      {calculateAge(patient.dateOfBirth)} years old
                    </span>
                    <span className="flex items-center gap-2">
                      <Droplets size={16} />
                      {patient.bloodGroup || "Unknown"} Blood Type
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center gap-2">
                      <Heart size={16} className="text-red-300" />
                      {patient.allergies?.length || 0} Allergies
                    </span>
                    <span className="flex items-center gap-2">
                      <FileText size={16} />
                      {patient.medicalHistory?.length || 0} Conditions
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
                  Patient ID: #{patient._id?.slice(-6).toUpperCase() || "N/A"}
                </p>
                <p className="text-blue-100 text-sm">
                  Member since{" "}
                  {formatDate(patient.createdAt || patient.userId?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Age
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {calculateAge(patient.dateOfBirth)}
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
                    {patient.bloodGroup || "N/A"}
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
                    {patient.allergies?.length || 0}
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
                    {patient.medicalHistory?.length || 0}
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

          {/* Edit Controls */}
          <div className="flex justify-end">
            {isEditing ? (
              <div className="flex items-center gap-3">
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
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn-primary flex items-center gap-2">
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <User size={24} className="text-primary" />
                  Personal Information
                  {isEditing && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Editing Mode
                    </span>
                  )}
                </h3>

                {isEditing ? (
                  <div className="space-y-6">
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
                        placeholder="Patient full name"
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
                          placeholder="patient@example.com"
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
                          placeholder="+1-234-567-8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editForm.dateOfBirth}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={editForm.gender}
                          onChange={handleInputChange}
                          className="input">
                          <option value="">Select Gender</option>
                          {genders.map((gender) => (
                            <option key={gender} value={gender}>
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={editForm.bloodGroup}
                          onChange={handleInputChange}
                          className="input">
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
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
                            {patient.userId?.name ||
                              patient.name ||
                              "Not available"}
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
                            {patient.userId?.email ||
                              patient.email ||
                              "Not available"}
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
                            {patient.userId?.phone ||
                              patient.phone ||
                              "Not available"}
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
                            {formatDate(patient.dateOfBirth)}
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
                            {patient.gender
                              ? patient.gender.charAt(0).toUpperCase() +
                                patient.gender.slice(1)
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
                            {patient.bloodGroup || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Home size={24} className="text-primary" />
                  Address Information
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
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={editForm.address.street}
                        onChange={handleInputChange}
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
                          name="address.city"
                          value={editForm.address.city}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={editForm.address.state}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          value={editForm.address.zipCode}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Current Address
                      </label>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-primary mt-1" />
                        <div className="text-gray-900 dark:text-slate-100 font-medium">
                          {patient.address?.street ? (
                            <>
                              {patient.address.street}
                              <br />
                              {patient.address.city}, {patient.address.state}{" "}
                              {patient.address.zipCode}
                            </>
                          ) : (
                            "No address on file"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Users size={24} className="text-primary" />
                  Emergency Contact
                  {isEditing && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Editing Mode
                    </span>
                  )}
                </h3>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={editForm.emergencyContact.name}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact.phone"
                        value={editForm.emergencyContact.phone}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="+1-234-567-8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Relationship
                      </label>
                      <select
                        name="emergencyContact.relation"
                        value={editForm.emergencyContact.relation}
                        onChange={handleInputChange}
                        className="input">
                        <option value="">Select Relationship</option>
                        {relations.map((relation) => (
                          <option key={relation} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                        Contact Name
                      </label>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="text-gray-900 dark:text-slate-100 font-medium">
                          {patient.emergencyContact?.name || "Not specified"}
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
                          {patient.emergencyContact?.phone || "Not specified"}
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
                          {patient.emergencyContact?.relation ||
                            "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Heart size={24} className="text-primary" />
                  Medical Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Blood Type
                    </span>
                    <div className="flex items-center gap-1">
                      <Droplets size={16} className="text-red-500" />
                      <span className="font-medium text-gray-900 dark:text-slate-100">
                        {patient.bloodGroup || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Known Allergies
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {patient.allergies?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Medical Conditions
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {patient.medicalHistory?.length || 0}
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
                    <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active Patient
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Patient ID
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      #{patient._id?.slice(-6).toUpperCase() || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Member Since
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {formatDate(
                        patient.createdAt || patient.userId?.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <AlertCircle size={24} className="text-primary" />
                  Medical Details
                  {isEditing && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Editing Mode
                    </span>
                  )}
                </h3>

                {/* Allergies */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    Allergies
                    {isEditing && (
                      <button
                        onClick={addAllergy}
                        className="ml-auto text-sm bg-primary text-white px-2 py-1 rounded hover:bg-primary/80">
                        Add Allergy
                      </button>
                    )}
                  </h4>

                  {isEditing ? (
                    <div className="space-y-2">
                      {editForm.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={allergy}
                            onChange={(e) =>
                              handleAllergyChange(index, e.target.value)
                            }
                            className="input flex-1"
                            placeholder="Enter allergy"
                          />
                          <button
                            onClick={() => removeAllergy(index)}
                            className="text-red-500 hover:text-red-700 p-1">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {editForm.allergies.length === 0 && (
                        <p className="text-gray-500 dark:text-slate-400 italic">
                          No allergies added. Click "Add Allergy" to add one.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies && patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle size={12} className="mr-1" />
                            {allergy}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-slate-400 italic">
                          No known allergies
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" />
                    Medical History
                  </h4>
                  <div className="space-y-3">
                    {patient.medicalHistory &&
                    patient.medicalHistory.length > 0 ? (
                      patient.medicalHistory.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 dark:text-slate-100">
                                {item.condition}
                              </h5>
                              {item.diagnosedDate && (
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                  Diagnosed: {formatDate(item.diagnosedDate)}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 italic">
                        No medical history on record
                      </p>
                    )}
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

export default PatientProfile;

