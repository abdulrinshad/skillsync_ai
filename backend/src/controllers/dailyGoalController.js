import DailyGoal from "../models/DailyGoal.js";
import User from "../models/user.js";

/**
 * Get or initialize today's daily goal.
 */
export const getDailyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    let goal = await DailyGoal.findOne({ userId, date: todayStr });
    if (!goal) {
      goal = await DailyGoal.create({
        userId,
        date: todayStr,
        goalType: "time",
        goalValue: 30, // default 30 mins
        progress: 0,
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Configure / update daily goal target.
 */
export const updateDailyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goalType, goalValue } = req.body;
    const todayStr = new Date().toISOString().split("T")[0];

    let goal = await DailyGoal.findOne({ userId, date: todayStr });
    if (goal) {
      goal.goalType = goalType || goal.goalType;
      goal.goalValue = goalValue !== undefined ? goalValue : goal.goalValue;
      // Recalculate completion
      if (goal.progress >= goal.goalValue && !goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date();
      }
      await goal.save();
    } else {
      goal = await DailyGoal.create({
        userId,
        date: todayStr,
        goalType,
        goalValue,
        progress: 0,
      });
    }

    res.status(200).json({ message: "Daily goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get detailed stats and goal history logs for analytics dashboard.
 */
export const getDailyGoalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    // Fetch today's goal
    let todayGoal = await DailyGoal.findOne({ userId, date: todayStr });
    if (!todayGoal) {
      todayGoal = {
        goalType: "time",
        goalValue: 30,
        progress: 0,
        completed: false,
      };
    }

    // Fetch past 7 days goal history for chart plotting
    const last7DaysGoals = await DailyGoal.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    // Calculate goals completed count and total learning hours
    const totalGoalsConfigured = await DailyGoal.countDocuments({ userId });
    const totalGoalsCompleted = await DailyGoal.countDocuments({ userId, completed: true });
    
    // Fetch all goals to calculate total time studied
    const allGoals = await DailyGoal.find({ userId, goalType: "time" });
    const totalStudyTimeMins = allGoals.reduce((sum, g) => sum + g.progress, 0);
    const totalStudyHours = Number((totalStudyTimeMins / 60).toFixed(1));

    // Fetch user for current streaks
    const user = await User.findById(userId);

    res.status(200).json({
      today: {
        goalType: todayGoal.goalType,
        goalValue: todayGoal.goalValue,
        progress: todayGoal.progress,
        completed: todayGoal.completed,
        percentage: todayGoal.goalValue > 0 ? Math.min(100, Math.round((todayGoal.progress / todayGoal.goalValue) * 100)) : 0,
      },
      stats: {
        currentStreak: user?.currentStreak || user?.streak || 0,
        longestStreak: user?.longestStreak || 0,
        goalsCompletedCount: totalGoalsCompleted,
        totalStudyHours,
        goalCompletionRate: totalGoalsConfigured > 0 ? Math.round((totalGoalsCompleted / totalGoalsConfigured) * 100) : 100,
      },
      history: last7DaysGoals.reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user streak configurations.
 */
export const getStreakStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      currentStreak: user?.currentStreak || user?.streak || 0,
      longestStreak: user?.longestStreak || 0,
      lastActiveDate: user?.lastActiveDate || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
