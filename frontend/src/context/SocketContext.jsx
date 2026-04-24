import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: () => {},
  markAsRead: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, loading } = useContext(AuthContext);
  const [lastCount, setLastCount] = useState(0);

  const fetchNotifications = async (page = 1, limit = 10) => {
    if (!user) return;

    try {
      const { data } = await api.get(
        `/notifications?page=${page}&limit=${limit}`,
      );
      setNotifications(data.data);
      setUnreadCount(
        data.unreadCount || data.data.filter((n) => !n.isRead).length,
      );

      // Show toast for new notifications (only on first page)
      if (page === 1 && data.unreadCount > lastCount && lastCount > 0) {
        const newNotifications = data.data.filter((n) => !n.isRead);
        if (newNotifications.length > 0) {
          toast.success(newNotifications[0].message, {
            duration: 5000,
            icon: "🔔",
          });
        }
      }
      if (page === 1) {
        setLastCount(
          data.unreadCount || data.data.filter((n) => !n.isRead).length,
        );
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return { data: [], unreadCount: 0 };
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Poll for notifications every 10 seconds
  useEffect(() => {
    if (loading || !user) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [user, loading]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
