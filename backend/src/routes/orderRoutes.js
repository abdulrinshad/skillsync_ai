import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", authMiddleware, authorize("student"), createOrder);
router.get("/my-orders", authMiddleware, authorize("student"), getMyOrders);
router.get("/:id", authMiddleware, authorize("student", "admin"), getOrderById);

export default router;
