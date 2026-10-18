import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getRecentlyViewedList,
  addRecentlyViewedItem,
  deleteRecentlyViewedItem,
  clearRecentlyViewedHistory,
  getRecentlyViewedStats
} from "../controllers/recentlyViewedController.js";

const router = express.Router();

// Secure recently viewed endpoints under student roles
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getRecentlyViewedList);
router.post("/", addRecentlyViewedItem);
router.delete("/clear", clearRecentlyViewedHistory);
router.delete("/:id", deleteRecentlyViewedItem);
router.get("/stats", getRecentlyViewedStats);

export default router;
