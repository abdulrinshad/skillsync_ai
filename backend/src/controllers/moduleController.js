import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Resource from "../models/Resource.js";
import AINote from "../models/AINote.js";
import AIQuiz from "../models/AIQuiz.js";
import AIQuizAttempt from "../models/AIQuizAttempt.js";
import AIQuestion from "../models/AIQuestion.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import CourseProgress from "../models/CourseProgress.js";
import { groqService } from "../services/groq.service.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import { updateDailyGoalProgress } from "../utils/dailyGoalHelper.js";
import { updateWeeklyGoalProgress } from "../utils/weeklyGoalHelper.js";
import { recordRecentlyViewed } from "../utils/recentlyViewedHelper.js";
import { recordTimelineEvent } from "../utils/timelineHelper.js";
import { checkAndUnlockBadge } from "../utils/achievementHelper.js";





// Helper check to verify ownership
const verifyOwnership = async (user, courseId) => {
  if (user.role === "admin") return true;
  const course = await Course.findById(courseId);
  if (!course) return false;
  return course.teacherId.toString() === user.id;
};

// Checks if the course is locked and updates status to draft on edits
const checkCourseLock = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  
  if (course.approvalStatus === "pending_review") {
    throw new Error("Course curriculum is locked pending review. You cannot make modifications at this time.");
  }

  if (course.approvalStatus === "published") {
    course.approvalStatus = "draft";
    await course.save();
  } else if (course.approvalStatus !== "draft") {
    course.approvalStatus = "draft";
    await course.save();
  }
  return course;
};

// Triggers admin notification and audit logging
const triggerNotificationAndLog = async ({
  userId,
  userRole,
  courseId,
  moduleId,
  lectureId,
  type,
  title,
  message,
}) => {
  await Notification.create({
    recipientRole: "admin",
    sender: userId,
    senderRole: userRole,
    course: courseId,
    module: moduleId,
    lecture: lectureId,
    type,
    title,
    message,
    status: "unread",
  });

  await AuditLog.create({
    userId,
    userRole,
    courseId,
    moduleId,
    lectureId,
    action: type,
    details: message,
  });
};

const flagPendingChanges = async (moduleId, teacherId) => {
  try {
    const moduleItem = await Module.findById(moduleId);
    if (moduleItem) {
      const course = await Course.findById(moduleItem.courseId);
      if (course) {
        course.submittedForReview = true;
        await course.save();

        await Notification.create({
          recipientRole: "admin",
          sender: teacherId,
          senderRole: "teacher",
          course: course._id,
          courseId: course._id,
          module: moduleItem._id,
          moduleId: moduleItem._id,
          teacherId: teacherId,
          type: "module_update",
          title: "Curriculum Updated",
          message: "Teacher updated course curriculum",
          priority: "medium",
          status: "unread",
          read: false,
        });
      }
    }
  } catch (err) {
    console.error("flagPendingChanges failed:", err);
  }
};

// ==========================================
// MODULES APIs
// ==========================================

export const createModule = async (req, res) => {
  try {
    const { courseId, title, description, learningOutcomes, topics, difficulty, duration } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const existing = await Module.findOne({
      courseId,
      title
    });

    if (existing) {
      return res.status(400).json({ message: "Module already exists" });
    }

    const newModule = await Module.create({
      courseId,
      teacherId: req.user.id,
      title,
      description,
      learningOutcomes: learningOutcomes || [],
      topics: topics || [],
      difficulty: difficulty || "Intermediate",
      duration: duration || "3 Hours",
      approvalStatus: "draft",
    });

    // Update Course modules reference
    await Course.findByIdAndUpdate(courseId, {
      $push: { modules: newModule._id }
    });

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId,
      moduleId: newModule._id,
      type: "MODULE_ADDED",
      title: "New Module Added",
      message: `Teacher added a new module "${title}" to course "${course.title}"`,
    });

    await flagPendingChanges(newModule._id, req.user.id);

    res.status(201).json({ message: "Module created successfully", module: newModule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const filter = { courseId };
    
    // Students only see published modules
    if (req.user.role === "student") {
      filter.approvalStatus = "published";
      filter.published = true;
    }

    const modules = await Module.find(filter).lean();

    // Dynamically calculate lectures and resources counts
    for (const mod of modules) {
      const [lecCount, resCount] = await Promise.all([
        Lecture.countDocuments({ moduleId: mod._id }),
        Resource.countDocuments({ moduleId: mod._id })
      ]);
      mod.lecturesCount = lecCount;
      mod.resourcesCount = resCount;
    }

    // Sort modules by their order in course.modules
    if (course.modules && course.modules.length > 0) {
      const orderMap = {};
      course.modules.forEach((id, idx) => {
        orderMap[id.toString()] = idx;
      });
      modules.sort((a, b) => {
        const orderA = orderMap[a._id.toString()] ?? 9999;
        const orderB = orderMap[b._id.toString()] ?? 9999;
        return orderA - orderB;
      });
    } else {
      modules.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleItem = await Module.findById(id);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });
    res.status(200).json(moduleItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleItem = await Module.findById(id);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    try {
      await checkCourseLock(moduleItem.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const updated = await Module.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: id,
      type: "MODULE_UPDATED",
      title: "Module Updated",
      message: `Teacher updated module "${updated.title}" in course "${course.title}"`,
    });

    await flagPendingChanges(id, req.user.id);

    res.status(200).json({ message: "Module updated successfully", module: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleItem = await Module.findById(id);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    try {
      await checkCourseLock(moduleItem.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    await Module.findByIdAndDelete(id);

    // Pull from Course modules reference
    await Course.findByIdAndUpdate(course._id, {
      $pull: { modules: id }
    });

    course.submittedForReview = true;
    await course.save();

    await Notification.create({
      recipientRole: "admin",
      sender: req.user.id,
      senderRole: "teacher",
      course: course._id,
      courseId: course._id,
      teacherId: req.user.id,
      type: "module_update",
      title: "Curriculum Updated",
      message: "Teacher updated course curriculum",
      priority: "medium",
      status: "unread",
      read: false,
    });

    // Clean up
    await Promise.all([
      Lecture.deleteMany({ moduleId: id }),
      Resource.deleteMany({ moduleId: id }),
      AINote.deleteMany({ moduleId: id }),
      AIQuiz.deleteMany({ moduleId: id }),
    ]);

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: id,
      type: "MODULE_DELETED",
      title: "Module Deleted",
      message: `Teacher deleted module "${moduleItem.title}" from course "${course.title}"`,
    });

    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// LECTURES APIs
// ==========================================

export const createLecture = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, description, videoUrl, duration, order } = req.body;

    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(moduleItem.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    let finalVideoUrl = videoUrl || "";
    if (req.file) {
      finalVideoUrl = `/uploads/videos/${req.file.filename}`;
    }

    const lecture = await Lecture.create({
      moduleId,
      courseId: moduleItem.courseId,
      teacherId: req.user.id,
      title,
      description: description || "",
      videoUrl: finalVideoUrl,
      duration: duration || "15:00",
      order: order || 0,
      approvalStatus: "draft",
    });

    moduleItem.lectureCount = (moduleItem.lectureCount || 0) + 1;
    await moduleItem.save();

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: moduleId,
      lectureId: lecture._id,
      type: "LECTURE_ADDED",
      title: "New Lecture Added",
      message: `Teacher added a new lecture "${title}" in module "${moduleItem.title}" of course "${course.title}"`,
    });

    await flagPendingChanges(moduleId, req.user.id);

    res.status(201).json({ message: "Lecture created successfully", lecture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleLectures = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lectures = await Lecture.find({ moduleId }).sort({ order: 1 });
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const course = await Course.findById(lecture.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, lecture.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(lecture.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    let updatedFields = { ...req.body };
    if (req.file) {
      updatedFields.videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    const updated = await Lecture.findByIdAndUpdate(lectureId, updatedFields, { new: true });

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: updated.moduleId,
      lectureId: updated._id,
      type: "LECTURE_UPDATED",
      title: "Lecture Updated",
      message: `Teacher updated lecture "${updated.title}" in course "${course.title}"`,
    });

    await flagPendingChanges(updated.moduleId, req.user.id);

    res.status(200).json({ message: "Lecture updated", lecture: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const course = await Course.findById(lecture.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, lecture.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(course);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    await Lecture.findByIdAndDelete(lectureId);

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: lecture.moduleId,
      lectureId: lectureId,
      type: "LECTURE_DELETED",
      title: "Lecture Deleted",
      message: `Teacher deleted lecture "${lecture.title}" from course "${course.title}"`,
    });

    await flagPendingChanges(lecture.moduleId, req.user.id);

    res.status(200).json({ message: "Lecture deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// RESOURCES APIs
// ==========================================

export const uploadResourceFile = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      await checkCourseLock(moduleItem.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const resource = await Resource.create({
      moduleId,
      courseId: moduleItem.courseId,
      teacherId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      fileType: req.file.originalname.split('.').pop().toUpperCase(),
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      approvalStatus: "draft",
    });

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: moduleId,
      type: "RESOURCE_UPLOADED",
      title: "Study Material Uploaded",
      message: `Teacher uploaded a resource file "${req.file.originalname}" in module "${moduleItem.title}" of course "${course.title}"`,
    });

    await flagPendingChanges(moduleId, req.user.id);

    res.status(201).json({ message: "Resource uploaded successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleResources = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const resources = await Resource.find({ moduleId });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { resId } = req.params;
    const resource = await Resource.findById(resId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const course = await Course.findById(resource.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, resource.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(resource.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const deletedResource = await Resource.findByIdAndDelete(resId);

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: resource.moduleId,
      type: "RESOURCE_DELETED",
      title: "Resource Deleted",
      message: `Teacher deleted resource "${resource.fileName}" from course "${course.title}"`,
    });

    await flagPendingChanges(resource.moduleId, req.user.id);

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// AI NOTES APIs
// ==========================================

export const generateAINotes = async (req, res) => {
  try {
    const { moduleId } = req.params;

    console.log("========== AI NOTES ==========");
    console.log("moduleId:", req.params.moduleId);
    console.log("body:", req.body);
    console.log("user:", req.user);
    console.log("==============================");

    // 1. Get module
    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) {
      console.log("Validation Failed: MODULE_NOT_FOUND");
      return res.status(400).json({ success: false, reason: "MODULE_NOT_FOUND", message: "Module not found" });
    }

    console.log("Module found:", moduleItem?.title);
    console.log("Topics:", moduleItem?.topics);

    const course = await Course.findById(moduleItem.courseId);
    if (!course) {
      console.log("Validation Failed: COURSE_NOT_FOUND");
      return res.status(400).json({ success: false, reason: "COURSE_NOT_FOUND", message: "Course not found" });
    }

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) {
      console.log("Validation Failed: UNAUTHORIZED");
      return res.status(403).json({ success: false, reason: "UNAUTHORIZED", message: "Unauthorized access" });
    }

    // 2. Extract and validate topics
    const topics = moduleItem.topics || [];
    if (topics.length === 0) {
      console.log("Validation Failed: MODULE_TOPICS_EMPTY");
      return res.status(400).json({ success: false, reason: "MODULE_TOPICS_EMPTY", message: "Module must contain topics to generate AI Notes" });
    }

    // Check if every topic has a title
    for (const topicObj of topics) {
      const topicTitle = typeof topicObj === "string" ? topicObj : topicObj?.title;
      if (!topicTitle) {
        console.log("Validation Failed: INVALID_TOPIC_STRUCTURE");
        return res.status(400).json({ success: false, reason: "INVALID_TOPIC_STRUCTURE", message: "Topic structure is invalid or missing title" });
      }
    }

    // Print starting log
    console.log("===== AI NOTES =====");
    console.log("Module:", moduleItem._id);
    console.log("Topics:", topics.length);

    console.log("STEP 1: Skipping curriculum draft state validation (Bypassed for AI Notes generation)");
    const targetModuleId = moduleId;
    console.log("STEP 1 SUCCESS: Bypassed lock.");

    const targetModuleItem = moduleItem;

    // 3. Prevent duplicate note generation by deleting existing notes first
    console.log("STEP 2: Deleting existing notes for module");
    try {
      await AINote.deleteMany({
        $or: [{ moduleId: targetModuleId }, { module: targetModuleId }]
      });
      console.log("STEP 2 SUCCESS: Existing notes deleted");
    } catch (dbErr) {
      console.error("MongoDB Delete Error:", dbErr);
      throw dbErr;
    }

    // 4. Generate notes via Groq Service
    console.log("STEP 3: Initiating Groq service call");
    const generated = await groqService.generateModuleNotesGroq(targetModuleItem.topics);
    console.log("STEP 3 SUCCESS: Groq notes generated. Count:", generated.length);

    if (!generated || generated.length === 0) {
      console.log("Validation Failed: NO_NOTES_GENERATED");
      return res.status(400).json({ success: false, reason: "NO_NOTES_GENERATED", message: "No notes were generated by Groq" });
    }

    const savedNotes = [];
    for (let i = 0; i < generated.length; i++) {
      const gen = generated[i];

      console.log("STEP 4: Saving note to MongoDB");
      // Save notes in MongoDB using both structures for 100% compatibility
      try {
        let contentString = gen.content || "";
        if (typeof contentString === "object" && contentString !== null) {
          contentString = JSON.stringify(contentString, null, 2);
        }

        const note = await AINote.create({
          module: targetModuleId,
          moduleId: targetModuleId,
          courseId: moduleItem.courseId,
          title: gen.title,
          chapterNumber: gen.chapterNumber || (i + 1),
          introduction: gen.introduction || "",
          definition: gen.definition || "",
          keyPoints: gen.keyPoints || [],
          explanation: gen.explanation || "",
          examples: gen.examples || "",
          codeExamples: gen.codeExamples || [],
          importantQuestions: gen.importantQuestions || [],
          interviewQuestions: gen.interviewQuestions || [],
          mcqs: gen.mcqs || [],
          mistakes: gen.mistakes || [],
          tips: gen.tips || [],
          cheatSheet: gen.cheatSheet || [],
          summary: gen.summary || "",
          content: gen.content || gen.explanation || "",
          order: gen.order ?? i,
          generatedBy: req.user.id,
          aiProvider: "groq",
          aiModel: gen.aiModel || "llama-3.3-70b-versatile",
          published: false,
          approvalStatus: "draft",
        });

        console.log("Saved note:", note._id);
        savedNotes.push(note);
      } catch (dbErr) {
        console.error("MongoDB Save Error inside loop:", dbErr);
        throw dbErr;
      }
    }

    targetModuleItem.notesGenerated = true;
    await targetModuleItem.save();

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: targetModuleId,
      type: "AI_NOTES_GENERATED",
      title: "AI Notes Generated",
      message: `Teacher generated AI Notes using Groq API for module "${targetModuleItem.title}" in course "${course.title}"`,
    });

    await flagPendingChanges(targetModuleId, req.user.id);

    console.log("STEP 5: Notes generated and saved. Returning response.");
    res.status(201).json({
      success: true,
      message: "AI Notes generated successfully",
      notes: savedNotes
    });
  } catch (error) {
    console.error("Error in generateAINotes:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

export const getModuleNotes = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const filter = { moduleId };

    // Students only see published notes
    if (req.user.role === "student") {
      filter.published = true;
    }

    const notes = await AINote.find(filter);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAINote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await AINote.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isOwner = await verifyOwnership(req.user, note.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    const updated = await AINote.findByIdAndUpdate(noteId, req.body, { new: true });
    await flagPendingChanges(updated.moduleId, req.user.id);
    res.status(200).json({ message: "Note updated successfully", note: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAINote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await AINote.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isOwner = await verifyOwnership(req.user, note.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    await AINote.findByIdAndDelete(noteId);
    await flagPendingChanges(note.moduleId, req.user.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePublishNotes = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { published } = req.body;

    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    await AINote.updateMany({ moduleId }, { published });
    res.status(200).json({ message: `AI Notes published status set to ${published}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// AI QUIZ APIs
// ==========================================

export const generateAIQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    if (!moduleItem.topics || moduleItem.topics.length === 0) {
      return res.status(400).json({ message: "Module must contain topics to generate AI Quiz" });
    }

    const targetModuleId = moduleId;
    const targetModuleItem = moduleItem;

    console.log("===== GENERATE QUIZ =====");
    console.log("MODULE:", moduleId);
    const topics = targetModuleItem.topics.map(t => t.title);
    console.log("TOPICS:", topics);

    const questionsList = [];
    let provider = "groq";
    let modelUsed = "";

    for (const topicObj of targetModuleItem.topics) {
      const topicTitle = topicObj.title;
      console.log("GENERATING:", topicTitle);
      try {
        const quizRes = await groqService.generateQuizForTopic(topicTitle);
        if (quizRes && Array.isArray(quizRes.questions)) {
          questionsList.push(...quizRes.questions);
          provider = quizRes.aiProvider || "groq";
          modelUsed = quizRes.aiModel || modelUsed;
        }
      } catch (err) {
        console.error(`Failed to generate quiz for topic ${topicTitle}:`, err);
      }
    }

    if (questionsList.length === 0) {
      return res.status(500).json({ success: false, message: "Groq AI generation failed" });
    }

    // Delete old AIQuiz and AIQuestions
    const oldQuizzes = await AIQuiz.find({ moduleId: targetModuleId });
    const oldQuizIds = oldQuizzes.map(q => q._id);
    await AIQuestion.deleteMany({ quizId: { $in: oldQuizIds } });
    await AIQuiz.deleteMany({ moduleId: targetModuleId });

    // Create container AIQuiz document
    const quiz = await AIQuiz.create({
      moduleId: targetModuleId,
      courseId: moduleItem.courseId,
      teacherId: req.user.id,
      topic: targetModuleItem.topics.map(t => t.title).join(", "),
      questions: questionsList,
      aiProvider: provider,
      aiModel: modelUsed,
      published: false,
      approvalStatus: "draft",
    });

    // Save individual questions to AIQuestion collection with validator mapping
    const typeMapping = {
      mcq: "mcq",
      truefalse: "tf",
      fillblank: "fill_blank",
      shortanswer: "short_answer"
    };

    const diffMapping = {
      easy: "Beginner",
      medium: "Intermediate",
      hard: "Advanced"
    };

    const questionsToSave = questionsList.map((q) => ({
      courseId: moduleItem.courseId,
      quizId: quiz._id,
      question: q.question,
      type: typeMapping[q.type] || "mcq",
      options: q.options || [],
      correctAnswer: q.correctAnswer || "",
      explanation: q.explanation || "",
      difficulty: diffMapping[q.difficulty] || "Intermediate",
      marks: q.marks || 1,
      createdBy: req.user.id,
    }));

    await AIQuestion.insertMany(questionsToSave);

    console.log("QUIZ GENERATED");
    console.log("QUESTIONS:", questionsList.length);

    targetModuleItem.quizGenerated = true;
    await targetModuleItem.save();

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: targetModuleId,
      type: "AI_QUIZ_GENERATED",
      title: "AI Quiz Generated",
      message: `Teacher generated AI Quiz using Groq API for module "${targetModuleItem.title}" in course "${course.title}"`,
    });

    await flagPendingChanges(targetModuleId, req.user.id);

    res.status(201).json({ message: "AI Quiz generated successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const filter = { moduleId };

    // Students only see published quiz
    if (req.user.role === "student") {
      filter.published = true;
    }

    const quiz = await AIQuiz.findOne(filter);
    res.status(200).json(quiz || { questions: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAIQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await AIQuiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const isOwner = await verifyOwnership(req.user, quiz.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    const updated = await AIQuiz.findByIdAndUpdate(quizId, req.body, { new: true });
    res.status(200).json({ message: "Quiz updated successfully", quiz: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAIQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await AIQuiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const isOwner = await verifyOwnership(req.user, quiz.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    await AIQuiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePublishQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { published } = req.body;

    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    await AIQuiz.updateMany({ moduleId }, { published });
    res.status(200).json({ message: `AI Quiz published status set to ${published}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleContent = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    // Fetch the first lecture for the player
    const lecture = await Lecture.findOne({ moduleId }).sort({ order: 1 });

    // Fetch resources
    const resources = await Resource.find({ moduleId });

    // Fetch notes (students only see published notes)
    const notesFilter = { moduleId };
    if (req.user.role === "student") {
      notesFilter.published = true;
    }
    const notes = await AINote.find(notesFilter);

    // Fetch quiz (students only see published quiz)
    const quizFilter = { moduleId };
    if (req.user.role === "student") {
      quizFilter.published = true;
    }
    const quiz = await AIQuiz.findOne(quizFilter);

    // Extract cheat sheet from notes' revision notes
    const cheatSheet = notes.map(n => n.revisionNotes).filter(Boolean).join("\n\n");

    res.status(200).json({
      lecture,
      resources,
      notes,
      quiz: quiz || { questions: [] },
      cheatSheet,
      learningObjectives: moduleItem.learningOutcomes || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleIds } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    course.modules = moduleIds;
    await course.save();

    res.status(200).json({ message: "Modules reordered successfully", modules: course.modules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const duplicateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const original = await Module.findById(id);
    if (!original) return res.status(404).json({ message: "Module not found" });

    const isOwner = await verifyOwnership(req.user, original.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    const duplicated = await Module.create({
      courseId: original.courseId,
      teacherId: req.user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      learningOutcomes: original.learningOutcomes || [],
      topics: original.topics || [],
      difficulty: original.difficulty,
      duration: original.duration,
    });

    await Course.findByIdAndUpdate(original.courseId, {
      $push: { modules: duplicated._id }
    });

    const lectures = await Lecture.find({ moduleId: original._id }).sort({ order: 1 });
    if (lectures.length > 0) {
      await Lecture.insertMany(
        lectures.map((lec) => ({
          moduleId: duplicated._id,
          courseId: duplicated.courseId,
          teacherId: req.user.id,
          title: lec.title,
          description: lec.description,
          videoUrl: lec.videoUrl,
          thumbnail: lec.thumbnail,
          duration: lec.duration,
          order: lec.order,
        }))
      );
    }

    const resources = await Resource.find({ moduleId: original._id });
    if (resources.length > 0) {
      await Resource.insertMany(
        resources.map((res) => ({
          moduleId: duplicated._id,
          courseId: duplicated.courseId,
          teacherId: req.user.id,
          fileName: res.fileName,
          fileUrl: res.fileUrl,
          fileType: res.fileType,
          fileSize: res.fileSize,
        }))
      );
    }

    if (original.notesGenerated) {
      const notes = await AINote.find({ moduleId: original._id });
      if (notes.length > 0) {
        await AINote.insertMany(
          notes.map((note) => ({
            moduleId: duplicated._id,
            courseId: duplicated.courseId,
            teacherId: req.user.id,
            topicTitle: note.topicTitle,
            definition: note.definition,
            explanation: note.explanation,
            examples: note.examples || [],
            realWorldExample: note.realWorldExample || "",
            keyConcepts: note.keyConcepts || [],
            summary: note.summary,
            revisionNotes: note.revisionNotes,
            interviewQuestions: note.interviewQuestions || [],
            published: false,
          }))
        );
        duplicated.notesGenerated = true;
      }
    }

    if (original.quizGenerated) {
      const quiz = await AIQuiz.findOne({ moduleId: original._id });
      if (quiz) {
        await AIQuiz.create({
          moduleId: duplicated._id,
          courseId: duplicated.courseId,
          teacherId: req.user.id,
          topic: quiz.topic || "",
          questions: quiz.questions || [],
          aiProvider: quiz.aiProvider || "groq",
          aiModel: quiz.aiModel || "",
          published: false,
        });
        duplicated.quizGenerated = true;
      }
    }

    await duplicated.save();

    res.status(201).json({ message: "Module duplicated successfully", module: duplicated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const publishModuleAdmin = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    moduleItem.published = true;
    moduleItem.pendingChanges = false;
    moduleItem.approvalStatus = "published";
    await moduleItem.save();

    await Promise.all([
      AINote.updateMany({ moduleId: moduleItem._id }, { approvalStatus: "published", published: true }),
      AIQuiz.updateMany({ moduleId: moduleItem._id }, { approvalStatus: "published", published: true }),
    ]);

    const course = await Course.findById(moduleItem.courseId);
    if (course) {
      course.publishedVersion = (course.publishedVersion || 0) + 1;
      course.lastPublishedAt = new Date();
      await course.save();
    }

    res.status(200).json({ message: "Module approved and published successfully", module: moduleItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { answers, completionTime } = req.body;
    const studentId = req.user.id;

    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const quiz = await AIQuiz.findOne({ moduleId, published: true });
    if (!quiz) return res.status(404).json({ message: "Published quiz not found for this module" });

    // Validate and score attempts
    let score = 0;
    let totalQuestions = quiz.questions.length;
    const scoredAnswers = [];

    answers.forEach((ans) => {
      const question = quiz.questions.id(ans.questionId) || quiz.questions.find(q => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = ans.selectedAnswer?.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase();
        if (isCorrect) score += question.marks || 1;
        scoredAnswers.push({
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect
        });
      }
    });

    const totalPossibleMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const percentage = totalPossibleMarks > 0 ? Math.round((score / totalPossibleMarks) * 100) : 0;
    const xpAwarded = 25; // Award 25 XP on Quiz completion

    const attempt = await AIQuizAttempt.create({
      studentId,
      quizId: quiz._id,
      moduleId,
      courseId: quiz.courseId,
      answers: scoredAnswers,
      score,
      totalQuestions,
      percentage,
      completed: true,
      xpEarned: xpAwarded,
      completionTime,
    });

    const CourseProgress = mongoose.model("CourseProgress");
    let progress = await CourseProgress.findOne({ studentId, courseId: quiz.courseId });
    let isFirstQuizComplete = false;

    if (progress) {
      let modProg = progress.moduleProgress.find(m => m.moduleId.toString() === moduleId.toString());
      if (!modProg) {
        progress.moduleProgress.push({
          moduleId,
          completedLectures: [],
          watchedPercentage: {},
          completedResources: [],
          notesCompleted: false,
          quizCompleted: false,
          quizScore: 0,
          progressPercentage: 0,
        });
        modProg = progress.moduleProgress[progress.moduleProgress.length - 1];
      }

      if (!modProg.quizCompleted) {
        modProg.quizCompleted = true;
        isFirstQuizComplete = true;
      }
      modProg.quizScore = percentage;
      await progress.save();
      await updateDailyGoalProgress(studentId, "quiz", 1);
      await updateWeeklyGoalProgress(studentId, "quiz", 1);
      
      // Log recently viewed AI Quiz
      await recordRecentlyViewed(studentId, {
        courseId: quiz.courseId,
        moduleId,
        contentType: "quiz",
        contentId: quiz._id,
        title: "Module Quiz",
        progress: percentage
      });

      // Log quiz completion to learning timeline
      await recordTimelineEvent(studentId, {
        courseId: quiz.courseId,
        moduleId,
        eventType: "quiz_complete",
        title: "AI Quiz Completed",
        description: `Passed the module quiz with score: ${percentage}%`,
        xpEarned: xpAwarded
      });

      await checkAndUnlockBadge(studentId, "quiz_conqueror", true);




    }

    // Award XP
    const user = await User.findById(studentId);
    if (user && isFirstQuizComplete) {
      user.totalXP = (user.totalXP || 0) + xpAwarded;
      user.level = Math.floor(user.totalXP / 100) + 1;
      await user.save();
    }

    res.status(201).json({
      message: "Quiz attempt submitted successfully",
      attempt,
      xpEarned: isFirstQuizComplete ? xpAwarded : 0,
      newTotalXP: user?.totalXP || 0,
      level: user?.level || 1,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

