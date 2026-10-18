import mongoose from "mongoose";

const importantQuestionSchema = new mongoose.Schema(
  {
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions2Mark: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }
    ],
    questions5Mark: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }
    ],
    questions10Mark: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }
    ],
    interviewQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }
    ],
    companyQuestions: [
      {
        question: { type: String, required: true },
        companies: [{ type: String }],
        answer: { type: String, required: true },
      }
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ImportantQuestion = mongoose.models.ImportantQuestion || mongoose.model("ImportantQuestion", importantQuestionSchema);
export default ImportantQuestion;
