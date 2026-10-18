import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { GlassCard, Badge } from "../ui";

const EstimatedTimeCard = ({ courseId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstimatedTime = async () => {
      if (!courseId) return;
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/progress/estimated-time/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load estimated time remaining:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimatedTime();
  }, [courseId]);

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[2rem] border-white/5 animate-pulse flex items-center justify-between">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-white/5 rounded w-1/3" />
          <div className="h-6 bg-white/5 rounded w-3/4" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5" />
      </div>
    );
  }

  if (!data || data.totalSecondsLeft === 0) {
    return (
      <GlassCard className="p-6 border-white/5 rounded-[2rem] bg-gradient-to-br from-green-950/10 to-transparent flex items-center justify-between">
        <div>
          <Badge color="green" className="mb-2">Completed</Badge>
          <h4 className="text-sm font-extrabold text-white">Course Syllabus Complete!</h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Ready for certificate claiming</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
          ✓
        </div>
      </GlassCard>
    );
  }

  // Calculate predicted completion date: assume 30 minutes studied per day
  const calculateEstDate = () => {
    const totalMins = data.totalSecondsLeft / 60;
    const daysToFinish = Math.ceil(totalMins / 30);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToFinish);
    return targetDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <GlassCard className="p-6 border-white/5 rounded-[2rem] bg-gradient-to-br from-purple-950/10 via-transparent to-[#0a0f24]/50 relative overflow-hidden group">
      <div className="absolute top-[-30%] right-[-30%] w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
      
      <div className="flex justify-between items-center gap-4 relative z-10">
        <div className="space-y-1">
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block leading-none">Estimated Remaining</span>
          <h4 className="text-2xl font-black text-white">
            {data.hours > 0 ? `${data.hours}h ` : ""}{data.minutes}m left
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 mt-1">
            <Calendar size={12} className="text-purple-400" />
            <span>Est. Finish: {calculateEstDate()}</span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
          <Clock size={20} className="animate-pulse" />
        </div>
      </div>
    </GlassCard>
  );
};

export default EstimatedTimeCard;
