import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
  getFavoriteStatus
} from "../controllers/favoriteController.js";

const router = express.Router();

// Secure all favorite endpoints under student role
router.use(authMiddleware);
router.use(authorize("student"));

router.get("/", getFavorites);
router.post("/", addFavorite);
router.get("/status/:courseId", getFavoriteStatus);
router.delete("/:courseId", deleteFavorite);

export default router;
