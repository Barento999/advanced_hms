import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          // Fetch fresh user data to ensure we have complete information
          const response = await api.get("/auth/me");
          if (response.data.success) {
            const freshUserData = response.data.data;
            setUser(freshUserData);
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(freshUserData));
          } else {
            // If token is invalid, clear auth data
            logout();
          }
        } catch (error) {
          // If request fails (invalid token, etc.), clear auth data
          console.error("Auth initialization failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to landing page after logout
    window.location.href = "/";
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
