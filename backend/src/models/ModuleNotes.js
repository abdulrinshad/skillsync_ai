import mongoose from "mongoose";

const moduleNotesSchema = new mongoose.Schema(
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
        conceptExplanation: { type: String, required: true },
        examples: [{ type: String }],
        codeExamples: [{ type: String }],
        realWorldExamples: [{ type: String }],
        bestPractices: [{ type: String }],
        summary: { type: String, required: true },
        revisionNotes: { type: String, required: true },
      }
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ModuleNotes = mongoose.models.ModuleNotes || mongoose.model("ModuleNotes", moduleNotesSchema);
export default ModuleNotes;
