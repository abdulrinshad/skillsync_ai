import mongoose from "mongoose";

const aiQuizSchema = new mongoose.Schema(
  {
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
    topic: {
      type: String,
      default: "",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    questions: [
      {
        type: {
          type: String,
          enum: ["mcq", "truefalse", "fillblank", "shortanswer"],
          required: true,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        options: [{ type: String }],
        correctAnswer: {
          type: String,
          default: "",
        },
        sampleAnswer: {
          type: String,
          default: "",
        },
        explanation: {
          type: String,
          default: "",
        },
        marks: {
          type: Number,
          default: 1,
        },
      }
    ],
    aiProvider: {
      type: String,
      default: "groq",
    },
    aiModel: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_review", "approved", "published", "rejected"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    collection: "aiquizzes",
  }
);

const AIQuiz = mongoose.models.AIQuiz || mongoose.model("AIQuiz", aiQuizSchema);
export default AIQuiz;
