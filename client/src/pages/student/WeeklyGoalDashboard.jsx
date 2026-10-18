import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Zap,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Settings,
  ChevronDown,
  Calendar,
  Sparkles,
  ArrowLeft,
  Flame,
  BarChart3,
  TrendingUp,
  History
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { GlassCard, Button, Badge } from "../../components/ui";
import confetti from "canvas-confetti";

const WeeklyGoalDashboard = () => {
  const [data, setData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [goalType, setGoalType] = useState("time");
  const [goalValue, setGoalValue] = useState(180);

  const fetchWeeklyGoalData = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get("http://localhost:5000/api/weekly-goal/progress", { headers });
      setData(res.data);
      setGoalType(res.data.today.goalType);
      setGoalValue(res.data.today.goalValue);

      const histRes = await axios.get("http://localhost:5000/api/weekly-goal/history", { headers });
      setHistoryData(histRes.data);

      // Trigger weekly confetti celebration on completion
      if (res.data.today.completed && !localStorage.getItem(`weekly_goal_celebrated_${res.data.today.goalType}_${res.data.today.goalValue}`)) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        localStorage.setItem(`weekly_goal_celebrated_${res.data.today.goalType}_${res.data.today.goalValue}`, "true");
        toast.success("🎉 Incredible! You've achieved your Weekly Learning Goal! +150 XP rewarded.");
      }
    } catch (err) {
      console.error("Failed to load weekly goal details:", err);
      toast.error("Failed to load weekly goal analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyGoalData();
  }, []);

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/weekly-goal", {
        goalType,
        goalValue: Number(goalValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Weekly learning target updated!");
      setIsEditing(false);
      fetchWeeklyGoalData();
    } catch (err) {
      toast.error("Failed to configure weekly target settings.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Analyzing Weekly Performance...</p>
      </div>
    );
  }

  if (!data) return null;

  const { today, calendar, stats } = data;

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case "time": return "Study Time";
      case "lectures": return "Lectures Completed";
      case "notes": return "AI Notes Read";
      case "quiz": return "Quizzes Completed";
      case "custom": return "Materials Reviewed";
      default: return "Activity";
    }
  };

  const getProgressTargetString = () => {
    if (today.goalType === "time") {
      return `${Math.round(today.progress)} / ${today.goalValue} minutes (${Number((today.progress / 60).toFixed(1))}h / ${Number((today.goalValue / 60).toFixed(1))}h)`;
    }
    return `${today.progress} / ${today.goalValue} items completed`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge color="purple" className="mb-2">Weekly Goal System</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Your Weekly Challenge</h1>
            <p className="text-gray-400 text-sm mt-2">Stay consistent, build learning streaks, and unlock exclusive rewards.</p>
          </div>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="py-3 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 self-start md:self-auto"
          >
            <Settings size={14} /> Configure Goal
          </Button>
        </div>

        {/* Goal Settings Configuration Panel */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6 rounded-[2.5rem] border-purple-500/20 bg-purple-950/5 max-w-xl"
            >
              <form onSubmit={handleUpdateGoal} className="space-y-4">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-widest">Update Weekly learning Target</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Goal Category</label>
                    <select
                      value={goalType}
                      onChange={(e) => {
                        setGoalType(e.target.value);
                        setGoalValue(e.target.value === "time" ? 180 : 3);
                      }}
                      className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="time">Weekly Study Hours</option>
                      <option value="lectures">Lectures Watched</option>
                      <option value="notes">AI Notes Read</option>
                      <option value="quiz">Quizzes Attempted</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target Value</label>
                    {goalType === "time" ? (
                      <select
                        value={goalValue}
                        onChange={(e) => setGoalValue(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none"
                      >
                        <option value={180}>3 Hours (180 mins)</option>
                        <option value={300}>5 Hours (300 mins)</option>
                        <option value={600}>10 Hours (600 mins)</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={goalValue}
                        onChange={(e) => setGoalValue(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="py-2.5 px-6 bg-purple-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    Save Changes
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="py-2.5 px-6 border-white/10 text-white font-bold text-[10px] uppercase tracking-wider">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Stepper & Calendar */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Visual Calendar */}
            <section className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" /> Weekly Activity Streak
              </h3>

              <div className="grid grid-cols-7 gap-3 text-center">
                {calendar.map((day, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-between gap-3 ${day.completed ? "bg-purple-600/10 border-purple-500/30 text-purple-400" : "bg-white/[0.02] border-white/5 text-gray-600"}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{day.day}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${day.completed ? "bg-purple-600 text-white scale-110" : "bg-white/5"}`}>
                      {day.completed ? <CheckCircle size={16} /> : <span className="text-xs font-black">•</span>}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500">{day.value > 0 ? `${Math.round(day.value)}m` : "0m"}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Daily Study Trend Chart */}
            <section className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-400" /> Daily Learning Minutes
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calendar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {calendar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.completed ? "url(#purpleGrad)" : "rgba(255, 255, 255, 0.05)"} />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Core Goal Card */}
            <GlassCard className="p-6 border-white/5 space-y-6 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-30%] w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-28 h-28 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <motion.circle
                      cx="56" cy="56" r="48" stroke="url(#weeklyGradient)" strokeWidth="6" fill="transparent"
                      strokeDasharray={301}
                      initial={{ strokeDashoffset: 301 }}
                      animate={{ strokeDashoffset: 301 - (301 * today.percentage) / 100 }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{today.percentage}%</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Progress</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest leading-none">Weekly Target</h3>
                  <p className="text-base font-black text-white mt-2">{getGoalTypeLabel(today.goalType)}</p>
                  <p className="text-xs text-gray-500 mt-1 font-bold">{getProgressTargetString()}</p>
                </div>
                
                {today.completed ? (
                  <div className="py-2.5 px-4 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-2xl w-full">
                    ✓ Challenge Completed (+150 XP rewarded)
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    Complete your weekly challenge to earn exclusive badges!
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Performance Stats */}
            <GlassCard className="p-6 border-white/5 space-y-4 rounded-[2.5rem]">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" /> Weekly Activity Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Clock size={16} /> Total Learning
                  </span>
                  <span>{stats.learningHours} Hours</span>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <BookOpen size={16} /> Lectures Watched
                  </span>
                  <span>{stats.lecturesFinished} completed</span>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <HelpCircle size={16} /> Quizzes Finished
                  </span>
                  <span>{stats.quizzesFinished} completed</span>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Zap size={16} /> XP Accumulated
                  </span>
                  <span className="text-purple-400 font-extrabold">+{stats.xpEarned} XP</span>
                </div>
              </div>
            </GlassCard>

            {/* History Selector Card */}
            {historyData && historyData.history?.length > 0 && (
              <GlassCard className="p-6 border-white/5 space-y-4 rounded-[2.5rem]">
                <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <History size={16} className="text-yellow-500" /> Goal History
                </h3>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {historyData.history.map((hist) => (
                    <div key={hist._id} className="p-3 bg-black/20 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block leading-none">{hist.weekId}</span>
                        <span className="text-xs font-bold text-gray-300 mt-1 block">
                          {getGoalTypeLabel(hist.goalType)}: {hist.goalValue}
                        </span>
                      </div>
                      <Badge color={hist.completed ? "green" : "gray"}>
                        {hist.completed ? "Completed" : "Missed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoalDashboard;
