import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import CourseProgress from "../models/CourseProgress.js";

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check course is approved and published
    if (course.status !== "published" || course.approvalStatus !== "approved") {
      return res.status(400).json({
        message: "This course is not available for enrollment",
      });
    }

    // Check already enrolled
    const existingEnrollment =
      await Enrollment.findOne({
        studentId: req.user.id,
        courseId,
      });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
    });

    // Increase course student count
    course.totalStudents += 1;
    await course.save();

    res.status(201).json({
      message: "Enrollment successful",
      enrollment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user.id,
    }).populate({
      path: "courseId",
      populate: {
        path: "teacherId",
        select: "fullName email",
      },
    });

    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await CourseProgress.findOne({
          studentId: req.user.id,
          courseId: enrollment.courseId._id,
        });
        
        return {
          ...enrollment.toObject(),
          progressDetails: progress || {
            progressPercentage: enrollment.progress || 0,
            completedLectures: [],
            completedModules: [],
          },
        };
      })
    );

    res.status(200).json(enrollmentsWithProgress);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    enrollment.progress = progress;

    if (progress >= 100) {
      enrollment.completed = true;
    }

    await enrollment.save();

    res.status(200).json({
      message: "Progress updated",
      enrollment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};