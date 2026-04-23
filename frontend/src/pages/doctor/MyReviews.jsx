import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  ReviewCardSkeleton,
  StatCardSkeleton,
} from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndReviews();
  }, []);

  const fetchProfileAndReviews = async () => {
    try {
      // Get doctor profile
      const profileRes = await api.get("/doctor/profile");
      setProfile(profileRes.data.data);

      // Get reviews for this doctor
      const reviewsRes = await api.get(
        `/reviews/doctor/${profileRes.data.data._id}`,
      );
      setReviews(reviewsRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
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
          <div className="p-8 mt-20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark">My Reviews</h2>
              <p className="text-gray-600 mt-1">
                See what your patients are saying about you
              </p>
            </div>
            <StatCardSkeleton />
            <div className="space-y-4 mt-6">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
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
            <h2 className="text-2xl font-bold text-dark">My Reviews</h2>
            <p className="text-gray-600 mt-1">
              See what your patients are saying about you
            </p>
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
                <p className="text-sm text-gray-600 mt-2">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
              <div className="flex-1 border-l pl-6">
                <h3 className="font-semibold text-dark mb-3">
                  Rating Breakdown
                </h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percentage =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 w-12">
                        {star} star
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
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
            {reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-dark">
                          {review.patientId?.userId?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="card text-center py-12">
                <Star size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Your reviews will appear here once patients rate your service
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
