import { useState, useEffect } from "react";
import { Phone, Mail } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { PatientCardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Patients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // For export
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9, // 3x3 grid
  });

  useEffect(() => {
    fetchPatients();
    fetchAllPatients(); // Fetch all for export
  }, [pagination.currentPage]);

  const fetchAllPatients = async () => {
    try {
      const { data } = await api.get("/doctor/patients?all=true");
      setAllPatients(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all patients for export");
    }
  };

  const fetchPatients = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/doctor/patients?page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setPatients(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || data.data.length,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  My Patients
                </h2>
                <ExportButton
                  data={[]}
                  type="patients"
                  title="My Patients Report"
                  filename="my_patients_report"
                  disabled={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PatientCardSkeleton />
                <PatientCardSkeleton />
                <PatientCardSkeleton />
                <PatientCardSkeleton />
                <PatientCardSkeleton />
                <PatientCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-slate-100">
                My Patients
              </h2>
              <ExportButton
                data={allPatients}
                type="patients"
                title="My Patients Report"
                filename="my_patients_report"
              />
            </div>

            {patients.length === 0 ? (
              <EmptyState
                type="patients"
                title="No patients yet"
                description="You don't have any patients yet. Patients will appear here once they book appointments with you."
                className="py-12"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {patient.userId?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-dark dark:text-slate-100">
                            {patient.userId?.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {patient.gender} • {patient.bloodGroup || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                          <Mail size={16} />
                          <span className="text-sm">
                            {patient.userId?.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                          <Phone size={16} />
                          <span className="text-sm">
                            {patient.userId?.phone || "N/A"}
                          </span>
                        </div>
                      </div>

                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">
                            Allergies:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {patient.allergies.map((allergy, index) => (
                              <span
                                key={index}
                                className="badge bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;

