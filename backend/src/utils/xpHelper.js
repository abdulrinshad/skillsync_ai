import XPHistory from "../models/XPHistory.js";
import User from "../models/user.js";
import { recordTimelineEvent } from "./timelineHelper.js";

/**
 * Calculates XP required to pass a given level.
 * Using a progressive scale: 100 * level * level.
 */
export const getXPForLevel = (lvl) => {
  return 100 * lvl * lvl;
};

/**
 * Resolves level number from total XP parameters.
 */
export const getLevelFromXP = (xp) => {
  let lvl = 1;
  while (xp >= getXPForLevel(lvl)) {
    lvl++;
  }
  return lvl;
};

/**
 * Resolves Level Title descriptor depending on rank value.
 */
export const getLevelTitle = (lvl) => {
  if (lvl >= 100) return "Grand Master";
  if (lvl >= 75) return "Legend";
  if (lvl >= 50) return "Master";
  if (lvl >= 40) return "Expert";
  if (lvl >= 30) return "Professional";
  if (lvl >= 20) return "Scholar";
  if (lvl >= 10) return "Learner";
  if (lvl >= 5) return "Explorer";
  return "Beginner";
};

/**
 * Main wrapper to add student XP, write logs, and promote user levels.
 */
export const awardStudentXP = async (studentId, amount, activity) => {
  try {
    if (!studentId || !amount || amount <= 0) return;

    // 1. Log XP transaction ledger
    await XPHistory.create({
      studentId,
      activity,
      xpEarned: amount,
      date: new Date()
    });

    // 2. Update User profile XP
    const user = await User.findById(studentId);
    if (user) {
      const oldLevel = user.level || 1;
      user.totalXP = (user.totalXP || 0) + amount;
      
      // Compute new level based on progressive scale
      const newLevel = getLevelFromXP(user.totalXP);
      user.level = newLevel;
      await user.save();

      // 3. Log milestone if student leveled up
      if (newLevel > oldLevel) {
        await recordTimelineEvent(studentId, {
          eventType: "goal_complete",
          title: `Leveled Up: Level ${newLevel}!`,
          description: `Congratulations! You've achieved the rank of ${getLevelTitle(newLevel)}.`,
          xpEarned: 50 // bonus XP for level up!
        });
      }
    }
  } catch (err) {
    console.error("Error in awardStudentXP helper:", err);
  }
};
