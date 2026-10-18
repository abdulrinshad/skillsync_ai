import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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

    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    verificationCode: {
      type: String,
      unique: true,
    },

    certificateUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Certificate",
  certificateSchema
);