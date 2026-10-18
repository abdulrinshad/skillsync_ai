import Download from "../models/Download.js";
import mongoose from "mongoose";

/**
 * Fetch student download logs history.
 * Supports keyword searching and filtering by fileType.
 */
export const getDownloadsHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { search, fileType } = req.query;

    const query = { studentId };

    // Apply type filter
    if (fileType && fileType !== "all") {
      query.fileType = fileType;
    }

    // Apply search filter on filename
    if (search) {
      query.fileName = { $regex: search, $options: "i" };
    }

    const logs = await Download.find(query)
      .populate("courseId", "title thumbnail")
      .populate("moduleId", "title")
      .sort({ downloadedAt: -1 });

    // Aggregate storage statistics
    const totalStorageBytes = logs.reduce((sum, item) => sum + (item.fileSize || 0), 0);
    const storageUsedMB = Number((totalStorageBytes / (1024 * 1024)).toFixed(2));

    res.status(200).json({
      storageUsedMB,
      totalDownloads: logs.length,
      history: logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Register or update a download activity log.
 */
export const addDownloadLog = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, resourceId, fileName, fileType, fileSize, downloadStatus } = req.body;

    const log = await Download.findOneAndUpdate(
      { studentId, resourceId },
      {
        courseId,
        moduleId,
        fileName,
        fileType,
        fileSize,
        downloadStatus: downloadStatus || "completed",
        downloadedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Download registered successfully", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove a single download log.
 */
export const deleteDownloadLog = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const deleted = await Download.findOneAndDelete({ _id: id, studentId });
    if (!deleted) {
      return res.status(404).json({ message: "Download log not found" });
    }

    res.status(200).json({ message: "Download log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Clear all download history for a student.
 */
export const clearDownloadsHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    await Download.deleteMany({ studentId });
    res.status(200).json({ message: "Downloads history cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
