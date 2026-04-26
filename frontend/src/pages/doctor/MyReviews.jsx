import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { DoctorReviewsSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]); // For stats calculation
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });

  useEffect(() => {
    fetchProfileAndReviews();
  }, [pagination.currentPage]);

  const fetchProfileAndReviews = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      // Get doctor profile
      const profileRes = await api.get("/doctor/profile");
      setProfile(profileRes.data.data);

      // Get all reviews for stats calculation (without pagination)
      const allReviewsRes = await api.get(
        `/reviews/doctor/${profileRes.data.data._id}?all=true`,
      );
      setAllReviews(allReviewsRes.data.data || []);

      // Get paginated reviews
      const reviewsRes = await api.get(
        `/reviews/doctor/${profileRes.data.data._id}?page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setReviews(reviewsRes.data.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: reviewsRes.data.currentPage || 1,
        totalPages: reviewsRes.data.totalPages || 1,
        totalItems: reviewsRes.data.totalItems || 0,
      }));

      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
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
            size={18}
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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <DoctorReviewsSkeleton />
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  My Reviews
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mt-1">
                  See what your patients are saying about you
                </p>
              </div>
              <ExportButton
                data={allReviews}
                type="reviews"
                title="My Reviews Report"
                filename="my_reviews_report"
              />
            </div>
          </div>

          {/* Rating Summary */}
          <div className="card mb-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary">
                  {profile?.rating || "0.0"}
                </div>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(profile?.rating || 0))}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                  {allReviews.length}{" "}
                  {allReviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
              <div className="flex-1 border-l dark:border-slate-700 pl-6">
                <h3 className="font-semibold text-dark dark:text-slate-100 mb-3">
                  Rating Breakdown
                </h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = allReviews.filter(
                    (r) => r.rating === star,
                  ).length;
                  const percentage =
                    allReviews.length > 0
                      ? (count / allReviews.length) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 dark:text-slate-400 w-12">
                        {star} star
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-slate-400 w-12">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <EmptyState
                type="reviews"
                title="No reviews yet"
                description="Your reviews will appear here once patients rate your service"
                className="py-12"
              />
            ) : (
              <>
                {reviews.map((review) => (
                  <div key={review._id} className="card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-dark dark:text-slate-100">
                              {review.patientId?.userId?.name || "Anonymous"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500 dark:text-slate-400">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-slate-300 mt-3">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
