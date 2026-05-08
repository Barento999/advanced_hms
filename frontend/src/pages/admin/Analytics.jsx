import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Users, Calendar, DollarSign, Activity, Filter } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import ExportButton from "../../components/ExportButton";
import { DashboardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const COLORS = ["#1E3A8A", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/analytics?period=${period}`);
      setAnalytics(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to fetch analytics data");
      setAnalytics(null); // Reset analytics on error
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const processUserTrends = () => {
    if (!analytics?.userTrends || analytics.userTrends.length === 0) return [];

    const dateMap = {};
    analytics.userTrends.forEach((item) => {
      const date = item._id.date;
      if (!dateMap[date]) {
        dateMap[date] = { date, admin: 0, doctor: 0, patient: 0 };
      }
      dateMap[date][item._id.role] = item.count;
    });

    return Object.values(dateMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  };

  const processAppointmentTrends = () => {
    if (
      !analytics?.appointmentTrends ||
      analytics.appointmentTrends.length === 0
    )
      return [];

    const dateMap = {};
    analytics.appointmentTrends.forEach((item) => {
      const date = item._id.date;
      if (!dateMap[date]) {
        dateMap[date] = {
          date,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      dateMap[date][item._id.status] = item.count;
    });

    return Object.values(dateMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  };

  const processRevenueTrends = () => {
    if (!analytics?.revenueTrends || analytics.revenueTrends.length === 0)
      return [];

    return analytics.revenueTrends
      .map((item) => ({
        date: item._id,
        revenue: item.revenue,
        transactions: item.count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const processSpecializationData = () => {
    if (
      !analytics?.specializationStats ||
      analytics.specializationStats.length === 0
    )
      return [];

    return analytics.specializationStats.map((item) => ({
      name: item._id,
      value: item.count,
      avgRating: item.avgRating?.toFixed(1) || 0,
      avgFee: item.avgFee?.toFixed(0) || 0,
    }));
  };

  const processAppointmentStatusData = () => {
    if (
      !analytics?.appointmentStatusStats ||
      analytics.appointmentStatusStats.length === 0
    )
      return [];

    return analytics.appointmentStatusStats.map((item) => ({
      name: item._id,
      value: item.count,
    }));
  };

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const revenueGrowth = analytics?.revenueComparison
    ? calculateGrowth(
        analytics.revenueComparison.current.total,
        analytics.revenueComparison.previous.total,
      )
    : 0;

  if (loading) {
    return (
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <DashboardSkeleton
            title="Analytics & Reports"
            subtitle="Comprehensive insights and performance metrics"
            showExportButton={true}
            exportData={[]}
            exportType="analytics"
            exportTitle="Analytics Report"
            exportFilename="analytics_report"
            period={period}
            setPeriod={setPeriod}
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-slate-100">
                Analytics & Reports
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">
                Comprehensive insights and performance metrics
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Period Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500 flex-shrink-0 sm:w-5 sm:h-5" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              {/* Export Button */}
              <ExportButton
                data={analytics || {}}
                type="analytics"
                title={`Analytics Report - ${period}`}
                filename={`analytics_${period}`}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={`$${analytics?.revenueComparison?.current?.total || 0}`}
              change={`${revenueGrowth}%`}
              changeType={revenueGrowth >= 0 ? "increase" : "decrease"}
              color="text-primary"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatCard
              icon={Users}
              title="New Users"
              value={
                analytics?.userTrends?.reduce(
                  (sum, item) => sum + item.count,
                  0,
                ) || 0
              }
              color="text-accent"
              bgColor="bg-green-100 dark:bg-green-900/30"
            />
            <StatCard
              icon={Calendar}
              title="Appointments"
              value={
                analytics?.appointmentTrends?.reduce(
                  (sum, item) => sum + item.count,
                  0,
                ) || 0
              }
              color="text-yellow-600"
              bgColor="bg-yellow-100 dark:bg-yellow-900/30"
            />
            <StatCard
              icon={Activity}
              title="Top Doctors"
              value={analytics?.topDoctors?.length || 0}
              color="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Registration Trends */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                User Registration Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={processUserTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="patient"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                  />
                  <Area
                    type="monotone"
                    dataKey="doctor"
                    stackId="1"
                    stroke="#1E3A8A"
                    fill="#1E3A8A"
                  />
                  <Area
                    type="monotone"
                    dataKey="admin"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trends */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                Revenue Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processRevenueTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={(value, name) => [
                      name === "revenue" ? `$${value}` : value,
                      name === "revenue" ? "Revenue" : "Transactions",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1E3A8A"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Appointment Status Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                Appointment Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processAppointmentStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {processAppointmentStatusData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Doctor Specialization Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
                Doctor Specializations
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processSpecializationData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "value" ? "Count" : name,
                    ]}
                  />
                  <Bar dataKey="value" fill="#1E3A8A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointment Trends */}
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
              Appointment Trends by Status
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={processAppointmentTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                />
                <Area
                  type="monotone"
                  dataKey="confirmed"
                  stackId="1"
                  stroke="#1E3A8A"
                  fill="#1E3A8A"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performing Doctors */}
          <div className="card">
            <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
              Top Performing Doctors
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Specialization
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Total Appointments
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Completed
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.topDoctors?.map((doctor, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-dark dark:text-slate-100 font-medium">
                        {doctor.name}
                      </td>
                      <td className="py-3 px-4 text-dark dark:text-slate-100">
                        {doctor.specialization}
                      </td>
                      <td className="py-3 px-4 text-dark dark:text-slate-100">
                        {doctor.appointmentCount}
                      </td>
                      <td className="py-3 px-4 text-dark dark:text-slate-100">
                        {doctor.completedAppointments}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-dark dark:text-slate-100">
                            {doctor.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {doctor.appointmentCount > 0
                            ? (
                                (doctor.completedAppointments /
                                  doctor.appointmentCount) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
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

export default Analytics;
