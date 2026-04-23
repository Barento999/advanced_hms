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
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 border border-border dark:border-slate-700">
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
            Create Account
          </h1>
          <p className="text-muted dark:text-slate-400 mt-2">
            Join our healthcare platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Email
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
              Phone
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

          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Register as
            </label>
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign Up"}
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
      </div>
    </div>
  );
};

export default Register;
