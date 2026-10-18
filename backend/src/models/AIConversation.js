import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["system", "user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const aiConversationSchema = new mongoose.Schema(
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
    messages: [aiMessageSchema]
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookups
aiConversationSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });

const AIConversation = mongoose.models.AIConversation || mongoose.model("AIConversation", aiConversationSchema);
export default AIConversation;
