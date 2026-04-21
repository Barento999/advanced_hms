import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    timeSlot: { startTime: "", endTime: "" },
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/patient/doctors");
      setDoctors(data.data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/patient/appointments", formData);
      toast.success("Appointment booked successfully!");
      navigate("/patient/appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="max-w-2xl mx-auto card">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Book Appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  className="input-field"
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  required>
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.userId?.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={formData.timeSlot.startTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeSlot: {
                          ...formData.timeSlot,
                          startTime: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={formData.timeSlot.endTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeSlot: {
                          ...formData.timeSlot,
                          endTime: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Describe your symptoms or reason for visit"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1">
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/patient")}
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

export default BookAppointment;
