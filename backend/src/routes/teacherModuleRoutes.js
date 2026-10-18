import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { generateModuleNotesGroq } from "../controllers/aiNotesController.js";

const router = express.Router();

router.post("/:moduleId/generate-notes", authMiddleware, authorize("teacher", "admin"), generateModuleNotesGroq);

export default router;
