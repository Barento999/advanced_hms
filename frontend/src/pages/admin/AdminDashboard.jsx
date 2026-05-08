import { useState, useEffect } from "react";
import { Users, UserCheck, Calendar, DollarSign } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { AdminDashboardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <AdminDashboardSkeleton />
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
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark dark:text-slate-100">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">
              Healthcare management system overview
            </p>
          </div>

          {/* Stats Grid - Responsive with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats?.totalUsers || 0}
              color="text-primary"
              bgColor="bg-orange-100 dark:bg-orange-900/30"
            />
            <StatCard
              icon={UserCheck}
              title="Total Doctors"
              value={stats?.totalDoctors || 0}
              color="text-accent"
              bgColor="bg-green-100 dark:bg-green-900/30"
            />
            <StatCard
              icon={Calendar}
              title="Appointments"
              value={stats?.totalAppointments || 0}
              color="text-yellow-600 dark:text-yellow-400"
              bgColor="bg-yellow-100 dark:bg-yellow-900/30"
            />
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={`$${stats?.totalRevenue || 0}`}
              color="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>

          {/* Recent Appointments - Mobile Responsive */}
          <div className="card">
            <h3 className="text-lg sm:text-xl font-bold text-dark dark:text-slate-100 mb-4">
              Recent Appointments
            </h3>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAppointments?.map((apt) => (
                    <tr
                      key={apt._id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                        {apt.patientId?.userId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                        {apt.doctorId?.userId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {stats?.recentAppointments?.map((apt) => (
                <div
                  key={apt._id}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                        Patient
                      </p>
                      <p className="font-medium text-dark dark:text-slate-100">
                        {apt.patientId?.userId?.name || "N/A"}
                      </p>
                    </div>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                      Doctor
                    </p>
                    <p className="text-sm text-dark dark:text-slate-100">
                      {apt.doctorId?.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                      Date
                    </p>
                    <p className="text-sm text-dark dark:text-slate-100">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {(!stats?.recentAppointments || stats.recentAppointments.length === 0) && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-slate-400">
                  No recent appointments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
