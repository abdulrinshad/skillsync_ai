import mongoose from "mongoose";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import User from "../models/user.js";
import { updateDailyGoalProgress } from "../utils/dailyGoalHelper.js";
import { updateWeeklyGoalProgress } from "../utils/weeklyGoalHelper.js";
import { recordRecentlyViewed } from "../utils/recentlyViewedHelper.js";
import { calculateRemainingTime } from "../utils/estimatedTimeHelper.js";
import { recordTimelineEvent } from "../utils/timelineHelper.js";
import { checkAndUnlockBadge } from "../utils/achievementHelper.js";
import { awardStudentXP } from "../utils/xpHelper.js";



const getOrCreateProgress = async (studentId, courseId) => {
  let progress = await CourseProgress.findOne({ studentId, courseId });
  if (!progress) {
    progress = new CourseProgress({
      studentId,
      courseId,
      moduleProgress: [],
    });
  }

  // Populate/initialize all published modules in the course
  const ModuleModel = mongoose.model("Module");
  const modules = await ModuleModel.find({ courseId, published: true });

  let modified = false;
  modules.forEach((mod) => {
    const exists = progress.moduleProgress.some(m => m.moduleId.toString() === mod._id.toString());
    if (!exists) {
      progress.moduleProgress.push({
        moduleId: mod._id,
        completedLectures: [],
        watchedPercentage: {},
        completedResources: [],
        notesCompleted: false,
        quizCompleted: false,
        quizScore: 0,
        progressPercentage: 0,
      });
      modified = true;
    }
  });

  if (modified || progress.isNew) {
    await progress.save();
  }

  return progress;
};

export const startCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const progress = await getOrCreateProgress(studentId, courseId);
    res.status(200).json({ message: "Course started successfully", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const progress = await getOrCreateProgress(studentId, courseId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeLecture = async (req, res) => {
  try {
    const { courseId, moduleId, lectureId } = req.body;
    const studentId = req.user.id;

    const progress = await getOrCreateProgress(studentId, courseId);
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

    let xpAwarded = 0;
    if (!modProg.completedLectures.includes(lectureId)) {
      modProg.completedLectures.push(lectureId);
      xpAwarded += 10;
    }

    if (!modProg.watchedPercentage) {
      modProg.watchedPercentage = new Map();
    }
    modProg.watchedPercentage.set(lectureId.toString(), 100);

    await progress.save();
    await updateDailyGoalProgress(studentId, "lectures", 1);
    await updateWeeklyGoalProgress(studentId, "lectures", 1);

    if (xpAwarded > 0) {
      const user = await User.findById(studentId);
      if (user) {
        user.totalXP = (user.totalXP || 0) + xpAwarded;
        user.level = Math.floor(user.totalXP / 100) + 1;
        await user.save();
      }
    }

    res.status(200).json({ message: "Lecture marked complete", progress, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeLectureInModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { lectureId } = req.body;
    const studentId = req.user.id;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const courseId = lecture.courseId;
    const progress = await getOrCreateProgress(studentId, courseId);
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

    let xpAwarded = 0;
    if (!modProg.completedLectures.includes(lectureId)) {
      modProg.completedLectures.push(lectureId);
      xpAwarded += 10;
    }

    if (!modProg.watchedPercentage) {
      modProg.watchedPercentage = new Map();
    }
    modProg.watchedPercentage.set(lectureId.toString(), 100);

    await progress.save();
    await updateDailyGoalProgress(studentId, "lectures", 1);
    await updateWeeklyGoalProgress(studentId, "lectures", 1);

    if (xpAwarded > 0) {
      const user = await User.findById(studentId);
      if (user) {
        user.totalXP = (user.totalXP || 0) + xpAwarded;
        user.level = Math.floor(user.totalXP / 100) + 1;
        await user.save();
      }
    }

    res.status(200).json({ message: "Lecture marked complete", progress, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveContinueProgress = async (req, res) => {
  try {
    const { courseId, moduleId, lectureId, currentSecond, watchedPercentage } = req.body;
    const studentId = req.user.id;

    const progress = await getOrCreateProgress(studentId, courseId);
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

    modProg.currentSecond = currentSecond;
    modProg.lastLecture = lectureId;
    modProg.lastAccessed = new Date();

    if (!modProg.watchedPercentage) {
      modProg.watchedPercentage = new Map();
    }
    
    const prevPct = modProg.watchedPercentage.get(lectureId.toString()) || 0;
    const newPct = Math.max(prevPct, watchedPercentage);
    modProg.watchedPercentage.set(lectureId.toString(), newPct);

    let xpAwarded = 0;
    if (newPct >= 90 && !modProg.completedLectures.includes(lectureId)) {
      modProg.completedLectures.push(lectureId);
      xpAwarded += 10;
    }

    await progress.save();
    await updateDailyGoalProgress(studentId, "time", 10);
    await updateWeeklyGoalProgress(studentId, "time", 10);
    
    // Log recently viewed video lecture
    const lectureObj = await Lecture.findById(lectureId);
    if (lectureObj) {
      await recordRecentlyViewed(studentId, {
        courseId,
        moduleId,
        lectureId,
        contentType: "video",
        contentId: lectureId,
        title: lectureObj.title,
        watchPosition: currentSecond,
        progress: newPct
      });
    }

    if (xpAwarded > 0) {
      await updateDailyGoalProgress(studentId, "lectures", 1);
      await updateWeeklyGoalProgress(studentId, "lectures", 1);

      // Log lecture complete to student's learning timeline
      if (lectureObj) {
        await recordTimelineEvent(studentId, {
          courseId,
          moduleId,
          lectureId,
          eventType: "lecture_complete",
          title: "Lecture Completed",
          description: `Finished watching: ${lectureObj.title}`,
          xpEarned: 10
        });
        
        await checkAndUnlockBadge(studentId, "first_watch", true);
      }
    }



    if (xpAwarded > 0) {
      await awardStudentXP(studentId, xpAwarded, `Completed Video Lecture: ${lectureObj?.title || 'Video'}`);
      const user = await User.findById(studentId);
      if (user) {

        
        // Streak logic
        const today = new Date().toDateString();
        const lastActiveDate = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
        
        if (!lastActiveDate) {
          user.currentStreak = 1;
        } else if (today !== lastActiveDate) {
          const diff = Math.abs(new Date(today) - new Date(lastActiveDate));
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            user.currentStreak = (user.currentStreak || 0) + 1;
          } else if (diffDays > 1) {
            user.currentStreak = 1;
          }
        }
        user.lastActiveDate = new Date();
        if (user.currentStreak > (user.longestStreak || 0)) {
          user.longestStreak = user.currentStreak;
        }

        await user.save();
      }
    }

    res.status(200).json({ message: "Watch progress updated", progress, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContinueProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const progress = await CourseProgress.findOne({ studentId, courseId })
      .populate("moduleProgress.lastLecture");

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this course" });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentContinueProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const progress = await CourseProgress.findOne({ studentId })
      .sort({ updatedAt: -1 })
      .populate("courseId")
      .populate("moduleProgress.moduleId")
      .populate("moduleProgress.lastLecture");

    if (!progress || progress.moduleProgress.length === 0) {
      return res.status(404).json({ message: "No continue watching progress found" });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeLectureDirect = async (req, res) => {
  try {
    const { courseId, moduleId, lectureId } = req.body;
    const studentId = req.user.id;

    const progress = await getOrCreateProgress(studentId, courseId);
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

    let xpAwarded = 0;
    if (!modProg.completedLectures.includes(lectureId)) {
      modProg.completedLectures.push(lectureId);
      xpAwarded += 10;
    }

    if (!modProg.watchedPercentage) {
      modProg.watchedPercentage = new Map();
    }
    modProg.watchedPercentage.set(lectureId.toString(), 100);

    await progress.save();
    await updateDailyGoalProgress(studentId, "lectures", 1);
    await updateWeeklyGoalProgress(studentId, "lectures", 1);

    if (xpAwarded > 0) {
      const user = await User.findById(studentId);
      if (user) {
        user.totalXP = (user.totalXP || 0) + xpAwarded;
        user.level = Math.floor(user.totalXP / 100) + 1;
        await user.save();
      }
    }

    res.status(200).json({ message: "Lecture marked complete successfully", progress, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeResource = async (req, res) => {
  try {
    const { courseId, moduleId, resourceId } = req.body;
    const studentId = req.user.id;

    const progress = await getOrCreateProgress(studentId, courseId);
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

    if (!modProg.completedResources) {
      modProg.completedResources = [];
    }

    if (!modProg.completedResources.includes(resourceId)) {
      modProg.completedResources.push(resourceId);
      await progress.save();
      await updateDailyGoalProgress(studentId, "custom", 1);
      await updateWeeklyGoalProgress(studentId, "custom", 1);

      // Log recently viewed resource
      const ResourceModel = mongoose.model("Resource");
      const resObj = await ResourceModel.findById(resourceId);
      if (resObj) {
        await recordRecentlyViewed(studentId, {
          courseId,
          moduleId,
          contentType: "resource",
          contentId: resourceId,
          title: resObj.title || "Study Resource",
          progress: 100
        });

        await recordTimelineEvent(studentId, {
          courseId,
          moduleId,
          eventType: "resource_view",
          title: "Resource Viewed",
          description: `Studied resource material: ${resObj.title || "Study Material"}`
        });
      }


    }

    res.status(200).json({ message: "Resource marked complete successfully", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotesCompleted = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId } = req.body;

    // Validate inputs
    if (!studentId || !courseId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Missing studentId, courseId, or moduleId"
      });
    }

    // Find existing progress
    let progress = await CourseProgress.findOne({ studentId, courseId });
    if (!progress) {
      progress = await CourseProgress.create({
        studentId,
        courseId,
        moduleProgress: []
      });
    }

    // Find module progress
    let moduleProgress = progress.moduleProgress.find(
      m => m.moduleId.toString() === moduleId.toString()
    );

    if (!moduleProgress) {
      progress.moduleProgress.push({
        moduleId,
        lectureCompleted: false,
        resourceCompleted: false,
        notesCompleted: false,
        quizCompleted: false,
        progressPercentage: 0
      });
      moduleProgress = progress.moduleProgress[progress.moduleProgress.length - 1];
    }

    moduleProgress.notesCompleted = true;

    // Recalculate module progress
    moduleProgress.progressPercentage =
      (moduleProgress.lectureCompleted ? 40 : 0) +
      (moduleProgress.resourceCompleted ? 20 : 0) +
      (moduleProgress.notesCompleted ? 20 : 0) +
      (moduleProgress.quizCompleted ? 20 : 0);

    // Recalculate course progress
    progress.totalProgress =
      progress.moduleProgress.reduce(
        (sum, m) => sum + m.progressPercentage,
        0
      ) / progress.moduleProgress.length;

    if (progress.totalProgress === 100) {
      progress.completed = true;
      progress.certificateEligible = true;
    }

    await progress.save();
    await updateDailyGoalProgress(studentId, "notes", 1);
    await updateWeeklyGoalProgress(studentId, "notes", 1);
    
    await checkAndUnlockBadge(studentId, "notes_explorer", true);


    await recordTimelineEvent(studentId, {
      courseId,
      moduleId,
      eventType: "notes_read",
      title: "AI Notes Read",
      description: "Successfully read all AI generated notes for this module"
    });


    // Log recently viewed AI Notes
    await recordRecentlyViewed(studentId, {
      courseId,
      moduleId,
      contentType: "notes",
      contentId: moduleId,
      title: "AI Notes",
      progress: 100
    });


    // Log debugging statements as requested
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("COURSE:", courseId);
    console.log("MODULE:", moduleId);
    console.log("PROGRESS:", progress);

    return res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error("NOTES COMPLETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const progresses = await CourseProgress.find({ studentId });
    
    let totalCourses = progresses.length;
    let completedCourses = progresses.filter((p) => p.completed).length;

    // Total Study Hours
    let totalStudyTimeSec = 0;
    progresses.forEach(p => {
      p.moduleProgress.forEach(mp => {
        totalStudyTimeSec += ((mp.completedLectures ? mp.completedLectures.length : 0) * 600) + (mp.currentSecond || 0);
      });
    });
    const totalStudyHours = Number((totalStudyTimeSec / 3600).toFixed(1));

    // Daily, Weekly, Monthly Study Time (mins)
    const today = new Date();
    let dailyStudyTime = 0;
    let weeklyStudyTime = 0;
    let monthlyStudyTime = 0;

    progresses.forEach(p => {
      p.moduleProgress.forEach(mp => {
        if (mp.lastAccessed) {
          const diffTime = Math.abs(today - new Date(mp.lastAccessed));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const mins = Math.round((((mp.completedLectures ? mp.completedLectures.length : 0) * 600) + (mp.currentSecond || 0)) / 60);

          if (diffDays <= 1) dailyStudyTime += mins;
          if (diffDays <= 7) weeklyStudyTime += mins;
          if (diffDays <= 30) monthlyStudyTime += mins;
        }
      });
    });

    // Certificates Earned
    const Certificate = mongoose.model("Certificate");
    const certificatesEarned = await Certificate.countDocuments({ studentId });

    // Leaderboard Rank
    const allUsers = await User.find({}).sort({ totalXP: -1 });
    const leaderboardRank = allUsers.findIndex(u => u._id.toString() === studentId) + 1 || 1;

    // Quiz Average
    let totalQuizScoreSum = 0;
    let quizCount = 0;
    progresses.forEach(p => {
      p.moduleProgress.forEach(mp => {
        if (mp.quizCompleted) {
          totalQuizScoreSum += mp.quizScore || 0;
          quizCount++;
        }
      });
    });
    const quizAverage = quizCount > 0 ? Math.round(totalQuizScoreSum / quizCount) : 0;

    // Average Module Progress
    const averageModuleProgress = progresses.length > 0
      ? Math.round(progresses.reduce((acc, curr) => acc + (curr.totalProgress || 0), 0) / progresses.length)
      : 0;

    res.status(200).json({
      totalCourses,
      completedCourses,
      totalXP: user.totalXP || 0,
      level: user.level || 1,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      totalStudyHours,
      dailyStudyTime,
      weeklyStudyTime,
      monthlyStudyTime,
      certificatesEarned,
      leaderboardRank,
      quizAverage,
      averageModuleProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoadmapDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // 1. Fetch Course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Fetch User for Gamification
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Fetch Course Progress
    const progress = await getOrCreateProgress(studentId, courseId);

    // 4. Fetch Modules
    const modules = await Module.find({ courseId, published: true });
    
    // Sort modules based on their order in course.modules (if exists)
    const modulesMap = {};
    modules.forEach((m) => {
      modulesMap[m._id.toString()] = m;
    });
    
    let sortedModules = [];
    if (course.modules && course.modules.length > 0) {
      course.modules.forEach((mId) => {
        const found = modulesMap[mId.toString()];
        if (found) {
          sortedModules.push(found);
        }
      });
      // Fallback: Append any modules that weren't in the modules list
      modules.forEach((m) => {
        if (!sortedModules.some((sm) => sm._id.toString() === m._id.toString())) {
          sortedModules.push(m);
        }
      });
    } else {
      sortedModules = modules;
    }

    // 5. Construct roadmap items with locks, lectures, resources, AI elements
    const roadmapItems = [];
    let previousModuleCompleted = true; // First module is unlocked
    let nextLecture = null;
    let nextModule = null;
    let totalRemainingMinutes = 0;
    
    const LectureModel = mongoose.model("Lecture");
    const ResourceModel = mongoose.model("Resource");
    const AINoteModel = mongoose.model("AINote");
    const AIQuizModel = mongoose.model("AIQuiz");

    for (let i = 0; i < sortedModules.length; i++) {
      const mod = sortedModules[i];
      const modProgress = progress.moduleProgress.find(
        (mp) => mp.moduleId.toString() === mod._id.toString()
      ) || {
        completedLectures: [],
        completedResources: [],
        notesCompleted: false,
        quizCompleted: false,
        progressPercentage: 0,
      };

      // Module status logic
      let isLocked = !previousModuleCompleted;
      let status = "Not Started";

      if (isLocked) {
        status = "Locked";
      } else if (modProgress.progressPercentage === 100) {
        status = "Completed";
      } else if (modProgress.progressPercentage > 0) {
        status = "In Progress";
      }

      // Fetch Sub-items
      const lectures = await LectureModel.find({ moduleId: mod._id }).sort({ order: 1 });
      const resources = await ResourceModel.find({ moduleId: mod._id }).sort({ sortOrder: 1 });
      const notes = await AINoteModel.find({ moduleId: mod._id, published: true }).sort({ order: 1 });
      const quiz = await AIQuizModel.findOne({ moduleId: mod._id, published: true });

      // Map sub-item statuses
      const mappedLectures = lectures.map((lec) => {
        const isCompleted = modProgress.completedLectures.includes(lec._id);
        if (!isCompleted) {
          totalRemainingMinutes += 15; // standard duration estimation
          if (!nextLecture && !isLocked) {
            nextLecture = {
              _id: lec._id,
              title: lec.title,
              moduleId: mod._id,
              courseId,
            };
          }
        }
        return {
          _id: lec._id,
          title: lec.title,
          description: lec.description,
          duration: lec.duration || "15:00",
          status: isCompleted ? "Completed" : "Not Started",
          isBookmarked: false,
        };
      });

      const mappedResources = resources.map((res) => {
        const isCompleted = modProgress.completedResources?.includes(res._id);
        if (!isCompleted) {
          totalRemainingMinutes += 10;
        }
        return {
          _id: res._id,
          title: res.title,
          fileName: res.fileName,
          fileUrl: res.fileUrl,
          resourceType: res.resourceType,
          status: isCompleted ? "Completed" : "Not Started",
        };
      });

      const mappedNotes = notes.map((n) => {
        const isCompleted = modProgress.notesCompleted;
        if (!isCompleted) {
          totalRemainingMinutes += 10;
        }
        return {
          _id: n._id,
          title: n.title,
          status: isCompleted ? "Completed" : "Not Started",
        };
      });

      let quizItem = null;
      if (quiz) {
        const isCompleted = modProgress.quizCompleted;
        if (!isCompleted) {
          totalRemainingMinutes += 15;
        }
        quizItem = {
          _id: quiz._id,
          title: quiz.title || "Module Quiz",
          questionsCount: quiz.questions?.length || 5,
          status: isCompleted ? "Completed" : "Not Started",
          score: modProgress.quizScore || 0,
        };
      }

      roadmapItems.push({
        moduleId: mod._id,
        title: mod.title,
        description: mod.description,
        difficulty: mod.difficulty,
        duration: mod.duration,
        progress: modProgress.progressPercentage,
        status,
        isLocked,
        lectures: mappedLectures,
        resources: mappedResources,
        notes: mappedNotes,
        quiz: quizItem,
      });

      // Sequential unlock: next module is unlocked only if current module is 100% complete
      previousModuleCompleted = modProgress.progressPercentage === 100;
      if (!previousModuleCompleted && !nextModule && !isLocked) {
        nextModule = {
          _id: mod._id,
          title: mod.title,
        };
      }
    }

    // Smart Features
    const remainingHours = Number((totalRemainingMinutes / 60).toFixed(1));
    const completionDatePrediction = new Date();
    completionDatePrediction.setDate(completionDatePrediction.getDate() + Math.ceil(remainingHours * 2));

    // Simple Streak & Goal calculations
    const dailyGoalStatus = progress.updatedAt && new Date(progress.updatedAt).toDateString() === new Date().toDateString() ? "Completed" : "Not Started";
    const weeklyGoalProgress = Math.min(100, Math.round((progress.moduleProgress.filter(m => m.progressPercentage > 0).length / (sortedModules.length || 1)) * 100));

    res.status(200).json({
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        totalProgress: progress.totalProgress || 0,
        completed: progress.completed || false,
        certificateEligible: progress.certificateEligible || false,
      },
      stats: {
        remainingHours,
        completionDatePrediction,
        streak: user.currentStreak || user.streak || 0,
        xp: user.totalXP || user.xp || 0,
        level: user.level || 1,
        dailyGoal: {
          title: "Complete 1 lecture today",
          status: dailyGoalStatus,
        },
        weeklyGoal: {
          title: "Complete 1 module this week",
          progress: weeklyGoalProgress,
        },
      },
      nextItem: nextLecture || nextModule || null,
      roadmap: roadmapItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContinueLearningList = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch all course progresses for the student, sorted by recency
    const progresses = await CourseProgress.find({ studentId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "courseId",
        populate: { path: "teacherId", select: "fullName" }
      })
      .populate("moduleProgress.moduleId")
      .populate("moduleProgress.lastLecture");

    const continueList = [];
    const Lecture = mongoose.model("Lecture");

    for (const prog of progresses) {
      if (!prog.courseId) continue; // skip orphan progress records

      const course = prog.courseId;
      const instructorName = course.teacherId?.fullName || "Verified Instructor";

      // Find the most recently accessed module in this course
      let activeModProg = null;
      if (prog.moduleProgress && prog.moduleProgress.length > 0) {
        activeModProg = prog.moduleProgress
          .slice()
          .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))[0];
      }

      const activeModule = activeModProg?.moduleId || null;
      const activeLecture = activeModProg?.lastLecture || null;

      // Estimate remaining time: find total lectures in the course minus completed lectures
      const totalLecturesCount = await Lecture.countDocuments({ courseId: course._id });
      const completedCount = prog.moduleProgress.reduce((sum, m) => sum + (m.completedLectures ? m.completedLectures.length : 0), 0);
      const remainingLectures = Math.max(0, totalLecturesCount - completedCount);
      const estimatedTimeRemainingMins = remainingLectures * 15; // 15 mins per lecture estimate
      const timeRemainingHours = Number((estimatedTimeRemainingMins / 60).toFixed(1));

      // Calculate estimated completion date: assume 30 minutes studied per day
      const completionDatePrediction = new Date();
      completionDatePrediction.setDate(completionDatePrediction.getDate() + Math.ceil(timeRemainingHours * 2));

      continueList.push({
        courseId: course._id,
        courseTitle: course.title,
        thumbnail: course.thumbnail,
        instructorName,
        totalProgress: prog.totalProgress || 0,
        completed: prog.completed || false,
        certificateEligible: prog.certificateEligible || false,
        activeModule: activeModule ? {
          _id: activeModule._id,
          title: activeModule.title,
          progress: activeModProg?.progressPercentage || 0,
        } : null,
        activeLecture: activeLecture ? {
          _id: activeLecture._id,
          title: activeLecture.title,
          currentSecond: activeModProg?.currentSecond || 0,
        } : null,
        timeRemainingHours,
        completionDatePrediction,
        lastAccessed: prog.updatedAt,
      });
    }

    res.status(200).json(continueList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseEstimatedTime = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const remaining = await calculateRemainingTime(studentId, courseId);
    res.status(200).json(remaining);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



