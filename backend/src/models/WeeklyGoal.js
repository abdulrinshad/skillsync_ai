import mongoose from "mongoose";

const weeklyGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekId: {
      type: String, // Format: YYYY-[W]WW (e.g. 2026-W29)
      required: true,
    },
    goalType: {
      type: String,
      enum: ["time", "lectures", "notes", "quiz", "modules", "xp"],
      default: "time",
    },
    goalValue: {
      type: Number,
      default: 180, // default to 180 minutes (3 hours)
    },
    progress: {
      type: Number,
      default: 0,
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
      default: 150,
    },
    rewarded: {
      type: Boolean,
      default: false,
    },
    // Daily learning activity tracker. Maps day index (0: Sun, 1: Mon, ... 6: Sat) to study minutes
    dailyActivity: {
      type: Map,
      of: Number,
      default: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
      }
    },
    // Detailed stats aggregated during the week
    stats: {
      time: { type: Number, default: 0 },
      lectures: { type: Number, default: 0 },
      notes: { type: Number, default: 0 },
      quiz: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true,
  }
);

// Unique compound index for user and week combination
weeklyGoalSchema.index({ userId: 1, weekId: 1 }, { unique: true });

const WeeklyGoal = mongoose.models.WeeklyGoal || mongoose.model("WeeklyGoal", weeklyGoalSchema);
export default WeeklyGoal;
