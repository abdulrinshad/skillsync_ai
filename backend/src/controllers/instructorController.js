import Follow from "../models/Follow.js";
import User from "../models/user.js";
import Course from "../models/course.js";

/**
 * Follow instructor.
 */
export const followInstructor = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { teacherId } = req.params;

    if (studentId === teacherId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Instructor not found." });
    }

    // Prevent duplicate follows
    const existing = await Follow.findOne({ studentId, teacherId });
    if (existing) {
      return res.status(400).json({ message: "You are already following this instructor." });
    }

    const follow = await Follow.create({ studentId, teacherId });
    res.status(250).json({ message: "Successfully followed instructor!", follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Unfollow instructor.
 */
export const unfollowInstructor = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { teacherId } = req.params;

    const deleted = await Follow.findOneAndDelete({ studentId, teacherId });
    if (!deleted) {
      return res.status(404).json({ message: "You were not following this instructor." });
    }

    res.status(200).json({ message: "Successfully unfollowed instructor!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch followed instructors list.
 */
export const getFollowingList = async (req, res) => {
  try {
    const studentId = req.user.id;
    const following = await Follow.find({ studentId }).populate("teacherId", "name avatar specialization bio");
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch instructor profile statistics.
 */
export const getInstructorProfile = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const studentId = req.user?.id;

    // 1. Fetch instructor details
    const teacher = await User.findById(teacherId).select("name avatar specialization bio experience skills socialLinks");
    if (!teacher) {
      return res.status(404).json({ message: "Instructor not found." });
    }

    // 2. Aggregate courses published
    const courses = await Course.find({ teacherId, status: "published" });

    // 3. Sum up total student enrollments
    const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    // 4. Count followers
    const followersCount = await Follow.countDocuments({ teacherId });

    // 5. Check if following
    let isFollowing = false;
    if (studentId) {
      const follow = await Follow.findOne({ studentId, teacherId });
      isFollowing = !!follow;
    }

    res.status(200).json({
      teacher,
      courses,
      totalStudents,
      followersCount,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
