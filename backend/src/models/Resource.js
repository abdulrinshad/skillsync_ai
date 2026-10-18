import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    resourceType: {
      type: String,
      enum: ["pdf", "ppt", "doc", "excel", "zip", "image", "video", "link", "other"],
      default: "other",
    },
    category: {
      type: String,
      default: "Study Material",
    },
    fileName: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    fileSize: {
      type: String,
      default: "0 Bytes",
    },
    fileExtension: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    externalLink: {
      type: String,
      default: "",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_review", "approved", "published", "rejected"],
      default: "draft",
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;
