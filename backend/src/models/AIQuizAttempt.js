import mongoose from "mongoose";

const aiQuizAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIQuiz",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        selectedAnswer: {
          type: String,
          default: "",
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      }
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    completionTime: {
      type: Number, // duration in seconds
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "aiquizattempts",
  }
);

const AIQuizAttempt = mongoose.models.AIQuizAttempt || mongoose.model("AIQuizAttempt", aiQuizAttemptSchema);
export default AIQuizAttempt;
