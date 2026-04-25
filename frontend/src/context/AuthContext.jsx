import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Fetch fresh user data to ensure we have complete information
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
          );
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
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
