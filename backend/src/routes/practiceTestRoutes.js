import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  generatePracticeTest,
  submitPracticeTest,
  getCoursePracticeTests
} from "../controllers/practiceTestController.js";

const router = express.Router();

// Secured actions under authMiddleware
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/generate", generatePracticeTest);
router.post("/:testId/submit", submitPracticeTest);
router.get("/course/:courseId", getCoursePracticeTests);

export default router;
