import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  generateAIQuiz,
  getCourseQuizzes,
  updateAIQuiz,
  deleteAIQuiz,
  updateAIQuestion,
  deleteAIQuestion,
} from "../controllers/aiQuizController.js";

const router = express.Router();

router.post("/generate", authMiddleware, authorize("teacher"), generateAIQuiz);
router.get("/:courseId", authMiddleware, getCourseQuizzes);
router.put("/:id", authMiddleware, authorize("teacher"), updateAIQuiz);
router.delete("/:id", authMiddleware, authorize("teacher"), deleteAIQuiz);
router.put("/question/:id", authMiddleware, authorize("teacher"), updateAIQuestion);
router.delete("/question/:id", authMiddleware, authorize("teacher"), deleteAIQuestion);

export default router;
