import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getTeacherAnalytics,
} from "../controllers/teacherAnalyticsController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorize("teacher"),
  getTeacherAnalytics
);

export default router;