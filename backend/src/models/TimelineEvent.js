import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
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
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
    eventType: {
      type: String,
      enum: [
        "enrollment",
        "course_start",
        "module_start",
        "lecture_complete",
        "resource_view",
        "notes_read",
        "quiz_complete",
        "goal_complete",
        "certificate_earn",
        "course_complete"
      ],
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
    xpEarned: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

timelineEventSchema.index({ studentId: 1, timestamp: -1 });

const TimelineEvent = mongoose.models.TimelineEvent || mongoose.model("TimelineEvent", timelineEventSchema);
export default TimelineEvent;
