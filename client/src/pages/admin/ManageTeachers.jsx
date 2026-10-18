import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, DollarSign, TrendingUp, Search, CheckCircle,
  XCircle, Filter, MoreVertical, Award, Users, Activity, Sparkles, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold" style={{ color: entry.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: {entry.name.includes('Revenue') ? '$' : ''}{entry.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const performanceData = [
  { name: 'Mon', revenue: 4200, rating: 4.8 },
  { name: 'Tue', revenue: 5100, rating: 4.9 },
  { name: 'Wed', revenue: 4800, rating: 4.8 },
  { name: 'Thu', revenue: 6300, rating: 4.9 },
  { name: 'Fri', revenue: 7800, rating: 4.9 },
  { name: 'Sat', revenue: 9500, rating: 5.0 },
  { name: 'Sun', revenue: 8100, rating: 4.9 },
];


const ManageTeachers = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      console.log("Fetching teachers...");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/teachers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", res.data);

      setTeachers(res.data.teachers || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchTeachers();
}, []);

  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((teacher) =>
      teacher.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  const handleViewTeacher = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/admin/teachers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedTeacher(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveTeacher = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/admin/teachers/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectTeacher = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/admin/teachers/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Teachers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-purple-500/30">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Teachers</h1>
            <p className="text-gray-400 mt-1">Review instructor applications, monitor performance, and analyze platform revenue creators.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2"><Filter size={16} /> Advanced Filters</Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-purple-500/20"><BookOpen size={16} /> Onboard Teacher</Button>
          </div>
        </div>

        {/* Analytics Top Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Verified Instructors', value: '1,248', icon: Award, color: 'purple', trend: '+24 this week' },
            { label: 'Pending Approvals', value: '35', icon: Activity, color: 'orange', trend: 'Needs review' },
            { label: 'Total Instructor Revenue', value: '$845.2k', icon: DollarSign, color: 'emerald', trend: '+15.2% vs last month' },
            { label: 'Avg Satisfaction Score', value: '4.8/5.0', icon: Star, color: 'cyan', trend: 'Platform wide' },
          ].map((stat, idx) => (
            <GlassCard key={idx} className="p-5 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</h3>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">{stat.trend}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Content Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <GlassCard className="p-0 overflow-hidden lg:col-span-2 flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="text-purple-400" /> Instructor Directory</h2>
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Instructor</th>
                    <th className="px-6 py-3 font-medium">Status & Score</th>
                    <th className="px-6 py-3 font-medium">Performance Metrics</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                            {teacher.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 text-sm flex items-center gap-1">
                              {teacher.fullName}
                              {teacher.isVerified && <CheckCircle size={12} className="text-emerald-400" />}
                            </p>
                            <p className="text-xs text-cyan-400 font-medium">{teacher.email}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          color={
                            teacher.teacherStatus === "approved"
                              ? "green"
                              : teacher.teacherStatus === "rejected"
                                ? "red"
                                : "orange"
                          }
                        >
                          {teacher.teacherStatus || "pending"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">AI Score:</span>
                          <span
                            className={`text-xs font-bold ${(teacher.score || 0) >= 90
                              ? "text-emerald-400"
                              : "text-orange-400"
                              }`}
                          >
                            {teacher.score || 0}/100
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {teacher.status === 'Verified' ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Star size={12} className="text-yellow-400" /> <span className="font-bold">{teacher.rating || 0}</span> <span className="text-gray-500">Avg Rating</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Users size={12} className="text-blue-400" /> <span className="font-bold">{(teacher.students || 0).toFixed(1)}k</span> <span className="text-gray-500">Students</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <DollarSign size={12} className="text-emerald-400" /> <span className="font-bold">${(teacher.revenue || 0).toFixed(1)}k</span> <span className="text-gray-500">Revenue</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">No metrics available (Pending)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!teacher.isVerified ? (
                          <div className="flex justify-end gap-2">

                            <Button
                              variant="success"
                              onClick={() => approveTeacher(teacher._id)}
                            >
                              <CheckCircle size={16} />
                            </Button>

                            <Button
                              variant="danger"
                              onClick={() => rejectTeacher(teacher._id)}
                            >
                              <XCircle size={16} />
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleViewTeacher(teacher._id)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-cyan-400" />
                <h3 className="font-bold text-sm">AI Performance Analysis</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex gap-3">
                  <TrendingUp size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-200">Revenue Creators Segment</p>
                    <p className="text-[10px] text-gray-400 mt-1">Top 10% of instructors are generating 65% of platform revenue. Recommend introducing a "Premium Instructor" tier to retain top talent.</p>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex gap-3">
                  <AlertTriangle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-200">Quality Warning</p>
                    <p className="text-[10px] text-gray-400 mt-1">3 instructors have dropped below the 4.0 average rating threshold this week. Automated coaching emails have been queued.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold text-sm mb-4">Global Instructor Revenue</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRevBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="revenue" fill="url(#colorRevBar)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default ManageTeachers;
