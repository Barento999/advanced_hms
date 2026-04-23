import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(
        `/admin/users?page=${pagination.page}&limit=${pagination.limit}`,
      );
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success("User status updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="card">
            <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-6">
              User Management
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-dark dark:text-slate-100">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-dark dark:text-slate-100">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge bg-orange-100 dark:bg-orange-900/30 text-primary dark:text-orange-400">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${user.isActive ? "badge-completed" : "badge-cancelled"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(user._id)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                            {user.isActive ? (
                              <ToggleRight size={20} />
                            ) : (
                              <ToggleLeft size={20} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
