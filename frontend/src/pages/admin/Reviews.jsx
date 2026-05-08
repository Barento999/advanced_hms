import { useState, useEffect } from "react";
import { Star, User, Search, Filter } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { AdminReviewsSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Reviews = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });

  useEffect(() => {
    fetchDoctorsAndReviews();
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    filterReviews();
  }, [selectedDoctor, searchTerm, allReviews]);

  useEffect(() => {
    paginateReviews();
  }, [pagination.currentPage]);

  const fetchDoctorsAndReviews = async () => {
    try {
      // Temporary delay to see skeleton (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch all reviews in one call
      const reviewsRes = await api.get("/reviews/all");
      const reviewsData = reviewsRes.data.data || [];

      // Filter out reviews with null doctorId to prevent errors
      const validReviews = reviewsData.filter(
        (review) => review.doctorId && review.doctorId._id,
      );
      setAllReviews(validReviews);

      // Extract unique doctors from reviews
      const uniqueDoctors = [];
      const doctorIds = new Set();
      validReviews.forEach((review) => {
        if (review.doctorId && !doctorIds.has(review.doctorId._id)) {
          doctorIds.add(review.doctorId._id);
          uniqueDoctors.push(review.doctorId);
        }
      });
      setDoctors(uniqueDoctors);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
        (review) => review.doctorId && review.doctorId._id === selectedDoctor,
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

    // Update pagination info
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: 1,
    }));

    // Paginate the filtered results
    const startIndex = 0;
    const endIndex = pagination.itemsPerPage;
    setReviews(filtered.slice(startIndex, endIndex));
  };

  const paginateReviews = () => {
    let filtered = [...allReviews];

    // Apply filters
    if (selectedDoctor) {
      filtered = filtered.filter(
        (review) => review.doctorId && review.doctorId._id === selectedDoctor,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.patientId?.userId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Paginate
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    setReviews(filtered.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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
    if (!reviews || reviews.length === 0) return 0;
    const validReviews = reviews.filter(
      (review) => review && typeof review.rating === "number",
    );
    if (validReviews.length === 0) return 0;
    const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / validReviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <AdminReviewsSkeleton />
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
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  All Doctor Reviews
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mt-1">
                  View and manage all reviews across the platform
                </p>
              </div>
              <ExportButton
                data={allReviews}
                type="reviews"
                title="Reviews Report"
                filename="reviews_report"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                Total Reviews
              </p>
              <p className="text-3xl font-bold text-primary">
                {allReviews?.length || 0}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                Average Rating
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-primary">
                  {getAverageRating()}
                </p>
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                Doctors with Reviews
              </p>
              <p className="text-3xl font-bold text-primary">
                {
                  new Set(
                    allReviews
                      .filter((r) => r.doctorId)
                      .map((r) => r.doctorId._id),
                  ).size
                }
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                5-Star Reviews
              </p>
              <p className="text-3xl font-bold text-primary">
                {allReviews?.filter((r) => r.rating === 5)?.length || 0}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
              Filter Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
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
            <div className="mt-3 text-sm text-gray-600 dark:text-slate-400">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}{" "}
              of {pagination.totalItems} reviews
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
                        <h4 className="font-semibold text-dark dark:text-slate-100">
                          {review.patientId?.userId?.name || "Anonymous"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          reviewed{" "}
                          <span className="font-medium text-primary">
                            {review.doctorId?.userId?.name}
                          </span>{" "}
                          ({review.doctorId?.specialization})
                        </p>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-slate-300 mt-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && !loading && (
              <EmptyState
                type="reviews"
                title="No reviews found"
                description={
                  selectedDoctor || searchTerm
                    ? "No reviews match your current filters. Try adjusting your search criteria."
                    : "No reviews have been submitted yet. Reviews will appear here once patients start rating doctors."
                }
                className="py-8"
              />
            )}
          </div>

          {/* Pagination */}
          {!loading && reviews.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
