import axios from "axios";
import { useEffect } from "react";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Flag, UserX, AlertOctagon, CheckCircle, Search,
  Filter, MoreVertical, MessageSquare, AlertTriangle, Scale, Lock,
  FileText, ArrowRight
} from 'lucide-react';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
  };
  return (
    <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color]} flex items-center gap-1 w-fit ${className}`}>
      {children}
    </span>
  );
};



const ReportsAdmin = () => {
  const [activeTab, setActiveTab] = useState("All");

  const [reportData, setReportData] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReportData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/activity-logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivityLogs(res.data.logs || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchReports(),
        fetchActivityLogs(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-rose-500/30">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Reports & Moderation</h1>
            <p className="text-gray-400 mt-1">Investigate abuse reports, handle content violations, and review audit logs.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2"><FileText size={16} /> Audit Logs</Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-rose-500/20"><AlertOctagon size={16} /> Emergency Lock</Button>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Students",
              value: reportData?.users?.students || 0,
              icon: UserX,
              color: "purple",
            },
            {
              label: "Teachers",
              value: reportData?.users?.teachers || 0,
              icon: ShieldAlert,
              color: "blue",
            },
            {
              label: "Total Courses",
              value: reportData?.courses?.total || 0,
              icon: FileText,
              color: "orange",
            },
            {
              label: "Revenue",
              value: `₹${reportData?.revenue || 0}`,
              icon: CheckCircle,
              color: "green",
            },
          ].map((stat, idx) => (
            <GlassCard
              key={idx}
              className="p-5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}
                >
                  <stat.icon size={18} />
                </div>
              </div>

              <p className="text-3xl font-bold">
                {stat.value}
              </p>

              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </h3>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <GlassCard className="p-0 overflow-hidden xl:col-span-2 flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {['All', 'Unresolved', 'In Review', 'Resolved'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${activeTab === tab ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search report ID, user..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-rose-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Report Details</th>
                    <th className="px-6 py-3 font-medium">Target</th>
                    <th className="px-6 py-3 font-medium">Status & Priority</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activityLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-200 text-sm">
                          {log.action}
                        </p>

                        <p className="text-[10px] text-gray-500 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-300 font-medium">
                          {log.userId?.fullName}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {log.details}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Badge color="cyan">
                          {log.userId?.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <ShieldAlert size={18} className="text-rose-400" />
                <h3 className="font-bold text-sm">AI Moderation Assistant</h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-200">Auto-Resolution Engine</span>
                    <Badge color="green" className="!px-1 !py-0">Active</Badge>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-1">AI successfully resolved 342 low-risk spam reports in the last 24 hours without human intervention, maintaining a 99.8% accuracy rate.</p>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale size={14} className="text-orange-400" />
                    <span className="text-xs font-bold text-gray-200">Fraud Pattern Detected</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">Detected a cluster of 5 accounts generating fake reviews for the course "UI/UX Masterclass". Accounts have been shadowbanned pending your review.</p>
                  <button className="text-[10px] font-bold text-rose-400 hover:underline mt-2">View Cluster Analysis</button>
                </div>
              </div>
            </GlassCard>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsAdmin;
