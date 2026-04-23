import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Search, Filter, Star } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    timeSlot: { startTime: "", endTime: "" },
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const specializations = [
    "All Specializations",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "General Medicine",
    "Surgery",
    "Gynecology",
    "Ophthalmology",
    "ENT",
    "Dentistry",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialization, doctors]);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find((d) => d._id === formData.doctorId);
      setSelectedDoctor(doctor);
      setAvailableSlots(doctor?.availableTimeSlots || []);
    }
  }, [formData.doctorId, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/patient/doctors?limit=50");
      setDoctors(data.data);
      setFilteredDoctors(data.data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    // Filter by specialization
    if (
      selectedSpecialization &&
      selectedSpecialization !== "All Specializations"
    ) {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === selectedSpecialization,
      );
    }

    // Filter by search term (name or specialization)
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.userId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredDoctors(filtered);
  };

  const isDateAvailable = (date) => {
    if (!selectedDoctor || !date) return false;
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    return selectedDoctor.availableDays?.includes(dayName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date
    if (!isDateAvailable(formData.appointmentDate)) {
      toast.error("Doctor is not available on the selected date");
      return;
    }

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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-dark dark:text-slate-100 mb-6">
              Book Appointment
            </h2>

            {/* Search and Filter Section */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
                Find a Doctor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-2">
                      <Search size={16} />
                      Search by Name
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search doctor by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-2">
                      <Filter size={16} />
                      Filter by Specialization
                    </span>
                  </label>
                  <select
                    className="input"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </div>
            </div>

            {/* Appointment Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Select Doctor
                  </label>
                  <select
                    className="input-field"
                    value={formData.doctorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        doctorId: e.target.value,
                        appointmentDate: "",
                        timeSlot: { startTime: "", endTime: "" },
                      })
                    }
                    required>
                    <option value="">Choose a doctor</option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.userId?.name} - {doctor.specialization} (
                        {doctor.rating && doctor.rating > 0
                          ? `⭐ ${doctor.rating}`
                          : "New"}{" "}
                        , {doctor.experience} years exp, $
                        {doctor.consultationFee})
                      </option>
                    ))}
                  </select>
                  {filteredDoctors.length === 0 && (
                    <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
                      No doctors found matching your criteria
                    </p>
                  )}
                </div>

                {selectedDoctor && (
                  <div className="p-4 bg-blue-50 dark:bg-slate-700/50 border-l-4 border-blue-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-blue-500 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                          Doctor's Information
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          {selectedDoctor.rating &&
                          selectedDoctor.rating > 0 ? (
                            <>
                              <Star
                                size={16}
                                className="text-yellow-400 fill-yellow-400"
                              />
                              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                                {selectedDoctor.rating} Rating
                              </span>
                            </>
                          ) : (
                            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                              No reviews yet
                            </span>
                          )}
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                          <strong>Available Days:</strong>{" "}
                          {selectedDoctor.availableDays?.join(", ") ||
                            "Not set"}
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                          <strong>Time Slots:</strong>{" "}
                          {availableSlots.length > 0
                            ? availableSlots
                                .map(
                                  (slot) => `${slot.startTime}-${slot.endTime}`,
                                )
                                .join(", ")
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
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
                    disabled={!formData.doctorId}
                  />
                  {formData.appointmentDate &&
                    !isDateAvailable(formData.appointmentDate) && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        Doctor is not available on this day. Please select
                        another date.
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Select Time Slot
                  </label>
                  {availableSlots.length > 0 ? (
                    <select
                      className="input-field"
                      value={`${formData.timeSlot.startTime}-${formData.timeSlot.endTime}`}
                      onChange={(e) => {
                        const [startTime, endTime] = e.target.value.split("-");
                        setFormData({
                          ...formData,
                          timeSlot: { startTime, endTime },
                        });
                      }}
                      required
                      disabled={!formData.doctorId}>
                      <option value="">Choose a time slot</option>
                      {availableSlots.map((slot, index) => (
                        <option
                          key={index}
                          value={`${slot.startTime}-${slot.endTime}`}>
                          {slot.startTime} - {slot.endTime}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      {formData.doctorId
                        ? "Doctor has not set available time slots yet"
                        : "Please select a doctor first"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
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
                    disabled={
                      loading || !isDateAvailable(formData.appointmentDate)
                    }
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
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
    </div>
  );
};

export default BookAppointment;
