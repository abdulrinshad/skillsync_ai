import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
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
    resourceId: {
      type: String, // ID of the specific sub-resource or PDF notes
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true, // e.g. 'pdf', 'zip', 'certificate', 'ppt'
    },
    fileSize: {
      type: Number,
      default: 0, // in bytes
    },
    downloadStatus: {
      type: String,
      enum: ["waiting", "downloading", "paused", "completed", "failed", "cancelled"],
      default: "completed",
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

downloadSchema.index({ studentId: 1, downloadedAt: -1 });

const Download = mongoose.models.Download || mongoose.model("Download", downloadSchema);
export default Download;
