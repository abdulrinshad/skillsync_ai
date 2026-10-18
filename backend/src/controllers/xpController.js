import XPHistory from "../models/XPHistory.js";
import User from "../models/user.js";
import { getXPForLevel, getLevelTitle } from "../utils/xpHelper.js";

/**
 * Fetch student level, XP progress percentage, level titles, and brief history.
 */
export const getXPStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Fetch user parameters
    const user = await User.findById(studentId).select("totalXP level");
    const totalXP = user?.totalXP || 0;
    const level = user?.level || 1;

    // 2. XP level scale calculations
    const prevXPNeeded = level > 1 ? getXPForLevel(level - 1) : 0;
    const nextXPNeeded = getXPForLevel(level);
    const range = nextXPNeeded - prevXPNeeded;
    const currentProgressXP = totalXP - prevXPNeeded;
    const progressPct = range > 0 ? Math.min(100, Math.max(0, Number(((currentProgressXP / range) * 100).toFixed(1)))) : 0;

    // 3. Fetch recent history logs
    const history = await XPHistory.find({ studentId })
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({
      level,
      levelTitle: getLevelTitle(level),
      totalXP,
      xpToNextLevel: nextXPNeeded - totalXP,
      progressPct,
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch all XP transaction logs.
 */
export const getXPHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const logs = await XPHistory.find({ studentId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
