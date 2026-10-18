import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getWeeklyGoal,
  updateWeeklyGoal,
  getWeeklyGoalProgress,
  getWeeklyGoalHistory
} from "../controllers/weeklyGoalController.js";

const router = express.Router();

// Secure weekly goal routes under student role
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getWeeklyGoal);
router.post("/", updateWeeklyGoal);
router.get("/progress", getWeeklyGoalProgress);
router.get("/history", getWeeklyGoalHistory);

export default router;
