import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authMiddleware, authorize("student"), getCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:courseId", authMiddleware, authorize("student"), removeFromCart);
router.delete("/clear", authMiddleware, authorize("student"), clearCart);

export default router;
