import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Play, FileText, HelpCircle, BookOpen, Clock, ChevronRight } from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";

const LastActivityCard = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastActivity = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/timeline/last-activity", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivity(res.data);
      } catch (err) {
        console.error("Failed to load last activity status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastActivity();
  }, []);

  const getFormatDetails = (type) => {
    switch (type) {
      case "lecture_complete":
        return { label: "Watched Video", icon: <Play size={16} className="text-purple-400" fill="currentColor" /> };
      case "notes_read":
        return { label: "Read AI Notes", icon: <FileText size={16} className="text-cyan-400" /> };
      case "quiz_complete":
        return { label: "Completed AI Quiz", icon: <HelpCircle size={16} className="text-yellow-400" /> };
      default:
        return { label: "Studied Resource", icon: <BookOpen size={16} className="text-green-400" /> };
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[2.5rem] border-white/5 animate-pulse space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/4" />
        <div className="h-8 bg-white/5 rounded w-3/4" />
      </div>
    );
  }

  if (!activity) return null;

  const details = getFormatDetails(activity.eventType);

  // Compute time ago
  const formatTimeAgo = (dateStr) => {
    const diffMs = new Date() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <GlassCard className="p-6 md:p-8 rounded-[2.5rem] border-purple-500/20 bg-gradient-to-br from-purple-950/15 via-transparent to-[#020617]/50 relative overflow-hidden group">
      {/* Background glow styling */}
      <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/5 rounded-lg shrink-0">
              {details.icon}
            </span>
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest leading-none">
              {details.label}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              • {formatTimeAgo(activity.timestamp)}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white leading-tight truncate">
            {activity.title}
          </h3>
          
          <p className="text-xs text-gray-400 font-medium">
            {activity.description}
          </p>

          {activity.courseId && (
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pt-1">
              Course: {activity.courseId.title}
            </p>
          )}
        </div>

        {activity.courseId && (
          <Link to={`/courses/${activity.courseId._id || activity.courseId}`} className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-cyan-500 shadow-2xl flex items-center justify-center gap-2 group">
              Resume Learning <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        )}
      </div>
    </GlassCard>
  );
};

export default LastActivityCard;
