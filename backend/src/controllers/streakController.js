import User from "../models/user.js";
import DailyGoal from "../models/DailyGoal.js";
import { awardStudentXP } from "../utils/xpHelper.js";

/**
 * Fetch streak stats, freezes remaining, and a 90-day learning heatmap.
 */
export const getStreakStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user streak details
    const user = await User.findById(userId).select("currentStreak longestStreak streakFreezeCount totalXP");
    const currentStreak = user?.currentStreak || 0;
    const longestStreak = user?.longestStreak || 0;
    const streakFreezeCount = user?.streakFreezeCount || 0;
    const totalXP = user?.totalXP || 0;

    // 2. Fetch daily goals for the last 90 days to construct the heatmap
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const goals = await DailyGoal.find({
      userId,
      createdAt: { $gte: ninetyDaysAgo }
    }).sort({ date: 1 });

    // Map date strings to status
    const heatmapMap = {};
    goals.forEach((g) => {
      let status = "learned";
      if (g.completed) {
        status = "goal_completed";
      } else if (g.progress === 0) {
        status = "missed";
      }
      heatmapMap[g.date] = status;
    });

    // Generate complete 90-day array (filling in missing dates as missed)
    const heatmap = [];
    for (let i = 90; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      heatmap.push({
        date: dateStr,
        status: heatmapMap[dateStr] || "missed"
      });
    }

    res.status(200).json({
      currentStreak,
      longestStreak,
      streakFreezeCount,
      totalXP,
      heatmap
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Purchase a Streak Freeze for 200 XP.
 */
export const purchaseStreakFreeze = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    if ((user.totalXP || 0) < 200) {
      return res.status(400).json({ message: "Insufficient XP. You need at least 200 XP to buy a Streak Freeze." });
    }

    // Deduct XP and add freeze count
    user.totalXP -= 200;
    user.streakFreezeCount = (user.streakFreezeCount || 0) + 1;
    await user.save();

    res.status(200).json({
      message: "Streak Freeze purchased successfully!",
      streakFreezeCount: user.streakFreezeCount,
      totalXP: user.totalXP
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
