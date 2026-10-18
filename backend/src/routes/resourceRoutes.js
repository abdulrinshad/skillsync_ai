import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  uploadResource,
  editResource,
  deleteResource,
  getModuleResources,
  reorderResources,
  trackDownload,
  getStudentModuleResources,
  getPendingResources,
  approveResource,
  rejectResource,
} from "../controllers/resourceController.js";

const router = express.Router();

// Public/Student routes (authenticated students or teachers)
router.get("/module/:moduleId", authMiddleware, getModuleResources);
router.get("/student/module/:moduleId", authMiddleware, getStudentModuleResources);
router.post("/download/:resourceId", authMiddleware, trackDownload);

// Admin review/approval routes
router.get("/admin/pending", authMiddleware, authorize("admin"), getPendingResources);
router.put("/admin/:resourceId/approve", authMiddleware, authorize("admin"), approveResource);
router.put("/admin/:resourceId/reject", authMiddleware, authorize("admin"), rejectResource);

// Teacher/Admin restricted routes
router.post(
  "/upload",
  authMiddleware,
  authorize("teacher", "admin"),
  upload.single("file"),
  uploadResource
);

router.put(
  "/:resourceId",
  authMiddleware,
  authorize("teacher", "admin"),
  editResource
);

router.delete(
  "/:resourceId",
  authMiddleware,
  authorize("teacher", "admin"),
  deleteResource
);

router.post(
  "/reorder",
  authMiddleware,
  authorize("teacher", "admin"),
  reorderResources
);

export default router;
