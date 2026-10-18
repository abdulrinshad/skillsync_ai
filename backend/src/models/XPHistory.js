import mongoose from "mongoose";

const xpHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activity: {
      type: String, // e.g. 'Completed Quiz', 'Watched Lecture'
      required: true,
    },
    xpEarned: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

xpHistorySchema.index({ studentId: 1, date: -1 });

const XPHistory = mongoose.models.XPHistory || mongoose.model("XPHistory", xpHistorySchema);
export default XPHistory;
