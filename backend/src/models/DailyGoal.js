import mongoose from "mongoose";

const dailyGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD (helps segment by calendar date in UTC/local timezone)
      required: true,
    },
    goalType: {
      type: String,
      enum: ["time", "lectures", "notes", "quiz", "modules", "custom"],
      default: "time",
    },
    goalValue: {
      type: Number,
      default: 30, // e.g. 30 minutes, or 2 lectures, 1 quiz, etc.
    },
    progress: {
      type: Number,
      default: 0, // e.g. minutes studied today, or count of lectures completed today
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    streakUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly query today's goal for a user
dailyGoalSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyGoal = mongoose.models.DailyGoal || mongoose.model("DailyGoal", dailyGoalSchema);
export default DailyGoal;
