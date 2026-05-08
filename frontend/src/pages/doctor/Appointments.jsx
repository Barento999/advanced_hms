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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
          <div className="card">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-slate-100">
                  My Appointments
                </h2>

                <ExportButton
                  data={allAppointments}
                  type="doctorAppointments"
                  title="My Appointments Report"
                  filename="my_appointments_report"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "pending", "confirmed", "completed"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
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
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 p-4 border-b border-gray-200 dark:border-slate-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-dark dark:text-slate-100 truncate">
                              {apt.patientId?.userId?.name || "N/A"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                              {new Date(apt.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`badge badge-${apt.status} ml-2 flex-shrink-0`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                            Reason
                          </p>
                          <p className="text-sm font-medium text-dark dark:text-slate-100">
                            {apt.reason}
                          </p>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="px-4 pb-4">
                        {apt.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(apt, "confirmed")}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 dark:bg-green-900/30 text-accent dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium">
                              <Check size={16} />
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(apt, "cancelled")}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium">
                              <X size={16} />
                              Cancel
                            </button>
                          </div>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(apt, "completed")}
                            className="w-full px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                            Mark as Complete
                          </button>
                        )}
                      </div>
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
