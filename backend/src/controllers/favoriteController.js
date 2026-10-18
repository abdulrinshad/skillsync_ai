import Favorite from "../models/Favorite.js";
import Course from "../models/course.js";
import CourseProgress from "../models/CourseProgress.js";
import mongoose from "mongoose";

/**
 * Get all favorited courses for a student.
 * Supports query searching, category/level filtering, and sorting.
 */
export const getFavorites = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { search, category, level, sort } = req.query;

    // Find all favorites for student first
    const favs = await Favorite.find({ studentId }).populate({
      path: "courseId",
      populate: { path: "teacherId", select: "fullName" }
    });

    let favoritedCourses = favs
      .map(f => {
        if (!f.courseId) return null;
        return {
          _id: f.courseId._id,
          title: f.courseId.title,
          description: f.courseId.description,
          thumbnail: f.courseId.thumbnail,
          category: f.courseId.category,
          level: f.courseId.level || "Beginner",
          price: f.courseId.price,
          rating: f.courseId.averageRating || f.courseId.rating || 4.5,
          duration: f.courseId.duration || "12 hours",
          studentsEnrolled: f.courseId.studentsEnrolled || 0,
          instructorName: f.courseId.teacherId?.fullName || "Verified Instructor",
          addedAt: f.addedAt,
          favoriteId: f._id,
        };
      })
      .filter(Boolean);

    // Apply Search Query filter
    if (search) {
      const searchLower = search.toLowerCase();
      favoritedCourses = favoritedCourses.filter(c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.instructorName.toLowerCase().includes(searchLower)
      );
    }

    // Apply Category filter
    if (category && category !== "all") {
      favoritedCourses = favoritedCourses.filter(c => c.category === category);
    }

    // Apply Level filter
    if (level && level !== "all") {
      favoritedCourses = favoritedCourses.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }

    // Apply Sorting Options
    if (sort === "alphabetical") {
      favoritedCourses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "rating") {
      favoritedCourses.sort((a, b) => b.rating - a.rating);
    } else if (sort === "popularity") {
      favoritedCourses.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
    } else if (sort === "oldest") {
      favoritedCourses.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    } else {
      // Default: Recently Added (Newest)
      favoritedCourses.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }

    // Append enrollment progress status to each favorited item
    const results = [];
    for (const item of favoritedCourses) {
      const prog = await CourseProgress.findOne({ studentId, courseId: item._id });
      results.push({
        ...item,
        enrolled: !!prog,
        progress: prog ? (prog.totalProgress || 0) : 0,
        completed: prog ? (prog.completed || false) : false
      });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a course to the student's wishlist.
 */
export const addFavorite = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if duplicate exists
    const duplicate = await Favorite.findOne({ studentId, courseId });
    if (duplicate) {
      return res.status(400).json({ message: "Course is already in favorites" });
    }

    const fav = await Favorite.create({ studentId, courseId });
    res.status(201).json({ message: "Course added to favorites successfully", fav });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove a course from the student's wishlist.
 */
export const deleteFavorite = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const deleted = await Favorite.findOneAndDelete({ studentId, courseId });
    if (!deleted) {
      return res.status(404).json({ message: "Course not found in favorites" });
    }

    res.status(200).json({ message: "Course removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve simple boolean status for Course Details layouts.
 */
export const getFavoriteStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const fav = await Favorite.findOne({ studentId, courseId });
    res.status(200).json({ isFavorited: !!fav });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
