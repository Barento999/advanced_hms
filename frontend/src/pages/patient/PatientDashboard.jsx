import { useState, useEffect } from "react";
import { Calendar, FileText, DollarSign, Activity } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { PatientDashboardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/patient/appointments?limit=5");
      setAppointments(data.data);

      const total = data.totalItems || 0;
      const upcoming = data.data.filter((a) =>
        ["pending", "confirmed"].includes(a.status),
      ).length;
      const completed = data.data.filter(
        (a) => a.status === "completed",
      ).length;

      setStats({ total, upcoming, completed });
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        {loading ? (
          <PatientDashboardSkeleton />
        ) : (
          <div className="p-8 mt-20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                Patient Dashboard
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-2">
                Your healthcare journey and appointments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Calendar}
                title="Total Appointments"
                value={stats.total}
                color="text-primary"
                bgColor="bg-orange-100"
              />
              <StatCard
                icon={Activity}
                title="Upcoming"
                value={stats.upcoming}
                color="text-yellow-600"
                bgColor="bg-yellow-100"
              />
              <StatCard
                icon={FileText}
                title="Completed"
                value={stats.completed}
                color="text-accent"
                bgColor="bg-green-100"
              />
              <StatCard
                icon={DollarSign}
                title="Payments"
                value="$0"
                color="text-purple-600"
                bgColor="bg-purple-100"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                  Recent Appointments
                </h3>
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-dark dark:text-slate-100">
                          {apt.doctorId?.userId?.name || "N/A"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary text-left">
                    Book New Appointment
                  </button>
                  <button className="w-full btn-secondary text-left">
                    View Medical Records
                  </button>
                  <button className="w-full btn-secondary text-left">
                    Payment History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
