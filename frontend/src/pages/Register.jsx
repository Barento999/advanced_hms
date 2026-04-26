import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    drugAllergies: "",
    role: "patient", // Fixed as patient - doctors created by admin only
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Phone validation (optional but if provided, must be valid)
    if (
      formData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else if (age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      } else if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old to register";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      toast.success(
        "Registration successful! Basic profile created. Please login to complete your full medical profile.",
      );
      setTimeout(() => navigate("/login?redirect=complete-profile"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-slate-900 p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-10 border border-border dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
            Create Patient Account
          </h1>
          <p className="text-muted dark:text-slate-400 mt-2">
            Join our healthcare platform as a patient
          </p>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-700 dark:text-green-300 text-center">
              ✅ Enhanced registration with essential health information for
              your safety
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name - Full Width */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              className={`input-field ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email and Phone - Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                className={`input-field ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className={`input-field ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Date of Birth - Full Width */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className={`input-field ${errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : ""}`}
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Drug Allergies - Full Width with Safety Highlight */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              <span className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                Known Drug Allergies (Critical for Safety)
              </span>
            </label>
            <input
              type="text"
              name="drugAllergies"
              className="input-field"
              placeholder="e.g., Penicillin, Aspirin, Ibuprofen (leave blank if none)"
              value={formData.drugAllergies}
              onChange={handleChange}
            />
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
              Please list any medications you're allergic to. This information
              is critical for your safety during treatment.
            </p>
          </div>

          {/* Password - Full Width */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              className={`input-field ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-muted dark:text-slate-400 mt-1">
              Password must contain at least one uppercase letter, one lowercase
              letter, and one number
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg">
            {loading ? "Creating account..." : "Create Patient Account"}
          </button>
        </form>

        <p className="text-center text-muted dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
            Sign in
          </Link>
        </p>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            <strong>Note:</strong> Doctor accounts are created by administrators
            only. If you're a healthcare professional, please contact your
            system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
