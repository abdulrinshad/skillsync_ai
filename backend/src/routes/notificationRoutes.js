import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getAdminNotifications,
  readAdminNotification,
  readAllAdminNotifications,
  getTeacherNotifications,
  readTeacherNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Admin routes
router.get(
  "/admin/notifications",
  authMiddleware,
  authorize("admin"),
  getAdminNotifications
);

router.patch(
  "/admin/notifications/:id/read",
  authMiddleware,
  authorize("admin"),
  readAdminNotification
);

router.patch(
  "/admin/notifications/read-all",
  authMiddleware,
  authorize("admin"),
  readAllAdminNotifications
);

// Teacher routes
router.get(
  "/teacher/notifications",
  authMiddleware,
  authorize("teacher"),
  getTeacherNotifications
);

router.patch(
  "/teacher/notifications/:id/read",
  authMiddleware,
  authorize("teacher"),
  readTeacherNotification
);

export default router;
