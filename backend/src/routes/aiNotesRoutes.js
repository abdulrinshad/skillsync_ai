import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  generateAINotes,
  getModuleNotes,
  updateAINote,
  deleteAINote,
  togglePublishNotes,
} from "../controllers/moduleController.js";

const router = express.Router();

/**
 * Generate AI Notes for a module
 * POST /api/ai-notes/generate/:moduleId
 */
router.post(
  "/generate/:moduleId",
  authMiddleware,
  authorize("teacher", "admin"),
  generateAINotes
);

/**
 * Get AI Notes for a module
 * GET /api/ai-notes/module/:moduleId
 */
router.get(
  "/module/:moduleId",
  authMiddleware,
  getModuleNotes
);

/**
 * Update a specific AI Note
 * PUT /api/ai-notes/:noteId
 */
router.put(
  "/:noteId",
  authMiddleware,
  authorize("teacher", "admin"),
  updateAINote
);

/**
 * Delete a specific AI Note
 * DELETE /api/ai-notes/:noteId
 */
router.delete(
  "/:noteId",
  authMiddleware,
  authorize("teacher", "admin"),
  deleteAINote
);

/**
 * Publish/Unpublish AI Notes
 * PATCH /api/ai-notes/publish/:moduleId
 */
router.patch(
  "/publish/:moduleId",
  authMiddleware,
  authorize("teacher", "admin"),
  togglePublishNotes
);

export default router;