import StudyReminder from "../models/StudyReminder.js";
import User from "../models/user.js";
import CourseProgress from "../models/CourseProgress.js";

/**
 * Fetch study reminders.
 * Automatically pre-populates personalized reminders if none exist.
 */
export const getReminders = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch existing active study reminders
    let reminders = await StudyReminder.find({
      studentId,
      status: { $in: ["pending", "snoozed"] }
    }).sort({ scheduledTime: 1 });

    // Auto-generate if none exist
    if (reminders.length === 0) {
      const user = await User.findById(studentId);
      const progress = await CourseProgress.findOne({ studentId }).populate("courseId");

      const generated = [];

      // 1. Daily Study Time Reminder
      if (progress && progress.courseId) {
        generated.push({
          studentId,
          courseId: progress.courseId._id,
          reminderType: "daily_study",
          title: "Study Time Reminder",
          description: `Resume learning on: "${progress.courseId.title}". You are doing great!`,
          priority: "high",
          scheduledTime: new Date(),
          status: "pending"
        });
      }

      // 2. Streak Protection Alert
      if (user && user.currentStreak > 0) {
        generated.push({
          studentId,
          reminderType: "streak_protection",
          title: "Streak Protection Alert",
          description: `Protect your active ${user.currentStreak}-day learning streak by studying for 15 minutes today!`,
          priority: "critical",
          scheduledTime: new Date(),
          status: "pending"
        });
      }

      if (generated.length > 0) {
        reminders = await StudyReminder.insertMany(generated);
      }
    }

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add custom study reminder.
 */
export const addReminder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, description, priority, scheduledTime } = req.body;

    const reminder = await StudyReminder.create({
      studentId,
      title,
      description,
      priority: priority || "medium",
      scheduledTime: new Date(scheduledTime),
      status: "pending"
    });

    res.status(201).json({ message: "Reminder scheduled successfully", reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Snooze reminder by specified duration (minutes).
 */
export const snoozeReminder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { minutes } = req.body; // e.g. 10, 30, 60

    const snoozedUntil = new Date();
    snoozedUntil.setMinutes(snoozedUntil.getMinutes() + parseInt(minutes || 10));

    const reminder = await StudyReminder.findOneAndUpdate(
      { _id: id, studentId },
      { status: "snoozed", snoozedUntil },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Study reminder not found" });
    }

    res.status(200).json({ message: `Reminder snoozed for ${minutes} minutes`, reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark reminder as completed.
 */
export const completeReminder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const reminder = await StudyReminder.findOneAndUpdate(
      { _id: id, studentId },
      { status: "completed" },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Study reminder not found" });
    }

    res.status(200).json({ message: "Reminder marked completed", reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Dismiss reminder.
 */
export const deleteReminder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const reminder = await StudyReminder.findOneAndUpdate(
      { _id: id, studentId },
      { status: "dismissed" },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Study reminder not found" });
    }

    res.status(200).json({ message: "Reminder dismissed", reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
