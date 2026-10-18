import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getDownloadsHistory,
  addDownloadLog,
  deleteDownloadLog,
  clearDownloadsHistory
} from "../controllers/downloadController.js";

const router = express.Router();

// Secure download history routes under student roles
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/history", getDownloadsHistory);
router.post("/log", addDownloadLog);
router.delete("/clear", clearDownloadsHistory);
router.delete("/:id", deleteDownloadLog);

export default router;
