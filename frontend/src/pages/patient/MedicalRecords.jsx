import { useState, useEffect } from "react";
import { FileText, Calendar, User } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import { ListSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get("/patient/medical-records");
      setRecords(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch medical records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="card">
            <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-6">
              My Medical Records
            </h2>

            {loading ? (
              <ListSkeleton items={3} />
            ) : records.length === 0 ? (
              <EmptyState type="medicalRecords" className="py-8" />
            ) : (
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
                              {new Date(record.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <FileText size={24} className="text-primary" />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
