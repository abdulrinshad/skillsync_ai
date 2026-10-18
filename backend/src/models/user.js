import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    isBlocked: {
  type: Boolean,
  default: false,
},

    avatar: {
      type: String,
      default: "",
    },

    totalXP: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    xp: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    teacherStatus: {
  type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    },

  teacherVerifiedAt: {
    type: Date,
    },

  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;