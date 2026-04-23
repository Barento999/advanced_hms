import { useContext, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { NotificationContext } from "../context/SocketContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const Notifications = () => {
  const { notifications, fetchNotifications, markAsRead } =
    useContext(NotificationContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await api.delete(`/notifications/${notificationId}`);
        toast.success("Notification deleted");
        fetchNotifications();
      } catch (error) {
        toast.error("Failed to delete notification");
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return "📅";
      case "payment":
        return "💰";
      case "medical":
        return "🏥";
      default:
        return "🔔";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">Notifications</h2>
              <p className="text-gray-600 mt-1">
                {unreadNotifications.length} unread notification
                {unreadNotifications.length !== 1 ? "s" : ""}
              </p>
            </div>
            {unreadNotifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition-colors">
                <CheckCheck size={18} />
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="card text-center py-16">
              <Bell size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                You'll see notifications here when you have updates
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-bold text-dark mb-4">
                    Unread ({unreadNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start gap-4 p-4 bg-orange-50 border-l-4 border-primary rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="Mark as read">
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-bold text-dark mb-4">
                    Read ({readNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow opacity-75">
                        <div className="text-3xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
