import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { AdminTablePageSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // For export
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    appointment: null,
    loading: false,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchAppointments(1);
    fetchAllAppointments(); // Fetch all for export
  }, [filter]);

  useEffect(() => {
    fetchAppointments();
  }, [pagination.currentPage]);

  const fetchAllAppointments = async () => {
    try {
      const statusParam = filter === "all" ? "" : `&status=${filter}`;
      const { data } = await api.get(
        `/doctor/appointments?all=true${statusParam}`,
      );
      setAllAppointments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all appointments for export");
    }
  };

  const fetchAppointments = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const statusParam = filter === "all" ? "" : `&status=${filter}`;
      const { data } = await api.get(
        `/doctor/appointments?page=${page}&limit=${pagination.itemsPerPage}${statusParam}`,
      );
      setAppointments(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointment, status) => {
    const actionType =
      status === "confirmed"
        ? "confirm"
        : status === "cancelled"
          ? "reject"
          : status === "completed"
            ? "complete"
            : "update";

    setConfirmModal({
      isOpen: true,
      type: actionType,
      appointment: { ...appointment, newStatus: status },
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      await api.patch(
        `/doctor/appointments/${confirmModal.appointment._id}/status`,
        {
          status: confirmModal.appointment.newStatus,
        },
      );
      toast.success("Status updated successfully");
      fetchAppointments();
      fetchAllAppointments(); // Refresh export data
      setConfirmModal({
        isOpen: false,
        type: "",
        appointment: null,
        loading: false,
      });
    } catch (error) {
      toast.error("Failed to update status");
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({
        isOpen: false,
        type: "",
        appointment: null,
        loading: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <AdminTablePageSkeleton
            title="My Appointments"
            subtitle="Manage your patient appointments and consultations"
            showExportButton={true}
            exportData={[]}
            exportType="doctorAppointments"
            exportTitle="My Appointments Report"
            exportFilename="my_appointments_report"
            showFilterButtons={true}
            filterOptions={["all", "pending", "confirmed", "completed"]}
            currentFilter={filter}
            onFilterChange={setFilter}
            rows={8}
          />
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
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                My Appointments
              </h2>

              <div className="flex items-center gap-4">
                <ExportButton
                  data={allAppointments}
                  type="doctorAppointments"
                  title="My Appointments Report"
                  filename="my_appointments_report"
                />

                <div className="flex gap-2">
                  {["all", "pending", "confirmed", "completed"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                          filter === status
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {appointments.length === 0 ? (
              <EmptyState
                type="doctorAppointments"
                title={
                  filter === "all"
                    ? "No appointments found"
                    : `No ${filter} appointments`
                }
                description={
                  filter === "all"
                    ? "You don't have any appointments scheduled. Patients can book appointments with you through the system."
                    : `You don't have any ${filter} appointments. Check other status filters to see more appointments.`
                }
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                        Reason
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
                    {appointments.map((apt) => (
                      <tr
                        key={apt._id}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {apt.patientId?.userId?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-dark dark:text-slate-100">
                          {apt.reason}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge badge-${apt.status}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {apt.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(apt, "confirmed")}
                                className="p-2 bg-green-100 dark:bg-green-900/30 text-accent dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => updateStatus(apt, "cancelled")}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                <X size={18} />
                              </button>
                            </div>
                          )}
                          {apt.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(apt, "completed")}
                              className="btn-primary text-sm">
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
        itemName={`Appointment with ${confirmModal.appointment?.patientId?.userId?.name}`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Appointments;
