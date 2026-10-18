import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getDailyGoal,
  updateDailyGoal,
  getDailyGoalProgress,
  getStreakStats
} from "../controllers/dailyGoalController.js";

const router = express.Router();

// Secure daily goal routes under student role
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getDailyGoal);
router.post("/", updateDailyGoal);
router.get("/progress", getDailyGoalProgress);
router.get("/streak", getStreakStats);

export default router;
