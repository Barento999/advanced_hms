import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const ProfileGuard = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Only check for patients
      if (!user || user.role !== "patient") {
        setProfileLoading(false);
        return;
      }

      // Don't check if already on complete-profile page
      if (location.pathname === "/complete-profile") {
        setProfileLoading(false);
        return;
      }

      try {
        const response = await api.get("/patient/profile-completion");

        if (response.data.success) {
          const { profileCompleted } = response.data.data;

          if (!profileCompleted) {
            // Profile is incomplete, redirect to complete profile
            toast.error("Please complete your medical profile to continue");
            navigate("/complete-profile", { replace: true });
            return;
          }

          setProfileComplete(true);
        }
      } catch (error) {
        console.error("Profile completion check failed:", error);
        // If check fails, assume profile is incomplete and redirect
        toast.error("Please complete your medical profile to continue");
        navigate("/complete-profile", { replace: true });
        return;
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading && user) {
      checkProfileCompletion();
    } else if (!authLoading) {
      setProfileLoading(false);
    }
  }, [user, authLoading, navigate, location.pathname]);

  // Show loading while checking
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">
            Checking profile status...
          </p>
        </div>
      </div>
    );
  }

  // For non-patients or when profile is complete, render children
  if (
    !user ||
    user.role !== "patient" ||
    profileComplete ||
    location.pathname === "/complete-profile"
  ) {
    return children;
  }

  // This shouldn't be reached, but just in case
  return null;
};

export default ProfileGuard;
