import { useState } from "react";
import { Download, Printer, FileText, ChevronDown } from "lucide-react";
import {
  downloadPrescription,
  printPrescription,
} from "../utils/prescriptionUtils";
import toast from "react-hot-toast";

const PrescriptionButton = ({
  medicalRecord,
  patientInfo,
  doctorInfo,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    if (!medicalRecord || !patientInfo || !doctorInfo) {
      toast.error("Missing required information for prescription generation");
      return;
    }

    if (
      !medicalRecord.prescription ||
      medicalRecord.prescription.length === 0
    ) {
      toast.error("No prescription data available");
      return;
    }

    setIsProcessing(true);
    setIsOpen(false);

    try {
      if (action === "download") {
        downloadPrescription(medicalRecord, patientInfo, doctorInfo);
        toast.success("Prescription downloaded successfully");
      } else if (action === "print") {
        printPrescription(medicalRecord, patientInfo, doctorInfo);
        toast.success("Opening print dialog...");
      }
    } catch (error) {
      console.error("Prescription action failed:", error);
      toast.error(
        `Failed to ${action} prescription: ${error.message || "Unknown error occurred"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if prescription is available
  const hasPrescription =
    medicalRecord?.prescription && medicalRecord.prescription.length > 0;

  if (disabled || !hasPrescription) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-400 rounded-xl cursor-not-allowed ${className}`}
        title="No prescription available">
        <FileText size={18} />
        No Prescription
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isProcessing}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Download or print prescription">
        <FileText size={18} />
        {isProcessing ? "Processing..." : "Prescription"}
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
                onClick={() => handleAction("download")}
                disabled={isProcessing}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Download size={18} className="text-blue-500" />
                <div>
                  <div className="font-medium text-dark dark:text-slate-100">
                    Download PDF
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Save prescription as PDF
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleAction("print")}
                disabled={isProcessing}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Printer size={18} className="text-green-500" />
                <div>
                  <div className="font-medium text-dark dark:text-slate-100">
                    Print Prescription
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Open print dialog
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

export default PrescriptionButton;
