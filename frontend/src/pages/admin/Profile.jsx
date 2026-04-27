import { useState, useEffect, useContext } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit3,
  Save,
  X,
  Settings,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Activity,
  Database,
  BarChart3,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { AdminProfileSkeleton } from "../../components/LoadingSkeleton";

const AdminProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    createdAt: "",
  });
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      // Since admin doesn't have a separate profile model, we'll use the user data
      if (user) {
        setAdminData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          createdAt: user.createdAt || "",
        });
        setEditData({
          name: user.name || "",
          phone: user.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing - reset form data
      setEditData({
        name: adminData.name,
        phone: adminData.phone,
      });
    }
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Update user profile via auth endpoint
      const response = await api.patch("/auth/profile", {
        name: editData.name,
        phone: editData.phone,
      });

      if (response.data.success) {
        // Update local state
        const updatedData = {
          ...adminData,
          name: editData.name,
          phone: editData.phone,
        };
        setAdminData(updatedData);

        // Update auth context
        updateUser({
          ...user,
          name: editData.name,
          phone: editData.phone,
        });

        setEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);

      await api.patch("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <AdminProfileSkeleton />
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
          {/* Enhanced Header with Healthcare Theme */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-dark dark:text-slate-100">
                    Administrator Profile
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 mt-2 text-lg">
                    System Administrator • Full Access Control
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Active Administrator
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 transform hover:scale-105">
                      <Save size={18} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105">
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105">
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Profile Information */}
            <div className="xl:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-8 text-white">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{adminData.name}</h2>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                          System Administrator
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm font-medium border border-green-400/30">
                          <UserCheck size={14} className="inline mr-1" />
                          Active
                        </span>
                      </div>
                      <p className="text-purple-100 text-sm">
                        Full system access • User management • System oversight
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <User size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-dark dark:text-slate-100">
                          Personal Information
                        </h3>
                      </div>

                      {/* Name Field */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          Full Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-0 bg-white dark:bg-slate-700 text-dark dark:text-slate-100 transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 group-hover:border-purple-300 dark:group-hover:border-purple-500 transition-all duration-200">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <User size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-dark dark:text-slate-100">
                                {adminData.name || "Not provided"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                Administrator Name
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          Email Address
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 group-hover:border-purple-300 dark:group-hover:border-purple-500 transition-all duration-200">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-dark dark:text-slate-100">
                              {adminData.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              Primary contact email
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 dark:bg-slate-600 rounded-md text-xs text-gray-600 dark:text-slate-400">
                            Protected
                          </span>
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          Phone Number
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData({ ...editData, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-0 bg-white dark:bg-slate-700 text-dark dark:text-slate-100 transition-all duration-200"
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 group-hover:border-purple-300 dark:group-hover:border-purple-500 transition-all duration-200">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Phone size={20} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-dark dark:text-slate-100">
                                {adminData.phone || "Not provided"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                Contact number
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          <Settings size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-dark dark:text-slate-100">
                          System Information
                        </h3>
                      </div>

                      {/* Account Created */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          Account Created
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-all duration-200">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-dark dark:text-slate-100">
                              {adminData.createdAt
                                ? new Date(adminData.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              Registration date
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* System Role */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          System Role
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800 dark:text-purple-300">
                              System Administrator
                            </p>
                            <p className="text-sm text-purple-600 dark:text-purple-400">
                              Full system access and control
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                          Account Status
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Activity size={20} className="text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">
                              Active & Operational
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              All systems accessible
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                        />
                        <span className="text-dark dark:text-slate-100">
                          {adminData.name || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <Mail
                        size={20}
                        className="text-gray-500 dark:text-slate-400"
                      />
                      <span className="text-dark dark:text-slate-100">
                        {adminData.email}
                      </span>
                      <span className="ml-auto text-xs text-gray-500 dark:text-slate-400">
                        Cannot be changed
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                        <Phone
                          size={20}
                          className="text-gray-500 dark:text-slate-400"
                        />
                        <span className="text-dark dark:text-slate-100">
                          {adminData.phone || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                      Account Created
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <Calendar
                        size={20}
                        className="text-gray-500 dark:text-slate-400"
                      />
                      <span className="text-dark dark:text-slate-100">
                        {adminData.createdAt
                          ? new Date(adminData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-6">
              {/* Password Change */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-border dark:border-slate-700">
                <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
                  Security Settings
                </h3>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                    <Shield size={16} />
                    Change Password
                  </button>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="input-field"
                        minLength="6"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors disabled:opacity-50">
                        {saving ? "Changing..." : "Change Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Admin Privileges */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
                  Administrator Privileges
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Full system access
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    User management
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    System analytics
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Data export capabilities
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

export default AdminProfile;
