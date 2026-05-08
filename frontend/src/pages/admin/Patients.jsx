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
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark dark:text-slate-100">
                Patient Management
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Manage patient records and medical information
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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

          <div className="card">

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
                <div className="md:hidden space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-700 p-4 border-b border-gray-200 dark:border-slate-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-dark dark:text-slate-100 truncate">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5 truncate">
                              {patient.email}
                            </p>
                          </div>
                          <span
                            className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"} ml-2 flex-shrink-0`}>
                            {patient.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Age
                              </p>
                              <p className="text-sm font-medium text-dark dark:text-slate-100">
                                {calculateAge(patient.dateOfBirth)} years
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Gender
                              </p>
                              <p className="text-sm font-medium text-dark dark:text-slate-100 capitalize truncate">
                                {patient.gender || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="px-4 pb-4 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => handleToggleStatus(patient)}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors shadow-sm"
                          title={patient.isActive ? "Deactivate" : "Activate"}>
                          {patient.isActive ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(patient)}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors shadow-sm"
                          title="Delete">
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
