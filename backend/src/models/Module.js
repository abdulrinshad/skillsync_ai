import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    learningOutcomes: [{
      type: String,
    }],
    topics: [
      {
        title: { type: String, required: true },
        order: { type: Number, default: 0 },
      }
    ],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    duration: {
      type: String,
      default: "3 Hours",
    },
    notesGenerated: {
      type: Boolean,
      default: false,
    },
    quizGenerated: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_review", "approved", "published", "rejected"],
      default: "draft",
    },
    lectureCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

moduleSchema.index(
  {
    courseId: 1,
    title: 1,
  },
  {
    unique: true,
  }
);

const Module = mongoose.models.Module || mongoose.model("Module", moduleSchema);
export default Module;
