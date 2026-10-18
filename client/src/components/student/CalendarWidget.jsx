import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, BookOpen, HelpCircle, FileText, PlusCircle } from "lucide-react";
import { GlassCard, Badge, Button } from "../ui";

const CalendarWidget = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/calendar", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter events happening today
        const todayStr = new Date().toDateString();
        const filtered = (res.data || []).filter(e => new Date(e.date).toDateString() === todayStr);
        setEvents(filtered.slice(0, 3));
      } catch (err) {
        console.error("Failed to load today's calendar events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEvents();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "quiz": return <HelpCircle size={12} className="text-yellow-400" />;
      case "notes": return <FileText size={12} className="text-cyan-400" />;
      default: return <BookOpen size={12} className="text-purple-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[2rem] border-white/5 animate-pulse space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="h-10 bg-white/5 rounded w-full" />
      </div>
    );
  }

  return (
    <GlassCard className="p-6 border-white/5 rounded-[2rem] space-y-6 relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-sm text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={16} /> Schedule
        </h3>
        <Link to="/dashboard/calendar" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-0.5 transition-colors">
          Calendar <ChevronRight size={12} />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="space-y-4 text-center py-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">No study sessions scheduled today.</p>
          <Link to="/dashboard/calendar">
            <Button variant="outline" className="text-[9px] py-2 px-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-1.5 mx-auto mt-2">
              <PlusCircle size={12} /> Plan Day
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="flex justify-between items-start gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-white/5 rounded-lg">
                  {getEventIcon(event.eventType)}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-white leading-tight truncate max-w-[140px]">{event.title}</h4>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">{event.startTime} - {event.endTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(event.priority)}`} />
                <Badge color={event.status === "completed" ? "green" : "purple"} className="text-[8px] font-black shrink-0 px-1 py-0.5">
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default CalendarWidget;
