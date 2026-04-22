import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Connect to Socket.io server
      const newSocket = io("http://localhost:5000");

      newSocket.on("connect", () => {
        console.log("Connected to Socket.io server");
        // Register user with their ID
        newSocket.emit("register", user._id);
      });

      // Listen for notifications
      newSocket.on("notification", (notification) => {
        console.log("Received notification:", notification);
        setNotifications((prev) => [notification, ...prev]);

        // Show toast notification
        toast.success(notification.message, {
          duration: 5000,
          icon: "🔔",
        });
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from Socket.io server");
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
