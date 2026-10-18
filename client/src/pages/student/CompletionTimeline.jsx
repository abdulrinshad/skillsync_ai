import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Play,
  FileText,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  Search,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";

const CompletionTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const fetchTimeline = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/timeline", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, type: selectedType }
      });
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to load timeline logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [search, selectedType]);

  const getEventIcon = (type) => {
    switch (type) {
      case "lecture_complete":
        return <Play size={14} className="text-purple-400" fill="currentColor" />;
      case "notes_read":
        return <FileText size={14} className="text-cyan-400" />;
      case "quiz_complete":
        return <HelpCircle size={14} className="text-yellow-400" />;
      case "resource_view":
        return <BookOpen size={14} className="text-green-400" />;
      default:
        return <Sparkles size={14} className="text-gray-400" />;
    }
  };

  const getEventBadgeColor = (type) => {
    switch (type) {
      case "lecture_complete": return "purple";
      case "notes_read": return "cyan";
      case "quiz_complete": return "yellow";
      case "resource_view": return "green";
      default: return "gray";
    }
  };

  // Group events by Calendar Date string
  const groupEventsByDate = (eventArray) => {
    const groups = {};
    eventArray.forEach((event) => {
      const dateStr = new Date(event.timestamp).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(event);
    });
    return groups;
  };

  const grouped = groupEventsByDate(events);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header Header */}
        <div>
          <Badge color="purple" className="mb-2">Learning Ledger</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Completion Timeline</h1>
          <p className="text-gray-400 text-sm mt-2">A chronological roadmap of your modules, lectures, quizzes, and XP achievements.</p>
        </div>

        {/* Filters and search panel */}
        <div className="grid sm:grid-cols-12 gap-4 items-center bg-white/[0.01] border border-white/5 p-4 rounded-3xl">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Categories filters */}
          <div className="sm:col-span-7 flex flex-wrap gap-2 justify-start sm:justify-end">
            {[
              { type: "all", label: "All Events" },
              { type: "lecture_complete", label: "Videos" },
              { type: "notes_read", label: "AI Notes" },
              { type: "quiz_complete", label: "Quizzes" },
              { type: "resource_view", label: "Resources" }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  selectedType === item.type
                    ? "bg-purple-600/20 border-purple-500/30 text-purple-400"
                    : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Stepper Tree */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[2.5rem] text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
            No milestones or timeline records logged.
          </div>
        ) : (
          <div className="space-y-10 relative pl-4 md:pl-8 border-l border-white/10 ml-4">
            <AnimatePresence>
              {Object.entries(grouped).map(([dateStr, dayEvents]) => (
                <div key={dateStr} className="space-y-6 relative">
                  {/* Floating Date Header Indicator */}
                  <div className="absolute left-[-46px] md:left-[-62px] top-[-8px] bg-purple-600 text-white rounded-full p-1.5 border border-purple-400 shadow-xl z-10">
                    <Clock size={12} />
                  </div>
                  
                  <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">
                    {dateStr}
                  </h3>

                  <div className="space-y-4 pl-4 md:pl-0">
                    {dayEvents.map((event) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="glass-card p-5 rounded-[2rem] border-white/5 hover:border-purple-500/20 bg-gradient-to-br from-white/[0.01] to-transparent flex items-start gap-4 transition-all duration-300 group"
                      >
                        {/* Type Icon */}
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                          {getEventIcon(event.eventType)}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-bold block">
                              {new Date(event.timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                            </span>
                            <Badge color={getEventBadgeColor(event.eventType)} className="px-1.5 py-0.5 text-[8px] tracking-wider shrink-0 uppercase">
                              {event.eventType.replace("_", " ")}
                            </Badge>
                            {event.xpEarned > 0 && (
                              <Badge color="purple" className="px-1.5 py-0.5 text-[8px] font-black tracking-wider leading-none">
                                +{event.xpEarned} XP
                              </Badge>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-white group-hover:text-purple-400 transition-colors leading-snug">
                            {event.title}
                          </h4>
                          
                          <p className="text-xs text-gray-400 font-medium">
                            {event.description}
                          </p>

                          {event.courseId && (
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider pt-1.5">
                              Course: {event.courseId.title}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionTimeline;
