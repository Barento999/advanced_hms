import { Bell, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  // Role-specific greeting messages
  const getRoleGreeting = () => {
    switch (user?.role) {
      case "admin":
        return "Manage your healthcare system";
      case "doctor":
        return "Ready to help your patients today";
      case "patient":
        return "Your health is our priority";
      default:
        return "Have a great day at work";
    }
  };

  // Role-specific badge colors
  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-gradient-to-br from-purple-500 to-purple-700";
      case "doctor":
        return "bg-gradient-to-br from-primary to-orange-600";
      case "patient":
        return "bg-gradient-to-br from-blue-500 to-blue-700";
      default:
        return "bg-gradient-to-br from-primary to-orange-600";
    }
  };

  return (
    <div className="fixed top-0 right-0 left-64 bg-gradient-to-r from-white to-orange-50 shadow-lg px-8 py-4 flex justify-between items-center border-b-2 border-primary/20 z-30">
      <div>
        <h2 className="text-2xl font-bold text-primary">
          Welcome back, {user?.name}
        </h2>
        <p className="text-gray-600 text-sm">{getRoleGreeting()}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 hover:bg-orange-100 rounded-xl transition-all duration-200 group">
          <Bell
            size={24}
            className="text-gray-600 group-hover:text-primary transition-colors"
          />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l-2 border-orange-200">
          <div
            className={`w-11 h-11 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md`}>
            <User size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-dark">{user?.name}</p>
            <p className="text-xs text-primary font-medium uppercase">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
