import TimelineEvent from "../models/TimelineEvent.js";

/**
 * Persist a chronological learning timeline milestone event.
 */
export const recordTimelineEvent = async (studentId, {
  courseId,
  moduleId,
  lectureId,
  eventType,
  title,
  description = "",
  xpEarned = 0
}) => {
  try {
    if (!studentId || !eventType || !title) {
      return;
    }

    await TimelineEvent.create({
      studentId,
      courseId: courseId || null,
      moduleId: moduleId || null,
      lectureId: lectureId || null,
      eventType,
      title,
      description,
      xpEarned,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Error in recordTimelineEvent helper:", err);
  }
};
