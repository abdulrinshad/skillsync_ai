import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  register,
  login,
  getProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.get(
  "/teacher-only",
  authMiddleware,
  authorize("teacher"),
  (req, res) => {
    res.json({
      message: "Teacher Access Granted",
    });
  }
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);


export default router;