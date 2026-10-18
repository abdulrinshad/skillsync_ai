import mongoose from "mongoose";

const platformSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "SkillSync AI",
    },

    supportEmail: {
      type: String,
      default: "support@skillsync.ai",
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    allowTeacherRegistration: {
      type: Boolean,
      default: true,
    },

    allowStudentRegistration: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PlatformSettings",
  platformSettingsSchema
);