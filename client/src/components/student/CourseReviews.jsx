import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, ThumbsUp, AlertOctagon, CheckCircle, Sparkles, Send } from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";
import { toast } from "react-toastify";

const CourseReviews = ({ courseId, enrolled, progress }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalCount: 0, recommendPct: 0, distribution: {} });
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [recommended, setRecommended] = useState("Everyone");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/course/${courseId}`);
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || { averageRating: 0, totalCount: 0, recommendPct: 0, distribution: {} });
    } catch (err) {
      console.error("Failed to fetch course reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) {
      toast.error("Please add review description text.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          courseId,
          rating,
          title,
          review: reviewText,
          pros,
          cons,
          recommendedFor: recommended
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Review submitted successfully!");
      setTitle("");
      setReviewText("");
      setPros("");
      setCons("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      toast.error("Please login to vote.");
    }
  };

  const handleReport = async (reviewId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/reviews/${reviewId}/report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review reported.");
    } catch (err) {
      toast.error("Failed to report review.");
    }
  };

  const renderStars = (count, size = 14) => {
    return Array.from({ length: 5 }, (_, idx) => (
      <Star
        key={idx}
        size={size}
        className={idx < count ? "text-yellow-400 fill-yellow-400" : "text-gray-650"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="w-full h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-6" />
    );
  }

  // Check eligibility: enrolled and progress >= 30%
  const isEligibleToReview = enrolled && progress >= 30;

  return (
    <div className="space-y-8 pt-8 border-t border-white/5">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" /> Student Reviews & Feedback
        </h3>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Rating Breakdown (col-span-4) */}
        <div className="md:col-span-4">
          <GlassCard className="p-6 border-white/10 space-y-6 text-center bg-gradient-to-b from-white/[0.01] to-transparent">
            <div>
              <span className="text-5xl font-black text-white">{stats.averageRating}</span>
              <div className="flex justify-center gap-1 mt-2">
                {renderStars(Math.round(stats.averageRating), 18)}
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-2 block">
                Course Rating ({stats.totalCount} reviews)
              </span>
            </div>

            <div className="space-y-2 text-left pt-4 border-t border-white/5">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <span className="w-3">{star}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${stats.distribution[star] || 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{stats.distribution[star] || 0}%</span>
                </div>
              ))}
            </div>

            {stats.recommendPct > 0 && (
              <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-green-400">
                <CheckCircle size={16} />
                <span>{stats.recommendPct}% of students recommend this course</span>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Reviews lists & submission forms (col-span-8) */}
        <div className="md:col-span-8 space-y-6">
          {/* Submit form if eligible */}
          {isEligibleToReview && (
            <GlassCard className="p-6 border-purple-500/20 bg-purple-950/5 space-y-4">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles size={16} className="text-purple-400" /> Share your experience
                </h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Submit your verified rating</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          size={20}
                          className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-650"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Review Title (e.g. Incredibly helpful summary)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <textarea
                    placeholder="Write detailed review details..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                    className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pros (Optional)"
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Cons (Optional)"
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5"
                >
                  <Send size={12} /> Post Review
                </Button>
              </form>
            </GlassCard>
          )}

          {/* List of Reviews */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl text-xs text-gray-500 font-bold uppercase tracking-wider">
                No reviews yet. Be the first to share your feedback!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                        {rev.studentId?.name ? rev.studentId.name.charAt(0) : "S"}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          {rev.studentId?.name || "Verified Student"}
                          <Badge color="green" className="text-[8px] font-black shrink-0 px-1 py-0.5 uppercase tracking-wider">Verified</Badge>
                        </h4>
                        <div className="flex gap-0.5 mt-1">{renderStars(rev.rating)}</div>
                      </div>
                    </div>

                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {rev.title && <h5 className="text-xs font-black text-white">{rev.title}</h5>}
                    <p className="text-xs text-gray-400 leading-relaxed font-semibold">{rev.review}</p>
                    
                    {(rev.pros || rev.cons) && (
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-semibold pt-1">
                        {rev.pros && <p className="text-green-400">👍 Pros: {rev.pros}</p>}
                        {rev.cons && <p className="text-red-400">👎 Cons: {rev.cons}</p>}
                      </div>
                    )}
                  </div>

                  {/* Actions & Teacher Reply */}
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHelpful(rev._id)}
                        className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-1"
                      >
                        <ThumbsUp size={10} /> Helpful ({rev.helpfulVotes?.length || 0})
                      </button>
                      <button
                        onClick={() => handleReport(rev._id)}
                        className="text-[9px] font-black text-gray-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 ml-3"
                      >
                        <AlertOctagon size={10} /> Report
                      </button>
                    </div>

                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      Progress: {rev.progressAtReview}%
                    </span>
                  </div>

                  {rev.teacherReply && (
                    <div className="p-3 bg-purple-950/10 border border-purple-500/10 rounded-xl space-y-1 text-xs">
                      <span className="text-[9px] text-purple-400 font-black uppercase tracking-wider block">Instructor Reply:</span>
                      <p className="text-gray-400 font-semibold">{rev.teacherReply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseReviews;
