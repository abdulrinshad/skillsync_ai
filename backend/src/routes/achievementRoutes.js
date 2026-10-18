import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getMyBadges } from "../controllers/achievementController.js";

const router = express.Router();

// Secure routes under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/my-badges", getMyBadges);

export default router;
