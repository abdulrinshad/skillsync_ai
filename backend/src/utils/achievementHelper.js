import StudentAchievement from "../models/StudentAchievement.js";
import User from "../models/user.js";
import { recordTimelineEvent } from "./timelineHelper.js";

/**
 * Predefined badges and unlock rules.
 */
export const BADGE_TEMPLATES = [
  {
    badgeId: "first_watch",
    title: "First Watch",
    description: "Watch your first video lecture on SkillSync AI.",
    iconName: "Play",
    category: "learning",
    xpReward: 50,
    difficulty: "bronze"
  },
  {
    badgeId: "notes_explorer",
    title: "Notes Explorer",
    description: "Read your first set of AI summary study notes.",
    iconName: "FileText",
    category: "notes",
    xpReward: 50,
    difficulty: "bronze"
  },
  {
    badgeId: "quiz_conqueror",
    title: "Quiz Conqueror",
    description: "Complete your first AI generated module quiz.",
    iconName: "HelpCircle",
    category: "quizzes",
    xpReward: 75,
    difficulty: "bronze"
  },
  {
    badgeId: "streak_3",
    title: "Three-Day Streak",
    description: "Learn for three consecutive days.",
    iconName: "Flame",
    category: "streaks",
    xpReward: 100,
    difficulty: "silver"
  },
  {
    badgeId: "streak_7",
    title: "Seven-Day Streak",
    description: "Learn for seven consecutive days. Consistency master!",
    iconName: "Flame",
    category: "streaks",
    xpReward: 250,
    difficulty: "gold"
  },
  {
    badgeId: "first_goal",
    title: "Goal Getter",
    description: "Complete your first daily learning target.",
    iconName: "Target",
    category: "goals",
    xpReward: 50,
    difficulty: "bronze"
  }
];

/**
 * Evaluates and awards a badge if criteria is met and the student hasn't earned it yet.
 */
export const checkAndUnlockBadge = async (studentId, badgeId, isEligible) => {
  try {
    if (!studentId || !badgeId || !isEligible) return;

    // 1. Check if badge is already unlocked
    const alreadyEarned = await StudentAchievement.findOne({ studentId, badgeId });
    if (alreadyEarned) return;

    // 2. Find template
    const template = BADGE_TEMPLATES.find(b => b.badgeId === badgeId);
    if (!template) return;

    // 3. Save student achievement badge log
    await StudentAchievement.create({
      studentId,
      badgeId,
      title: template.title,
      description: template.description,
      iconName: template.iconName,
      category: template.category,
      xpReward: template.xpReward,
      difficulty: template.difficulty,
      earnedAt: new Date()
    });

    // 4. Update student's XP & level on the User profile
    const user = await User.findById(studentId);
    if (user) {
      user.totalXP = (user.totalXP || 0) + template.xpReward;
      user.level = Math.floor(user.totalXP / 100) + 1;
      await user.save();
    }

    // 5. Write to completion timeline
    await recordTimelineEvent(studentId, {
      eventType: "goal_complete",
      title: `Unlocked Badge: ${template.title}`,
      description: template.description,
      xpEarned: template.xpReward
    });

  } catch (err) {
    console.error("Error in checkAndUnlockBadge helper:", err);
  }
};
