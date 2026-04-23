import { useState, useEffect } from "react";
import { Users, UserCheck, Calendar, DollarSign } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { DashboardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats?.totalUsers || 0}
              color="text-primary"
              bgColor="bg-orange-100"
            />
            <StatCard
              icon={UserCheck}
              title="Total Doctors"
              value={stats?.totalDoctors || 0}
              color="text-accent"
              bgColor="bg-green-100"
            />
            <StatCard
              icon={Calendar}
              title="Appointments"
              value={stats?.totalAppointments || 0}
              color="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={`$${stats?.totalRevenue || 0}`}
              color="text-purple-600"
              bgColor="bg-purple-100"
            />
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-dark mb-4">
              Recent Appointments
            </h3>
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAppointments?.map((apt) => (
                    <tr
                      key={apt._id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4">
                        {apt.patientId?.userId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {apt.doctorId?.userId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(apt.appointmentDate).toLocaleDateString()}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
