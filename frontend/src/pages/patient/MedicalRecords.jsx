import { useState, useEffect } from "react";
import { FileText, Calendar, User } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import PrescriptionButton from "../../components/PrescriptionButton";
import { PatientMedicalRecordsSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MedicalRecords = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]); // For export
  const [patientProfile, setPatientProfile] = useState(null); // For prescription
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  useEffect(() => {
    fetchPatientProfile();
    fetchRecords();
    fetchAllRecords(); // Fetch all for export
  }, [pagination.currentPage]);

  const fetchPatientProfile = async () => {
    try {
      const { data } = await api.get("/patient/profile");
      setPatientProfile(data.data);
    } catch (error) {
      console.error("Failed to fetch patient profile:", error);
      toast.error("Failed to load patient profile");
    }
  };

  const fetchAllRecords = async () => {
    try {
      const { data } = await api.get("/patient/medical-records?all=true");
      setAllRecords(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all medical records for export");
    }
  };

  const fetchRecords = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/patient/medical-records?page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setRecords(data.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch medical records");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    setSelectedRecord(null); // Close any open record when changing pages
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64 overflow-x-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {loading ? (
          <PatientMedicalRecordsSkeleton />
        ) : (
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
            <div className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-slate-100">
                  My Medical Records
                </h2>
                <ExportButton
                  data={allRecords.length > 0 ? allRecords : records}
                  type="medicalRecords"
                  title="Medical Records Report"
                  filename="medical_records"
                />
              </div>
              {records.length === 0 ? (
                <EmptyState type="medicalRecords" className="py-8" />
              ) : (
                <>
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record._id}
                        className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() =>
                          setSelectedRecord(
                            selectedRecord?._id === record._id ? null : record,
                          )
                        }>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-2">
                              {record.diagnosis}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{record.doctorId?.userId?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>
                                  {new Date(
                                    record.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <PrescriptionButton
                              medicalRecord={record}
                              patientInfo={{
                                name: patientProfile?.userId?.name || "Patient",
                                email: patientProfile?.userId?.email || "",
                                phone: patientProfile?.userId?.phone || "",
                                gender: patientProfile?.gender || "",
                                bloodGroup: patientProfile?.bloodGroup || "",
                                dateOfBirth: patientProfile?.dateOfBirth || "",
                              }}
                              doctorInfo={{
                                name: record.doctorId?.userId?.name || "Doctor",
                                email: record.doctorId?.userId?.email || "",
                                phone: record.doctorId?.userId?.phone || "",
                                specialization:
                                  record.doctorId?.specialization || "",
                              }}
                            />
                            <FileText size={24} className="text-primary" />
                          </div>
                        </div>

                        {selectedRecord?._id === record._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-4">
                            {record.symptoms && record.symptoms.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                  Symptoms:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {record.symptoms.map((symptom, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {record.prescription &&
                              record.prescription.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    Prescription:
                                  </h4>
                                  <div className="space-y-3">
                                    {record.prescription.map((med, index) => (
                                      <div
                                        key={index}
                                        className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                                        <p className="font-semibold text-dark dark:text-slate-100">
                                          {med.medicine}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                          Dosage: {med.dosage}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                          Duration: {med.duration}
                                        </p>
                                        {med.instructions && (
                                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                            Instructions: {med.instructions}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {record.notes && (
                              <div>
                                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                  Doctor's Notes:
                                </h4>
                                <p className="text-gray-600 dark:text-slate-400">
                                  {record.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
