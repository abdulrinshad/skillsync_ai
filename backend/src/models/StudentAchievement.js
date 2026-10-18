import mongoose from "mongoose";

const studentAchievementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badgeId: {
      type: String, // unique ID of the badge (e.g. 'first_lecture', 'quiz_master')
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: "Trophy",
    },
    category: {
      type: String,
      required: true, // e.g. 'learning', 'quizzes', 'goals', 'streaks', 'xp'
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    difficulty: {
      type: String,
      enum: ["bronze", "silver", "gold", "legend"],
      default: "bronze",
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

studentAchievementSchema.index({ studentId: 1, badgeId: 1 }, { unique: true });

const StudentAchievement = mongoose.models.StudentAchievement || mongoose.model("StudentAchievement", studentAchievementSchema);
export default StudentAchievement;
