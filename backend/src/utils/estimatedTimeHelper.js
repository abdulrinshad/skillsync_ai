import Lecture from "../models/Lecture.js";
import CourseProgress from "../models/CourseProgress.js";
import mongoose from "mongoose";

/**
 * Converts string duration (like "15:00", "01:10:45") to seconds.
 */
export const parseDurationToSeconds = (durationStr) => {
  if (!durationStr) return 900; // fallback to 15 minutes
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) {
    return (parts[0] * 60) + parts[1];
  } else if (parts.length === 3) {
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  }
  return Number(durationStr) || 900;
};

/**
 * Computes remaining learning time for a student on a specific course.
 */
export const calculateRemainingTime = async (studentId, courseId) => {
  try {
    const progress = await CourseProgress.findOne({ studentId, courseId });
    const lectures = await Lecture.find({ courseId });

    if (lectures.length === 0) {
      return { totalSecondsLeft: 0, hours: 0, minutes: 0 };
    }

    let totalSecondsLeft = 0;

    // 1. Calculate remaining video durations
    for (const lecture of lectures) {
      const lectureIdStr = lecture._id.toString();
      const modProg = progress ? progress.moduleProgress.find(m => m.moduleId.toString() === lecture.moduleId.toString()) : null;

      // Skip if lecture is completed
      if (modProg && modProg.completedLectures?.includes(lecture._id)) {
        continue;
      }

      const totalLecSecs = parseDurationToSeconds(lecture.duration);
      let watchedSecs = 0;

      // Subtract partial watch time if recorded
      if (modProg && modProg.watchedPercentage) {
        const pct = modProg.watchedPercentage.get(lectureIdStr) || 0;
        watchedSecs = (pct / 100) * totalLecSecs;
      }

      totalSecondsLeft += Math.max(0, totalLecSecs - watchedSecs);
    }

    // 2. Add supplemental items estimates (Notes = 5m [300s], Quizzes = 10m [600s])
    if (progress) {
      progress.moduleProgress.forEach((m) => {
        if (!m.notesCompleted) {
          totalSecondsLeft += 300;
        }
        if (!m.quizCompleted) {
          totalSecondsLeft += 600;
        }
      });
    }

    // Personalization multiplier (default 1.0)
    const watchSpeedMultiplier = 1.0;
    const finalSeconds = totalSecondsLeft / watchSpeedMultiplier;

    const hours = Math.floor(finalSeconds / 3600);
    const minutes = Math.round((finalSeconds % 3600) / 60);

    return {
      totalSecondsLeft: Math.round(finalSeconds),
      hours,
      minutes
    };
  } catch (err) {
    console.error("Error in calculateRemainingTime helper:", err);
    return { totalSecondsLeft: 0, hours: 0, minutes: 0 };
  }
};
