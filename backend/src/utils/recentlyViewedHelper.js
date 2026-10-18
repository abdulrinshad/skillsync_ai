import RecentlyViewed from "../models/RecentlyViewed.js";

/**
 * Record a student's access to a specific learning unit.
 * Updates matching history logs or inserts new logs, maintaining a maximum size of 30 items.
 */
export const recordRecentlyViewed = async (studentId, {
  courseId,
  moduleId,
  lectureId,
  contentType,
  contentId,
  title,
  watchPosition = 0,
  progress = 0
}) => {
  try {
    if (!studentId || !courseId || !moduleId || !contentType || !contentId || !title) {
      return;
    }

    // Upsert the entry: updates lastViewedAt and positions
    await RecentlyViewed.findOneAndUpdate(
      { studentId, contentType, contentId },
      {
        courseId,
        moduleId,
        lectureId: lectureId || null,
        title,
        lastViewedAt: new Date(),
        watchPosition,
        progress
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Enforce 30-item limit per student to keep database clean
    const count = await RecentlyViewed.countDocuments({ studentId });
    if (count > 30) {
      const oldestItems = await RecentlyViewed.find({ studentId })
        .sort({ lastViewedAt: 1 })
        .limit(count - 30);
      
      const oldestIds = oldestItems.map(item => item._id);
      await RecentlyViewed.deleteMany({ _id: { $in: oldestIds } });
    }
  } catch (err) {
    console.error("Error in recordRecentlyViewed:", err);
  }
};
