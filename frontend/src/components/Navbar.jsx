import { Bell, User, Moon, Sun, ChevronDown, Shield, Menu } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/SocketContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount } = useContext(NotificationContext) || {
    notifications: [],
    unreadCount: 0,
  };
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const navigate = useNavigate();
  const adminDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setShowAdminDropdown(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white dark:bg-slate-800 shadow-md px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center border-b border-border dark:border-slate-700 z-30 transition-all duration-200">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl transition-colors flex-shrink-0"
          aria-label="Open menu">
          <Menu size={24} className="text-dark dark:text-white" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark dark:text-white truncate">
            Welcome back, {user?.name}
          </h2>
          <p className="text-muted dark:text-slate-400 text-xs sm:text-sm hidden sm:block">
            {getRoleGreeting()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            console.log("Toggle clicked, current darkMode:", darkMode);
            toggleDarkMode();
          }}
          className="p-2 sm:p-3 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-border dark:hover:border-slate-600"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? (
            <Sun size={20} className="sm:w-6 sm:h-6 text-yellow-400" />
          ) : (
            <Moon size={20} className="sm:w-6 sm:h-6 text-slate-600" />
          )}
        </button>

        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-3 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
            <Bell
              size={20}
              className="sm:w-6 sm:h-6 text-muted dark:text-slate-400 group-hover:text-primary transition-colors"
            />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 lg:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-3 sm:p-4 border-b border-border dark:border-slate-700">
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

        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 lg:pl-4 border-l-2 border-border dark:border-slate-700">
          {/* Admin Dropdown */}
          {user?.role === "admin" ? (
            <div className="relative" ref={adminDropdownRef}>
              {/* Mobile - Circle Only */}
              <button
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                className="sm:hidden p-1 hover:bg-secondary dark:hover:bg-slate-700 rounded-full transition-all duration-200">
                <div
                  className={`w-9 h-9 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md`}>
                  <User size={18} className="text-white" />
                </div>
              </button>

              {/* Desktop - Full Profile with Dropdown */}
              <button
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                className="hidden sm:flex items-center gap-2 hover:bg-secondary dark:hover:bg-slate-700 rounded-xl px-2 sm:px-3 py-2 transition-all duration-200 group">
                <div
                  className={`w-9 h-9 lg:w-11 lg:h-11 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                  <User size={18} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-dark dark:text-white text-sm lg:text-base truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-primary dark:text-blue-400 font-medium uppercase">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`sm:w-4 sm:h-4 text-muted dark:text-slate-400 group-hover:text-primary transition-all duration-200 flex-shrink-0 ${
                    showAdminDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Admin Dropdown Menu */}
              {showAdminDropdown && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 lg:w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border dark:border-slate-700 z-50 py-2">
                  <button
                    onClick={() => {
                      setShowAdminDropdown(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-secondary dark:hover:bg-slate-700 transition-colors text-left">
                    <User size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
                    <span className="text-dark dark:text-white font-medium text-sm sm:text-base">
                      Admin Profile
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAdminDropdown(false);
                      navigate("/admin/management");
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-secondary dark:hover:bg-slate-700 transition-colors text-left">
                    <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
                    <span className="text-dark dark:text-white font-medium text-sm sm:text-base">
                      Admin Management
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Non-admin users - Circle on mobile, full on desktop */
            <>
              {/* Mobile - Circle Only */}
              <div className="sm:hidden">
                <div
                  className={`w-9 h-9 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md`}>
                  <User size={18} className="text-white" />
                </div>
              </div>

              {/* Desktop - Full Profile */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-9 h-9 lg:w-11 lg:h-11 ${getRoleBadgeColor()} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                  <User size={18} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-dark dark:text-white text-sm lg:text-base truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-primary dark:text-blue-400 font-medium uppercase">
                    {user?.role}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
