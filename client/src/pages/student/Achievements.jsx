import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  Flame,
  Target,
  Play,
  FileText,
  HelpCircle,
  Lock,
  Award,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { GlassCard, Badge } from "../../components/ui";
import confetti from "canvas-confetti";

const Achievements = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/achievements/my-badges", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        
        // Celebrate badge unlock with confetti
        if (res.data?.unlockedCount > 0) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 }
          });
        }
      } catch (err) {
        console.error("Failed to load achievements details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "legend": return "border-purple-500/50 text-purple-400 bg-purple-950/10";
      case "gold": return "border-yellow-500/50 text-yellow-400 bg-yellow-950/10";
      case "silver": return "border-slate-400/50 text-slate-300 bg-slate-900/10";
      default: return "border-amber-700/50 text-amber-500 bg-amber-950/10";
    }
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case "Play": return <Play size={20} />;
      case "FileText": return <FileText size={20} />;
      case "HelpCircle": return <HelpCircle size={20} />;
      case "Flame": return <Flame size={20} />;
      case "Target": return <Target size={20} />;
      default: return <Trophy size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { level, totalXP, unlocked, locked } = data || { level: 1, totalXP: 0, unlocked: [], locked: [] };

  // Level XP calculations (e.g. 100 XP per level)
  const currentLevelXP = totalXP % 100;
  const levelProgressPct = currentLevelXP;

  const allBadges = [
    ...unlocked.map(b => ({ ...b, isUnlocked: true })),
    ...locked.map(b => ({ ...b, isUnlocked: false }))
  ];

  const filteredBadges = selectedCategory === "all" 
    ? allBadges 
    : allBadges.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Level Progress Banner */}
        <GlassCard className="p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-purple-950/20 via-transparent to-[#020617]/50 relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* Level Progress Ring */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                  <circle cx="56" cy="56" r="48" stroke="url(#levelGradient)" strokeWidth="8" fill="transparent"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={2 * Math.PI * 48 * (1 - levelProgressPct / 100)} />
                  <defs>
                    <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <span className="text-xs text-gray-500 font-bold block uppercase tracking-wider">Level</span>
                  <span className="text-3xl font-black text-white">{level}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-white">Gamification Center</h2>
                <p className="text-sm text-gray-400">Earn XP by watching lectures, scoring on quizzes, and completing daily goals.</p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge color="purple" className="flex items-center gap-1">
                    <Zap size={10} /> {totalXP} Total XP
                  </Badge>
                  <span className="text-[10px] text-gray-500 font-bold">{100 - currentLevelXP} XP to Level {level + 1}</span>
                </div>
              </div>
            </div>

            {/* Overall Stats Cards */}
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-white/5 rounded-2xl text-center border border-white/5 min-w-[120px]">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block">Unlocked</span>
                <span className="text-2xl font-black text-white">{data.unlockedCount}</span>
              </div>
              <div className="px-6 py-4 bg-white/5 rounded-2xl text-center border border-white/5 min-w-[120px]">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block">Streak</span>
                <span className="text-2xl font-black text-white flex items-center justify-center gap-1">
                  <Flame size={20} className="text-orange-500" /> {data.currentStreak}d
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Badges" },
            { id: "learning", label: "Learning" },
            { id: "notes", label: "AI Notes" },
            { id: "quizzes", label: "Quizzes" },
            { id: "streaks", label: "Streaks" },
            { id: "goals", label: "Goals" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedCategory === cat.id
                  ? "bg-purple-600/20 border-purple-500/30 text-purple-400"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge.badgeId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 border rounded-[2rem] flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden group ${
                  badge.isUnlocked
                    ? "bg-gradient-to-br from-white/[0.02] to-transparent border-white/10 hover:border-purple-500/30 hover:scale-[1.02]"
                    : "bg-black/40 border-white/5 opacity-50"
                }`}
              >
                {/* Visual Glow on hover */}
                {badge.isUnlocked && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                )}

                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getDifficultyColor(badge.difficulty)}`}>
                    {getBadgeIcon(badge.iconName)}
                  </div>

                  {badge.isUnlocked ? (
                    <Badge color="green" className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5">Unlocked</Badge>
                  ) : (
                    <div className="p-1.5 bg-white/5 rounded-lg text-gray-600 border border-white/5">
                      <Lock size={12} />
                    </div>
                  )}
                </div>

                <div className="space-y-1 relative z-10">
                  <h4 className="text-sm font-extrabold text-white">{badge.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">{badge.description}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5 relative z-10">
                  <span className="text-[9px] text-purple-450 font-black uppercase tracking-widest">+{badge.xpReward} XP Reward</span>
                  {badge.earnedAt && (
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
