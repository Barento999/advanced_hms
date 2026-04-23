/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#F8FAFC",
        accent: "#10B981",
        highlight: "#E76F2E",
        dark: "#111827",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
