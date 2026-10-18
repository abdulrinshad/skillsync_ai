import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
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
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "15:00",
    },
    order: {
      type: Number,
      default: 0,
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
  }
);

const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
export default Lecture;
