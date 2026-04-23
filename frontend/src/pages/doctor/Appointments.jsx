import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
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
      const url =
        filter === "all"
          ? "/doctor/appointments"
          : `/doctor/appointments?status=${filter}`;
      const { data } = await api.get(url);
      setAppointments(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status`, { status });
      toast.success("Status updated successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update status");
    }
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
                Appointments
              </h2>

              <div className="flex gap-2">
                {["all", "pending", "confirmed", "completed"].map((status) => (
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

            {loading ? (
              <TableSkeleton rows={8} />
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
                                onClick={() =>
                                  updateStatus(apt._id, "confirmed")
                                }
                                className="p-2 bg-green-100 dark:bg-green-900/30 text-accent dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(apt._id, "cancelled")
                                }
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                <X size={18} />
                              </button>
                            </div>
                          )}
                          {apt.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(apt._id, "completed")}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
