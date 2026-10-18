import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  enrollCourse,
  getMyCourses,
  updateProgress,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.post(
  "/:courseId",
  authMiddleware,
  authorize("student"),
  enrollCourse
);

router.get(
  "/my-courses",
  authMiddleware,
  authorize("student"),
  getMyCourses
);

router.patch(
  "/:courseId/progress",
  authMiddleware,
  authorize("student"),
  updateProgress
);

export default router;
