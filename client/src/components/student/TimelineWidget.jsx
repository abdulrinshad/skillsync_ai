import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock, Play, FileText, HelpCircle, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { GlassCard, Badge } from "../ui";

const TimelineWidget = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/timeline/recent", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data || []);
      } catch (err) {
        console.error("Failed to load recent timeline events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case "lecture_complete":
        return <Play size={10} className="text-purple-400" fill="currentColor" />;
      case "notes_read":
        return <FileText size={10} className="text-cyan-400" />;
      case "quiz_complete":
        return <HelpCircle size={10} className="text-yellow-400" />;
      case "resource_view":
        return <BookOpen size={10} className="text-green-400" />;
      default:
        return <Sparkles size={10} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[2rem] border-white/5 animate-pulse space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="space-y-3">
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <GlassCard className="p-6 border-white/5 rounded-[2rem] space-y-6 relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-sm text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={16} /> Recent Activity
        </h3>
        <Link to="/dashboard/timeline" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-0.5 transition-colors">
          Full Log <ChevronRight size={12} />
        </Link>
      </div>

      <div className="relative border-l border-white/10 ml-2.5 pl-5 space-y-6">
        {events.map((event) => (
          <div key={event._id} className="relative group">
            {/* Visual Node Dot */}
            <div className="absolute left-[-26px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#020617] border-2 border-purple-500/50 flex items-center justify-center group-hover:border-purple-400 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            </div>

            {/* Event Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-bold block">
                  {new Date(event.timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </span>
                {event.xpEarned > 0 && (
                  <Badge color="purple" className="px-1 py-0.5 text-[8px] font-black tracking-wider leading-none">
                    +{event.xpEarned} XP
                  </Badge>
                )}
              </div>
              <h4 className="text-xs font-extrabold text-white group-hover:text-purple-400 transition-colors leading-snug">
                {event.title}
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold line-clamp-1">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TimelineWidget;
