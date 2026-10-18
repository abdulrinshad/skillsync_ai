import mongoose from "mongoose";

const studyReminderSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    reminderType: {
      type: String,
      enum: ["daily_study", "goal_reminder", "streak_protection", "assignment_due", "revision"],
      default: "daily_study",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "snoozed", "dismissed"],
      default: "pending",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    snoozedUntil: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

studyReminderSchema.index({ studentId: 1, scheduledTime: 1 });

const StudyReminder = mongoose.models.StudyReminder || mongoose.model("StudyReminder", studyReminderSchema);
export default StudyReminder;
