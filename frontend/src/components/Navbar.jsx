import { Bell, User } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { notifications } = useContext(SocketContext);
  const [showNotifications, setShowNotifications] = useState(false);

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
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 hover:bg-orange-100 rounded-xl transition-all duration-200 group">
            <Bell
              size={24}
              className="text-gray-600 group-hover:text-primary transition-colors"
            />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-dark">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.slice(0, 10).map((notif, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-dark text-sm">
                        {notif.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
