import { useState, useEffect } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/admin/users?role=patient&limit=50");
      setPatients(data.data);
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success("Patient status updated");
      fetchPatients();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success("Patient deleted successfully");
        fetchPatients();
      } catch (error) {
        toast.error("Failed to delete patient");
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
              Patient Management
            </h2>

            {loading ? (
              <TableSkeleton rows={8} />
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
                    {patients.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500">
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient) => (
                        <tr
                          key={patient._id}
                          className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{patient.name}</td>
                          <td className="py-3 px-4">{patient.email}</td>
                          <td className="py-3 px-4">{patient.phone}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`badge ${patient.isActive ? "badge-completed" : "badge-cancelled"}`}>
                              {patient.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleStatus(patient._id)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                {patient.isActive ? (
                                  <ToggleRight size={20} />
                                ) : (
                                  <ToggleLeft size={20} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(patient._id)}
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

export default Patients;
