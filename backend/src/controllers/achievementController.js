import StudentAchievement from "../models/StudentAchievement.js";
import User from "../models/user.js";
import { BADGE_TEMPLATES } from "../utils/achievementHelper.js";

/**
 * Fetch student level parameters, unlocked badges list, and remaining locked goals.
 */
export const getMyBadges = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Fetch user XP and level statistics
    const user = await User.findById(studentId).select("totalXP level currentStreak");
    const totalXP = user?.totalXP || 0;
    const level = user?.level || 1;
    const currentStreak = user?.currentStreak || 0;

    // 2. Fetch earned achievements
    const earned = await StudentAchievement.find({ studentId }).sort({ earnedAt: -1 });
    const earnedBadgeIds = earned.map((b) => b.badgeId);

    // 3. Map locked badges
    const locked = BADGE_TEMPLATES.filter((b) => !earnedBadgeIds.includes(b.badgeId));

    res.status(200).json({
      totalXP,
      level,
      currentStreak,
      totalBadgesCount: BADGE_TEMPLATES.length,
      unlockedCount: earned.length,
      unlocked: earned,
      locked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
