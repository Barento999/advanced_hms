import { Bell, User } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/SocketContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount } = useContext(NotificationContext) || {
    notifications: [],
    unreadCount: 0,
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

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
        return "bg-gradient-to-br from-accent to-green-600";
      case "patient":
        return "bg-gradient-to-br from-blue-500 to-blue-700";
      default:
        return "bg-gradient-to-br from-primary to-blue-700";
    }
  };

  return (
    <div className="fixed top-0 right-0 left-64 bg-white shadow-md px-8 py-4 flex justify-between items-center border-b border-border z-30">
      <div>
        <h2 className="text-2xl font-bold text-dark">
          Welcome back, {user?.name}
        </h2>
        <p className="text-muted text-sm">{getRoleGreeting()}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 hover:bg-secondary rounded-xl transition-all duration-200 group">
            <Bell
              size={24}
              className="text-muted group-hover:text-primary transition-colors"
            />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-border z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-dark">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.slice(0, 10).map((notif, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(`/${user?.role}/notifications`);
                      }}
                      className="p-4 hover:bg-secondary transition-colors cursor-pointer">
                      <h4 className="font-semibold text-dark text-sm">
                        {notif.title}
                      </h4>
                      <p className="text-muted text-sm mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(`/${user?.role}/notifications`);
                    }}
                    className="w-full text-center text-primary hover:text-blue-700 font-semibold text-sm">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l-2 border-border">
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
