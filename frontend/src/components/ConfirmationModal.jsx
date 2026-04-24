import {
  AlertTriangle,
  Trash2,
  X,
  Check,
  Ban,
  UserX,
  Calendar,
  FileX,
} from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
  loading = false,
  itemName = "",
}) => {
  if (!isOpen) return null;

  // Predefined modal configurations
  const modalConfigs = {
    delete: {
      icon: Trash2,
      iconColor: "text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
      title: `Delete ${itemName}`,
      message: `Are you sure you want to delete this ${itemName.toLowerCase()}? This action cannot be undone.`,
    },
    cancel: {
      icon: X,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      confirmButtonClass: "bg-orange-600 hover:bg-orange-700 text-white",
      title: `Cancel ${itemName}`,
      message: `Are you sure you want to cancel this ${itemName.toLowerCase()}?`,
    },
    deactivate: {
      icon: Ban,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      confirmButtonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
      title: `Deactivate ${itemName}`,
      message: `Are you sure you want to deactivate this ${itemName.toLowerCase()}?`,
    },
    activate: {
      icon: Check,
      iconColor: "text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
      title: `Activate ${itemName}`,
      message: `Are you sure you want to activate this ${itemName.toLowerCase()}?`,
    },
    removeUser: {
      icon: UserX,
      iconColor: "text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
      title: `Remove ${itemName}`,
      message: `Are you sure you want to remove this ${itemName.toLowerCase()} from the system?`,
    },
    complete: {
      icon: Check,
      iconColor: "text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
      title: `Complete ${itemName}`,
      message: `Are you sure you want to mark this ${itemName.toLowerCase()} as completed?`,
    },
    reject: {
      icon: X,
      iconColor: "text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
      title: `Reject ${itemName}`,
      message: `Are you sure you want to reject this ${itemName.toLowerCase()}?`,
    },
    logout: {
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      confirmButtonClass: "bg-orange-600 hover:bg-orange-700 text-white",
      title: "Logout",
      message:
        "Are you sure you want to logout? You will need to login again to access your account.",
    },
    default: {
      icon: AlertTriangle,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
      title: "Confirm Action",
      message: "Are you sure you want to proceed with this action?",
    },
  };

  const config = modalConfigs[type] || modalConfigs.default;
  const Icon = config.icon;

  const finalTitle = title || config.title;
  const finalMessage = message || config.message;
  const finalConfirmText =
    confirmText === "Confirm"
      ? type === "delete"
        ? "Delete"
        : type === "cancel"
          ? "Cancel"
          : type === "logout"
            ? "Logout"
            : confirmText
      : confirmText;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon size={32} className={config.iconColor} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-slate-100 mb-3">
            {finalTitle}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
            {finalMessage}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmButtonClass}`}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                finalConfirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
