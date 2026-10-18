import mongoose from "mongoose";

const practiceQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    }
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    default: "",
  }
});

const practiceTestSchema = new mongoose.Schema(
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
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: [practiceQuestionSchema],
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    timeTaken: {
      type: Number,
      default: 0, // seconds
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookups
practiceTestSchema.index({ studentId: 1, courseId: 1 });

const PracticeTest = mongoose.models.PracticeTest || mongoose.model("PracticeTest", practiceTestSchema);
export default PracticeTest;
