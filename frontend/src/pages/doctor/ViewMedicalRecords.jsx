import { useState, useEffect } from "react";
import { FileText, Calendar, User, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import PrescriptionButton from "../../components/PrescriptionButton";
import { ListSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const ViewMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  useEffect(() => {
    fetchRecords();
  }, [pagination.currentPage, searchTerm]);

  const fetchRecords = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const { data } = await api.get(
        `/doctor/medical-records?page=${page}&limit=${pagination.itemsPerPage}${searchParam}`,
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSelectedRecord(null); // Close any open record when searching
    fetchRecords(1);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                Medical Records
              </h2>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by patient name or diagnosis..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </form>
            </div>

            {loading ? (
              <ListSkeleton items={5} />
            ) : records.length === 0 ? (
              <EmptyState
                type="medicalRecords"
                title={searchTerm ? "No records found" : "No medical records"}
                description={
                  searchTerm
                    ? "No records match your search criteria."
                    : "No medical records have been created yet."
                }
                className="py-8"
              />
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
                              <span>
                                {record.patientId?.userId?.name ||
                                  "Unknown Patient"}
                              </span>
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
                              name: record.patientId?.userId?.name || "Patient",
                              email: record.patientId?.userId?.email || "",
                              phone: record.patientId?.userId?.phone || "",
                              gender: record.patientId?.gender || "",
                              bloodGroup: record.patientId?.bloodGroup || "",
                              dateOfBirth: record.patientId?.dateOfBirth || "",
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
      </div>
    </div>
  );
};

export default ViewMedicalRecords;
