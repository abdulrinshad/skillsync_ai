import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  startCourse,
  getCourseProgress,
  completeLecture,
  getDashboardStats,
  completeLectureInModule,
  saveContinueProgress,
  getContinueProgress,
  getRecentContinueProgress,
  completeLectureDirect,
  completeResource,
  markNotesCompleted,
  getRoadmapDetails,
  getContinueLearningList,
  getCourseEstimatedTime,
} from "../controllers/progressController.js";

const router = express.Router();

// All progress routes require student access
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/start/:courseId", startCourse);
router.get("/dashboard/stats", getDashboardStats);
router.post("/continue", saveContinueProgress);
router.post("/lecture-complete", completeLectureDirect);
router.post("/resource-complete", completeResource);
router.post("/notes-complete", markNotesCompleted);
router.get("/continue-recent", getRecentContinueProgress);
router.get("/continue-learning", getContinueLearningList);
router.get("/continue/:courseId", getContinueProgress);
router.get("/roadmap/:courseId", getRoadmapDetails);
router.get("/estimated-time/:courseId", getCourseEstimatedTime);
router.get("/:courseId", getCourseProgress);
router.post("/lecture/:lectureId", completeLecture);
router.post("/module/:moduleId/lecture", completeLectureInModule);

export default router;
