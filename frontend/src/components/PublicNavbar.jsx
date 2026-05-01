import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { Heart, Moon, Sun, Menu, X } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const PublicNavbar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-dark dark:text-slate-100">
              HealthCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-primary font-semibold"
                  : "text-gray-700 dark:text-slate-300 hover:text-primary"
              }`}>
              Home
            </Link>
            <Link
              to="/blog"
              className={`transition-colors ${
                isActive("/blog") || location.pathname.startsWith("/blog/")
                  ? "text-primary font-semibold"
                  : "text-gray-700 dark:text-slate-300 hover:text-primary"
              }`}>
              Blog
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode">
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Desktop Auth Buttons */}
            <Link
              to="/login"
              className="hidden md:block px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="hidden md:block px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors">
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 transition-colors ${
                  isActive("/")
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-slate-300 hover:text-primary"
                }`}>
                Home
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 transition-colors ${
                  isActive("/blog") || location.pathname.startsWith("/blog/")
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-slate-300 hover:text-primary"
                }`}>
                Blog
              </Link>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 px-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
