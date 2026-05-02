import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentId: "",
    diagnosis: "",
    symptoms: "",
    prescription: [
      { medicine: "", dosage: "", duration: "", instructions: "" },
    ],
    notes: "",
  });

  const handleAddPrescription = () => {
    setFormData({
      ...formData,
      prescription: [
        ...formData.prescription,
        { medicine: "", dosage: "", duration: "", instructions: "" },
      ],
    });
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescription = [...formData.prescription];
    newPrescription[index][field] = value;
    setFormData({ ...formData, prescription: newPrescription });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const symptomsArray = formData.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      await api.post("/doctor/medical-records", {
        ...formData,
        symptoms: symptomsArray,
      });

      toast.success("Medical record created successfully!");
      navigate("/doctor");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create medical record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
              Add Medical Record
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Create comprehensive medical records for your patients
            </p>
          </div>

          <div className="max-w-4xl mx-auto card">
            <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-6">
              Patient Medical Record Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter patient ID"
                    value={formData.patientId}
                    onChange={(e) =>
                      setFormData({ ...formData, patientId: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Appointment ID (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter appointment ID"
                    value={formData.appointmentId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentId: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Symptoms (comma separated)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="fever, cough, headache"
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Prescription
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPrescription}
                    className="flex items-center gap-2 text-primary hover:text-orange-700">
                    <Plus size={20} />
                    Add Medicine
                  </button>
                </div>

                {formData.prescription.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Medicine name"
                      value={item.medicine}
                      onChange={(e) =>
                        handlePrescriptionChange(
                          index,
                          "medicine",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Dosage (e.g., 500mg)"
                      value={item.dosage}
                      onChange={(e) =>
                        handlePrescriptionChange(
                          index,
                          "dosage",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Duration (e.g., 7 days)"
                      value={item.duration}
                      onChange={(e) =>
                        handlePrescriptionChange(
                          index,
                          "duration",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Instructions"
                      value={item.instructions}
                      onChange={(e) =>
                        handlePrescriptionChange(
                          index,
                          "instructions",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Any additional notes or recommendations"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1">
                  {loading ? "Creating..." : "Create Medical Record"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/doctor")}
                  className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
