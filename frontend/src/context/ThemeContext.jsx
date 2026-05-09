import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("Error reading darkMode from localStorage:", error);
      return false;
    }
  });

  // Apply theme immediately on mount
  useEffect(() => {
    const htmlElement = document.documentElement;
    const saved = localStorage.getItem("darkMode");
    const isDark = saved ? JSON.parse(saved) : false;

    if (isDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    try {
      const htmlElement = document.documentElement;

      if (darkMode) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }

      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      console.log("Dark mode updated:", darkMode);
    } catch (error) {
      console.error("Error updating dark mode:", error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log("toggleDarkMode called, current state:", darkMode);
    setDarkMode((prev) => {
      const newValue = !prev;
      console.log("Setting darkMode to:", newValue);
      return newValue;
    });
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  console.log("ThemeProvider rendering with value:", value);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
