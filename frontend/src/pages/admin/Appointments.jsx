import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
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
        `/admin/appointments?all=true${statusParam}`,
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
        `/admin/appointments?page=${page}&limit=${pagination.itemsPerPage}${statusParam}`,
      );
      setAppointments(data.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Fetch appointments error:", error); // Debug log
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <AdminTablePageSkeleton
            title="All Appointments"
            subtitle="View and manage all patient appointments"
            showExportButton={true}
            exportData={[]}
            exportType="appointments"
            exportTitle="Appointments Report"
            exportFilename="appointments_report"
            showFilterButtons={true}
            filterOptions={[
              "all",
              "pending",
              "confirmed",
              "completed",
              "cancelled",
            ]}
            currentFilter={filter}
            onFilterChange={setFilter}
            rows={10}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                All Appointments
              </h2>

              <div className="flex items-center gap-4">
                <ExportButton
                  data={allAppointments}
                  type="appointments"
                  title={`${filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments Report`}
                  filename={`appointments_${filter}_report`}
                />

                <div className="flex gap-2">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "completed",
                    "cancelled",
                  ].map((status) => (
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
                  ))}
                </div>
              </div>
            </div>

            {appointments.length === 0 ? (
              <EmptyState
                type="appointments"
                title={
                  filter === "all"
                    ? "No appointments found"
                    : `No ${filter} appointments`
                }
                description={
                  filter === "all"
                    ? "No appointments have been scheduled yet. Appointments will appear here once patients book with doctors."
                    : `No ${filter} appointments found. Try checking other status filters.`
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
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-6">
                  {console.log(
                    "Admin Appointments Pagination state:",
                    pagination,
                  )}{" "}
                  {/* Debug log */}
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
    </div>
  );
};

export default Appointments;
