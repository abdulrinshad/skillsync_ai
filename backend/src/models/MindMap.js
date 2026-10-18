import mongoose from "mongoose";

const mindMapNodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  }
});

const mindMapSchema = new mongoose.Schema(
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
    nodes: [mindMapNodeSchema]
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
mindMapSchema.index({ studentId: 1, lectureId: 1 });

const MindMap = mongoose.models.MindMap || mongoose.model("MindMap", mindMapSchema);
export default MindMap;
