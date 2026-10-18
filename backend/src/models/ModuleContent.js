import mongoose from "mongoose";

const moduleContentSchema = new mongoose.Schema(
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
    notes: [
      {
        title: { type: String, required: true },
        introduction: { type: String, required: true },
        explanation: { type: String, required: true },
        examples: [{ type: String }],
        realWorldUseCases: [{ type: String }],
        bestPractices: [{ type: String }],
        summary: { type: String, required: true },
        revisionNotes: { type: String, required: true },
      }
    ],
    cheatSheet: {
      type: String,
      default: "",
    },
    learningObjectives: [{
      type: String,
    }],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ModuleContent = mongoose.models.ModuleContent || mongoose.model("ModuleContent", moduleContentSchema);
export default ModuleContent;
