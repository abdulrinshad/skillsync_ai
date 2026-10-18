import Course from "../models/course.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";
import CourseProgress from "../models/CourseProgress.js";
import User from "../models/user.js";
import Lecture from "../models/Lecture.js";
import Resource from "../models/Resource.js";
import AIQuiz from "../models/AIQuiz.js";
import AIQuizAttempt from "../models/AIQuizAttempt.js";

export const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get teacher courses
    const courses = await Course.find({ teacherId });
    const courseIds = courses.map((course) => course._id);

    // Get enrollments
    const enrollments = await Enrollment.find({
      courseId: { $in: courseIds },
    });

    // Get certificates
    const certificates = await Certificate.find({
      courseId: { $in: courseIds },
    });

    // Stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((course) => course.status === "published").length;
    const totalStudents = enrollments.length;
    const totalCertificates = certificates.length;

    const totalRevenue = courses.reduce(
      (total, course) => total + (course.price || 0) * (course.totalStudents || 0),
      0
    );

    const completedStudents = enrollments.filter((enrollment) => enrollment.completed).length;

    const completionRate = totalStudents > 0
      ? Number(((completedStudents / totalStudents) * 100).toFixed(2))
      : 0;

    // CourseProgress records for teacher courses
    const progresses = await CourseProgress.find({ courseId: { $in: courseIds } });

    let totalLecturesProgressSum = 0;
    let totalWatchTimeSec = 0;
    let totalQuizScoreSum = 0;
    let quizAttemptsCount = 0;
    let activeStudents = 0;
    let dropoffCount = 0;

    const now = new Date();

    progresses.forEach((progress) => {
      // Lecture ratio
      const lecRatio = progress.totalLectures > 0 ? (progress.completedLectureCount / progress.totalLectures) * 100 : 0;
      totalLecturesProgressSum += lecRatio;

      // Watch Time
      totalWatchTimeSec += (progress.completedLectureCount * 600) + (progress.currentSecond || 0);

      // Quiz Performance
      if (progress.quizCompleted) {
        totalQuizScoreSum += progress.quizScore || 0;
        quizAttemptsCount++;
      }

      // Active in last 7 days
      if (progress.lastAccessed) {
        const diffTime = Math.abs(now - new Date(progress.lastAccessed));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          activeStudents++;
        }
        if (progress.progressPercentage < 10 && diffDays > 14) {
          dropoffCount++;
        }
      }
    });

    const averageLectureCompletion = progresses.length > 0 ? Math.round(totalLecturesProgressSum / progresses.length) : 0;
    const averageWatchTimeMin = progresses.length > 0 ? Math.round((totalWatchTimeSec / progresses.length) / 60) : 0;
    const averageQuizScore = quizAttemptsCount > 0 ? Math.round(totalQuizScoreSum / quizAttemptsCount) : 0;
    const averageEngagement = progresses.length > 0 ? Math.round(progresses.reduce((acc, curr) => acc + curr.progressPercentage, 0) / progresses.length) : 0;
    const dropoffRate = progresses.length > 0 ? Math.round((dropoffCount / progresses.length) * 100) : 0;

    // XP Distribution
    const studentUserIds = enrollments.map((e) => e.studentId);
    const users = await User.find({ _id: { $in: studentUserIds } });

    const xpRanges = {
      "0-100 XP": users.filter((u) => (u.totalXP || 0) <= 100).length,
      "101-500 XP": users.filter((u) => (u.totalXP || 0) > 100 && (u.totalXP || 0) <= 500).length,
      "501-1000 XP": users.filter((u) => (u.totalXP || 0) > 500 && (u.totalXP || 0) <= 1000).length,
      "1000+ XP": users.filter((u) => (u.totalXP || 0) > 1000).length,
    };
    const xpDistribution = Object.keys(xpRanges).map((key) => ({ range: key, students: xpRanges[key] }));

    res.status(200).json({
      totalCourses,
      publishedCourses,
      totalStudents,
      totalCertificates,
      totalRevenue,
      completionRate,
      averageLectureCompletion,
      averageWatchTimeMin,
      averageQuizScore,
      averageEngagement,
      activeStudents,
      dropoffRate,
      xpDistribution,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};