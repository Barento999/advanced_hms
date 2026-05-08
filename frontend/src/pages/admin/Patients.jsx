import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import AddPatientModal from "../../components/AddPatientModal";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { AdminTablePageSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Patients = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // For export
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    patient: null,
    loading: false,
  });
  const [addPatientModal, setAddPatientModal] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchAllPatients(); // Fetch all for export
  }, [pagination.currentPage]);

  const fetchAllPatients = async () => {
    try {
      const { data } = await api.get("/admin/users?role=patient&all=true");
      setAllPatients(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all patients for export");
    }
  };

  const fetchPatients = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/admin/users?role=patient&page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setPatients(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (patient) => {
    // Use patientId if available (Patient document ID), otherwise use _id (User ID)
    const id = patient.patientId || patient._id;
    navigate(`/admin/patients/${id}`);
  };

  const handleAddPatient = () => {
    setAddPatientModal(true);
  };

  const handleAddPatientSuccess = () => {
    toast.success("Patient created successfully");
    fetchPatients();
    fetchAllPatients();
  };

  const handleToggleStatus = async (patient) => {
    setConfirmModal({
      isOpen: true,
      type: patient.isActive ? "deactivate" : "activate",
      patient: patient,
      loading: false,
    });
  };

  const handleDelete = async (patient) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      patient: patient,
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/admin/users/${confirmModal.patient._id}`);
        toast.success("Patient deleted successfully");
      } else if (
        confirmModal.type === "deactivate" ||
        confirmModal.type === "activate"
      ) {
        await api.patch(
          `/admin/users/${confirmModal.patient._id}/toggle-status`,
        );
        toast.success(`Patient ${confirmModal.type}d successfully`);
      }

      fetchPatients();
      setConfirmModal({
        isOpen: false,
        type: "",
        patient: null,
        loading: false,
      });
    } catch (error) {
      toast.error(`Failed to ${confirmModal.type} patient`);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const closeModal = () => {
    if (!confirmModal.loading) {
      setConfirmModal({
        isOpen: false,
        type: "",
        patient: null,
        loading: false,
      });
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <AdminTablePageSkeleton
            title="Patient Management"
            subtitle="Manage patient records and medical information"
            showAddButton={true}
            addButtonText="Add Patient"
            onAddClick={() => setAddPatientModal(true)}
            showExportButton={true}
            exportData={[]}
            exportType="adminPatients"
            exportTitle="Patients Report"
            exportFilename="patients_report"
            rows={8}
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
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                Patient Management
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleAddPatient}
                  className="btn btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Add Patient
                </button>
                <ExportButton
                  data={allPatients}
                  type="adminPatients"
                  title="Patients Report"
                  filename="patients_report"
                />
              </div>
            </div>

            {patients.length === 0 ? (
              <EmptyState type="patients" className="py-12" />
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Age
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Gender
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr
                          key={patient._id}
                          className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            {patient.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            {patient.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            {calculateAge(patient.dateOfBirth)} years
                          </td>
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 capitalize">
                              {patient.gender || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"}`}>
                              {patient.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(patient)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                title="View Details">
                                <Eye size={20} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(patient)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors"
                                title={
                                  patient.isActive ? "Deactivate" : "Activate"
                                }>
                                {patient.isActive ? (
                                  <ToggleRight size={20} />
                                ) : (
                                  <ToggleLeft size={20} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(patient)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors"
                                title="Delete">
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-dark dark:text-slate-100 truncate">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 truncate">
                            {patient.email}
                          </p>
                        </div>
                        <span
                          className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"} ml-2 flex-shrink-0`}>
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                            Age
                          </p>
                          <p className="text-sm font-medium text-dark dark:text-slate-100">
                            {calculateAge(patient.dateOfBirth)} years
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                            Gender
                          </p>
                          <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 capitalize">
                            {patient.gender || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium">
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleToggleStatus(patient)}
                          className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                          {patient.isActive ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(patient)}
                          className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={addPatientModal}
        onClose={() => setAddPatientModal(false)}
        onSuccess={handleAddPatientSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        type={confirmModal.type}
        itemName={`Patient (${confirmModal.patient?.name})`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Patients;
