import { useContext, useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import ConfirmationModal from "../components/ConfirmationModal";
import { ListSkeleton } from "../components/LoadingSkeleton";
import { NotificationContext } from "../context/SocketContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const Notifications = () => {
  const { notifications, fetchNotifications, markAsRead } =
    useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    notification: null,
    loading: false,
  });

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications();
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    setConfirmModal({
      isOpen: true,
      type: "markAllRead",
      notification: null,
      loading: false,
    });
  };

  const handleDelete = async (notification) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      notification: notification,
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/notifications/${confirmModal.notification._id}`);
        toast.success("Notification deleted");
      } else if (confirmModal.type === "markAllRead") {
        await api.patch("/notifications/mark-all-read");
        toast.success("All notifications marked as read");
      }

      fetchNotifications();
      setConfirmModal({
        isOpen: false,
        type: "",
        notification: null,
        loading: false,
      });
    } catch (error) {
      toast.error(
        `Failed to ${confirmModal.type === "delete" ? "delete notification" : "mark all as read"}`,
      );
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({
        isOpen: false,
        type: "",
        notification: null,
        loading: false,
      });
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
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                Notifications
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
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

          {loading ? (
            <div className="card">
              <ListSkeleton items={6} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="card">
              <EmptyState type="notifications" className="py-12" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-bold text-dark dark:text-slate-100 mb-4">
                    Unread ({unreadNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-slate-700/50 border-l-4 border-primary rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark dark:text-slate-100">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 dark:text-slate-300 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">
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
                            onClick={() => handleDelete(notification)}
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
                  <h3 className="text-lg font-bold text-dark dark:text-slate-100 mb-4">
                    Read ({readNotifications.length})
                  </h3>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg hover:shadow-md transition-shadow opacity-75">
                        <div className="text-3xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark dark:text-slate-100">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 dark:text-slate-300 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(notification)}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        type={
          confirmModal.type === "markAllRead" ? "default" : confirmModal.type
        }
        title={
          confirmModal.type === "markAllRead" ? "Mark All as Read" : undefined
        }
        message={
          confirmModal.type === "markAllRead"
            ? "Are you sure you want to mark all notifications as read? This action cannot be undone."
            : undefined
        }
        itemName={confirmModal.type === "delete" ? "Notification" : ""}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Notifications;
