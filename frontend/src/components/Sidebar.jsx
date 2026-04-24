import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  User,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Star,
  BarChart3,
  FileBarChart,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const getMenuItems = () => {
    if (user?.role === "admin") {
      return [
        { icon: Home, label: "Dashboard", path: "/admin" },
        { icon: Users, label: "Doctors", path: "/admin/doctors" },
        { icon: Users, label: "Patients", path: "/admin/patients" },
        { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
        { icon: Star, label: "Reviews", path: "/admin/reviews" },
        { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
        { icon: FileBarChart, label: "Reports", path: "/admin/reports" },
        { icon: Bell, label: "Notifications", path: "/admin/notifications" },
      ];
    } else if (user?.role === "doctor") {
      return [
        { icon: Home, label: "Dashboard", path: "/doctor" },
        { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
        { icon: Users, label: "Patients", path: "/doctor/patients" },
        {
          icon: FileText,
          label: "Add Medical Record",
          path: "/doctor/records",
        },
        { icon: FileText, label: "View Records", path: "/doctor/view-records" },
        { icon: Settings, label: "Schedule", path: "/doctor/schedule" },
        { icon: Star, label: "Reviews", path: "/doctor/reviews" },
        { icon: Bell, label: "Notifications", path: "/doctor/notifications" },
      ];
    } else {
      return [
        { icon: Home, label: "Dashboard", path: "/patient" },
        { icon: Users, label: "Doctors", path: "/patient/doctors" },
        {
          icon: Calendar,
          label: "Appointments",
          path: "/patient/appointments",
        },
        { icon: FileText, label: "Medical Records", path: "/patient/records" },
        { icon: CreditCard, label: "Payments", path: "/patient/payments" },
        { icon: Star, label: "Reviews", path: "/patient/reviews" },
        { icon: Bell, label: "Notifications", path: "/patient/notifications" },
      ];
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className="fixed left-0 top-0 w-64 h-screen flex flex-col shadow-2xl z-40 transition-colors duration-200"
      style={{ backgroundColor: "#1E3A8A" }}>
      <div className="dark:bg-slate-900 dark:shadow-slate-900/50 h-full flex flex-col">
        <div className="p-6 border-b border-white/10 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-white dark:text-slate-100">
            HealthCare
          </h1>
          <p className="text-sm text-white/80 dark:text-slate-400 mt-1">
            {user?.role?.toUpperCase()}
          </p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-primary dark:text-slate-100 shadow-lg transform scale-105"
                    : "text-white/90 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-100"
                }`}>
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 dark:border-slate-700">
          {user?.role === "patient" && (
            <Link
              to="/patient/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                location.pathname === "/patient/profile"
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-slate-100 shadow-lg transform scale-105"
                  : "text-white/90 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-100"
              }`}>
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
          )}
          {user?.role === "doctor" && (
            <Link
              to="/doctor/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                location.pathname === "/doctor/profile"
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-slate-100 shadow-lg transform scale-105"
                  : "text-white/90 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-100"
              }`}>
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 dark:text-slate-300 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white dark:hover:text-white w-full transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => !logoutLoading && setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        type="logout"
        loading={logoutLoading}
      />
    </div>
  );
};

export default Sidebar;
