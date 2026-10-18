import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  generateMindMap,
  getLectureMindMap,
  toggleNodeComplete
} from "../controllers/mindMapController.js";

const router = express.Router();

// Secured actions under authMiddleware
router.use(authMiddleware);
router.use(authorize("student"));

router.post("/generate", generateMindMap);
router.get("/lecture/:lectureId", getLectureMindMap);
router.put("/:mapId/node/:nodeId/complete", toggleNodeComplete);

export default router;
