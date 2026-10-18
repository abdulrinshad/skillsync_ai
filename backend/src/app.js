import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";

import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import teacherAnalyticsRoutes from "./routes/teacherAnalyticsRoutes.js";
import teacherStudentRoutes from "./routes/teacherStudentRoutes.js";
import teacherEarningsRoutes from "./routes/teacherEarningsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import aiNotesRoutes from "./routes/aiNotesRoutes.js";
import aiQuizRoutes from "./routes/aiQuizRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import teacherModuleRoutes from "./routes/teacherModuleRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import dailyGoalRoutes from "./routes/dailyGoalRoutes.js";
import weeklyGoalRoutes from "./routes/weeklyGoalRoutes.js";
import recentlyViewedRoutes from "./routes/recentlyViewedRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import xpRoutes from "./routes/xpRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import mindMapRoutes from "./routes/mindMapRoutes.js";
import practiceTestRoutes from "./routes/practiceTestRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import { groqService } from "./services/groq.service.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/teacher/analytics", teacherAnalyticsRoutes);
app.use("/api/teacher/students", teacherStudentRoutes);
app.use("/api/teacher/earnings", teacherEarningsRoutes);
app.use("/api/teacher/modules", teacherModuleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai-notes", aiNotesRoutes);
app.use("/api/ai-quiz", aiQuizRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api", notificationRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/daily-goal", dailyGoalRoutes);
app.use("/api/weekly-goal", weeklyGoalRoutes);
app.use("/api/recently-viewed", recentlyViewedRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/xp", xpRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/mindmaps", mindMapRoutes);
app.use("/api/practice-tests", practiceTestRoutes);
app.use("/api/code", codeRoutes);














app.get("/api/test-groq", async (req, res) => {
  try {
    const result = await groqService.generateNotesForTopic("What is Web Development?");
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "SkillSync AI Backend Running"
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack
  });
});

export default app;