import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
    assignments: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: [{ type: String }],
        expectedOutput: { type: String, default: "" },
        submissionInstructions: { type: String, default: "Upload zip file of the repository or submit github link." },
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

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
