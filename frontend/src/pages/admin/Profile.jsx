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
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
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
    return <AdminProfileSkeleton />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
              Admin Profile
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
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors disabled:opacity-50">
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors">
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-border dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  {adminData.name}
                </h2>
                <p className="text-primary font-medium">System Administrator</p>
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
  );
};

export default AdminProfile;
