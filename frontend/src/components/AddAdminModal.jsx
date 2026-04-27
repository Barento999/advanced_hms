import { useState } from "react";
import {
  X,
  Shield,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  AlertTriangle,
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const AddAdminModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/create-admin", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "admin",
      });

      toast.success("Admin created successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-700 animate-slideUp">
        {/* Enhanced Header with Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10"></div>
          <div className="relative flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Add New Admin
                </h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                  Create a new system administrator account
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X size={20} className="text-gray-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Name with Icon */}
          <div>
            <label className="block text-sm font-semibold text-dark dark:text-slate-200 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter admin's full name"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email with Icon */}
          <div>
            <label className="block text-sm font-semibold text-dark dark:text-slate-200 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="admin@healthcare.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone with Icon */}
          <div>
            <label className="block text-sm font-semibold text-dark dark:text-slate-200 mb-2">
              Phone Number{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password with Icon */}
          <div>
            <label className="block text-sm font-semibold text-dark dark:text-slate-200 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter secure password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.password}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password with Icon */}
          <div>
            <label className="block text-sm font-semibold text-dark dark:text-slate-200 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`input-field pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Enhanced Security Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  Security Notice
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 leading-relaxed">
                  This admin will have full system access including user
                  management, data export, and system configuration. Only grant
                  admin privileges to trusted personnel.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-medium disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Create Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
