import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getTeacherEarnings,
} from "../controllers/teacherEarningsController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorize("teacher"),
  getTeacherEarnings
);

export default router;