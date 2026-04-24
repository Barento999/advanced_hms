import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Users,
  UserCheck,
  Activity,
  DollarSign,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ExportButton from "../../components/ExportButton";
import { ListSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("users");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReports();
  }, [reportType, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/admin/reports?type=${reportType}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
      );
      setReports(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderUserReport = () => {
    if (!reports?.report) return null;

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          User Statistics Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {reports.report.map((item) => (
            <div
              key={item._id}
              className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark dark:text-slate-100 capitalize">
                  {item._id}s
                </h4>
                <Users className="text-primary" size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Total:
                  </span>
                  <span className="font-semibold text-dark dark:text-slate-100">
                    {item.count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Active:
                  </span>
                  <span className="font-semibold text-green-600">
                    {item.active}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Inactive:
                  </span>
                  <span className="font-semibold text-red-600">
                    {item.inactive}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointmentReport = () => {
    if (!reports?.report) return null;

    // Group by status
    const statusGroups = {};
    reports.report.forEach((item) => {
      const status = item._id.status;
      if (!statusGroups[status]) {
        statusGroups[status] = [];
      }
      statusGroups[status].push(item);
    });

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          Appointment Trends Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(statusGroups).map(([status, items]) => (
            <div
              key={status}
              className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark dark:text-slate-100 capitalize">
                  {status}
                </h4>
                <Activity className="text-primary" size={24} />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-dark dark:text-slate-100">
                  {items.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">
                  Total appointments
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly breakdown table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Month/Year
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.report.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    {item._id.month}/{item._id.year}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${item._id.status}`}>
                      {item._id.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100 font-semibold">
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRevenueReport = () => {
    if (!reports?.report) return null;

    const totalRevenue = reports.report.reduce(
      (sum, item) => sum + item.totalRevenue,
      0,
    );
    const totalTransactions = reports.report.reduce(
      (sum, item) => sum + item.transactionCount,
      0,
    );
    const avgTransaction =
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          Revenue Report
        </h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark dark:text-slate-100">
                Total Revenue
              </h4>
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark dark:text-slate-100">
                Transactions
              </h4>
              <Activity className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {totalTransactions}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark dark:text-slate-100">
                Avg Transaction
              </h4>
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${avgTransaction.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Month/Year
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Transactions
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Avg Transaction
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.report.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    {item._id.month}/{item._id.year}
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100 font-semibold">
                    ${item.totalRevenue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    {item.transactionCount}
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    ${item.avgTransaction.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDoctorReport = () => {
    if (!reports?.report) return null;

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          Doctor Performance Report
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
                  Experience
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Fee
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Appointments
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Completed
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                  Reviews
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.report.map((doctor, index) => (
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
                    {doctor.experience} years
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    ${doctor.consultationFee}
                  </td>
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    {doctor.totalAppointments}
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
                  <td className="py-3 px-4 text-dark dark:text-slate-100">
                    {doctor.totalReviews} (★{" "}
                    {doctor.avgReviewRating?.toFixed(1) || "N/A"})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    switch (reportType) {
      case "users":
        return renderUserReport();
      case "appointments":
        return renderAppointmentReport();
      case "revenue":
        return renderRevenueReport();
      case "doctors":
        return renderDoctorReport();
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                Detailed Reports
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-2">
                Generate and export comprehensive reports
              </p>
            </div>

            <ExportButton
              data={reports?.report || []}
              type={reportType}
              title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
              filename={`${reportType}_report_${dateRange.startDate}_${dateRange.endDate}`}
            />
          </div>

          {/* Filters */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
              Report Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="users">User Statistics</option>
                  <option value="appointments">Appointment Trends</option>
                  <option value="revenue">Revenue Analysis</option>
                  <option value="doctors">Doctor Performance</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Report Content */}
          {loading ? <ListSkeleton items={5} /> : renderReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
