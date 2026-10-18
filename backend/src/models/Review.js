import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      required: true,
    },
    pros: {
      type: String,
      default: "",
    },
    cons: {
      type: String,
      default: "",
    },
    recommendedFor: {
      type: String,
      default: "Everyone",
    },
    contentQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    videoQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    resourceQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    progressAtReview: {
      type: Number,
      default: 0,
    },
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    reportCount: {
      type: Number,
      default: 0,
    },
    teacherReply: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["visible", "hidden", "flagged"],
      default: "visible",
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
reviewSchema.index({ courseId: 1, status: 1 });
reviewSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
