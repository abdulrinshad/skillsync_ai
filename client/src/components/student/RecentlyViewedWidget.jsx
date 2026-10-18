import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileText,
  HelpCircle,
  BookOpen,
  Trash2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";
import { toast } from "react-toastify";

const RecentlyViewedWidget = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/recently-viewed", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type: selectedType,
          search: search,
          sort: sortBy
        }
      });
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load viewed history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, selectedType, sortBy]);

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/recently-viewed/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removed from history");
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire history?")) return;
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/recently-viewed/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("History cleared");
      setHistory([]);
    } catch (err) {
      toast.error("Failed to clear history.");
    }
  };

  const handleResume = (item) => {
    navigate(`/courses/${item.courseId?._id}/modules/${item.moduleId?._id || item.moduleId}`);
  };

  const getIcon = (type) => {
    switch (type) {
      case "video": return <Play size={14} className="text-purple-400" fill="currentColor" />;
      case "notes": return <FileText size={14} className="text-cyan-400" />;
      case "quiz": return <HelpCircle size={14} className="text-yellow-400" />;
      case "resource": return <BookOpen size={14} className="text-green-400" />;
      default: return <Sparkles size={14} className="text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "video": return "Video Lecture";
      case "notes": return "AI notes";
      case "quiz": return "Module Quiz";
      case "resource": return "Study Material";
      default: return "Activity";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
            <Clock size={20} />
          </div>
          Recently Viewed
        </h2>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] text-red-400 hover:text-red-300 font-extrabold uppercase tracking-widest shrink-0 self-start sm:self-auto"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Filters & Search Panel */}
      <div className="grid sm:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search recently viewed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
          />
        </div>

        {/* Categories filters */}
        <div className="sm:col-span-7 flex flex-wrap gap-2 justify-start sm:justify-end">
          {["all", "video", "notes", "quiz", "resource"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedType === type
                  ? "bg-purple-600/20 border-purple-500/30 text-purple-400"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2rem] text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
          No matching records found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {history.map((item) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleResume(item)}
                className="glass-card p-4 rounded-[2rem] border-white/5 hover:border-purple-500/20 bg-gradient-to-br from-white/[0.01] to-transparent cursor-pointer flex items-center justify-between gap-4 group transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Category icon */}
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                    {getIcon(item.contentType)}
                  </div>

                  {/* Title & subtitle info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge color="purple" className="px-1.5 py-0.5 text-[8px] tracking-wider shrink-0 uppercase">
                        {getTypeLabel(item.contentType)}
                      </Badge>
                      {item.progress > 0 && (
                        <span className="text-[9px] font-black text-gray-500">{Math.round(item.progress)}% completed</span>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-white mt-1 group-hover:text-purple-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider truncate">
                      Course: {item.courseId?.title || "Overview"}
                    </p>
                  </div>
                </div>

                {/* Quick actions delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDeleteItem(e, item._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 border border-white/5 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedWidget;
