import Review from "../models/Review.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";

/**
 * Fetch course reviews, ratings distribution, and recommendation stats.
 */
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch reviews with populated student names
    const reviews = await Review.find({ courseId, status: "visible" })
      .populate("studentId", "name avatar")
      .sort({ createdAt: -1 });

    // Compute rating breakdown statistics
    const stats = {
      averageRating: 0,
      totalCount: reviews.length,
      recommendPct: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviews.length > 0) {
      let sum = 0;
      let recommendCount = 0;

      reviews.forEach((r) => {
        sum += r.rating;
        if (r.recommendedFor !== "No one") {
          recommendCount++;
        }
        if (stats.distribution[r.rating] !== undefined) {
          stats.distribution[r.rating]++;
        }
      });

      stats.averageRating = Number((sum / reviews.length).toFixed(1));
      stats.recommendPct = Math.round((recommendCount / reviews.length) * 100);
      
      // Normalize distributions to percentages
      Object.keys(stats.distribution).forEach((star) => {
        stats.distribution[star] = Math.round((stats.distribution[star] / reviews.length) * 100);
      });
    }

    res.status(200).json({ stats, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit verified student review.
 */
export const submitReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      courseId,
      rating,
      title,
      review,
      pros,
      cons,
      recommendedFor,
      contentQuality,
      videoQuality,
      resourceQuality,
      difficulty
    } = req.body;

    // 1. Verify enrollment and progress percentage (>= 30% or course completed)
    const progress = await CourseProgress.findOne({ studentId, courseId });
    if (!progress) {
      return res.status(403).json({ message: "You must be enrolled in this course to submit a review." });
    }

    if (progress.totalProgress < 30 && !progress.completed) {
      return res.status(403).json({ message: "You must complete at least 30% of the course to share feedback." });
    }

    // 2. Prevent duplicate reviews
    const existingReview = await Review.findOne({ studentId, courseId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course. You can edit your existing review instead." });
    }

    // 3. Create review
    const newReview = await Review.create({
      studentId,
      courseId,
      rating,
      title,
      review,
      pros,
      cons,
      recommendedFor,
      contentQuality,
      videoQuality,
      resourceQuality,
      difficulty,
      progressAtReview: progress.totalProgress,
      status: "visible"
    });

    res.status(201).json({ message: "Review posted successfully!", review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update review.
 */
export const updateReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { rating, title, review, pros, cons, recommendedFor } = req.body;

    const updated = await Review.findOneAndUpdate(
      { _id: id, studentId },
      { rating, title, review, pros, cons, recommendedFor },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review updated successfully!", review: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete review.
 */
export const deleteReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const deleted = await Review.findOneAndDelete({ _id: id, studentId });
    if (!deleted) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle helpful vote.
 */
export const voteHelpful = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const index = review.helpfulVotes.indexOf(userId);
    if (index > -1) {
      review.helpfulVotes.splice(index, 1); // remove helpful vote
    } else {
      review.helpfulVotes.push(userId); // add helpful vote
    }

    await review.save();
    res.status(200).json({ message: "Helpful status updated", helpfulVotes: review.helpfulVotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Report/Flag review.
 */
export const reportReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.reportCount += 1;
    if (review.reportCount >= 3) {
      review.status = "flagged"; // auto-flag suspicious reviews
    }

    await review.save();
    res.status(200).json({ message: "Review reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reply to review (Teacher action).
 */
export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.teacherReply = reply;
    await review.save();

    res.status(200).json({ message: "Reply posted successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
