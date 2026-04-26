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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              className="input-field"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email and Phone - Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Date of Birth - Full Width */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              className="input-field"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />
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
              className="input-field"
              placeholder="e.g., Penicillin, Aspirin, Ibuprofen (leave blank if none)"
              value={formData.drugAllergies}
              onChange={(e) =>
                setFormData({ ...formData, drugAllergies: e.target.value })
              }
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
              className="input-field"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
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
