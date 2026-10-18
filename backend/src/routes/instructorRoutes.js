import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  followInstructor,
  unfollowInstructor,
  getFollowingList,
  getInstructorProfile
} from "../controllers/instructorController.js";

const router = express.Router();

// Secured actions under authMiddleware
router.use(authMiddleware);

router.post("/follow/:teacherId", followInstructor);
router.delete("/unfollow/:teacherId", unfollowInstructor);
router.get("/following", getFollowingList);
router.get("/profile/:teacherId", getInstructorProfile);

export default router;
