import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createModule,
  getCourseModules,
  getModuleById,
  updateModule,
  deleteModule,
  createLecture,
  getModuleLectures,
  updateLecture,
  deleteLecture,
  uploadResourceFile,
  getModuleResources,
  deleteResource,
  generateAINotes,
  getModuleNotes,
  updateAINote,
  deleteAINote,
  togglePublishNotes,
  generateAIQuiz,
  getModuleQuiz,
  updateAIQuiz,
  deleteAIQuiz,
  togglePublishQuiz,
  getModuleContent,
  reorderModules,
  duplicateModule,
  submitQuizAttempt,
} from "../controllers/moduleController.js";

const router = express.Router();

// ==========================================
// MODULES
// ==========================================
router.post("/", authMiddleware, authorize("teacher", "admin"), createModule);
router.get("/course/:courseId", authMiddleware, getCourseModules);
router.put("/course/:courseId/reorder", authMiddleware, authorize("teacher", "admin"), reorderModules);
router.post("/:id/duplicate", authMiddleware, authorize("teacher", "admin"), duplicateModule);
router.get("/:moduleId/content", authMiddleware, getModuleContent);
router.get("/:id", authMiddleware, getModuleById);
router.put("/:id", authMiddleware, authorize("teacher", "admin"), updateModule);
router.delete("/:id", authMiddleware, authorize("teacher", "admin"), deleteModule);

// ==========================================
// LECTURES
// ==========================================
router.post("/:moduleId/lectures", authMiddleware, authorize("teacher", "admin"), upload.single("video"), createLecture);
router.get("/:moduleId/lectures", authMiddleware, getModuleLectures);
router.put("/lectures/:lectureId", authMiddleware, authorize("teacher", "admin"), upload.single("video"), updateLecture);
router.delete("/lectures/:lectureId", authMiddleware, authorize("teacher", "admin"), deleteLecture);

// ==========================================
// RESOURCES
// ==========================================
router.post("/:moduleId/resources", authMiddleware, authorize("teacher", "admin"), upload.single("file"), uploadResourceFile);
router.get("/:moduleId/resources", authMiddleware, getModuleResources);
router.delete("/resources/:resId", authMiddleware, authorize("teacher", "admin"), deleteResource);

// ==========================================
// AI NOTES
// ==========================================
router.post("/:moduleId/notes/generate", authMiddleware, authorize("teacher", "admin"), generateAINotes);
router.get("/:moduleId/notes", authMiddleware, getModuleNotes);
router.put("/notes/:noteId", authMiddleware, authorize("teacher", "admin"), updateAINote);
router.delete("/notes/:noteId", authMiddleware, authorize("teacher", "admin"), deleteAINote);
router.put("/:moduleId/notes/publish", authMiddleware, authorize("teacher", "admin"), togglePublishNotes);

// ==========================================
// AI QUIZ
// ==========================================
router.post("/:moduleId/quiz/generate", authMiddleware, authorize("teacher", "admin"), generateAIQuiz);
router.get("/:moduleId/quiz", authMiddleware, getModuleQuiz);
router.put("/quiz/:quizId", authMiddleware, authorize("teacher", "admin"), updateAIQuiz);
router.delete("/quiz/:quizId", authMiddleware, authorize("teacher", "admin"), deleteAIQuiz);
router.put("/:moduleId/quiz/publish", authMiddleware, authorize("teacher", "admin"), togglePublishQuiz);
router.post("/:moduleId/quiz/attempt", authMiddleware, authorize("student"), submitQuizAttempt);

export default router;
