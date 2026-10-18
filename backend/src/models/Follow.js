import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate follow connections
followSchema.index({ studentId: 1, teacherId: 1 }, { unique: true });

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);
export default Follow;
