import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
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
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "expert"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "learning", "review", "mastered"],
      default: "new",
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    repetitionCount: {
      type: Number,
      default: 0,
    },
    interval: {
      type: Number,
      default: 0, // days
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookups
flashcardSchema.index({ studentId: 1, lectureId: 1 });

const Flashcard = mongoose.models.Flashcard || mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;
