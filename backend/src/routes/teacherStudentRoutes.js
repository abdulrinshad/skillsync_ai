import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getTeacherStudents,
} from "../controllers/teacherStudentController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorize("teacher"),
  getTeacherStudents
);

export default router;