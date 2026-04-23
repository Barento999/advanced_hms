import { useState, useEffect } from "react";
import { Star, User, Search, Filter } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  ReviewCardSkeleton,
  StatCardSkeleton,
} from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Reviews = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctorsAndReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [selectedDoctor, searchTerm, allReviews]);

  const fetchDoctorsAndReviews = async () => {
    try {
      // Temporary delay to see skeleton (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch all reviews in one call
      const reviewsRes = await api.get("/reviews/all");
      const reviewsData = reviewsRes.data.data;
      setAllReviews(reviewsData);
      setReviews(reviewsData);

      // Extract unique doctors from reviews
      const uniqueDoctors = [];
      const doctorIds = new Set();
      reviewsData.forEach((review) => {
        if (review.doctorId && !doctorIds.has(review.doctorId._id)) {
          doctorIds.add(review.doctorId._id);
          uniqueDoctors.push(review.doctorId);
        }
      });
      setDoctors(uniqueDoctors);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...allReviews];

    // Filter by selected doctor
    if (selectedDoctor) {
      filtered = filtered.filter(
        (review) => review.doctorId._id === selectedDoctor,
      );
    }

    // Filter by search term (patient name or comment)
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.patientId?.userId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setReviews(filtered);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20">
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>

            <div className="card mb-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </div>
          </div>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark">All Doctor Reviews</h2>
            <p className="text-gray-600 mt-1">
              View and manage all reviews across the platform
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-primary">
                {allReviews.length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-primary">
                  {getAverageRating()}
                </p>
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Doctors with Reviews</p>
              <p className="text-3xl font-bold text-primary">
                {new Set(allReviews.map((r) => r.doctorId._id)).size}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">5-Star Reviews</p>
              <p className="text-3xl font-bold text-primary">
                {allReviews.filter((r) => r.rating === 5).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-dark mb-4">
              Filter Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Filter size={16} />
                    Filter by Doctor
                  </span>
                </label>
                <select
                  className="input"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}>
                  <option value="">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.userId?.name} - {doctor.specialization} (⭐{" "}
                      {doctor.rating || "0.0"})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Search size={16} />
                    Search Reviews
                  </span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Search by patient name or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Showing {reviews.length} of {allReviews.length} reviews
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-dark">
                          {review.patientId?.userId?.name || "Anonymous"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          reviewed{" "}
                          <span className="font-medium text-primary">
                            {review.doctorId?.userId?.name}
                          </span>{" "}
                          ({review.doctorId?.specialization})
                        </p>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="card text-center py-12">
                <Star size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-500">
                  {selectedDoctor || searchTerm
                    ? "Try adjusting your filters"
                    : "Reviews will appear here once patients start rating doctors"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
