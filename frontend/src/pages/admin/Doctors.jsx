import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/admin/users?role=doctor&limit=50");
      setDoctors(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success("Doctor status updated");
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        toast.error("Failed to delete doctor");
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
              Doctor Management
            </h2>

            {loading ? (
              <TableSkeleton rows={8} />
            ) : (
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
                        Phone
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
                    {doctors.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500 dark:text-slate-400">
                          No doctors found
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4 text-dark dark:text-slate-100">
                            {doctor.name}
                          </td>
                          <td className="py-3 px-4 text-dark dark:text-slate-100">
                            {doctor.email}
                          </td>
                          <td className="py-3 px-4 text-dark dark:text-slate-100">
                            {doctor.phone}
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
                                onClick={() => handleToggleStatus(doctor._id)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg transition-colors">
                                {doctor.isActive ? (
                                  <ToggleRight size={20} />
                                ) : (
                                  <ToggleLeft size={20} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(doctor._id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors">
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
