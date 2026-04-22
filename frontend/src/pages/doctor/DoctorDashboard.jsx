import { useState, useEffect } from "react";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/doctor/appointments?limit=5");
      setAppointments(data.data);

      const total = data.pagination.total;
      const pending = data.data.filter((a) => a.status === "pending").length;
      const confirmed = data.data.filter(
        (a) => a.status === "confirmed",
      ).length;
      const completed = data.data.filter(
        (a) => a.status === "completed",
      ).length;

      setStats({ total, pending, confirmed, completed });
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              title="Total Appointments"
              value={stats.total}
              color="text-primary"
              bgColor="bg-orange-100"
            />
            <StatCard
              icon={Clock}
              title="Pending"
              value={stats.pending}
              color="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            <StatCard
              icon={Users}
              title="Confirmed"
              value={stats.confirmed}
              color="text-primary"
              bgColor="bg-orange-100"
            />
            <StatCard
              icon={CheckCircle}
              title="Completed"
              value={stats.completed}
              color="text-accent"
              bgColor="bg-green-100"
            />
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-dark mb-4">
              Upcoming Appointments
            </h3>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {apt.patientId?.userId?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">
                        {apt.patientId?.userId?.name || "Patient"}
                      </h4>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </p>
                    <span className={`badge badge-${apt.status} mt-1`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
