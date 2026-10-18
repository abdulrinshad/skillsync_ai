import WeeklyGoal from "../models/WeeklyGoal.js";
import User from "../models/user.js";
import { getISOWeekId } from "../utils/weeklyGoalHelper.js";

/**
 * Get or initialize current week's goal.
 */
export const getWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekId = getISOWeekId();

    let goal = await WeeklyGoal.findOne({ userId, weekId });
    if (!goal) {
      goal = await WeeklyGoal.create({
        userId,
        weekId,
        goalType: "time",
        goalValue: 180, // Default 3 hours
        progress: 0,
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Configure / update weekly target settings.
 */
export const updateWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goalType, goalValue } = req.body;
    const weekId = getISOWeekId();

    let goal = await WeeklyGoal.findOne({ userId, weekId });
    if (goal) {
      goal.goalType = goalType || goal.goalType;
      goal.goalValue = goalValue !== undefined ? goalValue : goal.goalValue;
      if (goal.progress >= goal.goalValue && !goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date();
      }
      await goal.save();
    } else {
      goal = await WeeklyGoal.create({
        userId,
        weekId,
        goalType,
        goalValue,
        progress: 0,
      });
    }

    res.status(200).json({ message: "Weekly learning goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get weekly analytics, calendar indicator checkmarks, and stats.
 */
export const getWeeklyGoalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekId = getISOWeekId();

    let todayGoal = await WeeklyGoal.findOne({ userId, weekId });
    if (!todayGoal) {
      todayGoal = {
        goalType: "time",
        goalValue: 180,
        progress: 0,
        completed: false,
        dailyActivity: new Map([
          ["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0], ["6", 0]
        ]),
        stats: { time: 0, lectures: 0, notes: 0, quiz: 0, xp: 0 }
      };
    }

    // Convert dailyActivity map to flat array starting from Monday (1) to Sunday (0)
    const weekdaysActivity = [
      { day: "Mon", value: todayGoal.dailyActivity.get("1") || 0, completed: (todayGoal.dailyActivity.get("1") || 0) > 0 },
      { day: "Tue", value: todayGoal.dailyActivity.get("2") || 0, completed: (todayGoal.dailyActivity.get("2") || 0) > 0 },
      { day: "Wed", value: todayGoal.dailyActivity.get("3") || 0, completed: (todayGoal.dailyActivity.get("3") || 0) > 0 },
      { day: "Thu", value: todayGoal.dailyActivity.get("4") || 0, completed: (todayGoal.dailyActivity.get("4") || 0) > 0 },
      { day: "Fri", value: todayGoal.dailyActivity.get("5") || 0, completed: (todayGoal.dailyActivity.get("5") || 0) > 0 },
      { day: "Sat", value: todayGoal.dailyActivity.get("6") || 0, completed: (todayGoal.dailyActivity.get("6") || 0) > 0 },
      { day: "Sun", value: todayGoal.dailyActivity.get("0") || 0, completed: (todayGoal.dailyActivity.get("0") || 0) > 0 },
    ];

    // Compute achievements stats
    const user = await User.findById(userId);

    res.status(200).json({
      today: {
        goalType: todayGoal.goalType,
        goalValue: todayGoal.goalValue,
        progress: todayGoal.progress,
        completed: todayGoal.completed,
        percentage: todayGoal.goalValue > 0 ? Math.min(100, Math.round((todayGoal.progress / todayGoal.goalValue) * 100)) : 0,
      },
      calendar: weekdaysActivity,
      stats: {
        learningHours: Number((todayGoal.stats.time / 60).toFixed(1)),
        lecturesFinished: todayGoal.stats.lectures || 0,
        notesFinished: todayGoal.stats.notes || 0,
        quizzesFinished: todayGoal.stats.quiz || 0,
        xpEarned: todayGoal.stats.xp || 0,
        currentStreak: user?.currentStreak || user?.streak || 0,
        longestStreak: user?.longestStreak || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve weekly goal history logs for success rates and achievements.
 */
export const getWeeklyGoalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await WeeklyGoal.find({ userId })
      .sort({ weekId: -1 })
      .limit(10);

    const totalGoals = history.length;
    const completedGoals = history.filter(h => h.completed).length;
    const successRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 100;

    res.status(200).json({
      successRate,
      totalGoals,
      completedGoals,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
