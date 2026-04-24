import {
  Users,
  Calendar,
  FileText,
  CreditCard,
  Star,
  Bell,
  UserPlus,
  CalendarPlus,
  FileX,
  Search,
  Database,
  Clock,
  Stethoscope,
  Activity,
} from "lucide-react";

const EmptyState = ({
  type = "default",
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon,
  className = "",
}) => {
  // Predefined empty state configurations
  const emptyStateConfigs = {
    patients: {
      icon: Users,
      title: "No patients found",
      description:
        "No patients have been registered yet. Patients will appear here once they sign up.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    doctors: {
      icon: Stethoscope,
      title: "No doctors found",
      description:
        "No doctors have been added to the system yet. Add doctors to start managing appointments.",
      iconColor: "text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    appointments: {
      icon: Calendar,
      title: "No appointments scheduled",
      description:
        "You don't have any appointments yet. Schedule your first appointment to get started.",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      actionText: "Book Appointment",
    },
    myAppointments: {
      icon: Calendar,
      title: "No appointments found",
      description:
        "You haven't booked any appointments yet. Book your first appointment with a doctor.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      actionText: "Book Appointment",
    },
    doctorAppointments: {
      icon: Calendar,
      title: "No appointments today",
      description:
        "You don't have any appointments scheduled. Patients can book appointments with you.",
      iconColor: "text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    medicalRecords: {
      icon: FileText,
      title: "No medical records",
      description:
        "No medical records have been created yet. Records will appear here after appointments.",
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    payments: {
      icon: CreditCard,
      title: "No payment history",
      description:
        "You haven't made any payments yet. Payment history will appear here after transactions.",
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    reviews: {
      icon: Star,
      title: "No reviews yet",
      description:
        "No reviews have been submitted. Reviews from patients will appear here.",
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    notifications: {
      icon: Bell,
      title: "No notifications",
      description:
        "You're all caught up! New notifications will appear here when you have updates.",
      iconColor: "text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
    },
    search: {
      icon: Search,
      title: "No results found",
      description:
        "We couldn't find anything matching your search. Try adjusting your search terms.",
      iconColor: "text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
    },
    schedule: {
      icon: Clock,
      title: "No schedule set",
      description:
        "You haven't set your availability yet. Set your schedule to allow patients to book appointments.",
      iconColor: "text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      actionText: "Set Schedule",
    },
    dashboard: {
      icon: Activity,
      title: "Welcome to your dashboard",
      description:
        "Your dashboard will show important information once you start using the system.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    error: {
      icon: FileX,
      title: "Something went wrong",
      description:
        "We encountered an error loading this data. Please try refreshing the page.",
      iconColor: "text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      actionText: "Retry",
    },
  };

  // Get configuration for the specified type
  const config = emptyStateConfigs[type] || emptyStateConfigs.default;

  // Use custom props or fall back to config
  const Icon = CustomIcon || config.icon || Database;
  const finalTitle = title || config.title || "No data available";
  const finalDescription =
    description ||
    config.description ||
    "There's nothing to show here right now.";
  const finalActionText = actionText || config.actionText;
  const iconColor = config.iconColor || "text-gray-400";
  const bgColor = config.bgColor || "bg-gray-50 dark:bg-gray-900/20";

  return (
    <div className={`text-center py-16 px-8 ${className}`}>
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${bgColor} mb-6`}>
        <Icon size={40} className={iconColor} />
      </div>

      <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-3">
        {finalTitle}
      </h3>

      <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
        {finalDescription}
      </p>

      {finalActionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2">
          {finalActionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
