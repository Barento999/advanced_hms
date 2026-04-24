import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    patient: null,
    loading: false,
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/admin/users?role=patient&limit=50");
      setPatients(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (patient) => {
    setConfirmModal({
      isOpen: true,
      type: patient.isActive ? "deactivate" : "activate",
      patient: patient,
      loading: false,
    });
  };

  const handleDelete = async (patient) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      patient: patient,
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/admin/users/${confirmModal.patient._id}`);
        toast.success("Patient deleted successfully");
      } else if (
        confirmModal.type === "deactivate" ||
        confirmModal.type === "activate"
      ) {
        await api.patch(
          `/admin/users/${confirmModal.patient._id}/toggle-status`,
        );
        toast.success(`Patient ${confirmModal.type}d successfully`);
      }

      fetchPatients();
      setConfirmModal({
        isOpen: false,
        type: "",
        patient: null,
        loading: false,
      });
    } catch (error) {
      toast.error(`Failed to ${confirmModal.type} patient`);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({
        isOpen: false,
        type: "",
        patient: null,
        loading: false,
      });
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
              Patient Management
            </h2>

            {loading ? (
              <TableSkeleton rows={8} />
            ) : patients.length === 0 ? (
              <EmptyState type="patients" className="py-12" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {patient.name}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {patient.email}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {patient.phone}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"}`}>
                            {patient.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(patient)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                              {patient.isActive ? (
                                <ToggleRight size={20} />
                              ) : (
                                <ToggleLeft size={20} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(patient)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        type={confirmModal.type}
        itemName={`Patient (${confirmModal.patient?.name})`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Patients;
