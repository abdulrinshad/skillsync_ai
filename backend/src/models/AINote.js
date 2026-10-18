import mongoose from "mongoose";

const aiNoteSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    chapterNumber: {
      type: Number,
      default: 1,
    },
    introduction: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: true,
    },
    keyPoints: [{
      type: String,
    }],
    explanation: {
      type: String,
      required: true,
    },
    examples: {
      type: String,
    },
    codeExamples: [{
      code: String,
      explanation: String,
    }],
    importantQuestions: [{
      type: String,
    }],
    interviewQuestions: [{
      type: String,
    }],
    mcqs: [{
      question: String,
      options: [String],
      answer: String,
      explanation: String,
    }],
    mistakes: [{
      type: String,
    }],
    tips: [{
      type: String,
    }],
    cheatSheet: [{
      term: String,
      definition: String,
    }],
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aiProvider: {
      type: String,
      default: "groq",
    },
    aiModel: {
      type: String,
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
    collection: "ainotes",
  }
);

const AINote = mongoose.models.AINote || mongoose.model("AINote", aiNoteSchema);
export default AINote;
