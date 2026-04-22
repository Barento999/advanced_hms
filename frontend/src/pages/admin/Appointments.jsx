import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark">All Appointments</h2>

              <div className="flex gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        filter === status
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Reason
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500">
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr
                          key={apt._id}
                          className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {apt.patientId?.userId?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            Dr. {apt.doctorId?.userId?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}
                          </td>
                          <td className="py-3 px-4">{apt.reason}</td>
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
