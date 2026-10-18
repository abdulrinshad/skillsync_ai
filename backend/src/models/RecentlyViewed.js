import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
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
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
    contentType: {
      type: String,
      enum: ["video", "notes", "resource", "quiz", "certificate"],
      required: true,
    },
    contentId: {
      type: String, // ID of the specific sub-item (lecture, quiz, resource, etc.)
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
    watchPosition: {
      type: Number,
      default: 0, // seconds offset if video
    },
    progress: {
      type: Number,
      default: 0, // completion percentage
    }
  },
  {
    timestamps: true,
  }
);

// Index to quickly fetch a student's history sorted by recency
recentlyViewedSchema.index({ studentId: 1, lastViewedAt: -1 });

// Ensure unique entry per content type and content ID for the student
recentlyViewedSchema.index({ studentId: 1, contentType: 1, contentId: 1 }, { unique: true });

const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model("RecentlyViewed", recentlyViewedSchema);
export default RecentlyViewed;
