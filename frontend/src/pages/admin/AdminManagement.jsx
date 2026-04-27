import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { AdminTablePageSkeleton } from "../../components/LoadingSkeleton";
import Pagination from "../../components/Pagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import ExportButton from "../../components/ExportButton";
import AddAdminModal from "../../components/AddAdminModal";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    admin: null,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchAdmins();
    fetchAllAdmins();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const fetchAllAdmins = async () => {
    try {
      const { data } = await api.get("/admin/users?role=admin&all=true");
      setAllAdmins(data.data || []);
    } catch (error) {
      console.error("Error fetching all admins:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/admin/users?role=admin&page=${pagination.currentPage}&limit=${pagination.itemsPerPage}&search=${searchTerm}&status=${statusFilter}`,
      );
      setAdmins(data.data);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.itemsPerPage,
      });
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/admin/users/${confirmModal.admin._id}`);
        toast.success("Admin deleted successfully");
      } else if (
        confirmModal.type === "activate" ||
        confirmModal.type === "deactivate"
      ) {
        await api.patch(`/admin/users/${confirmModal.admin._id}/toggle-status`);
        toast.success(`Admin ${confirmModal.type}d successfully`);
      }

      fetchAdmins();
      fetchAllAdmins();
      setConfirmModal({ isOpen: false, type: "", admin: null });
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error(
        error.response?.data?.message || `Failed to ${confirmModal.type} admin`,
      );
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <UserCheck size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <UserX size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  const filteredStats = {
    total: allAdmins.length,
    active: allAdmins.filter((admin) => admin.isActive).length,
    inactive: allAdmins.filter((admin) => !admin.isActive).length,
  };

  if (loading && admins.length === 0) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <AdminTablePageSkeleton
            title="Admin Management"
            subtitle="Manage system administrators and their access"
            showAddButton={true}
            showExportButton={true}
            showFilters={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8 mt-20">
          {/* Real Header - Shows Immediately */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
                  Admin Management
                </h1>
                <p className="text-gray-600 dark:text-slate-400 mt-2">
                  Manage system administrators and their access
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ExportButton
                  data={allAdmins}
                  filename="admins"
                  columns={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                    { key: "isActive", label: "Status" },
                    { key: "createdAt", label: "Created Date" },
                  ]}
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
                  <Plus size={16} />
                  Add Admin
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Total Admins
                  </p>
                  <p className="text-2xl font-bold text-dark dark:text-slate-100">
                    {filteredStats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Active Admins
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredStats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Inactive Admins
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredStats.inactive}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search admins by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field pl-10 pr-8">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Admins Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {admins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-dark dark:text-slate-100">
                              {admin.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              System Administrator
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark dark:text-slate-100">
                          {admin.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {admin.phone || "No phone"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(admin.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: admin.isActive
                                  ? "deactivate"
                                  : "activate",
                                admin,
                              })
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              admin.isActive
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                            }`}>
                            {admin.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: "delete",
                                admin,
                              })
                            }
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 rounded-lg text-xs font-medium transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {admins.length === 0 && !loading && (
              <div className="text-center py-12">
                <Shield
                  size={48}
                  className="mx-auto text-gray-300 dark:text-slate-600 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                  No admins found
                </h3>
                <p className="text-gray-500 dark:text-slate-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first admin"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary">
                    <Plus size={16} className="mr-2" />
                    Add Admin
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
              />
            </div>
          )}

          {/* Add Admin Modal */}
          {showAddModal && (
            <AddAdminModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSuccess={() => {
                fetchAdmins();
                fetchAllAdmins();
                setShowAddModal(false);
              }}
            />
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={confirmModal.isOpen}
            onClose={() =>
              setConfirmModal({ isOpen: false, type: "", admin: null })
            }
            onConfirm={handleAction}
            type={confirmModal.type}
            itemName={confirmModal.admin?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
