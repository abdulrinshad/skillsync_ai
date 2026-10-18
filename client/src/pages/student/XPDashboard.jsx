import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ShieldAlert, Award, Play, FileText, Calendar, ArrowLeft, Trophy } from "lucide-react";
import { GlassCard, Badge } from "../../components/ui";

const XPDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXPStats = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/xp/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load XP statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchXPStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { level, levelTitle, totalXP, xpToNextLevel, progressPct, history } = data || {
    level: 1,
    levelTitle: "Beginner",
    totalXP: 0,
    xpToNextLevel: 100,
    progressPct: 0,
    history: []
  };

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

        {/* Level and Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge color="purple" className="mb-2">RPG Level Rank</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Rank: <span className="text-gradient">{levelTitle}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">Earn more XP to unlock the expert and grand master level ranks.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Level progress (col-span-4) */}
          <div className="md:col-span-4">
            <GlassCard className="p-8 rounded-[2.5rem] border-white/5 text-center bg-gradient-to-b from-white/[0.01] to-transparent space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="56" stroke="url(#xpGradient)" strokeWidth="10" fill="transparent"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeDashoffset={2 * Math.PI * 56 * (1 - progressPct / 100)} />
                  <defs>
                    <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Level</span>
                  <span className="text-4xl font-black text-white">{level}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">Level Progress</span>
                <h4 className="text-xl font-extrabold text-white">{progressPct}% completed</h4>
                <p className="text-xs text-gray-400 font-medium">
                  {xpToNextLevel} XP needed to reach Level {level + 1}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400 font-bold">
                <Zap size={14} className="text-purple-400" />
                <span>{totalXP} Lifetime XP</span>
              </div>
            </GlassCard>
          </div>

          {/* XP History logs (col-span-8) */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">XP Earning History</h3>
            
            {history.length === 0 ? (
              <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[2.5rem] text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                No XP transactions logged.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-400 flex items-center justify-center">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{log.activity}</h4>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Badge color="purple" className="px-2.5 py-1 text-xs font-black tracking-wider leading-none shrink-0">
                      +{log.xpEarned} XP
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPDashboard;
