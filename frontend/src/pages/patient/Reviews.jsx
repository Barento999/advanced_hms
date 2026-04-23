import { useState, useEffect } from "react";
import { Star, Edit2, Trash2, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ListSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Reviews = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  const fetchCompletedAppointments = async () => {
    try {
      const { data } = await api.get("/patient/appointments?status=completed");
      setAppointments(data.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/reviews", {
        appointmentId: selectedAppointment._id,
        ...formData,
      });
      toast.success("Review submitted successfully");
      setShowModal(false);
      setFormData({ rating: 5, comment: "" });
      fetchCompletedAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark">Doctor Reviews</h2>
            <p className="text-gray-600 mt-1">
              Rate and review your completed appointments
            </p>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <ListSkeleton items={5} />
            ) : (
              appointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark">
                        {apt.doctorId?.userId?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {apt.doctorId?.specialization}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Appointment Date:{" "}
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Time: {apt.timeSlot?.startTime} -{" "}
                        {apt.timeSlot?.endTime}
                      </p>
                    </div>
                    <div>
                      {!apt.hasReview ? (
                        <button
                          onClick={() => openReviewModal(apt)}
                          className="btn-primary flex items-center gap-2">
                          <Plus size={18} />
                          Write Review
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <Star size={14} fill="currentColor" />
                          Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {!loading && appointments.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500">
                  No completed appointments to review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-dark mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none">
                      <Star
                        size={32}
                        className={
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Share your experience with this doctor..."
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1">
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ rating: 5, comment: "" });
                  }}
                  className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
