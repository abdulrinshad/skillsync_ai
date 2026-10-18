import mongoose from "mongoose";

const codingSubmissionSchema = new mongoose.Schema(
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
    language: {
      type: String,
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    stdout: {
      type: String,
      default: "",
    },
    stderr: {
      type: String,
      default: "",
    },
    isPassed: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
codingSubmissionSchema.index({ studentId: 1, moduleId: 1 });

const CodingSubmission = mongoose.models.CodingSubmission || mongoose.model("CodingSubmission", codingSubmissionSchema);
export default CodingSubmission;
