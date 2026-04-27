import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileGuard from "./components/ProfileGuard";

// Auth Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Notifications from "./pages/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/Profile";
import AdminManagement from "./pages/admin/AdminManagement";
import Doctors from "./pages/admin/Doctors";
import Patients from "./pages/admin/Patients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminReviews from "./pages/admin/Reviews";
import Analytics from "./pages/admin/Analytics";
import Reports from "./pages/admin/Reports";
import AdminDoctorProfile from "./pages/admin/DoctorProfile";
import AdminPatientProfile from "./pages/admin/PatientProfile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords";
import ViewMedicalRecords from "./pages/doctor/ViewMedicalRecords";
import DoctorReviews from "./pages/doctor/MyReviews";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/Profile";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import PatientMedicalRecords from "./pages/patient/MedicalRecords";
import Payments from "./pages/patient/Payments";
import Reviews from "./pages/patient/Reviews";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            marginTop: "10px",
            marginRight: "10px",
          },
          success: {
            style: {
              background: "#10B981",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={`/${user.role}`} />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to={`/${user.role}`} />}
        />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/records"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorMedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/view-records"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <ViewMedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/reviews"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/notifications"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <PatientDashboard />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <PatientProfile />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <BookAppointment />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <MyAppointments />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/records"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <PatientMedicalRecords />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/payments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <Payments />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/reviews"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <Reviews />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/notifications"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfileGuard>
                <Notifications />
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
