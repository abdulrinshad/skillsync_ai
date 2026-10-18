import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminController.js";
import {
  approveCourse,
  rejectCourse,
  getPendingReviews,
  getReviewHistory,
  approveItem,
  rejectItem,
  approveAllChanges,
  rejectAllChanges,
  approveSelectedItems,
  rejectSelectedItems,
} from "../controllers/courseController.js";
import { publishModuleAdmin } from "../controllers/moduleController.js";

 import {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  getAllTeachers,
  getTeacherById,
  approveTeacher,
  rejectTeacher,
  getActivityLogs,
  getReports,
  getPlatformSettings,
updatePlatformSettings,
getPlatformStats,


} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  authorize("admin"),
  getAdminAnalytics
);
router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  getUserById
);

router.patch(
  "/users/:id/block",
  authMiddleware,
  authorize("admin"),
  blockUser
);

router.patch(
  "/users/:id/unblock",
  authMiddleware,
  authorize("admin"),
  unblockUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  deleteUser
);

router.get(
  "/teachers",
  authMiddleware,
  authorize("admin"),
  getAllTeachers
);

router.get(
  "/teachers/:id",
  authMiddleware,
  authorize("admin"),
  getTeacherById
);

router.patch(
  "/teachers/:id/approve",
  authMiddleware,
  authorize("admin"),
  approveTeacher
);

router.patch(
  "/teachers/:id/reject",
  authMiddleware,
  authorize("admin"),
  rejectTeacher
);

router.get(
  "/activity-logs",
  authMiddleware,
  authorize("admin"),
  getActivityLogs
);

router.get(
  "/reports",
  authMiddleware,
  authorize("admin"),
  getReports
);



router.get(
  "/platform-settings",
  authMiddleware,
  authorize("admin"),
  getPlatformSettings
);

router.patch(
  "/platform-settings",
  authMiddleware,
  authorize("admin"),
  updatePlatformSettings
);

router.get(
  "/platform-stats",
  authMiddleware,
  authorize("admin"),
  getPlatformStats
);

// Course Approval System Routes
router.post(
  "/courses/:id/approve",
  authMiddleware,
  authorize("admin"),
  approveCourse
);

router.post(
  "/courses/:id/publish",
  authMiddleware,
  authorize("admin"),
  approveCourse
);

router.post(
  "/modules/:id/publish",
  authMiddleware,
  authorize("admin"),
  publishModuleAdmin
);

router.post(
  "/courses/:id/reject",
  authMiddleware,
  authorize("admin"),
  rejectCourse
);

router.post(
  "/courses/:id/approve-item",
  authMiddleware,
  authorize("admin"),
  approveItem
);

router.post(
  "/courses/:id/reject-item",
  authMiddleware,
  authorize("admin"),
  rejectItem
);

router.post(
  "/courses/:id/approve-all",
  authMiddleware,
  authorize("admin"),
  approveAllChanges
);

router.post(
  "/courses/:id/reject-all",
  authMiddleware,
  authorize("admin"),
  rejectAllChanges
);

router.post(
  "/courses/:id/approve-selected",
  authMiddleware,
  authorize("admin"),
  approveSelectedItems
);

router.post(
  "/courses/:id/reject-selected",
  authMiddleware,
  authorize("admin"),
  rejectSelectedItems
);

router.get(
  "/pending-reviews",
  authMiddleware,
  authorize("admin"),
  getPendingReviews
);

router.get(
  "/review-history",
  authMiddleware,
  authorize("admin"),
  getReviewHistory
);

export default router;