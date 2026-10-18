import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String,
    default: "",
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  language: {
    type: String,
    default: "English",
  },

  duration: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },

  discount: {
    type: Number,
    default: 0,
  },

  enrollmentLimit: {
    type: Number,
    default: 0,
  },

  outcomes: [{
    type: String
  }],

  prerequisites: [{
    type: String
  }],

  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  }],

  curriculum: [
    {
      title: String,
      lessons: [
        {
          title: String,
          type: {
            type: String,
            enum: ["video", "pdf", "quiz"],
            default: "video"
          }
        }
      ]
    }
  ],

  totalStudents: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },

  approvalStatus: {
    type: String,
    enum: ["draft", "pending_review", "approved", "published", "rejected", "pending"],
    default: "draft",
  },

  submittedForReview: {
    type: Boolean,
    default: false,
  },

  lastPublishedAt: {
    type: Date,
  },

  submittedAt: {
    type: Date,
  },

  approvedAt: {
    type: Date,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  rejectedAt: {
    type: Date,
  },

  rejectedReason: {
    type: String,
  },

  publishedAt: {
    type: Date,
  },

  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  completionRate: {
    type: Number,
    default: 0,
  },

  version: {
    type: Number,
    default: 1,
  },

  publishedVersion: {
    type: Number,
    default: 0,
  }


}, {
  timestamps: true,
});

const Course = mongoose.models.Course || mongoose.model(
  "Course",
  courseSchema
);

export default Course;