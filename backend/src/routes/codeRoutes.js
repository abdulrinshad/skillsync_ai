import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  runCode,
  submitCode,
  aiReviewCode
} from "../controllers/codeController.js";

const router = express.Router();

// Secured actions under authMiddleware
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/run", runCode);
router.post("/submit", submitCode);
router.post("/ai-review", aiReviewCode);

export default router;
