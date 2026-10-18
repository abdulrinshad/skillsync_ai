import RecentlyViewed from "../models/RecentlyViewed.js";
import { recordRecentlyViewed } from "../utils/recentlyViewedHelper.js";

/**
 * Retrieve the student's recently viewed items.
 * Supports filtering by contentType, searching titles, and sorting.
 */
export const getRecentlyViewedList = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type, search, sort } = req.query;

    const query = { studentId };

    // Apply content type filter
    if (type && type !== "all") {
      query.contentType = type;
    }

    // Apply search filter on title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let sortOption = { lastViewedAt: -1 };
    if (sort === "title") {
      sortOption = { title: 1 };
    } else if (sort === "oldest") {
      sortOption = { lastViewedAt: 1 };
    }

    const list = await RecentlyViewed.find(query)
      .populate("courseId", "title thumbnail")
      .populate("moduleId", "title")
      .sort(sortOption);

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Log a new item manual entry from client-side actions.
 */
export const addRecentlyViewedItem = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, lectureId, contentType, contentId, title, watchPosition, progress } = req.body;

    await recordRecentlyViewed(studentId, {
      courseId,
      moduleId,
      lectureId,
      contentType,
      contentId,
      title,
      watchPosition,
      progress
    });

    res.status(201).json({ message: "Recently viewed log recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a specific log entry by ID.
 */
export const deleteRecentlyViewedItem = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const deleted = await RecentlyViewed.findOneAndDelete({ _id: id, studentId });
    if (!deleted) {
      return res.status(404).json({ message: "History log item not found" });
    }

    res.status(200).json({ message: "Item removed from history successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Clear the entire history of logs for a student.
 */
export const clearRecentlyViewedHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    await RecentlyViewed.deleteMany({ studentId });
    res.status(200).json({ message: "History log cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRecentlyViewedStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const items = await RecentlyViewed.find({ studentId });

    // Calculate distributions
    const typeDistribution = {};
    items.forEach((item) => {
      typeDistribution[item.contentType] = (typeDistribution[item.contentType] || 0) + 1;
    });

    res.status(200).json({
      totalHistoryItems: items.length,
      typeDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
