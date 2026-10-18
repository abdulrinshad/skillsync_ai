import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getCourseReviews,
  submitReview,
  updateReview,
  deleteReview,
  voteHelpful,
  reportReview,
  replyToReview
} from "../controllers/reviewController.js";

const router = express.Router();

// Publicly fetch course reviews
router.get("/course/:courseId", getCourseReviews);

// Secured actions under authMiddleware
router.use(authMiddleware);

router.post("/", authorize("student"), submitReview);
router.put("/:id", authorize("student"), updateReview);
router.delete("/:id", authorize("student"), deleteReview);
router.post("/:id/helpful", voteHelpful);
router.post("/:id/report", reportReview);
router.post("/:id/reply", authorize("teacher", "admin"), replyToReview);

export default router;
