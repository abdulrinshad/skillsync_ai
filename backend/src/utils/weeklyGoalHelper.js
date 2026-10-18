import WeeklyGoal from "../models/WeeklyGoal.js";
import User from "../models/user.js";

/**
 * Calculates current ISO week identifier (Format: YYYY-W[WW])
 */
export const getISOWeekId = (date = new Date()) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday is 0, Sunday is 6
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${new Date(firstThursday).getFullYear()}-W${weekNum.toString().padStart(2, "0")}`;
};

/**
 * Automatically update a student's weekly goal progress and stats logs.
 * 
 * @param {string} userId - ID of the student
 * @param {string} activityType - The type of activity ('time', 'lectures', 'notes', 'quiz', 'xp')
 * @param {number} amount - The amount of progress to add
 */
export const updateWeeklyGoalProgress = async (userId, activityType, amount = 1) => {
  try {
    const weekId = getISOWeekId();
    const dayOfWeek = new Date().getDay().toString(); // 0: Sun, 1: Mon...

    // Find or create today's weekly goal
    let goal = await WeeklyGoal.findOne({ userId, weekId });
    if (!goal) {
      goal = new WeeklyGoal({
        userId,
        weekId,
        goalType: "time",
        goalValue: 180, // Default 3 hours (180 mins)
        progress: 0,
      });
    }

    // 1. Update overall statistics values on the weekly card
    if (activityType === "time") {
      const minutes = Number((amount / 60).toFixed(2));
      goal.stats.time = Number((goal.stats.time + minutes).toFixed(2));

      // Log daily breakdown for calendar checkmarks/charts
      const currentDayVal = goal.dailyActivity.get(dayOfWeek) || 0;
      goal.dailyActivity.set(dayOfWeek, Number((currentDayVal + minutes).toFixed(2)));
    } else if (activityType === "lectures") {
      goal.stats.lectures += amount;
    } else if (activityType === "notes") {
      goal.stats.notes += amount;
    } else if (activityType === "quiz") {
      goal.stats.quiz += amount;
    } else if (activityType === "xp") {
      goal.stats.xp += amount;
    }

    // 2. Accumulate progress if it matches current target configuration
    if (goal.goalType === activityType) {
      if (activityType === "time") {
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

    // 3. Award XP payout on weekly goal completion
    if (goal.completed && !goal.rewarded) {
      const user = await User.findById(userId);
      if (user) {
        user.totalXP = (user.totalXP || 0) + goal.xpReward;
        user.level = Math.floor(user.totalXP / 100) + 1;
        await user.save();
        goal.rewarded = true;
      }
    }

    await goal.save();
    return goal;
  } catch (err) {
    console.error("Error in updateWeeklyGoalProgress:", err);
  }
};
