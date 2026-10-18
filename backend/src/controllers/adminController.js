import User from "../models/User.js";
import Course from "../models/course.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";
import ActivityLog from "../models/ActivityLog.js";
import PlatformSettings from "../models/PlatformSettings.js";

export const createActivityLog = async (
  action,
  userId,
  details
) => {
  try {
    await ActivityLog.create({
      action,
      userId,
      details,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalTeachers = await User.countDocuments({
      role: "teacher",
    });

    const totalCourses = await Course.countDocuments();

    const publishedCourses = await Course.countDocuments({
      status: "published",
    });

    const totalEnrollments = await Enrollment.countDocuments();

    const totalCertificates = await Certificate.countDocuments();

    const courses = await Course.find();

    const totalRevenue = courses.reduce(
      (sum, course) =>
        sum + (course.price || 0) * (course.totalStudents || 0),
      0
    );

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalCertificates,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const role = req.query.role || "";

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      message: "User blocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin accounts cannot be deleted",
      });
    }

    await user.deleteOne();

      await createActivityLog(
      "USER_DELETED",
      req.user.id,
      `Deleted user ${user.fullName}`
    );

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";

    const query = {
      role: "teacher",
    };

    if (status) {
      query.teacherStatus = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    teacher.teacherStatus = "approved";
    teacher.isVerified = true;
    teacher.teacherVerifiedAt = new Date();

    await teacher.save();

    await createActivityLog(
  "TEACHER_APPROVED",
  req.user.id,
  `Approved teacher ${teacher.fullName}`
);

    const safeTeacher = await User.findById(teacher._id)
      .select("-password");

    res.status(200).json({
      message: "Teacher approved successfully",
      teacher: safeTeacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    teacher.teacherStatus = "rejected";
    teacher.isVerified = false;

    await teacher.save();
    await createActivityLog(
  "TEACHER_REJECTED",
  req.user.id,
  `Rejected teacher ${teacher.fullName}`
);
    
    const safeTeacher = await User.findById(teacher._id)
      .select("-password");

    res.status(200).json({
      message: "Teacher rejected successfully",
      teacher: safeTeacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      logs,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalTeachers = await User.countDocuments({
      role: "teacher",
    });

    const totalCourses = await Course.countDocuments();

    const publishedCourses = await Course.countDocuments({
      status: "published",
    });

    const pendingCourses = await Course.countDocuments({
      approvalStatus: "pending",
    });

    const courses = await Course.find();

    const revenue = courses.reduce(
      (sum, course) =>
        sum +
        (course.price || 0) *
          (course.totalStudents || 0),
      0
    );

    res.status(200).json({
      users: {
        students: totalStudents,
        teachers: totalTeachers,
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        pending: pendingCourses,
      },
      revenue,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPlatformSettings = async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();

    if (!settings) {
      settings = await PlatformSettings.create({});
    }

    res.status(200).json(settings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePlatformSettings = async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();

    if (!settings) {
      settings = await PlatformSettings.create({});
    }

    Object.assign(settings, req.body);

    await settings.save();

    res.status(200).json({
      message: "Platform settings updated successfully",
      settings,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const users = await User.countDocuments();

    const courses = await Course.countDocuments();

    const enrollments =
      await Enrollment.countDocuments();

    const certificates =
      await Certificate.countDocuments();

    const allCourses = await Course.find();

    const revenue = allCourses.reduce(
      (sum, course) =>
        sum +
        (course.price || 0) *
          (course.totalStudents || 0),
      0
    );

    res.status(200).json({
      users,
      courses,
      enrollments,
      certificates,
      revenue,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};