import { useState, useEffect } from "react";
import { Calendar, FileText, DollarSign, Activity } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import {
  StatCardSkeleton,
  ListSkeleton,
} from "../../components/LoadingSkeleton";
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

      const total = data.pagination.total;
      const upcoming = data.data.filter((a) =>
        ["pending", "confirmed"].includes(a.status),
      ).length;
      const completed = data.data.filter(
        (a) => a.status === "completed",
      ).length;

      setStats({ total, upcoming, completed });
    } catch (error) {
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

        <div className="p-8 mt-20">
          {loading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Recent Appointments
                  </h3>
                  <ListSkeleton items={5} />
                </div>
                <div className="card">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Recent Appointments
                  </h3>
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-dark">
                            {apt.doctorId?.userId?.name || "N/A"}
                          </h4>
                          <p className="text-sm text-gray-500">
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
                  <h3 className="text-xl font-bold text-dark mb-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
