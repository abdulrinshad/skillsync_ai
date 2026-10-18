import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Download, Sparkles, CreditCard, Wallet, 
  ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity,
  Target, Award, Calendar, CheckCircle, AlertCircle, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Mock UI components for this self-contained file.
const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
  };
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`} {...props}>
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
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color]} ${className}`}>
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
            {entry.name}: {entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('earnings') ? '$' : ''}{entry.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Data Mocks
const revenueData = [
  { month: 'Jan', revenue: 4200, profit: 3800 },
  { month: 'Feb', revenue: 5100, profit: 4600 },
  { month: 'Mar', revenue: 4800, profit: 4200 },
  { month: 'Apr', revenue: 6300, profit: 5700 },
  { month: 'May', revenue: 7800, profit: 7100 },
  { month: 'Jun', revenue: 9500, profit: 8600 },
];

const sourceData = [
  { name: 'Direct Purchases', value: 4500, color: '#8b5cf6' }, // purple
  { name: 'Subscriptions', value: 3200, color: '#06b6d4' },    // cyan
  { name: 'Live Classes', value: 1200, color: '#3b82f6' },     // blue
  { name: 'Premium Content', value: 600, color: '#10b981' },   // emerald
];

const topCourses = [
  { id: 1, title: 'Advanced Neural Networks', rev: 4520, students: 342, rating: 4.9, growth: '+24%', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80' },
  { id: 2, title: 'Full-Stack Next.js Pro', rev: 3850, students: 289, rating: 4.8, growth: '+18%', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80' },
  { id: 3, title: 'UI/UX Design Systems', rev: 2100, students: 156, rating: 4.9, growth: '+12%', thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80' }
];

const transactions = [
  { id: 'TRX-8921', user: 'Emma Watson', course: 'Advanced Neural Networks', date: 'Today, 2:45 PM', amount: 89.99, status: 'completed' },
  { id: 'TRX-8920', user: 'James Chen', course: 'Full-Stack Next.js Pro', date: 'Today, 11:20 AM', amount: 149.99, status: 'completed' },
  { id: 'TRX-8919', user: 'Sarah Miller', course: 'UI/UX Design Systems', date: 'Yesterday', amount: 79.99, status: 'pending' },
  { id: 'TRX-8918', user: 'Michael Scott', course: 'Advanced Neural Networks', date: 'Yesterday', amount: 89.99, status: 'completed' },
  { id: 'TRX-8917', user: 'Lisa Wang', course: 'Subscription (Monthly)', date: 'Oct 24', amount: 29.99, status: 'completed' }
];

const Earnings = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('6M');

  const [earnings, setEarnings] = useState(null);

  

  const fetchEarnings = async () => {
  try {
    const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/teacher/earnings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!earnings) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading Earnings...
    </div>
  );
}

    setEarnings(res.data);
    console.log("Teacher Earnings:", res.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchEarnings();
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
    <motion.div 
      className="space-y-8 pb-20 text-white min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* 1. Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Earnings & Revenue
          </h1>
          <p className="text-gray-400 mt-2">
            Track your teaching income, analyze business growth, and manage payouts.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            AI Revenue Insights
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Download Report
          </Button>
          <Button variant="success" className="flex items-center gap-2">
            <Wallet size={16} />
            Withdraw $4,250
          </Button>
        </div>
      </motion.div>

      {/* 2. Revenue Overview Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
  {
    label: "Total Revenue",
    value: `₹${earnings?.totalRevenue || 0}`,
    icon: DollarSign,
    color: "emerald",
  },
  {
    label: "Monthly Revenue",
    value: `₹${earnings?.monthlyRevenue || 0}`,
    icon: TrendingUp,
    color: "blue",
  },
  {
    label: "This Week",
    value: `₹${earnings?.weeklyRevenue || 0}`,
    icon: Activity,
    color: "purple",
  },
  {
    label: "Pending Payouts",
    value: `₹${earnings?.pendingPayouts || 0}`,
    icon: Clock,
    color: "orange",
  },
  {
    label: "Total Students",
    value: earnings?.totalStudents || 0,
    icon: Users,
    color: "cyan",
  },
  {
    label: "Paid Enrollments",
    value: earnings?.totalEnrollments || 0,
    icon: BookOpen,
    color: "blue",
  },
].map((stat, idx) => (
          <GlassCard key={idx} className="p-5 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon size={18} />
              </div>
              {stat.isUp !== null && (
                <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              )}
            </div>
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">{stat.trend}</p>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Charts & Tables) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* 3. Revenue Analytics Dashboard */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-cyan-400" /> Revenue Growth
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Monthly earnings trajectory</p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map(time => (
                    <button 
                      key={time}
                      onClick={() => setActiveTimeframe(time)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTimeframe === time ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4. Top Earning Courses */}
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Award className="text-yellow-400" /> Top Performers
                  </h2>
                  <Button variant="outline" className="text-xs py-1 px-3">View All</Button>
                </div>
                <div className="space-y-4">
                  {topCourses.map((course, idx) => (
                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                        <img src={course.thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{course.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Users size={12} /> {course.students}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="text-emerald-400">{course.growth}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-purple-400">${course.rev.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* 6. Revenue Sources Breakdown */}
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6 h-full flex flex-col">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <PieChartIcon className="text-emerald-400" /> Revenue Sources
                </h2>
                <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="text-xl font-bold">$9,500</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {sourceData.map((src, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                      <span className="text-gray-300 truncate">{src.name}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* 9. Recent Transactions */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="text-blue-400" /> Recent Transactions
                </h2>
                <Button variant="outline" className="text-xs py-1 px-3">View Full History</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-medium">Student / ID</th>
                      <th className="px-6 py-4 font-medium">Course Purchased</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((trx, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{trx.user}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{trx.id}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{trx.course}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{trx.date}</td>
                        <td className="px-6 py-4 font-bold">${trx.amount}</td>
                        <td className="px-6 py-4">
                          <Badge color={trx.status === 'completed' ? 'green' : 'orange'}>
                            {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

        </div>

        {/* Right Column (Insights & Goals) */}
        <div className="space-y-6">
          
          {/* 5. Payout Management */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 bg-gradient-to-br from-white/5 to-purple-500/10 border-purple-500/20">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Wallet className="text-purple-400" /> Payout Management
              </h2>
              
              <div className="space-y-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <p className="text-3xl font-black mt-1">₹{earnings?.teacherShare || 0}</p>
                  </div>
                  <Button variant="success" className="shadow-[0_0_15px_rgba(16,185,129,0.3)]">Withdraw</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Next Payout</p>
                    <p className="font-bold mt-1">Nov 1st</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Pending</p>
                    <p className="font-bold mt-1 text-orange-400">₹{earnings?.pendingPayouts || 0}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center border border-white/20">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">•••• 4242</p>
                      <p className="text-[10px] text-gray-400">Primary Bank</p>
                    </div>
                  </div>
                  <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">Manage</button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 8. AI Revenue Assistant */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Revenue Insights</h3>
                  <p className="text-xs text-gray-400">Opportunity detection active</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex gap-3 items-start hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Pricing Optimization</p>
                    <p className="text-xs text-gray-400 leading-relaxed">Increasing the price of "Advanced Neural Networks" by 15% could boost monthly revenue by ~$450 without affecting conversion rates.</p>
                  </div>
                </div>
                
                <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex gap-3 items-start hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Topic Demand Alert</p>
                    <p className="text-xs text-gray-400 leading-relaxed">Searches for "LangChain Agents" are up 300% among your students. Launching a mini-course on this could yield high initial sales.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 11. Earnings Goals Section */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="text-orange-400" /> Monthly Goal
              </h2>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-2xl font-black text-white">₹{earnings?.monthlyRevenue || 0}</p>
                  <p className="text-xs text-gray-400">of ₹{earnings?.totalRevenue || 0} target</p>
                </div>
                <Badge color="orange">95%</Badge>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-yellow-400" /> 
                Just $500 more to hit your milestone!
              </p>
            </GlassCard>
          </motion.div>

          {/* 12. Financial Insights Dashboard (Mini) */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="text-green-400" /> Performance Metrics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-gray-400">Best Sales Day</span>
                  <span className="text-sm font-bold">Tuesday</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-gray-400">Avg. Order Value</span>
                  <span className="text-sm font-bold">$105.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Refund Rate</span>
                  <span className="text-sm font-bold text-emerald-400">1.2% (Low)</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Earnings;
