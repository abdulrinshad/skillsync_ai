import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
    addedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Ensure unique compound index for student and course combinations
favoriteSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
export default Favorite;
