import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getTimelineEvents,
  getRecentTimelineEvents,
  getStudentLearningStats,
  getLastActivity
} from "../controllers/timelineController.js";

const router = express.Router();

// Secure timeline routes under student role
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getTimelineEvents);
router.get("/recent", getRecentTimelineEvents);
router.get("/stats", getStudentLearningStats);
router.get("/last-activity", getLastActivity);

export default router;
