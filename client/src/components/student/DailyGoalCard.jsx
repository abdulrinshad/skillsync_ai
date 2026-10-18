import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Target,
  Edit2,
  Clock,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Settings,
  ChevronDown
} from "lucide-react";
import confetti from "canvas-confetti";

const DailyGoalCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [goalType, setGoalType] = useState("time");
  const [goalValue, setGoalValue] = useState(30);

  const fetchGoalProgress = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/daily-goal/progress", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setGoalType(res.data.today.goalType);
      setGoalValue(res.data.today.goalValue);

      // Trigger confetti celebration on completion
      if (res.data.today.completed && !localStorage.getItem(`daily_goal_celebrated_${res.data.today.goalType}_${res.data.today.goalValue}`)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        localStorage.setItem(`daily_goal_celebrated_${res.data.today.goalType}_${res.data.today.goalValue}`, "true");
        toast.success("🎉 Congratulations! Today's Daily Goal Completed!");
      }
    } catch (err) {
      console.error("Failed to load daily goal progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalProgress();
  }, []);

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/daily-goal", {
        goalType,
        goalValue: Number(goalValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Daily learning goal updated!");
      setIsEditing(false);
      fetchGoalProgress();
    } catch (err) {
      toast.error("Failed to update daily goal configuration.");
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[2.5rem] border-white/5 animate-pulse flex flex-col items-center justify-center h-72">
        <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4" />
        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Calculating Target...</span>
      </div>
    );
  }

  if (!data) return null;

  const { today, stats } = data;
  const remaining = Math.max(0, today.goalValue - today.progress);

  // Human readable description
  const getGoalLabel = (type, val) => {
    switch (type) {
      case "time": return `${val} mins study`;
      case "lectures": return `${val} lectures`;
      case "notes": return `${val} AI notes read`;
      case "quiz": return `${val} quiz completions`;
      case "custom": return `${val} resources studied`;
      default: return `${val} items`;
    }
  };

  const getProgressDetails = () => {
    if (today.goalType === "time") {
      return `${Math.round(today.progress)} / ${today.goalValue} minutes`;
    }
    return `${today.progress} / ${today.goalValue} completed`;
  };

  return (
    <div className="glass-card p-6 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
      {/* Background radial glow */}
      <div className="absolute top-[-30%] right-[-30%] w-44 h-44 bg-purple-500/10 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={16} className="text-purple-400" /> Daily Target
          </h3>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
          >
            {isEditing ? <ChevronDown size={14} /> : <Settings size={14} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleUpdateGoal}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => {
                    setGoalType(e.target.value);
                    setGoalValue(e.target.value === "time" ? 30 : 1);
                  }}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="time">Study Time</option>
                  <option value="lectures">Watch Lectures</option>
                  <option value="notes">Read AI Notes</option>
                  <option value="quiz">Complete Quizzes</option>
                  <option value="custom">Supplementary Materials</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Daily Target Value</label>
                {goalType === "time" ? (
                  <select
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none"
                  />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="progress-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Circular Progress Ring */}
              <div className="w-28 h-28 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="56" cy="56" r="48" stroke="url(#goalGradient)" strokeWidth="6" fill="transparent"
                    strokeDasharray={301}
                    initial={{ strokeDashoffset: 301 }}
                    animate={{ strokeDashoffset: 301 - (301 * today.percentage) / 100 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {today.completed ? (
                    <CheckCircle className="text-pink-500 animate-bounce" size={28} />
                  ) : (
                    <>
                      <span className="text-2xl font-black text-white">{today.percentage}%</span>
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Done</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Descriptions */}
              <div className="text-center">
                <p className="text-sm font-extrabold text-white">
                  {getGoalLabel(today.goalType, today.goalValue)}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">
                  {getProgressDetails()}
                </p>
              </div>

              {/* Learning stats & XP milestones */}
              <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" size={18} fill="currentColor" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block leading-none">Streak</span>
                    <span className="text-sm font-black text-white">{stats.currentStreak} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="text-purple-400" size={18} fill="currentColor" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block leading-none">XP Earned</span>
                    <span className="text-sm font-black text-white">+{stats.goalsCompletedCount * 50} XP</span>
                  </div>
                </div>
              </div>

              {/* Quick feedback message */}
              <div className="text-center w-full pt-1">
                {today.completed ? (
                  <div className="py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-xl">
                    ✓ Goal Achieved (+50 XP rewarded)
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    {remaining > 0
                      ? `Complete ${today.goalType === "time" ? `${Math.ceil(remaining)} more mins` : `${remaining} more items`} to hold streak!`
                      : "Hold tight, updating details..."}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyGoalCard;
