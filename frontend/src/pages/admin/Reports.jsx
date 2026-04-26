import { useState, useEffect } from "react";
import { Users, Activity, DollarSign } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ExportButton from "../../components/ExportButton";
import { ReportsSkeleton } from "../../components/LoadingSkeleton";
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
    // Add a small delay to prevent too many API calls when dates change rapidly
    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [reportType, dateRange.startDate, dateRange.endDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      console.log("Fetching reports with:", { reportType, dateRange }); // Debug log

      // Build query parameters
      let queryParams = `type=${reportType}`;
      if (dateRange.startDate && dateRange.endDate) {
        queryParams += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }

      console.log("API URL:", `/admin/reports?${queryParams}`); // Debug log

      const { data } = await api.get(`/admin/reports?${queryParams}`);
      console.log("Reports response:", data); // Debug log
      setReports(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to fetch reports");
      setReports(null); // Reset reports on error
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => {
      const newRange = {
        ...prev,
        [field]: value,
      };

      // Validate date range
      if (
        field === "startDate" &&
        newRange.endDate &&
        new Date(value) > new Date(newRange.endDate)
      ) {
        toast.error("Start date cannot be after end date");
        return prev; // Don't update if invalid
      }

      if (
        field === "endDate" &&
        newRange.startDate &&
        new Date(value) < new Date(newRange.startDate)
      ) {
        toast.error("End date cannot be before start date");
        return prev; // Don't update if invalid
      }

      return newRange;
    });
  };

  const renderUserReport = () => {
    if (!reports?.report || reports.report.length === 0) {
      return (
        <div className="card">
          <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
            User Statistics Report
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-slate-400">
              No user data found for the selected date range.
            </p>
          </div>
        </div>
      );
    }

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
    if (!reports?.report || reports.report.length === 0) {
      return (
        <div className="card">
          <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
            Appointment Trends Report
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-slate-400">
              No appointment data found for the selected date range.
            </p>
          </div>
        </div>
      );
    }

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
    if (!reports?.report || reports.report.length === 0) {
      return (
        <div className="card">
          <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
            Revenue Report
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-slate-400">
              No revenue data found for the selected date range.
            </p>
          </div>
        </div>
      );
    }

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
    if (!reports?.report || reports.report.length === 0) {
      return (
        <div className="card">
          <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
            Doctor Performance Report
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-slate-400">
              No doctor data found for the selected date range.
            </p>
          </div>
        </div>
      );
    }

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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <ReportsSkeleton
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            fetchReports={fetchReports}
            loading={loading}
          />
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
                Report Filters
              </h3>
              <button
                onClick={fetchReports}
                disabled={loading}
                className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
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

            {/* Debug info */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm">
              <div className="flex justify-between items-center mb-2">
                <strong>Debug Info:</strong>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setDateRange({
                        startDate: "",
                        endDate: "",
                      })
                    }
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                    No Filter
                  </button>
                  <button
                    onClick={() =>
                      setDateRange({
                        startDate: new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1,
                        )
                          .toISOString()
                          .split("T")[0],
                        endDate: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    This Month
                  </button>
                  <button
                    onClick={() =>
                      setDateRange({
                        startDate: new Date(new Date().getFullYear(), 0, 1)
                          .toISOString()
                          .split("T")[0],
                        endDate: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                    This Year
                  </button>
                  <button
                    onClick={() =>
                      setDateRange({
                        startDate: new Date(
                          Date.now() - 30 * 24 * 60 * 60 * 1000,
                        )
                          .toISOString()
                          .split("T")[0],
                        endDate: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="px-2 py-1 bg-purple-500 text-white text-xs rounded">
                    Last 30 Days
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const { data } = await api.get("/admin/data-counts");
                        console.log("Data counts:", data);
                        toast.success(
                          `Found ${data.data.counts.users} users, ${data.data.counts.appointments} appointments`,
                        );
                      } catch (error) {
                        console.error("Data counts error:", error);
                        toast.error("Failed to fetch data counts");
                      }
                    }}
                    className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                    Check Data
                  </button>
                </div>
              </div>
              Type: {reportType}, Start: {dateRange.startDate || "None"}, End:{" "}
              {dateRange.endDate || "None"}
              {reports && (
                <div>
                  Results:{" "}
                  {Array.isArray(reports.report)
                    ? reports.report.length
                    : "N/A"}{" "}
                  items
                </div>
              )}
            </div>
          </div>

          {/* Report Content */}
          {renderReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
