import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  generateFlashcards,
  getLectureFlashcards,
  updateProgress,
  toggleBookmark,
  toggleFavorite
} from "../controllers/flashcardController.js";

const router = express.Router();

// Secured actions under authMiddleware
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/generate", generateFlashcards);
router.get("/lecture/:lectureId", getLectureFlashcards);
router.put("/:id/progress", updateProgress);
router.post("/:id/bookmark", toggleBookmark);
router.post("/:id/favorite", toggleFavorite);

export default router;
