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
  Crown,
  Lock,
  Settings,
  CheckCircle,
  Key,
  UserCheck,
  Activity,
  Database,
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

  useEffect(() => {
    fetchAdminProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      // Validate input
      if (!editData.name || editData.name.trim() === "") {
        toast.error("Name is required");
        return;
      }

      setSaving(true);

      // Update user profile via auth endpoint
      const response = await api.patch("/auth/profile", {
        name: editData.name.trim(),
        phone: editData.phone?.trim() || "",
      });

      if (response.data.success) {
        // Update local state
        const updatedData = {
          ...adminData,
          name: response.data.data.name,
          phone: response.data.data.phone,
        };
        setAdminData(updatedData);

        // Update auth context
        updateUser({
          ...user,
          name: response.data.data.name,
          phone: response.data.data.phone,
        });

        setEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                  Administrator Profile
                </h1>
                <p className="text-gray-600 dark:text-slate-400 mt-2">
                  Manage your administrator account settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50">
                      <Save size={18} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors">
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="btn-primary flex items-center gap-2">
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                      {adminData.name}
                    </h2>
                    <p className="text-primary font-medium">
                      System Administrator
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                        <Crown className="w-3 h-3 inline mr-1" />
                        Super Admin
                      </span>
                      <span className="badge badge-completed">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                        <User
                          size={20}
                          className="text-gray-500 dark:text-slate-400"
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
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
                      Security Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Manage your account security
                    </p>
                  </div>
                </div>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                    <Key size={16} />
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
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50">
                        {saving ? "Changing..." : "Update Password"}
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
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
                      Administrator Privileges
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Your system access permissions
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-slate-100">
                        Full System Access
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Complete administrative control
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-slate-100">
                        User Management
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Create, edit, and manage users
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-slate-100">
                        System Analytics
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        View detailed system reports
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-dark dark:text-slate-100">
                        Data Export
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Export system data and reports
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

export default AdminProfile;
