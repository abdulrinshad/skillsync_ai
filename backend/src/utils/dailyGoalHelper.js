import DailyGoal from "../models/DailyGoal.js";
import User from "../models/user.js";
import { checkAndUnlockBadge } from "./achievementHelper.js";
import { awardStudentXP } from "./xpHelper.js";

/**
 * Automatically update a student's daily goal progress.
 * If the goal becomes completed, reward XP and increment their active learning streak.
 * 
 * @param {string} userId - ID of the student
 * @param {string} activityType - The type of activity ('time', 'lectures', 'notes', 'quiz', 'modules')
 * @param {number} amount - The amount of progress to add (e.g. seconds/minutes of video watch time, or count of completions)
 */
export const updateDailyGoalProgress = async (userId, activityType, amount = 1) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Find or create today's daily goal. Default to 30 mins study goal if not configured.
    let goal = await DailyGoal.findOne({ userId, date: todayStr });
    if (!goal) {
      goal = new DailyGoal({
        userId,
        date: todayStr,
        goalType: "time",
        goalValue: 30, // Default 30 minutes
        progress: 0,
      });
    }

    // Accumulate progress if it matches the current goal type
    if (goal.goalType === activityType) {
      if (activityType === "time") {
        // Amount is passed in seconds from video time update. Convert to minutes.
        goal.progress = Number((goal.progress + (amount / 60)).toFixed(2));
      } else {
        goal.progress += amount;
      }

      // Check for goal completion
      if (goal.progress >= goal.goalValue && !goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date();
      }
    }

    // If goal is completed and streak hasn't been rewarded yet, award XP and increment streak
    if (goal.completed && !goal.streakUpdated) {
      await awardStudentXP(userId, goal.xpReward, "Completed Daily Study Target");
      const user = await User.findById(userId);
      if (user) {

        // Streak logic
        const today = new Date().toDateString();
        const lastActiveDate = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

        if (!lastActiveDate) {
          user.currentStreak = 1;
        } else if (today !== lastActiveDate) {
          const diff = Math.abs(new Date(today) - new Date(lastActiveDate));
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            user.currentStreak = (user.currentStreak || 0) + 1;
          } else if (diffDays > 1) {
            user.currentStreak = 1;
          }
        }
        user.lastActiveDate = new Date();
        if (user.currentStreak > (user.longestStreak || 0)) {
          user.longestStreak = user.currentStreak;
        }

        await user.save();
        goal.streakUpdated = true;

        // Gamification unlock checks
        await checkAndUnlockBadge(userId, "first_goal", true);
        await checkAndUnlockBadge(userId, "streak_3", user.currentStreak >= 3);
        await checkAndUnlockBadge(userId, "streak_7", user.currentStreak >= 7);
      }
    }

    await goal.save();
    return goal;
  } catch (err) {
    console.error("Error in updateDailyGoalProgress:", err);
  }
};
