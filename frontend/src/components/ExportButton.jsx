import { useState } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import {
  exportToPDF,
  exportToExcel,
  EXPORT_COLUMNS,
  formatDataForExport,
  exportAnalyticsToPDF,
  exportAnalyticsToExcel,
  formatAnalyticsForExport,
} from "../utils/exportUtils";
import toast from "react-hot-toast";

const ExportButton = ({
  data,
  type,
  title,
  filename,
  customColumns = null,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const columns = customColumns || EXPORT_COLUMNS[type];

  // Analytics doesn't need columns validation
  if (type !== "analytics" && !columns) {
    console.error(`No export columns defined for type: ${type}`);
    return null;
  }

  const handleExport = async (format) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      toast.error("No data available to export");
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      const exportTitle =
        title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`;
      const exportFilename =
        filename || `${type}_${new Date().toISOString().split("T")[0]}`;

      // Handle analytics data specially
      if (type === "analytics") {
        if (format === "pdf") {
          exportAnalyticsToPDF(data, exportTitle, exportFilename);
        } else if (format === "excel") {
          exportAnalyticsToExcel(data, exportFilename);
        }
        toast.success(`Analytics report exported as ${format.toUpperCase()}`);
        return;
      }

      // Handle regular data
      const formattedData = formatDataForExport(data, type);

      if (format === "pdf") {
        exportToPDF(formattedData, columns, exportTitle, exportFilename);
      } else if (format === "excel") {
        exportToExcel(formattedData, columns, exportTitle, exportFilename);
      }

      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(
        `Export failed: ${error.message || "Unknown error occurred"}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (disabled || !data || (Array.isArray(data) && data.length === 0)) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-400 rounded-xl cursor-not-allowed ${className}`}>
        <Download size={18} />
        Export
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
        <Download size={18} />
        {isExporting ? "Exporting..." : "Export"}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-20">
            <div className="py-2">
              <button
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <FileText size={18} className="text-red-500" />
                <div>
                  <div className="font-medium text-dark dark:text-slate-100">
                    Export as PDF
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Portable document format
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleExport("excel")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <FileSpreadsheet size={18} className="text-green-500" />
                <div>
                  <div className="font-medium text-dark dark:text-slate-100">
                    Export as Excel
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Spreadsheet format
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
