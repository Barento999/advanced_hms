import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      // Admin can view all appointments
      const { data } = await api.get("/admin/appointments");
      setAppointments(data.data || []);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                All Appointments
              </h2>

              <div className="flex gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map(
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

            {loading ? (
              <TableSkeleton rows={10} />
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
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500 dark:text-slate-400">
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
