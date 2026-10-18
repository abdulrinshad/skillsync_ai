import mongoose from "mongoose";

const aiQuestionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIQuiz",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "tf", "fill_blank", "short_answer"],
      required: true,
    },
    options: [{
      type: String,
    }],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    marks: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AIQuestion = mongoose.models.AIQuestion || mongoose.model("AIQuestion", aiQuestionSchema);
export default AIQuestion;
