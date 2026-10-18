import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getXPStats, getXPHistory } from "../controllers/xpController.js";

const router = express.Router();

// Secure routes under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/stats", getXPStats);
router.get("/history", getXPHistory);

export default router;
