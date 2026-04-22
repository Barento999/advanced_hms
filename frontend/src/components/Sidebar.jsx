import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const getMenuItems = () => {
    if (user?.role === "admin") {
      return [
        { icon: Home, label: "Dashboard", path: "/admin" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
      ];
    } else if (user?.role === "doctor") {
      return [
        { icon: Home, label: "Dashboard", path: "/doctor" },
        { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
        { icon: Users, label: "Patients", path: "/doctor/patients" },
        { icon: FileText, label: "Medical Records", path: "/doctor/records" },
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
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-primary via-orange-600 to-orange-700 h-screen flex flex-col shadow-2xl z-40">
      <div className="p-6 border-b border-orange-500/30">
        <h1 className="text-2xl font-bold text-white">HealthCare</h1>
        <p className="text-sm text-orange-100 mt-1">
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
                  ? "bg-white text-primary shadow-lg transform scale-105"
                  : "text-white/90 hover:bg-white/20 hover:text-white"
              }`}>
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-orange-500/30">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-red-500 hover:text-white w-full transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
