import { Bell, User, Moon, Sun } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/SocketContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount } = useContext(NotificationContext) || {
    notifications: [],
    unreadCount: 0,
  };
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
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
        return "bg-purple-600";
      case "doctor":
        return "bg-accent";
      case "patient":
        return "bg-blue-600";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="fixed top-0 right-0 left-64 bg-white dark:bg-slate-800 shadow-md px-8 py-4 flex justify-between items-center border-b border-border dark:border-slate-700 z-30 transition-colors duration-200">
      <div>
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Welcome back, {user?.name}
        </h2>
        <p className="text-muted dark:text-slate-400 text-sm">
          {getRoleGreeting()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            console.log("Toggle clicked, current darkMode:", darkMode);
            toggleDarkMode();
          }}
          className="p-3 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-border dark:hover:border-slate-600"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? (
            <Sun size={24} className="text-yellow-400" />
          ) : (
            <Moon size={24} className="text-slate-600" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
            <Bell
              size={24}
              className="text-muted dark:text-slate-400 group-hover:text-primary transition-colors"
            />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-border dark:border-slate-700">
                <h3 className="font-bold text-dark dark:text-white">
                  Notifications
                </h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted dark:text-slate-400">
                  <Bell
                    size={48}
                    className="mx-auto mb-3 text-gray-300 dark:text-slate-600"
                  />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border dark:divide-slate-700">
                  {notifications.slice(0, 10).map((notif, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(`/${user?.role}/notifications`);
                      }}
                      className="p-4 hover:bg-secondary dark:hover:bg-slate-700 transition-colors cursor-pointer">
                      <h4 className="font-semibold text-dark dark:text-white text-sm">
                        {notif.title}
                      </h4>
                      <p className="text-muted dark:text-slate-400 text-sm mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border dark:border-slate-700">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(`/${user?.role}/notifications`);
                    }}
                    className="w-full text-center text-primary hover:text-blue-800 dark:hover:text-blue-400 font-semibold text-sm transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l-2 border-border dark:border-slate-700">
          <div
            className={`w-11 h-11 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md`}>
            <User size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-dark dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-primary dark:text-blue-400 font-medium uppercase">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
