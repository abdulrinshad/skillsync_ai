import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();

// Public route to verify certificate authenticity
router.get("/verify/:certificateId", verifyCertificate);

router.post(
  "/:courseId",
  authMiddleware,
  authorize("student"),
  generateCertificate
);

router.get(
  "/my-certificates",
  authMiddleware,
  authorize("student"),
  getMyCertificates
);

export default router;