import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ShieldAlert, Award, Zap, ArrowLeft, PlusCircle } from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const StreakDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStreakStats = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/streaks/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load streak statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakStats();
  }, []);

  const handlePurchaseFreeze = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/streaks/purchase-freeze", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || "Streak Freeze purchased!");
      fetchStreakStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to purchase Streak Freeze.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { currentStreak, longestStreak, streakFreezeCount, totalXP, heatmap } = data || {
    currentStreak: 0,
    longestStreak: 0,
    streakFreezeCount: 0,
    totalXP: 0,
    heatmap: []
  };

  // Group heatmap by weeks of 7 days for the contribution grid
  const weeks = [];
  let tempWeek = [];
  heatmap.forEach((day, idx) => {
    tempWeek.push(day);
    if (tempWeek.length === 7 || idx === heatmap.length - 1) {
      weeks.push(tempWeek);
      tempWeek = [];
    }
  });

  const getHeatmapColor = (status) => {
    switch (status) {
      case "goal_completed": return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]";
      case "learned": return "bg-green-700/60";
      default: return "bg-white/[0.04]";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Streaks Flame stats banner */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-6">
            <GlassCard className="p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-orange-950/20 via-transparent to-[#020617]/50 relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full" />

              <div className="flex flex-col sm:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                  {/* Glowing Animated Flame Graphic */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 rounded-full bg-orange-600/10 border border-orange-500/30 flex items-center justify-center relative shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                  >
                    <Flame size={44} className="text-orange-500 fill-orange-500/20" />
                  </motion.div>

                  <div className="space-y-1">
                    <Badge color="orange" className="mb-1">Active Streak</Badge>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                      {currentStreak} <span className="text-xl text-gray-400 font-bold uppercase tracking-wider">Days</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider pt-1">
                      Longest Streak: {longestStreak} days
                    </p>
                  </div>
                </div>

                {/* Streak freeze container */}
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 text-center min-w-[180px]">
                  <div className="flex justify-center items-center gap-2">
                    <ShieldAlert size={16} className="text-cyan-400" />
                    <span className="text-xs font-black text-white">{streakFreezeCount} Freezes</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    Protects your active study streak if you miss a day.
                  </p>
                  <Button
                    onClick={handlePurchaseFreeze}
                    disabled={totalXP < 200}
                    className="w-full text-[9px] py-2 px-3 rounded-lg font-black uppercase tracking-wider flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                  >
                    <Zap size={10} className="text-yellow-400" /> Buy for 200 XP
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* GitHub-Style Contribution Heatmap */}
            <GlassCard className="p-8 border-white/5 rounded-[2.5rem] space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white">Consistency Heatmap</h3>
                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Your study activity over the last 90 days</p>
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 justify-start md:justify-center">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5 shrink-0">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-6 h-6 rounded-md ${getHeatmapColor(day.status)}`}
                        title={`${new Date(day.date).toLocaleDateString()}: ${day.status}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend keys */}
              <div className="flex justify-center items-center gap-6 text-[9px] font-black text-gray-500 uppercase tracking-widest pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-white/[0.04]" />
                  <span>Missed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-green-700/60" />
                  <span>Learned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span>Goal Achieved</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Stepper Timeline rewards (col-span-4) */}
          <div className="md:col-span-4">
            <GlassCard className="p-6 border-white/5 rounded-[2.5rem] bg-gradient-to-b from-white/[0.01] to-transparent space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white">Streak Rewards</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Unlock rewards by keeping streaks alive</p>
              </div>

              <div className="space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                {[
                  { days: 1, label: "Welcome Reward", reward: "Bronze Badge" },
                  { days: 3, label: "Daily Planner", reward: "Bronze Badge" },
                  { days: 7, label: "Consistency Champion", reward: "150 XP + Silver Badge" },
                  { days: 14, label: "Two-Week Streak", reward: "300 XP + Gold Badge" },
                  { days: 30, label: "Streak Master", reward: "500 XP + Diamond Badge" }
                ].map((step, idx) => {
                  const isCompleted = currentStreak >= step.days;

                  return (
                    <div key={idx} className="relative space-y-1">
                      <span className={`absolute left-[-21px] top-1.5 w-[12px] h-[12px] rounded-full border-2 ${
                        isCompleted
                          ? "bg-orange-500 border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                          : "bg-[#020617] border-white/10"
                      }`} />
                      <h4 className={`text-xs font-black leading-tight ${isCompleted ? "text-orange-400" : "text-gray-400"}`}>
                        {step.days} Day Streak
                      </h4>
                      <p className="text-[10px] text-gray-500 font-semibold">{step.label}</p>
                      <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block mt-1">
                        Reward: {step.reward}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakDashboard;
