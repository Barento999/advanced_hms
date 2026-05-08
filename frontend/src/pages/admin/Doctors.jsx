import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import AddDoctorModal from "../../components/AddDoctorModal";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { AdminTablePageSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Doctors = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]); // For export
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
    doctor: null,
    loading: false,
  });
  const [addDoctorModal, setAddDoctorModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchAllDoctors(); // Fetch all for export
  }, [pagination.currentPage]);

  const fetchAllDoctors = async () => {
    try {
      const { data } = await api.get("/admin/users?role=doctor&all=true");
      setAllDoctors(data.data || []);
    } catch (error) {
      console.error("Failed to fetch all doctors for export");
    }
  };

  const fetchDoctors = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/admin/users?role=doctor&page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setDoctors(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (doctor) => {
    // Use doctorId if available, otherwise fall back to _id for backward compatibility
    const id = doctor.doctorId || doctor._id;
    navigate(`/admin/doctors/${id}`);
  };

  const handleAddDoctor = () => {
    setAddDoctorModal(true);
  };

  const handleAddDoctorSuccess = () => {
    toast.success("Doctor created successfully");
    fetchDoctors();
    fetchAllDoctors();
  };

  const handleToggleStatus = async (doctor) => {
    setConfirmModal({
      isOpen: true,
      type: doctor.isActive ? "deactivate" : "activate",
      doctor: doctor,
      loading: false,
    });
  };

  const handleDelete = async (doctor) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      doctor: doctor,
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/admin/users/${confirmModal.doctor._id}`);
        toast.success("Doctor deleted successfully");
      } else if (
        confirmModal.type === "deactivate" ||
        confirmModal.type === "activate"
      ) {
        await api.patch(
          `/admin/users/${confirmModal.doctor._id}/toggle-status`,
        );
        toast.success(`Doctor ${confirmModal.type}d successfully`);
      }

      fetchDoctors();
      setConfirmModal({
        isOpen: false,
        type: "",
        doctor: null,
        loading: false,
      });
    } catch (error) {
      toast.error(`Failed to ${confirmModal.type} doctor`);
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
        doctor: null,
        loading: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <AdminTablePageSkeleton
            title="Doctor Management"
            subtitle="Manage doctor profiles and professional information"
            showAddButton={true}
            addButtonText="Add Doctor"
            onAddClick={() => setAddDoctorModal(true)}
            showExportButton={true}
            exportData={[]}
            exportType="doctors"
            exportTitle="Doctors Report"
            exportFilename="doctors_report"
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
                Doctor Management
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleAddDoctor}
                  className="btn btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Add Doctor
                </button>
                <ExportButton
                  data={allDoctors}
                  type="doctors"
                  title="Doctors Report"
                  filename="doctors_report"
                />
              </div>
            </div>

            {doctors.length === 0 ? (
              <EmptyState type="doctors" className="py-12" />
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
                          Specialization
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
                      {doctors.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            {doctor.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            {doctor.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-dark dark:text-slate-100">
                            <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                              {doctor.specialization || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`badge ${doctor.isActive ? "badge-completed" : "badge-cancelled"}`}>
                              {doctor.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(doctor)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                title="View Details">
                                <Eye size={20} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(doctor)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors"
                                title={
                                  doctor.isActive ? "Deactivate" : "Activate"
                                }>
                                {doctor.isActive ? (
                                  <ToggleRight size={20} />
                                ) : (
                                  <ToggleLeft size={20} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(doctor)}
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
                  {doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-dark dark:text-slate-100 truncate">
                            {doctor.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 truncate">
                            {doctor.email}
                          </p>
                        </div>
                        <span
                          className={`badge ${doctor.isActive ? "badge-completed" : "badge-cancelled"} ml-2 flex-shrink-0`}>
                          {doctor.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                          Specialization
                        </p>
                        <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                          {doctor.specialization || "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                        <button
                          onClick={() => handleViewDetails(doctor)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium">
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleToggleStatus(doctor)}
                          className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                          {doctor.isActive ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(doctor)}
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

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={addDoctorModal}
        onClose={() => setAddDoctorModal(false)}
        onSuccess={handleAddDoctorSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        type={confirmModal.type}
        itemName={`Doctor (${confirmModal.doctor?.name})`}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default Doctors;
