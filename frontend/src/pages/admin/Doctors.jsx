import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
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
            <h2 className="text-2xl font-bold text-dark mb-6">
              Doctor Management
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500">
                          No doctors found
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{doctor.name}</td>
                          <td className="py-3 px-4">{doctor.email}</td>
                          <td className="py-3 px-4">{doctor.phone}</td>
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
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                {doctor.isActive ? (
                                  <ToggleRight size={20} />
                                ) : (
                                  <ToggleLeft size={20} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(doctor._id)}
                                className="p-2 hover:bg-red-100 text-danger rounded-lg transition-colors">
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
