import mongoose from "mongoose";
import TimelineEvent from "../models/TimelineEvent.js";


/**
 * Fetch all learning timeline events for a student.
 * Supports filtering by eventType, sorting by timestamp, and search queries.
 */
export const getTimelineEvents = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type, search } = req.query;

    const query = { studentId };

    // Apply type filter
    if (type && type !== "all") {
      query.eventType = type;
    }

    // Apply search filter
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const events = await TimelineEvent.find(query)
      .populate("courseId", "title thumbnail")
      .populate("moduleId", "title")
      .populate("lectureId", "title")
      .sort({ timestamp: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch the student's top 5 most recent timeline events (for widgets).
 */
export const getRecentTimelineEvents = async (req, res) => {
  try {
    const studentId = req.user.id;
    const events = await TimelineEvent.find({ studentId })
      .populate("courseId", "title thumbnail")
      .populate("moduleId", "title")
      .populate("lectureId", "title")
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getStudentLearningStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const count = await TimelineEvent.countDocuments({ studentId });
    const completionStats = await TimelineEvent.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalMilestones: count,
      completionStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLastActivity = async (req, res) => {
  try {
    const studentId = req.user.id;
    const lastEvent = await TimelineEvent.findOne({ studentId })
      .populate("courseId", "title thumbnail")
      .populate("moduleId", "title")
      .populate("lectureId", "title")
      .sort({ timestamp: -1 });

    res.status(200).json(lastEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

