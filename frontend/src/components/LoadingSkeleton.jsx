// Reusable skeleton components for loading states
import { ArrowLeft, Filter, Plus, CheckCheck } from "lucide-react";
import ExportButton from "./ExportButton";

export const MedicalRecordSkeleton = () => (
  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Prescription Button Skeleton - More Precise */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-xl">
          <div className="w-4 h-4 bg-gray-300 dark:bg-slate-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-20"></div>
          <div className="w-3 h-3 bg-gray-300 dark:bg-slate-600 rounded"></div>
        </div>
        {/* File Icon Skeleton */}
        <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
);

export const AppointmentReviewSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {/* Doctor Name - h3 text-lg font-semibold */}
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-1"></div>
        {/* Specialization - p text-sm mt-1 */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-36 mb-2"></div>
        {/* Appointment Date - p text-sm mt-2 */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-52 mb-1"></div>
        {/* Time - p text-sm */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
      </div>
      <div>
        {/* Button or Badge - btn-primary or badge */}
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const PatientCardSkeleton = () => (
  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-12"></div>
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {/* Title */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
        {/* Value */}
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16 mb-1"></div>
        {/* Optional change indicator */}
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-12"></div>
      </div>
      {/* Icon */}
      <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-slate-700">
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-40 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-20 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
    </td>
  </tr>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-slate-700">
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export const ReviewCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            {/* Patient Name - h4 font-semibold */}
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-1"></div>
            {/* Stars + Date - flex items-center gap-2 mt-1 */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
            </div>
          </div>
        </div>
        {/* Comment - p mt-3 */}
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

export const DoctorReviewsSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
            My Reviews
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            See what your patients are saying about you
          </p>
        </div>
        <ExportButton
          data={[]}
          type="reviews"
          title="My Reviews Report"
          filename="my_reviews_report"
          disabled={true}
        />
      </div>
    </div>

    {/* Rating Summary Card Skeleton */}
    <div className="card mb-6 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="text-center">
          {/* Large Rating Number */}
          <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-20 mx-auto mb-2"></div>
          {/* Stars */}
          <div className="flex justify-center gap-1 mt-2 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
          {/* Review Count */}
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="flex-1 border-l dark:border-slate-700 pl-6">
          {/* Rating Breakdown Title */}
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-3"></div>
          {/* Rating Breakdown Bars */}
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3 mb-2">
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-12"></div>
              <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Reviews List Skeleton */}
    <div className="space-y-4">
      <ReviewCardSkeleton />
      <ReviewCardSkeleton />
      <ReviewCardSkeleton />
    </div>
  </div>
);

export const UpcomingAppointmentSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl animate-pulse">
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        {/* Patient Name */}
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-1"></div>
        {/* Reason */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-1"></div>
        {/* Time Slot */}
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    </div>
    <div className="text-right">
      {/* Date */}
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
      {/* Status Badge */}
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-16"></div>
    </div>
  </div>
);

export const DoctorDashboardSkeleton = ({
  title = "Doctor Dashboard",
  subtitle = "Manage your appointments and patient care",
  showHeader = true,
}) => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    {showHeader && (
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">{subtitle}</p>
      </div>
    )}

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Upcoming Appointments Card */}
    <div className="card">
      <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
        Upcoming Appointments
      </h3>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <UpcomingAppointmentSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const DoctorProfileSkeleton = () => (
  <div>
    {/* Professional Header Skeleton */}
    <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full"></div>
          <div>
            <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-28"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-white/20 rounded-full w-20 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-24"></div>
        </div>
      </div>
    </div>

    {/* Quick Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Navigation Tabs Skeleton */}
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-8 animate-pulse">
      <div className="flex space-x-1 p-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-24"></div>
        ))}
      </div>
    </div>

    {/* Content Section Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j}>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="p-8 mt-20">
    <div className="mb-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
    </div>

    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j}>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AdminTablePageSkeleton = ({
  title = "Management",
  subtitle = "Loading data...",
  showAddButton = false,
  addButtonText = "Add New",
  onAddClick,
  showExportButton = false,
  exportData = [],
  exportType = "data",
  exportTitle = "Report",
  exportFilename = "report",
  showFilterButtons = false,
  filterOptions = [],
  currentFilter = "all",
  onFilterChange,
  rows = 8,
}) => (
  <div className="p-8 mt-20">
    {/* Table Card with Real Header - Shows Immediately */}
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {showAddButton && (
            <button
              onClick={onAddClick}
              className="btn btn-primary flex items-center gap-2">
              <Plus size={20} />
              {addButtonText}
            </button>
          )}

          {showExportButton && (
            <ExportButton
              data={exportData}
              type={exportType}
              title={exportTitle}
              filename={exportFilename}
              disabled={true}
            />
          )}

          {showFilterButtons && (
            <div className="flex gap-2">
              {filterOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => onFilterChange && onFilterChange(status)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    currentFilter === status
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                  }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <TableSkeleton rows={rows} />

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ReportsSkeleton = ({
  reportType,
  setReportType,
  dateRange,
  handleDateChange,
  fetchReports,
  loading,
}) => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
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
        data={[]}
        type={reportType || "reports"}
        title={`${(reportType || "reports").charAt(0).toUpperCase() + (reportType || "reports").slice(1)} Report`}
        filename={`${reportType || "reports"}_report_${dateRange?.startDate || "start"}_${dateRange?.endDate || "end"}`}
        disabled={true}
      />
    </div>

    {/* Real Filters Card - Immediately Functional */}
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
            value={reportType || "users"}
            onChange={(e) => setReportType && setReportType(e.target.value)}
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
            value={dateRange?.startDate || ""}
            onChange={(e) =>
              handleDateChange && handleDateChange("startDate", e.target.value)
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
            value={dateRange?.endDate || ""}
            onChange={(e) =>
              handleDateChange && handleDateChange("endDate", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-dark dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>

    {/* Report Content Skeleton */}
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const NotificationsSkeleton = ({
  unreadCount = 0,
  handleMarkAllAsRead,
}) => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          Notifications
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mt-1">
          Loading notifications...
        </p>
      </div>
      {unreadCount > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition-colors">
          <CheckCheck size={18} />
          Mark All as Read
        </button>
      )}
    </div>

    {/* Notification Cards Skeleton */}
    <div className="space-y-6">
      {/* Unread Section Skeleton */}
      <div className="card">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-slate-700/50 border-l-4 border-primary rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Read Section Skeleton */}
      <div className="card">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg opacity-75 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({
  items = 5,
  title = "Reports",
  subtitle = "Loading report data...",
  showExportButton = false,
  exportData = [],
  exportType = "reports",
  exportTitle = "Report",
  exportFilename = "report",
}) => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">{subtitle}</p>
      </div>

      {showExportButton ? (
        <ExportButton
          data={exportData}
          type={exportType}
          title={exportTitle}
          filename={exportFilename}
          disabled={true}
        />
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-28 animate-pulse"></div>
        </div>
      )}
    </div>

    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  </div>
);
export const DetailedProfileSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Profile Card Skeleton */}
    <div className="lg:col-span-1">
      <div className="card animate-pulse">
        <div className="text-center p-6">
          <div className="w-32 h-32 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-full w-20 mx-auto"></div>
        </div>
      </div>
    </div>

    {/* Details Skeleton */}
    <div className="lg:col-span-2 space-y-6">
      {/* Basic Information Card */}
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional/Medical Information Card */}
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-12 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AdminDoctorProfileSkeleton = ({ navigate }) => (
  <div className="space-y-8">
    {/* Real Header - Shows Immediately */}
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => navigate("/admin/doctors")}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
        <ArrowLeft size={20} className="text-gray-600 dark:text-slate-400" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Doctor Profile Management
        </h1>
        <p className="text-gray-600 dark:text-slate-400">
          Loading doctor profile and statistics...
        </p>
      </div>
    </div>

    {/* Professional Header Skeleton */}
    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full"></div>
          <div>
            <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-28"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-white/20 rounded-full w-24 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-32 mb-1"></div>
          <div className="h-3 bg-white/20 rounded w-28"></div>
        </div>
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Edit Controls Skeleton */}
    <div className="flex justify-end animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-4">
                  <div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-1"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AdminPatientProfileSkeleton = ({ navigate }) => (
  <div className="space-y-8">
    {/* Real Header - Shows Immediately */}
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => navigate("/admin/patients")}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
        <ArrowLeft size={20} className="text-gray-600 dark:text-slate-400" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Patient Profile Management
        </h1>
        <p className="text-gray-600 dark:text-slate-400">
          Loading patient profile and medical information...
        </p>
      </div>
    </div>

    {/* Professional Header Skeleton */}
    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full"></div>
          <div>
            <div className="h-8 bg-white/20 rounded w-56 mb-2"></div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="h-4 bg-white/20 rounded w-28"></div>
              <div className="h-4 bg-white/20 rounded w-32"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-28"></div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-white/20 rounded-full w-28 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-32 mb-1"></div>
          <div className="h-3 bg-white/20 rounded w-28"></div>
        </div>
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-12"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Edit Controls Skeleton */}
    <div className="flex justify-end animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-4">
                  <div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-1"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-36"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
            {i === 3 ? (
              // Medical Details Skeleton
              <div className="space-y-6">
                <div>
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-16"></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
                  <div className="space-y-3">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-40 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-48"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Regular stats skeleton
              <div className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
// Patient Profile Skeleton
export const PatientProfileSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
        Patient Profile
      </h1>
      <p className="text-gray-600 dark:text-slate-400 mt-2">
        Manage your personal information and healthcare details
      </p>
    </div>

    {/* Professional Header Skeleton */}
    <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
          <div>
            <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-40 animate-pulse"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-white/20 rounded w-24 mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-20 mb-1 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Navigation Tabs Skeleton */}
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
      <div className="flex space-x-1 p-2">
        <div className="h-10 bg-primary rounded-lg w-24 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-28 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-24 animate-pulse"></div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-36 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-28 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="card">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-36 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
// Patient Dashboard Skeleton
export const PatientDashboardSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
        Patient Dashboard
      </h1>
      <p className="text-gray-600 dark:text-slate-400 mt-2">
        Your healthcare journey and appointments
      </p>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Two Column Layout Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Appointments Card */}
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          Recent Appointments
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl animate-pulse">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="card">
        <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);
// Patient Appointments Skeleton
export const PatientAppointmentsSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          My Appointments
        </h2>
        <ExportButton
          data={[]}
          type="patientAppointments"
          title="My Appointments Report"
          filename="my_appointments_report"
          disabled={true}
        />
      </div>

      <TableSkeleton rows={8} />

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
// Patient Medical Records Skeleton
export const PatientMedicalRecordsSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Real Header - Shows Immediately */}
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          My Medical Records
        </h2>
        <ExportButton
          data={[]}
          type="medicalRecords"
          title="Medical Records Report"
          filename="medical_records"
          disabled={true}
        />
      </div>

      {/* Medical Records List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {/* Diagnosis Title */}
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
                {/* Doctor and Date Info */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Prescription Button Skeleton */}
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                {/* File Icon Skeleton */}
                <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
// Patient Payments Skeleton
export const PatientPaymentsSkeleton = () => (
  <div className="p-8 mt-20">
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Real Header - Shows Immediately */}
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          Payment History
        </h2>
        <ExportButton
          data={[]}
          type="payments"
          title="Payment History Report"
          filename="payment_history"
          disabled={true}
        />
      </div>

      <TableSkeleton rows={5} />

      {/* Pagination Skeleton */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
