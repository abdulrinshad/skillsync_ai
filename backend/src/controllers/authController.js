import OTP from "../models/OTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    console.log("REGISTER OTP:", otp);

    await sendEmail(
      email,
      "SkillSync AI OTP Verification",
      `
  <div style="font-family: Arial, sans-serif">
    <h2>SkillSync AI</h2>
    <p>Your verification code is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 5 minutes.</p>
  </div>
  `
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    console.log("sendOTP called");

    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    console.log("About to call sendEmail");

    await sendEmail(
      email,
      "SkillSync AI OTP Verification",
      `
      <div>
        <h1>${otp}</h1>
      </div>
      `
    );

    console.log("sendEmail completed");

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await User.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      }
    );

    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    user: req.user,
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    console.log("RESET OTP:", otp);

    await sendEmail(
      email,
      "SkillSync AI Password Reset",
      `
      <div style="font-family: Arial, sans-serif">
        <h2>Password Reset Request</h2>
        <p>Your reset code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
      `
    );

    res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword
    } = req.body;

    const otpDoc = await OTP.findOne({
      email,
    });

    if (!otpDoc) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (
      otpDoc.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

