import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
createCourse,
getAllCourses,
getCourseById,
updateCourse,
deleteCourse,
publishCourse,
getTeacherCourses,
getAllCoursesAdmin,
getCourseByIdAdmin,
approveCourse,
rejectCourse,
deleteCourseAdmin,
submitReviewCourse,
getTeacherChangeHistory,
} from "../controllers/courseController.js";

const router = express.Router();

//
// PUBLIC ROUTES
//

router.get("/", getAllCourses);
router.get("/published", getAllCourses);

//
// TEACHER ROUTES
//

router.post(
  "/submit",
  authMiddleware,
  authorize("teacher"),
  submitReviewCourse
);

router.post(
"/",
authMiddleware,
authorize("teacher"),
createCourse
);

router.post(
"/:id/submit-review",
authMiddleware,
authorize("teacher"),
submitReviewCourse
);

router.get(
"/teacher/my-courses",
authMiddleware,
authorize("teacher"),
getTeacherCourses
);

router.get(
  "/teacher/curriculum/history",
  authMiddleware,
  authorize("teacher"),
  getTeacherChangeHistory
);

router.patch(
"/:id/publish",
authMiddleware,
authorize("teacher"),
publishCourse
);

router.put(
"/:id",
authMiddleware,
authorize("teacher"),
updateCourse
);

router.delete(
"/:id",
authMiddleware,
authorize("teacher"),
deleteCourse
);

//
// ADMIN ROUTES
// IMPORTANT: MUST COME BEFORE "/:id"
//

router.get(
"/admin",
authMiddleware,
authorize("admin"),
getAllCoursesAdmin
);

router.get(
"/admin/:id",
authMiddleware,
authorize("admin"),
getCourseByIdAdmin
);

router.patch(
"/admin/:id/approve",
authMiddleware,
authorize("admin"),
approveCourse
);

router.patch(
"/admin/:id/reject",
authMiddleware,
authorize("admin"),
rejectCourse
);

router.delete(
"/admin/:id",
authMiddleware,
authorize("admin"),
deleteCourseAdmin
);

//
// SINGLE COURSE ROUTE
// MUST BE LAST
//

router.get("/:id", getCourseById);

export default router;
