import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { DoctorDashboardSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      // Get current date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch all appointments for stats calculation
      const { data: allData } = await api.get("/doctor/appointments");

      console.log("All appointments data:", allData.data);
      console.log("First appointment structure:", allData.data[0]);

      // Filter appointments for dashboard display (only pending/confirmed and future dates)
      const filteredAppointments = allData.data.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        // Only show pending or confirmed appointments
        const isValidStatus =
          appointment.status === "pending" ||
          appointment.status === "confirmed";

        // Only show appointments from today onwards
        const isFutureOrToday = appointmentDate >= today;

        console.log(`Appointment ${appointment._id}:`, {
          appointmentDate: appointment.appointmentDate,
          parsedDate: appointmentDate.toDateString(),
          today: today.toDateString(),
          status: appointment.status,
          isValidStatus,
          isFutureOrToday,
          shouldShow: isValidStatus && isFutureOrToday,
        });

        return isValidStatus && isFutureOrToday;
      });

      console.log("Filtered appointments:", filteredAppointments);

      // Sort by date and time, then take first 5
      const sortedAppointments = filteredAppointments
        .sort((a, b) => {
          const dateA = new Date(a.appointmentDate);
          const dateB = new Date(b.appointmentDate);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          // If same date, sort by time
          if (a.timeSlot?.startTime && b.timeSlot?.startTime) {
            return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
          }
          return 0;
        })
        .slice(0, 5);

      console.log("Final sorted appointments:", sortedAppointments);
      setAppointments(sortedAppointments);

      // Calculate stats from all appointments
      const total = allData.totalItems || 0;
      const pending = allData.data.filter((a) => a.status === "pending").length;
      const confirmed = allData.data.filter(
        (a) => a.status === "confirmed",
      ).length;
      const completed = allData.data.filter(
        (a) => a.status === "completed",
      ).length;

      setStats({ total, pending, confirmed, completed });
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {loading ? (
          <DoctorDashboardSkeleton />
        ) : (
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-slate-100">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">
                Manage your appointments and patient care
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-dark dark:text-slate-100">
                  Upcoming Appointments
                </h3>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  Pending & Confirmed Only | Total Stats: P:{stats.pending} C:
                  {stats.confirmed}
                </div>
              </div>
              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                    <Calendar
                      size={48}
                      className="mx-auto mb-3 text-gray-400 dark:text-slate-600"
                    />
                    <p className="font-medium">No upcoming appointments</p>
                    <p className="text-sm mt-1">
                      All pending and confirmed appointments will appear here
                    </p>
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-primary/20 transition-all duration-200">
                      {/* Time indicator */}
                      <div className="flex flex-col items-center text-center min-w-[60px]">
                        {apt.timeSlot ? (
                          <>
                            <div className="text-lg font-bold text-primary">
                              {apt.timeSlot.startTime}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              {apt.timeSlot.endTime}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-slate-500">
                            No time
                          </div>
                        )}
                      </div>

                      {/* Appointment details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {apt.patientId?.userId?.name?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h4 className="font-semibold text-dark dark:text-slate-100 group-hover:text-primary transition-colors">
                                {apt.patientId?.userId?.name || "Patient"}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                                {apt.reason}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                                📅{" "}
                                {new Date(
                                  apt.appointmentDate,
                                ).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              {apt.patientId?.userId?.phone && (
                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                                  📞 {apt.patientId.userId.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`badge badge-${apt.status} text-xs`}>
                              {apt.status}
                            </span>
                            {apt.status === "pending" && (
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            )}
                            {apt.status === "confirmed" && (
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {apt.status === "pending" && (
                          <div className="flex gap-1">
                            <button className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                              <CheckCircle size={14} />
                            </button>
                            <button className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                              <Clock size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {appointments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
                    <span>
                      Showing {appointments.length} upcoming appointments
                    </span>
                    <button
                      onClick={() => navigate("/doctor/appointments")}
                      className="text-primary hover:text-blue-700 font-medium transition-colors">
                      View all appointments →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
