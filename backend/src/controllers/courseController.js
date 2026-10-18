import Course from "../models/course.js";
import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Resource from "../models/Resource.js";
import AINote from "../models/AINote.js";
import AIQuiz from "../models/AIQuiz.js";



export const createCourse = async (req, res) => {
  try {
    const {
  title,
  description,
  thumbnail,
  category,
  level,
  language,
  duration,
  price,
  discount,
  enrollmentLimit,
  outcomes,
  prerequisites,
  curriculum,
  status,
} = req.body;

if (!title || !description || !category) {
  return res.status(400).json({
    message: "Title, description and category are required",
  });
}

   const course = await Course.create({
  title,
  description,
  thumbnail,
  category,
  level,
  language,
  duration,
  price : price || 0,
  discount:discount || 0,
  enrollmentLimit : enrollmentLimit || 0,
  outcomes: outcomes || [],
  prerequisites: prerequisites || [],
  curriculum: curriculum || [],
  status: status || "draft",
  teacherId: req.user.id,
});

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      status: "published",
      approvalStatus: "published",
    })
      .populate(
        "teacherId",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(courses);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("teacherId", "fullName email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Students can only see published courses
    if (req.user && req.user.role === "student") {
      if (course.status !== "published" || course.approvalStatus !== "published") {
        return res.status(403).json({ message: "Course is not published" });
      }
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own courses",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own courses",
      });
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      message: "Course deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const publishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only owner can publish
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only publish your own courses",
      });
    }

    // Admin approval required
    if (course.approvalStatus !== "approved") {
      return res.status(400).json({
        message: "Course must be approved by admin before publishing",
      });
    }

    course.status = "published";

    await course.save();

    await ActivityLog.create({
      action: "COURSE_PUBLISHED",
      userId: req.user.id,
      details: `Published course ${course.title}`,
    });

    res.status(200).json({
      message: "Course published successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTeacherCourses = async (
  req,
  res
) => {
  try {
    const courses = await Course.find({
      teacherId: req.user.id,
    })
      .populate(
        "teacherId",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: courses.length,
      courses,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCoursesAdmin = async (req, res) => {
  try {
    console.log("ADMIN COURSES ROUTE HIT");

    const status = req.query.status || "";
    const query = {};

    if (status) {
      query.approvalStatus = status;
    }

    const courses = await Course.find(query)
      .populate("teacherId", "fullName email")
      .sort({ createdAt: -1 });

    console.log("COURSES FOUND:", courses.length);

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("ADMIN COURSES ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export const getCourseByIdAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacherId", "fullName email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const submitReviewCourse = async (req, res) => {
  try {
    const courseId = req.params.id || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only submit your own courses for review" });
    }

    course.approvalStatus = "pending";
    course.submittedForReview = true;
    course.submittedAt = new Date();
    await course.save();

    // Update modules, lectures, resources, etc. of the current version to pending_review
    await Promise.all([
      Module.updateMany({ courseId: course._id }, { approvalStatus: "pending_review" }),
      Lecture.updateMany({ courseId: course._id }, { approvalStatus: "pending_review" }),
      Resource.updateMany({ courseId: course._id }, { approvalStatus: "pending_review" }),
      AINote.updateMany({ courseId: course._id }, { approvalStatus: "pending_review" }),
      AIQuiz.updateMany({ courseId: course._id }, { approvalStatus: "pending_review" }),
    ]);

    // Create admin notification
    await Notification.create({
      recipientRole: "admin",
      sender: req.user.id,
      senderRole: "teacher",
      course: course._id,
      courseId: course._id,
      teacherId: req.user.id,
      type: "course_review",
      title: "New Course Submitted",
      message: "Course submitted for review",
      priority: "high",
      status: "unread",
      read: false
    });

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userRole: "teacher",
      courseId: course._id,
      action: "CURRICULUM_SUBMITTED",
      details: `Submitted course "${course.title}" (Version ${course.version}) for review`,
    });

    res.status(200).json({
      message: "Your curriculum changes have been submitted for review.",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacherId.toString() === req.user.id) {
      return res.status(400).json({ message: "Teachers cannot approve/reject their own courses" });
    }

    // Approve curriculum and publish
    course.approvalStatus = "published";
    course.status = "published";
    course.publishedVersion = course.publishedVersion + 1;
    course.approvedAt = new Date();
    course.approvedBy = req.user.id;
    course.publishedAt = new Date();
    course.publishedBy = req.user.id;
    course.submittedForReview = false;
    await course.save();

    // Mark current version modules/lectures as approved/published and visible to students
    await Promise.all([
      Module.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true }),
      Lecture.updateMany({ courseId: course._id }, { approvalStatus: "published" }),
      Resource.updateMany({ courseId: course._id }, { 
        approvalStatus: "published", 
        status: "approved",
        approvedBy: req.user.id,
        approvedAt: new Date(),
        rejectionReason: ""
      }),
      AINote.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true }),
      AIQuiz.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true }),
    ]);

    // Mark all pending review notifications for this course as read
    await Notification.updateMany(
      { course: course._id, recipientRole: "admin", status: "unread" },
      { status: "read", readAt: new Date() }
    );

    // Create teacher notification
    await Notification.create({
      recipientUser: course.teacherId,
      sender: req.user.id,
      senderRole: "admin",
      course: course._id,
      type: "COURSE_APPROVED",
      title: "Curriculum Approved",
      message: "Your curriculum has been approved.",
      priority: "medium",
      status: "unread",
    });

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userRole: "admin",
      courseId: course._id,
      action: "CURRICULUM_APPROVED",
      details: `Approved and published course "${course.title}" (Version ${course.version})`,
    });

    res.status(200).json({
      message: "Course approved and published successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectCourse = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacherId.toString() === req.user.id) {
      return res.status(400).json({ message: "Teachers cannot approve/reject their own courses" });
    }

    course.approvalStatus = "rejected";
    course.rejectedAt = new Date();
    course.rejectedReason = reason;
    await course.save();

    // Mark curriculum as rejected
    await Promise.all([
      Module.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      Lecture.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      Resource.updateMany({ courseId: course._id }, { 
        approvalStatus: "rejected", 
        status: "rejected", 
        rejectionReason: reason 
      }),
      AINote.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      AIQuiz.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
    ]);

    // Mark admin notifications read
    await Notification.updateMany(
      { course: course._id, recipientRole: "admin", status: "unread" },
      { status: "read", readAt: new Date() }
    );

    // Create teacher notification
    await Notification.create({
      recipientUser: course.teacherId,
      sender: req.user.id,
      senderRole: "admin",
      course: course._id,
      type: "COURSE_REJECTED",
      title: "Curriculum Rejected",
      message: "Your curriculum has been rejected.",
      priority: "high",
      status: "unread",
    });

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userRole: "admin",
      courseId: course._id,
      action: "CURRICULUM_REJECTED",
      rejectedReason: reason,
      details: `Rejected course "${course.title}" (Version ${course.version}). Reason: ${reason}`,
    });

    res.status(200).json({
      message: "Course rejected successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingReviews = async (req, res) => {
  try {
    const getSafeId = (val) => {
      if (!val) return "";
      if (val._id) return val._id.toString();
      return val.toString();
    };

    const courses = await Course.find({ approvalStatus: { $in: ["pending", "pending_review"] } })
      .populate("teacherId", "fullName email")
      .lean();

    const courseMap = {};
    courses.forEach(c => {
      courseMap[c._id.toString()] = c;
    });

    const allModules = await Module.find().lean();
    const moduleMap = {};
    allModules.forEach(m => {
      moduleMap[m._id.toString()] = m;
    });

    const [modules, lectures, resources, notes, quizzes] = await Promise.all([
      Module.find({ approvalStatus: "pending_review" }).lean(),
      Lecture.find({ approvalStatus: "pending_review" }).lean(),
      Resource.find({ 
        $or: [{ approvalStatus: "pending_review" }, { status: "pending" }] 
      }).lean(),
      AINote.find({ approvalStatus: "pending_review" }).lean(),
      AIQuiz.find({ approvalStatus: "pending_review" }).lean(),
    ]);

    const groups = {};

    const getOrCreateGroup = (courseId, moduleId) => {
      if (!courseId || !moduleId) return null;
      const cIdStr = getSafeId(courseId);
      const mIdStr = getSafeId(moduleId);
      const key = `${cIdStr}_${mIdStr}`;
      if (!groups[key]) {
        const course = courseMap[cIdStr];
        const moduleDoc = moduleMap[mIdStr];
        groups[key] = {
          key,
          courseId: cIdStr,
          moduleId: mIdStr,
          courseTitle: course ? course.title : "Unknown Course",
          moduleTitle: moduleDoc ? moduleDoc.title : "Unknown Module",
          teacherName: course?.teacherId?.fullName || "Unknown Teacher",
          teacherId: course?.teacherId?._id ? getSafeId(course.teacherId) : null,
          changes: [],
          stats: {
            resources: 0,
            lectures: 0,
            notes: 0,
            quizzes: 0,
            modules: 0
          }
        };
      }
      return groups[key];
    };

    modules.forEach(m => {
      const g = getOrCreateGroup(m.courseId, m._id);
      if (g) {
        g.changes.push({
          id: m._id.toString(),
          type: "module",
          title: m.title,
          description: "✓ Module Added"
        });
        g.stats.modules++;
      }
    });

    lectures.forEach(l => {
      const g = getOrCreateGroup(l.courseId, l.moduleId);
      if (g) {
        g.changes.push({
          id: l._id.toString(),
          type: "lecture",
          title: l.title,
          description: "✓ Lecture Added"
        });
        g.stats.lectures++;
      }
    });

    resources.forEach(r => {
      const g = getOrCreateGroup(r.courseId, r.moduleId);
      if (g) {
        g.changes.push({
          id: r._id.toString(),
          type: "resource",
          title: r.title || r.fileName,
          fileName: r.fileName,
          description: "✓ Resource Uploaded"
        });
        g.stats.resources++;
      }
    });

    notes.forEach(n => {
      const g = getOrCreateGroup(n.courseId, n.moduleId);
      if (g) {
        g.changes.push({
          id: n._id.toString(),
          type: "note",
          title: n.title,
          description: "✓ AI Notes Generated"
        });
        g.stats.notes++;
      }
    });

    quizzes.forEach(q => {
      const g = getOrCreateGroup(q.courseId, q.moduleId);
      if (g) {
        g.changes.push({
          id: q._id.toString(),
          type: "quiz",
          title: q.title || "AI Quiz",
          description: "✓ Quiz Generated"
        });
        g.stats.quizzes++;
      }
    });

    const groupedReviews = Object.values(groups).map(g => ({
      ...g,
      pendingCount: g.changes.length
    })).filter(g => g.pendingCount > 0);

    res.status(200).json(groupedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const courseId = req.params.id;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "itemId and itemType are required" });
    }

    switch (itemType) {
      case "module":
        await Module.findByIdAndUpdate(itemId, { approvalStatus: "published", published: true, pendingChanges: false });
        await AINote.updateMany({ moduleId: itemId }, { approvalStatus: "published", published: true });
        await AIQuiz.updateMany({ moduleId: itemId }, { approvalStatus: "published", published: true });
        break;
      case "lecture":
        await Lecture.findByIdAndUpdate(itemId, { approvalStatus: "published" });
        break;
      case "resource": {
        const resource = await Resource.findById(itemId);
        if (resource) {
          console.log("Before:", resource);
          resource.approvalStatus = "published";
          resource.status = "approved";
          resource.approvedBy = req.user.id;
          resource.approvedAt = new Date();
          resource.rejectionReason = "";
          console.log("After:", resource);
          await resource.save();
          console.log("Saved:", await Resource.findById(resource._id));
        }
        break;
      }
      case "note":
        await AINote.findByIdAndUpdate(itemId, { approvalStatus: "published", published: true });
        break;
      case "quiz":
        await AIQuiz.findByIdAndUpdate(itemId, { approvalStatus: "published", published: true });
        break;
      default:
        return res.status(400).json({ message: "Invalid itemType" });
    }

    // Check if any other items remain pending for this course
    const [pModules, pLectures, pResources, pNotes, pQuizzes] = await Promise.all([
      Module.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Lecture.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Resource.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AINote.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AIQuiz.countDocuments({ courseId, approvalStatus: "pending_review" }),
    ]);

    const totalPending = pModules + pLectures + pResources + pNotes + pQuizzes;
    if (totalPending === 0) {
      const course = await Course.findById(courseId);
      if (course) {
        course.approvalStatus = "published";
        course.status = "published";
        course.publishedVersion = (course.publishedVersion || 0) + 1;
        course.lastPublishedAt = new Date();
        course.submittedForReview = false;
        await course.save();
      }
    }

    res.status(200).json({ success: true, message: "Item approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectItem = async (req, res) => {
  try {
    const { itemId, itemType, reason } = req.body;
    const courseId = req.params.id;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "itemId and itemType are required" });
    }

    switch (itemType) {
      case "module":
        await Module.findByIdAndUpdate(itemId, { approvalStatus: "rejected", pendingChanges: true });
        break;
      case "lecture":
        await Lecture.findByIdAndUpdate(itemId, { approvalStatus: "rejected" });
        break;
      case "resource": {
        const resource = await Resource.findById(itemId);
        if (resource) {
          console.log("Before reject:", resource);
          resource.approvalStatus = "rejected";
          resource.status = "rejected";
          resource.rejectionReason = reason || "";
          console.log("After reject:", resource);
          await resource.save();
          console.log("Saved reject:", await Resource.findById(resource._id));
        }
        break;
      }
      case "note":
        await AINote.findByIdAndUpdate(itemId, { approvalStatus: "rejected" });
        break;
      case "quiz":
        await AIQuiz.findByIdAndUpdate(itemId, { approvalStatus: "rejected" });
        break;
      default:
        return res.status(400).json({ message: "Invalid itemType" });
    }

    const [pModules, pLectures, pResources, pNotes, pQuizzes] = await Promise.all([
      Module.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Lecture.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Resource.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AINote.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AIQuiz.countDocuments({ courseId, approvalStatus: "pending_review" }),
    ]);

    const totalPending = pModules + pLectures + pResources + pNotes + pQuizzes;
    if (totalPending === 0) {
      const course = await Course.findById(courseId);
      if (course) {
        course.approvalStatus = "rejected";
        course.submittedForReview = false;
        if (reason) course.rejectedReason = reason;
        await course.save();
      }
    }

    res.status(200).json({ success: true, message: "Item rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAllChanges = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.approvalStatus = "published";
    course.status = "published";
    course.publishedVersion = (course.publishedVersion || 0) + 1;
    course.approvedAt = new Date();
    course.approvedBy = req.user.id;
    course.publishedAt = new Date();
    course.publishedBy = req.user.id;
    course.submittedForReview = false;
    await course.save();

    await Promise.all([
      Module.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true, pendingChanges: false }),
      Lecture.updateMany({ courseId: course._id }, { approvalStatus: "published" }),
      Resource.updateMany({ courseId: course._id }, { 
        approvalStatus: "published",
        status: "approved",
        approvedBy: req.user.id,
        approvedAt: new Date()
      }),
      AINote.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true }),
      AIQuiz.updateMany({ courseId: course._id }, { approvalStatus: "published", published: true }),
    ]);

    res.status(200).json({ success: true, message: "All curriculum changes approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectAllChanges = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { reason } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.approvalStatus = "rejected";
    course.rejectedAt = new Date();
    if (reason) course.rejectedReason = reason;
    course.submittedForReview = false;
    await course.save();

    await Promise.all([
      Module.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      Lecture.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      Resource.updateMany({ courseId: course._id }, { 
        approvalStatus: "rejected",
        status: "rejected",
        rejectionReason: reason || ""
      }),
      AINote.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
      AIQuiz.updateMany({ courseId: course._id }, { approvalStatus: "rejected" }),
    ]);

    res.status(200).json({ success: true, message: "All curriculum changes rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewHistory = async (req, res) => {
  try {
    const logs = await AuditLog.find({ action: { $in: ["CURRICULUM_APPROVED", "CURRICULUM_REJECTED"] } })
      .populate("userId", "fullName email")
      .populate("courseId", "title")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCourseAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      message: "Course deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveSelectedItems = async (req, res) => {
  try {
    const { items } = req.body;
    const courseId = req.params.id;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "items array is required" });
    }

    for (const item of items) {
      const { id, type } = item;
      switch (type) {
        case "module":
          await Module.findByIdAndUpdate(id, { approvalStatus: "published", published: true, pendingChanges: false });
          await AINote.updateMany({ moduleId: id }, { approvalStatus: "published", published: true });
          await AIQuiz.updateMany({ moduleId: id }, { approvalStatus: "published", published: true });
          break;
        case "lecture":
          await Lecture.findByIdAndUpdate(id, { approvalStatus: "published" });
          break;
        case "resource": {
          const resource = await Resource.findById(id);
          if (resource) {
            console.log("Before selective approve:", resource);
            resource.approvalStatus = "published";
            resource.status = "approved";
            resource.approvedBy = req.user.id;
            resource.approvedAt = new Date();
            resource.rejectionReason = "";
            console.log("After selective approve:", resource);
            await resource.save();
          }
          break;
        }
        case "note":
          await AINote.findByIdAndUpdate(id, { approvalStatus: "published", published: true });
          break;
        case "quiz":
          await AIQuiz.findByIdAndUpdate(id, { approvalStatus: "published", published: true });
          break;
      }
    }

    const [pModules, pLectures, pResources, pNotes, pQuizzes] = await Promise.all([
      Module.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Lecture.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Resource.countDocuments({ courseId, status: "pending" }),
      AINote.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AIQuiz.countDocuments({ courseId, approvalStatus: "pending_review" }),
    ]);

    const totalPending = pModules + pLectures + pResources + pNotes + pQuizzes;
    if (totalPending === 0) {
      const course = await Course.findById(courseId);
      if (course) {
        course.approvalStatus = "published";
        course.status = "published";
        course.publishedVersion = (course.publishedVersion || 0) + 1;
        course.lastPublishedAt = new Date();
        course.submittedForReview = false;
        await course.save();
      }
    }

    res.status(200).json({ success: true, message: "Selected items approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectSelectedItems = async (req, res) => {
  try {
    const { items, reason } = req.body;
    const courseId = req.params.id;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "items array is required" });
    }

    for (const item of items) {
      const { id, type } = item;
      switch (type) {
        case "module":
          await Module.findByIdAndUpdate(id, { approvalStatus: "rejected", pendingChanges: true });
          break;
        case "lecture":
          await Lecture.findByIdAndUpdate(id, { approvalStatus: "rejected" });
          break;
        case "resource": {
          const resource = await Resource.findById(id);
          if (resource) {
            console.log("Before selective reject:", resource);
            resource.approvalStatus = "rejected";
            resource.status = "rejected";
            resource.rejectionReason = reason || "";
            console.log("After selective reject:", resource);
            await resource.save();
          }
          break;
        }
        case "note":
          await AINote.findByIdAndUpdate(id, { approvalStatus: "rejected" });
          break;
        case "quiz":
          await AIQuiz.findByIdAndUpdate(id, { approvalStatus: "rejected" });
          break;
      }
    }

    const [pModules, pLectures, pResources, pNotes, pQuizzes] = await Promise.all([
      Module.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Lecture.countDocuments({ courseId, approvalStatus: "pending_review" }),
      Resource.countDocuments({ courseId, status: "pending" }),
      AINote.countDocuments({ courseId, approvalStatus: "pending_review" }),
      AIQuiz.countDocuments({ courseId, approvalStatus: "pending_review" }),
    ]);

    const totalPending = pModules + pLectures + pResources + pNotes + pQuizzes;
    if (totalPending === 0) {
      const course = await Course.findById(courseId);
      if (course) {
        course.approvalStatus = "rejected";
        course.submittedForReview = false;
        if (reason) course.rejectedReason = reason;
        await course.save();
      }
    }

    res.status(200).json({ success: true, message: "Selected items rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherChangeHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ teacherId }).select("_id title").lean();
    const courseIds = courses.map(c => c._id);
    const courseNames = {};
    courses.forEach(c => {
      courseNames[c._id.toString()] = c.title;
    });

    const [modules, lectures, resources, notes, quizzes] = await Promise.all([
      Module.find({ courseId: { $in: courseIds }, approvalStatus: { $in: ["published", "rejected"] } }).lean(),
      Lecture.find({ courseId: { $in: courseIds }, approvalStatus: { $in: ["published", "rejected"] } }).lean(),
      Resource.find({ courseId: { $in: courseIds }, approvalStatus: { $in: ["published", "rejected"] } }).lean(),
      AINote.find({ courseId: { $in: courseIds }, approvalStatus: { $in: ["published", "rejected"] } }).lean(),
      AIQuiz.find({ courseId: { $in: courseIds }, approvalStatus: { $in: ["published", "rejected"] } }).lean(),
    ]);

    const history = [];
    modules.forEach(m => history.push({
      id: m._id,
      title: m.title,
      type: "Module",
      status: m.approvalStatus === "published" ? "Approved" : "Rejected",
      updatedAt: m.updatedAt || new Date(),
      courseTitle: courseNames[m.courseId?.toString()] || "Unknown Course"
    }));

    lectures.forEach(l => history.push({
      id: l._id,
      title: l.title,
      type: "Lecture",
      status: l.approvalStatus === "published" ? "Approved" : "Rejected",
      updatedAt: l.updatedAt || new Date(),
      courseTitle: courseNames[l.courseId?.toString()] || "Unknown Course"
    }));

    resources.forEach(r => history.push({
      id: r._id,
      title: r.title || r.fileName,
      type: "Resource",
      status: r.approvalStatus === "published" ? "Approved" : "Rejected",
      rejectionReason: r.rejectionReason,
      updatedAt: r.updatedAt || new Date(),
      courseTitle: courseNames[r.courseId?.toString()] || "Unknown Course"
    }));

    notes.forEach(n => history.push({
      id: n._id,
      title: n.title,
      type: "AI Notes",
      status: n.approvalStatus === "published" ? "Approved" : "Rejected",
      updatedAt: n.updatedAt || new Date(),
      courseTitle: courseNames[n.courseId?.toString()] || "Unknown Course"
    }));

    quizzes.forEach(q => history.push({
      id: q._id,
      title: q.title || "AI Quiz",
      type: "Quiz",
      status: q.approvalStatus === "published" ? "Approved" : "Rejected",
      updatedAt: q.updatedAt || new Date(),
      courseTitle: courseNames[q.courseId?.toString()] || "Unknown Course"
    }));

    history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};