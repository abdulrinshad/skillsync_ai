import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getReminders,
  addReminder,
  snoozeReminder,
  completeReminder,
  deleteReminder
} from "../controllers/reminderController.js";

const router = express.Router();

// Secure routes under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getReminders);
router.post("/", addReminder);
router.put("/:id/snooze", snoozeReminder);
router.put("/:id/complete", completeReminder);
router.delete("/:id", deleteReminder);

export default router;
