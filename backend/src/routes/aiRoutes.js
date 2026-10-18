import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  chatCurrentVideo,
  getChatHistory,
  clearChatHistory
} from "../controllers/aiController.js";

const router = express.Router();

// Secure all endpoints under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/chat/current-video", chatCurrentVideo);
router.get("/chat/history/:lectureId", getChatHistory);
router.delete("/chat/history/:lectureId", clearChatHistory);

export default router;
