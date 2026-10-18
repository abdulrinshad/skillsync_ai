// models/ActivityLog.js

import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    details: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ActivityLog",
  activityLogSchema
);