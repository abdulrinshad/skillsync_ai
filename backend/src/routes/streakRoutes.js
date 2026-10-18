import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getStreakStats, purchaseStreakFreeze } from "../controllers/streakController.js";

const router = express.Router();

// Secure routes under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/stats", getStreakStats);
router.post("/purchase-freeze", purchaseStreakFreeze);

export default router;
