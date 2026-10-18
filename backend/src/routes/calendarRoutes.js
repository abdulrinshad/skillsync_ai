import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
} from "../controllers/calendarController.js";

const router = express.Router();

// Secure routes under student authentication
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getCalendarEvents);
router.post("/", addCalendarEvent);
router.put("/:id", updateCalendarEvent);
router.delete("/:id", deleteCalendarEvent);

export default router;
