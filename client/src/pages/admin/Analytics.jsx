import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, DollarSign, Globe, Smartphone, 
  Target, Activity, Sparkles, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
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

// Data Mocks
const revenueData = [
  { month: 'Jan', revenue: 145000 },
  { month: 'Feb', revenue: 162000 },
  { month: 'Mar', revenue: 158000 },
  { month: 'Apr', revenue: 181000 },
  { month: 'May', revenue: 215000 },
  { month: 'Jun', revenue: 289000 },
];

const retentionData = [
  { name: 'Month 1', rate: 95 },
  { name: 'Month 2', rate: 85 },
  { name: 'Month 3', rate: 75 },
  { name: 'Month 4', rate: 68 },
  { name: 'Month 5', rate: 62 },
  { name: 'Month 6', rate: 58 },
];

const deviceData = [
  { name: 'Desktop', value: 65, color: '#3b82f6' },
  { name: 'Mobile', value: 30, color: '#a855f7' },
  { name: 'Tablet', value: 5, color: '#06b6d4' },
];

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
const [loading, setLoading] = useState(true);

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAnalytics(res.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAnalytics();
}, []);


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
      Loading Analytics...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Global Analytics</h1>
            <p className="text-gray-400 mt-1">Platform-wide metrics, retention analysis, and AI revenue forecasting.</p>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500/50">
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>

        {/* Top KPI Cards */}
       <motion.div
  variants={itemVariants}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
>
  {[
    {
      label: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: "blue",
      trend: `${analytics?.totalStudents || 0} Students`,
    },
    {
      label: "Revenue",
      value: `₹${analytics?.totalRevenue || 0}`,
      icon: DollarSign,
      color: "emerald",
      trend: "Platform Revenue",
    },
    {
      label: "Total Courses",
      value: analytics?.totalCourses || 0,
      icon: Activity,
      color: "purple",
      trend: `${analytics?.publishedCourses || 0} Published`,
    },
    {
      label: "Certificates",
      value: analytics?.totalCertificates || 0,
      icon: Target,
      color: "cyan",
      trend: `${analytics?.totalEnrollments || 0} Enrollments`,
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

        <Badge
          color={
            stat.color === "emerald"
              ? "green"
              : stat.color
          }
          className="!text-[10px]"
        >
          {stat.trend}
        </Badge>
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

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-indigo-400" /> Revenue & Growth Dashboard
              </h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorGlobalRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Platform Revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGlobalRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Globe className="text-blue-400" /> Geographic Activity
              </h3>
              <div className="space-y-3">
                {[
                  { region: 'North America', users: '45%', color: 'bg-blue-500' },
                  { region: 'Europe', users: '30%', color: 'bg-purple-500' },
                  { region: 'Asia Pacific', users: '15%', color: 'bg-cyan-500' },
                  { region: 'Other', users: '10%', color: 'bg-gray-500' },
                ].map(r => (
                  <div key={r.region}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{r.region}</span>
                      <span className="font-bold">{r.users}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color}`} style={{ width: r.users }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Smartphone className="text-purple-400" /> Device Analytics
              </h3>
              <div className="h-[120px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* AI Forecasting & Retention */}
          <GlassCard className="p-6 lg:col-span-2">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="text-emerald-400" /> User Retention Curve (Cohorts)
              </h2>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rate" name="Retention Rate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles size={18} className="text-indigo-400" />
              <h3 className="font-bold text-sm">AI Forecasting</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-400 mb-1">Q4 Revenue Projection</p>
                <p className="text-[10px] text-gray-400">Based on current MoM growth and seasonal trends, Q4 revenue is projected to hit <strong className="text-white">$1.2M</strong> (+42% YoY).</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                <p className="text-xs font-bold text-orange-400 mb-1">Churn Risk Alert</p>
                <p className="text-[10px] text-gray-400">Month 3 retention has dipped by 2%. Recommending an automated re-engagement email campaign targeting users inactive for 14+ days.</p>
              </div>
            </div>
          </GlassCard>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlatformAnalytics;
