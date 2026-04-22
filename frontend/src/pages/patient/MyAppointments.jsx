import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/patient/appointments");
      setAppointments(data.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.patch(`/patient/appointments/${id}/cancel`);
        toast.success("Appointment cancelled");
        fetchAppointments();
      } catch (error) {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="card">
            <h2 className="text-2xl font-bold text-dark mb-6">
              My Appointments
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt._id}
                      className="border-b border-gray-100 hover:bg-gray-50">
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
                      <td className="py-3 px-4">
                        {apt.status === "pending" && (
                          <button
                            onClick={() => cancelAppointment(apt._id)}
                            className="p-2 bg-red-100 text-danger rounded-lg hover:bg-red-200 transition-colors">
                            <X size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
