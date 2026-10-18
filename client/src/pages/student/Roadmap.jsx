import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Play,
  Lock,
  Flame,
  Zap,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";

const Roadmap = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/progress/roadmap/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      
      // Auto expand the active/in-progress module
      const initialExpanded = {};
      res.data.roadmap.forEach((mod) => {
        if (mod.status === "In Progress" || (mod.status === "Not Started" && !mod.isLocked)) {
          initialExpanded[mod.moduleId] = true;
        }
      });
      setExpandedModules(initialExpanded);
    } catch (err) {
      console.error("Failed to fetch roadmap:", err);
      toast.error("Failed to load your learning roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [courseId]);

  const toggleExpand = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleResume = () => {
    if (!data?.nextItem) {
      // If completed or no next item, default to first module's player
      if (data?.roadmap?.length > 0) {
        navigate(`/courses/${courseId}/modules/${data.roadmap[0].moduleId}`);
      }
      return;
    }
    const next = data.nextItem;
    navigate(`/courses/${courseId}/modules/${next.moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Assembling Roadmap...</p>
      </div>
    );
  }

  if (!data) return null;

  const { course, stats, roadmap, nextItem } = data;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <Link to="/dashboard/learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to My Learning
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] p-8 lg:p-12 border border-white/10 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900/50 to-cyan-900/15" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <Badge color={course.completed ? "green" : "purple"} className="mb-2">
                {course.completed ? "COURSE COMPLETED" : "STUDY WORKSPACE"}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">{course.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed md:line-clamp-2">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  onClick={handleResume} 
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-2xl flex items-center gap-2"
                >
                  <Play size={14} fill="currentColor" /> {nextItem ? "Resume Learning" : "Start Course Again"}
                </Button>
                {course.certificateEligible && (
                  <Link to="/dashboard/certificates">
                    <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-2xl">
                      Claim Certificate
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Overall Progress Circle */}
            <div className="flex flex-col items-center shrink-0 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
              <div className="w-24 h-24 relative mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="48" cy="48" r="42" stroke="url(#progressGradient)" strokeWidth="6" fill="transparent"
                    strokeDasharray={264}
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * (course.totalProgress || 0)) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                  {course.totalProgress}%
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Syllabus Progress</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Timeline Section */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
              <BookOpen className="text-purple-400" size={20} /> Learning Roadmap
            </h2>

            <div className="relative pl-6 md:pl-10 space-y-8">
              {/* Vertical connecting line */}
              <div className="absolute left-[29px] md:left-[37px] top-6 bottom-6 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 to-slate-800 rounded-full z-0" />

              {roadmap.map((mod, index) => {
                const isExpanded = !!expandedModules[mod.moduleId];
                let cardBorder = "border-white/5";
                let statusBadgeColor = "purple";
                let indicatorIcon = <Play size={14} className="text-purple-400" fill="currentColor" />;

                if (mod.isLocked) {
                  cardBorder = "border-white/5 bg-slate-950/20 opacity-60";
                  statusBadgeColor = "gray";
                  indicatorIcon = <Lock size={14} className="text-gray-500" />;
                } else if (mod.status === "Completed") {
                  cardBorder = "border-green-500/20 bg-green-950/5";
                  statusBadgeColor = "green";
                  indicatorIcon = <CheckCircle size={14} className="text-green-400" />;
                } else if (mod.status === "In Progress") {
                  cardBorder = "border-purple-500/30 bg-purple-950/5 shadow-lg shadow-purple-500/5";
                  statusBadgeColor = "purple";
                  indicatorIcon = <Play size={14} className="text-cyan-400" fill="currentColor" />;
                }

                return (
                  <motion.div
                    key={mod.moduleId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative z-10"
                  >
                    {/* Node Dot / Status Indicator */}
                    <div className="absolute -left-[30px] md:-left-[42px] top-4 w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-[#020617] bg-slate-900 flex items-center justify-center shadow-lg">
                      {indicatorIcon}
                    </div>

                    {/* Module Accordion Card */}
                    <div className={`glass-card p-6 rounded-[2rem] border ${cardBorder} transition-all duration-300 hover:border-purple-500/20`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge color={statusBadgeColor}>{mod.status}</Badge>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{mod.duration}</span>
                            <span className="text-[10px] text-gray-500 font-bold">•</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{mod.difficulty}</span>
                          </div>
                          <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{mod.description}</p>
                        </div>

                        {/* Progress and Toggle Controls */}
                        <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 border-t border-white/5 md:border-none pt-4 md:pt-0">
                          {!mod.isLocked && (
                            <div className="text-right">
                              <span className="text-sm font-black text-white">{mod.progress}%</span>
                              <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${mod.progress}%` }} />
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => !mod.isLocked && toggleExpand(mod.moduleId)}
                            disabled={mod.isLocked}
                            className={`p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors ${mod.isLocked ? "cursor-not-allowed opacity-30" : ""}`}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Module Sub-items Checklist */}
                      <AnimatePresence>
                        {isExpanded && !mod.isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6 pt-6 border-t border-white/5 space-y-4"
                          >
                            {/* Lectures */}
                            {mod.lectures?.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lectures & Videos</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {mod.lectures.map((lec) => (
                                    <div
                                      key={lec._id}
                                      onClick={() => navigate(`/courses/${courseId}/modules/${mod.moduleId}`)}
                                      className="p-3 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/20 cursor-pointer flex items-center justify-between group/lec"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover/lec:bg-purple-600 group-hover/lec:text-white transition-colors">
                                          <Play size={12} fill="currentColor" />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-xs font-bold text-gray-300 line-clamp-1">{lec.title}</p>
                                          <span className="text-[9px] text-gray-500">{lec.duration}</span>
                                        </div>
                                      </div>
                                      {lec.status === "Completed" && (
                                        <CheckCircle size={14} className="text-green-400 shrink-0" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Resources */}
                            {mod.resources?.length > 0 && (
                              <div className="space-y-2 pt-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Study Materials & Documents</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {mod.resources.map((res) => (
                                    <div
                                      key={res._id}
                                      onClick={() => navigate(`/courses/${courseId}/modules/${mod.moduleId}`)}
                                      className="p-3 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/20 cursor-pointer flex items-center justify-between group/res"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-600/10 flex items-center justify-center text-cyan-400 group-hover/res:bg-cyan-600 group-hover/res:text-white transition-colors">
                                          <FileText size={12} />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-xs font-bold text-gray-300 line-clamp-1">{res.title}</p>
                                          <span className="text-[9px] text-gray-500 uppercase">{res.resourceType}</span>
                                        </div>
                                      </div>
                                      {res.status === "Completed" && (
                                        <CheckCircle size={14} className="text-green-400 shrink-0" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* AI notes */}
                            {mod.notes?.length > 0 && (
                              <div className="space-y-2 pt-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Generated Study Notes</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {mod.notes.map((n) => (
                                    <div
                                      key={n._id}
                                      onClick={() => navigate(`/courses/${courseId}/modules/${mod.moduleId}`)}
                                      className="p-3 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/20 cursor-pointer flex items-center justify-between group/note"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-600/10 flex items-center justify-center text-yellow-400 group-hover/note:bg-yellow-600 group-hover/note:text-white transition-colors">
                                          <Sparkles size={12} />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-xs font-bold text-gray-300 line-clamp-1">{n.title}</p>
                                          <span className="text-[9px] text-gray-500">Summary & Key Points</span>
                                        </div>
                                      </div>
                                      {n.status === "Completed" && (
                                        <CheckCircle size={14} className="text-green-400 shrink-0" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quiz */}
                            {mod.quiz && (
                              <div className="space-y-2 pt-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Module Knowledge Check</h4>
                                <div
                                  onClick={() => navigate(`/courses/${courseId}/modules/${mod.moduleId}`)}
                                  className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/20 cursor-pointer flex items-center justify-between group/quiz"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover/quiz:bg-indigo-600 group-hover/quiz:text-white transition-colors">
                                      <HelpCircle size={16} />
                                    </div>
                                    <div className="text-left">
                                      <p className="text-sm font-bold text-gray-200">{mod.quiz.title}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">{mod.quiz.questionsCount} Questions • Pass condition: 80%</p>
                                    </div>
                                  </div>
                                  {mod.quiz.status === "Completed" ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-green-400">Score: {mod.quiz.score}</span>
                                      <CheckCircle size={16} className="text-green-400 shrink-0" />
                                    </div>
                                  ) : (
                                    <Badge color="purple">Start Quiz</Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Gamification Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
              <Activity className="text-cyan-400" size={20} /> Learning Analytics
            </h2>

            {/* Streak & XP Card */}
            <GlassCard className="p-6 border-white/5 relative overflow-hidden space-y-6 rounded-[2rem]">
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-purple-500/5 blur-3xl rounded-full" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Flame size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400">Streak</h3>
                    <p className="text-xl font-black text-white">{stats.streak} Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400">Experience</h3>
                    <p className="text-xl font-black text-white">{stats.xp} XP</p>
                  </div>
                </div>
              </div>

              {/* Level progress indicator */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Level {stats.level}</span>
                  <span className="text-gray-400">Level {stats.level + 1}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${(stats.xp % 100)}%` }} />
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{100 - (stats.xp % 100)} XP to next level</p>
              </div>
            </GlassCard>

            {/* Smart Prediction Card */}
            <GlassCard className="p-6 border-white/5 space-y-4 rounded-[2rem]">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" /> Completion Estimation
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Clock size={16} /> Hours Remaining
                  </span>
                  <span>{stats.remainingHours} hrs</span>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Award size={16} /> Estimated Date
                  </span>
                  <span>{new Date(stats.completionDatePrediction).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassCard>

            {/* Daily & Weekly Goals */}
            <GlassCard className="p-6 border-white/5 space-y-4 rounded-[2rem]">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Award size={16} className="text-yellow-400" /> Goals & Milestones
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Daily Goal</span>
                    <span className={stats.dailyGoal.status === "Completed" ? "text-green-400" : "text-purple-400"}>
                      {stats.dailyGoal.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{stats.dailyGoal.title}</p>
                </div>

                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Weekly Progress</span>
                    <span className="text-cyan-400">{stats.weeklyGoal.progress}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{stats.weeklyGoal.title}</p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${stats.weeklyGoal.progress}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
