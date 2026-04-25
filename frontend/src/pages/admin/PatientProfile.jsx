import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { DetailedProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientProfile();
  }, [id]);

  const fetchPatientProfile = async () => {
    setLoading(true);
    try {
      // Fetch patient details from the users endpoint with role filter
      const { data } = await api.get(`/admin/users?role=patient&all=true`);
      const patientData = data.data.find((pat) => pat._id === id);

      if (patientData) {
        setPatient(patientData);
      } else {
        toast.error("Patient not found");
        navigate("/admin/patients");
      }

      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patient profile");
      navigate("/admin/patients");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20">
            <DetailedProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-4">
                Patient Not Found
              </h2>
              <button
                onClick={() => navigate("/admin/patients")}
                className="btn btn-primary">
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin/patients")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft
                size={20}
                className="text-gray-600 dark:text-slate-400"
              />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                Patient Profile
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                Complete information about {patient.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={48} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-2">
                    {patient.name}
                  </h2>
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    {calculateAge(patient.dateOfBirth)} years old •{" "}
                    {patient.gender || "N/A"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Heart className="text-red-500" size={20} />
                    <span className="text-lg font-semibold text-dark dark:text-slate-100">
                      {patient.bloodGroup || "N/A"}
                    </span>
                  </div>
                  <div
                    className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"} text-lg px-4 py-2`}>
                    {patient.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <User size={24} />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Mail
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Email
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {patient.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Phone
                          size={20}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Phone
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {patient.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Calendar
                          size={20}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Date of Birth
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {formatDate(patient.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <User
                          size={20}
                          className="text-orange-600 dark:text-orange-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Joined
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Heart size={24} />
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Heart
                          size={20}
                          className="text-red-600 dark:text-red-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Blood Group
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {patient.bloodGroup || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <User
                          size={20}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Gender
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100 capitalize">
                          {patient.gender || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Calendar
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Age
                        </p>
                        <p className="font-medium text-dark dark:text-slate-100">
                          {calculateAge(patient.dateOfBirth)} years
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {patient.address && (
                <div className="card">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                      <MapPin size={24} />
                      Address Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <div className="space-y-2">
                        <p className="text-dark dark:text-slate-100">
                          <span className="font-medium">Street:</span>{" "}
                          {patient.address.street || "N/A"}
                        </p>
                        <p className="text-dark dark:text-slate-100">
                          <span className="font-medium">City:</span>{" "}
                          {patient.address.city || "N/A"}
                        </p>
                        <p className="text-dark dark:text-slate-100">
                          <span className="font-medium">State:</span>{" "}
                          {patient.address.state || "N/A"}
                        </p>
                        <p className="text-dark dark:text-slate-100">
                          <span className="font-medium">ZIP Code:</span>{" "}
                          {patient.address.zipCode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {patient.emergencyContact && (
                <div className="card">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                      <Phone size={24} />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <User
                            size={20}
                            className="text-orange-600 dark:text-orange-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Name
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {patient.emergencyContact.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Phone
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Phone
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {patient.emergencyContact.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Heart
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Relationship
                          </p>
                          <p className="font-medium text-dark dark:text-slate-100">
                            {patient.emergencyContact.relationship || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Allergies */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="card">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                      <AlertTriangle size={24} />
                      Allergies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Calendar size={24} />
                    Medical History & Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {patient.totalAppointments || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Total Appointments
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {patient.completedAppointments || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Completed
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {patient.medicalRecords || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Medical Records
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
