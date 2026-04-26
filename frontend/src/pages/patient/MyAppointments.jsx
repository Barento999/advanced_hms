import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { PatientAppointmentsSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // For export
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    appointment: null,
    loading: false,
  });

  useEffect(() => {
    fetchAppointments();
    fetchAllAppointments(); // Fetch all for export
  }, [pagination.currentPage]);

  const fetchAllAppointments = async () => {
    try {
      const { data } = await api.get("/patient/appointments?all=true");
      setAllAppointments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all appointments for export");
    }
  };

  const fetchAppointments = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/patient/appointments?page=${page}&limit=${pagination.itemsPerPage}`,
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

  const cancelAppointment = async (appointment) => {
    setConfirmModal({
      isOpen: true,
      appointment: appointment,
      loading: false,
    });
  };

  const handleConfirmCancel = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      await api.patch(
        `/patient/appointments/${confirmModal.appointment._id}/cancel`,
      );
      toast.success("Appointment cancelled");
      fetchAppointments();
      fetchAllAppointments(); // Refresh export data
      setConfirmModal({ isOpen: false, appointment: null, loading: false });
    } catch (error) {
      toast.error("Failed to cancel appointment");
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({ isOpen: false, appointment: null, loading: false });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        {loading ? (
          <PatientAppointmentsSkeleton />
        ) : (
          <div className="p-8 mt-20">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  My Appointments
                </h2>
                <ExportButton
                  data={allAppointments}
                  type="patientAppointments"
                  title="My Appointments Report"
                  filename="my_appointments_report"
                />
              </div>
              {appointments.length === 0 ? (
                <EmptyState
                  type="myAppointments"
                  actionText="Book Appointment"
                  onAction={() => navigate("/patient/doctors")}
                  className="py-12"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                          Doctor
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                          Time
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
                            {apt.doctorId?.userId?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-dark dark:text-slate-100">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-dark dark:text-slate-100">
                            {apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}
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
                              <button
                                onClick={() => cancelAppointment(apt)}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                <X size={18} />
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
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmCancel}
        type="cancel"
        itemName={`Appointment with Dr. ${confirmModal.appointment?.doctorId?.userId?.name}`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default MyAppointments;
