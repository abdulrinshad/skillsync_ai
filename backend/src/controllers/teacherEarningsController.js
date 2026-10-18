import Course from "../models/course.js";

export const getTeacherEarnings = async (req, res) => {
  try {
    const courses = await Course.find({
      teacherId: req.user.id,
    });

    const totalRevenue = courses.reduce(
      (sum, course) =>
        sum + (course.price || 0) * (course.totalStudents || 0),
      0
    );

    const totalStudents = courses.reduce(
      (sum, course) =>
        sum + (course.totalStudents || 0),
      0
    );

    const totalEnrollments = totalStudents;

    const teacherShare = totalRevenue * 0.7;

    const pendingPayouts = teacherShare * 0.2;

    res.status(200).json({
      totalRevenue,
      teacherShare,
      platformShare: totalRevenue * 0.3,
      totalCourses: courses.length,
      totalStudents,
      totalEnrollments,
      pendingPayouts,
      monthlyRevenue: totalRevenue,
      weeklyRevenue: totalRevenue * 0.25,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};