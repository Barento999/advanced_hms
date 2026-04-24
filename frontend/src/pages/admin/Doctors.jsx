import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    doctor: null,
    loading: false,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/admin/users?role=doctor&limit=50");
      setDoctors(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctor) => {
    setConfirmModal({
      isOpen: true,
      type: doctor.isActive ? "deactivate" : "activate",
      doctor: doctor,
      loading: false,
    });
  };

  const handleDelete = async (doctor) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      doctor: doctor,
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/admin/users/${confirmModal.doctor._id}`);
        toast.success("Doctor deleted successfully");
      } else if (
        confirmModal.type === "deactivate" ||
        confirmModal.type === "activate"
      ) {
        await api.patch(
          `/admin/users/${confirmModal.doctor._id}/toggle-status`,
        );
        toast.success(`Doctor ${confirmModal.type}d successfully`);
      }

      fetchDoctors();
      setConfirmModal({
        isOpen: false,
        type: "",
        doctor: null,
        loading: false,
      });
    } catch (error) {
      toast.error(`Failed to ${confirmModal.type} doctor`);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({
        isOpen: false,
        type: "",
        doctor: null,
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
              Doctor Management
            </h2>

            {loading ? (
              <TableSkeleton rows={8} />
            ) : doctors.length === 0 ? (
              <EmptyState type="doctors" className="py-12" />
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
                    {doctors.map((doctor) => (
                      <tr
                        key={doctor._id}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {doctor.name}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {doctor.email}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {doctor.phone}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`badge ${doctor.isActive ? "badge-completed" : "badge-cancelled"}`}>
                            {doctor.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(doctor)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                              {doctor.isActive ? (
                                <ToggleRight size={20} />
                              ) : (
                                <ToggleLeft size={20} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(doctor)}
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
        itemName={`Doctor (${confirmModal.doctor?.name})`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Doctors;
