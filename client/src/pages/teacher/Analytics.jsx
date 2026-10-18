import { getTeacherAnalytics } from "../../services/teacherAnalyticsService";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  Smile, 
  Calendar, 
  Download, 
  Sparkles, 
  BrainCircuit, 
  Play, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  Lightbulb, 
  ExternalLink, 
  Activity, 
  Trophy, 
  Flame, 
  Star, 
  Layers, 
  CheckCircle,
  X,
  UserCheck,
  Zap,
  Info,
  TrendingDown,
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';

// Numeric ticker animation
const AnimatedCounter = ({ value, duration = 1.2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numericStr = String(value).replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    let start = 0;
    const end = target;
    const isInt = Number.isInteger(end);
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * (end - start);

      if (isInt) {
        setCount(Math.floor(current));
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  const formattedCount = typeof count === 'number' && Number.isInteger(count) && count > 999 
    ? count.toLocaleString() 
    : count;

  return <span>{prefix}{formattedCount}{suffix}</span>;
};

// Custom Tooltip for Recharts
const GlassTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs mt-1 font-semibold">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-extrabold">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  // Cursor glow trackers
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
  fetchAnalytics();
}, []);

const fetchAnalytics = async () => {
  try {
    const data = await getTeacherAnalytics();

    console.log("ANALYTICS:", data);

    setAnalytics(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Filter States
  const [dateRange, setDateRange] = useState('30days');
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Multi-tab graphs
  const [engagementTab, setEngagementTab] = useState('dau'); // 'dau' | 'hours' | 'retention'
  const [courseTab, setCourseTab] = useState('enrollment'); // 'enrollment' | 'completion' | 'dropoff'

  // Modals state
  const [showAiModal, setShowAiModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [analytics, setAnalytics] = useState(null);
const [loading, setLoading] = useState(true);

  // Sparkline mini datasets
  const sparklineData = {
    students: [
      { v: 12000 }, { v: 12400 }, { v: 12900 }, { v: 13200 }, { v: 13800 }, { v: 14250 }
    ],
    active: [
      { v: 1500 }, { v: 1650 }, { v: 1800 }, { v: 1950 }, { v: 2100 }, { v: 2200 }
    ],
    completion: [
      { v: 88 }, { v: 90 }, { v: 91 }, { v: 93 }, { v: 93.8 }, { v: 94.2 }
    ],
    satisfaction: [
      { v: 4.88 }, { v: 4.90 }, { v: 4.92 }, { v: 4.94 }, { v: 4.95 }, { v: 4.95 }
    ],
    quiz: [
      { v: 90.2 }, { v: 91.0 }, { v: 91.5 }, { v: 91.8 }, { v: 92.2 }, { v: 92.4 }
    ],
    hours: [
      { v: 34000 }, { v: 36500 }, { v: 38000 }, { v: 39500 }, { v: 41000 }, { v: 42500 }
    ]
  };

  // Engagement datasets
  const engagementData = {
    dau: [
      { name: 'Mon', DAU: 1450, MAU: 8900 },
      { name: 'Tue', DAU: 1890, MAU: 9200 },
      { name: 'Wed', DAU: 2100, MAU: 9400 },
      { name: 'Thu', DAU: 1980, MAU: 9300 },
      { name: 'Fri', DAU: 2200, MAU: 9600 },
      { name: 'Sat', DAU: 1650, MAU: 8800 },
      { name: 'Sun', DAU: 1540, MAU: 8600 }
    ],
    hours: [
      { name: 'Week 1', Hours: 8400, Sessions: 4200 },
      { name: 'Week 2', Hours: 9600, Sessions: 4900 },
      { name: 'Week 3', Hours: 11200, Sessions: 5800 },
      { name: 'Week 4', Hours: 13300, Sessions: 6900 }
    ],
    retention: [
      { name: 'Day 1', Retention: 98 },
      { name: 'Day 7', Retention: 84 },
      { name: 'Day 14', Retention: 76 },
      { name: 'Day 30', Retention: 68 },
      { name: 'Day 60', Retention: 62 },
      { name: 'Day 90', Retention: 58 }
    ]
  };

  // Course metrics
  const coursePerformanceData = {
    enrollment: [
      { subject: 'Generative AI', Enrolled: 4890, Limit: 6000 },
      { subject: 'Neural Networks', Enrolled: 3420, Limit: 5000 },
      { subject: 'Ethical Hacking', Enrolled: 1240, Limit: 3000 },
      { subject: 'Next.js Dev', Enrolled: 2150, Limit: 4000 },
      { subject: 'AI Ethics', Enrolled: 1120, Limit: 2000 }
    ],
    completion: [
      { name: 'Generative AI', Rate: 94.2 },
      { name: 'Neural Networks', Rate: 88.5 },
      { name: 'Ethical Hacking', Rate: 78.0 },
      { name: 'Next.js Dev', Rate: 91.0 },
      { name: 'AI Ethics', Rate: 92.1 }
    ],
    dropoff: [
      { name: 'Intro Blueprint', Active: 100 },
      { name: 'Module 1 Math', Active: 92 },
      { name: 'Module 2 Coding', Active: 84 },
      { name: 'Module 3 Quiz', Active: 78 },
      { name: 'Final Capstone', Active: 68 }
    ]
  };

  // Student progress rows
  const [studentProgress, setStudentProgress] = useState([
    { id: 1, name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=alex", course: "Generative AI Foundations", progress: 94, quiz: 96, attendance: 98, lastActive: "Just now", streak: 14 },
    { id: 2, name: "Chloe Jenkins", avatar: "https://i.pravatar.cc/150?u=chloe", course: "Advanced Neural Networks", progress: 88, quiz: 100, attendance: 96, lastActive: "12 mins ago", streak: 28 },
    { id: 3, name: "Yuki Tanaka", avatar: "https://i.pravatar.cc/150?u=yuki", course: "Holographic User Interfaces", progress: 32, quiz: 68, attendance: 78, lastActive: "3 hours ago", streak: 3 },
    { id: 4, name: "Marcus Aurelius", avatar: "https://i.pravatar.cc/150?u=marcus", course: "Generative AI Foundations", progress: 98, quiz: 94, attendance: 100, lastActive: "1 day ago", streak: 42 },
    { id: 5, name: "Elena Rostova", avatar: "https://i.pravatar.cc/150?u=elena", course: "Ethical Hacking with LLMs", progress: 68, quiz: 85, attendance: 92, lastActive: "2 days ago", streak: 0 }
  ]);

  const filteredStudents = studentProgress.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          st.course.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesCourse = courseFilter === 'all' || st.course.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const handleNudgeStudent = (name) => {
    alert(`AI co-pilot nudge successfully targeted to ${name}. Message pushed via Email & System alert logs.`);
  };

  // Export Simulation
  const handleExportSimulate = () => {
    setExporting(true);
    setExportProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setExporting(false);
        alert("Analytics package successfully generated! Downloaded student_cohort_analytics_q3.csv to folder.");
      }
    }, 120);
  };

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading Analytics...
    </div>
  );
}
  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-32 bg-[#020617] -mx-4 lg:-mx-8 -my-6 lg:-my-8 px-4 lg:px-8 py-6 lg:py-8">
      {/* Background Radial Glow Mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0" />
      
      {/* Interactive Cursor Radial glow tracker */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.06), transparent 45%)`
        }}
      />

      <div className="relative z-10 space-y-10">
        
        {/* 1. PAGE HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Student Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Activity size={14} className="text-purple-400" /> Monitor student performance, Streaks, XP, and AI-predicted dropouts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Date range picker */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400">
              <Calendar size={14} className="mr-2 text-purple-400" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none py-2.5 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="7days" className="bg-slate-900">Last 7 Days</option>
                <option value="30days" className="bg-slate-900">Last 30 Days</option>
                <option value="90days" className="bg-slate-900">Last 90 Days</option>
                <option value="year" className="bg-slate-900">This Year</option>
              </select>
            </div>

            <Button 
              onClick={handleExportSimulate}
              disabled={exporting}
              variant="outline" 
              className="px-4 py-2.5 text-xs flex items-center gap-2 border-white/10 hover:bg-white/5"
            >
              <Download size={14} /> {exporting ? `Exporting (${exportProgress}%)` : 'Export Analytics'}
            </Button>
            
            <Button 
              onClick={() => setShowAiModal(true)}
              variant="gradient" 
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Sparkles size={14} /> AI Insights Core
            </Button>
          </div>
        </motion.div>


        {/* 2. ANALYTICS OVERVIEW CARDS (With embedded sparklines) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {[
            {
              label: "Total Students",
              val: analytics?.totalStudents || 0,
              change: "+0%",
              spark: sparklineData.students,
              color: "purple"
            },
            {
              label: "Total Revenue",
              val: analytics?.totalRevenue || 0,
              change: "+0%",
              spark: sparklineData.hours,
              prefix: "₹",
              color: "cyan"
            },
            {
              label: "Course Completion",
              val: analytics?.completionRate || 0,
              change: "+0%",
              spark: sparklineData.completion,
              suffix: "%",
              color: "green"
            },
            {
              label: "Lecture Completion",
              val: analytics?.averageLectureCompletion || 0,
              change: "+0%",
              spark: sparklineData.active,
              suffix: "%",
              color: "orange"
            },
            {
              label: "Avg Watch Time",
              val: analytics?.averageWatchTimeMin || 0,
              change: "+0%",
              spark: sparklineData.satisfaction,
              suffix: "m",
              color: "pink"
            },
            {
              label: "Quiz Performance",
              val: analytics?.averageQuizScore || 0,
              change: "+0%",
              spark: sparklineData.quiz,
              suffix: "%",
              color: "purple"
            }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden p-6 rounded-[2rem] border border-white/5 group bg-white/[0.01] backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Glowing card spots */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] -mr-8 -mt-8 group-hover:bg-purple-600/10 transition-all pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">{stat.label}</div>
                  <Badge color={stat.color}>{stat.change}</Badge>
                </div>

                <div className="text-3xl font-black tracking-tight mb-2">
                  <AnimatedCounter value={stat.val} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="h-10 w-full mt-2 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`sparkGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stat.color === 'purple' ? '#a855f7' : stat.color === 'cyan' ? '#06b6d4' : stat.color === 'green' ? '#22c55e' : '#ec4899'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={stat.color === 'purple' ? '#a855f7' : stat.color === 'cyan' ? '#06b6d4' : stat.color === 'green' ? '#22c55e' : '#ec4899'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke={stat.color === 'purple' ? '#a855f7' : stat.color === 'cyan' ? '#06b6d4' : stat.color === 'green' ? '#22c55e' : '#ec4899'} 
                      strokeWidth={1.5} 
                      fill={`url(#sparkGrad-${idx})`} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>


        {/* MULTI-DASHBOARD METRICS AND AI INSIGHTS SPLIT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: CHARTS, PROGRESS GRID, ASSESSMENT */}
          <div className="xl:col-span-2 space-y-10">

            {/* 3. STUDENT ENGAGEMENT DASHBOARD */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-600/5 blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-3">
                    <Clock size={20} className="text-cyan-400" /> Cohort Engagement Metrics
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Review hourly learning cycles, daily active profiles, and student retention decays</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                  {[
                    { id: 'dau', label: 'DAU / MAU' },
                    { id: 'hours', label: 'Hours Spent' },
                    { id: 'retention', label: 'Retention' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setEngagementTab(tab.id)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${engagementTab === tab.id ? 'bg-gradient-premium text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engagement charts viewport */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {engagementTab === 'dau' ? (
                    <AreaChart data={engagementData.dau} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01}/>
                        </linearGradient>
                        <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Area type="monotone" dataKey="DAU" name="Daily Active (DAU)" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#dauGrad)" />
                      <Area type="monotone" dataKey="MAU" name="Monthly Active (MAU)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#mauGrad)" />
                    </AreaChart>
                  ) : engagementTab === 'hours' ? (
                    <BarChart data={engagementData.hours} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Bar dataKey="Hours" name="Learning Hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Sessions" name="Study Sessions" fill="#ec4899" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={engagementData.retention} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Area type="monotone" dataKey="Retention" name="Retention Rate (%)" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#retGrad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Engagement summary indicators */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5 text-center text-xs">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Student Engagement</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    {analytics?.averageEngagement || 0}% <span className="text-green-400">Average</span>
                  </div>
                </div>
                <div className="border-x border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Active Students</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    {analytics?.activeStudents || 0} <span className="text-purple-400">Active</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Dropoff Rate</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    {analytics?.dropoffRate || 0}% <span className="text-red-400">Drop-off</span>
                  </div>
                </div>
              </div>
            </GlassCard>


            {/* 4. COURSE PERFORMANCE ANALYTICS */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
              <div className="absolute left-0 top-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-3">
                    <Target size={20} className="text-purple-400 animate-pulse" /> Course Performance Analytics
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Cross-reference course enrollments, cohort drop-offs, and completion rates</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                  {[
                    { id: 'enrollment', label: 'Enrollments comparison' },
                    { id: 'completion', label: 'Completions' },
                    { id: 'dropoff', label: 'Drop-off funnel' },
                    { id: 'xp', label: 'XP Distribution' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCourseTab(tab.id)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${courseTab === tab.id ? 'bg-gradient-premium text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course graph viewport */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {courseTab === 'enrollment' ? (
                    <RadarChart cx="50%" cy="50%" radius="70%" data={coursePerformanceData.enrollment}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 6000]} stroke="rgba(255,255,255,0.2)" fontSize={8} />
                      <Radar name="Active Enrolled" dataKey="Enrolled" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                      <Radar name="Registry Limit" dataKey="Limit" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} />
                      <Tooltip content={<GlassTooltip />} />
                    </RadarChart>
                  ) : courseTab === 'completion' ? (
                    <BarChart data={coursePerformanceData.completion} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Bar dataKey="Rate" name="Completion Rate (%)" fill="#a855f7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : courseTab === 'xp' ? (
                    <BarChart data={analytics?.xpDistribution || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Bar dataKey="students" name="Students count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={coursePerformanceData.dropoff} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<GlassTooltip />} />
                      <Area type="monotone" dataKey="Active" name="Active cohort (%)" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#dropGrad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </GlassCard>


            {/* 5. STUDENT PROGRESS TRACKING TABLE */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-3">
                    <Users className="text-cyan-400" size={20} /> Student Progress Tracking
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Review streak levels, module checks, and attendance metrics</p>
                </div>

                {/* Filter and search controls */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative group flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors w-3.5 h-3.5" />
                    <input 
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search student cohorts..."
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[11px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all text-white placeholder:text-gray-600"
                    />
                  </div>
                  
                  <div className="bg-white/5 rounded-xl px-2 border border-white/5 text-[10px] text-gray-400 flex items-center shrink-0">
                    <Filter size={10} className="mr-1.5 text-cyan-400" />
                    <select 
                      value={courseFilter} 
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="bg-transparent border-none py-1.5 text-[10px] font-black text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-900">All Courses</option>
                      <option value="Generative" className="bg-slate-900">GenAI Core</option>
                      <option value="Neural" className="bg-slate-900">Neural Networks</option>
                      <option value="Holographic" className="bg-slate-900">WebGL Graphics</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Progress Table grid */}
              <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.005] font-black text-gray-500 uppercase tracking-widest text-[9px]">
                        <th className="p-4 pl-6">Student profile</th>
                        <th className="p-4">Enrolled Course</th>
                        <th className="p-4">Syllabus Progress</th>
                        <th className="p-4 text-center">Avg Quiz Score</th>
                        <th className="p-4 text-center">Attendance %</th>
                        <th className="p-4 text-right pr-6 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-white/[0.01] transition-colors group">
                          {/* Student identity */}
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0 group-hover:border-purple-500/40 transition-colors">
                              <img src={st.avatar} className="w-full h-full object-cover" alt={st.name} />
                            </div>
                            <div>
                              <div className="font-extrabold text-white">{st.name}</div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                {st.streak > 0 ? (
                                  <span className="text-orange-400 font-bold flex items-center gap-0.5">
                                    <Flame size={10} className="fill-orange-400" /> {st.streak} day streak
                                  </span>
                                ) : (
                                  <span className="text-gray-600 font-semibold">Streak broken</span>
                                )}
                                <span>•</span>
                                <span>Active {st.lastActive}</span>
                              </div>
                            </div>
                          </td>

                          {/* Course title */}
                          <td className="p-4 font-semibold text-gray-300">
                            {st.course}
                          </td>

                          {/* Progress bar */}
                          <td className="p-4 w-44">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                <span>Completed</span>
                                <span>{st.progress}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: `${st.progress}%` }} />
                              </div>
                            </div>
                          </td>

                          {/* Quiz score */}
                          <td className="p-4 text-center font-black text-cyan-400 text-sm">
                            {st.quiz}%
                          </td>

                          {/* Attendance */}
                          <td className="p-4 text-center font-black text-white">
                            {st.attendance}%
                          </td>

                          {/* Action nudge button */}
                          <td className="p-4 text-right pr-6">
                            <button 
                              onClick={() => handleNudgeStudent(st.name)}
                              className="px-3 py-1.5 rounded-lg border border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Nudge Student
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>


          {/* RIGHT COLUMN: AI INSIGHTS, PREDICTIVE INTELLIGENCE, TIMELINE */}
          <div className="space-y-10">

            {/* 11. PREDICTIVE AI ANALYTICS */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Predictive AI Analytics</h4>
                <p className="text-[10px] text-gray-500 font-medium">Cohort forecasts modeled from deep learning checkpoints</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-purple-500/20 p-6 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-500/10 relative overflow-hidden space-y-6">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                {/* Confidence circle */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-purple-500/25">
                    94%
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Success Probability Score</h5>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase mt-0.5">Cohort Forecast: Excellent</p>
                  </div>
                </div>

                {/* Prediction stats */}
                <div className="space-y-3.5 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                      <span>Completion Prediction</span>
                      <span className="text-purple-400">92% Graduation</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                      <span>Engagement Forecast</span>
                      <span className="text-cyan-400">High Activity (24 days)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                  <span className="text-[9px] text-purple-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={10} /> Personalized Recommendation
                  </span>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Forecasts suggest scheduling a specialized Live Stream on 'Causal Masking' to prevent a WebGL dropout spike.
                  </p>
                </div>
              </GlassCard>
            </section>


            {/* 6. AI INSIGHTS PANEL */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">AI Diagnostic suggestions</h4>
                <p className="text-[10px] text-gray-500 font-medium">Identified risks, interventions, and behavior alerts</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-white/5 p-6 space-y-6 bg-gradient-to-b from-[#0a0f24]/80 to-[#020617]/90 relative overflow-hidden">
                <div className="space-y-4 text-xs font-semibold leading-relaxed">
                  
                  {/* Risk Alert */}
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-1.5">
                    <span className="text-[10px] text-red-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={12} /> Students at Risk of Dropoff
                    </span>
                    <p className="text-[11px] text-gray-300">
                      Yuki Tanaka (Holographic Graphics) has been inactive for 3 days and holds a low quiz average of 68%.
                    </p>
                    <button 
                      onClick={() => handleNudgeStudent('Yuki Tanaka')}
                      className="text-[10px] font-black uppercase text-red-400 hover:text-red-300 flex items-center gap-0.5 pt-1 cursor-pointer"
                    >
                      Trigger Intervention <ChevronRight size={10} />
                    </button>
                  </div>

                  {/* Suggestion */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb size={12} className="text-yellow-500" /> Learning Behavior Analysis
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Top performers show high streaks (42+ days) and review notebooks between 7PM-9PM on weekdays.
                    </p>
                  </div>

                </div>
              </GlassCard>
            </section>


            {/* 9. LEADERBOARD XP ANALYTICS */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Academy Streak Leaderboard</h4>
                <p className="text-[10px] text-gray-500 font-medium">Rankings mapped across total XP checkpoints</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-white/5 p-6 bg-gradient-to-b from-[#0a0f24]/80 to-[#020617]/90 relative overflow-hidden space-y-4">
                {[
                  { name: "Chloe Jenkins", xp: "18,450 XP", streak: "28 days", avatar: "https://i.pravatar.cc/150?u=chloe" },
                  { name: "Marcus Aurelius", xp: "16,200 XP", streak: "42 days", avatar: "https://i.pravatar.cc/150?u=marcus" },
                  { name: "Alex Rivera", xp: "14,500 XP", streak: "14 days", avatar: "https://i.pravatar.cc/150?u=alex" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center font-black text-[10px] text-purple-400 shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={item.avatar} className="w-full h-full object-cover" alt="avatar" />
                      </div>
                      <div className="font-bold text-white line-clamp-1 w-28">{item.name}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-cyan-400">{item.xp}</div>
                      <div className="text-[9px] text-gray-500 font-bold uppercase mt-0.5 flex items-center justify-end gap-0.5">
                        <Flame size={10} className="fill-orange-400 text-orange-400" /> {item.streak}
                      </div>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </section>


            {/* 10. STUDENT ACTIVITY TIMELINE */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Student Activity Timeline</h4>
                <p className="text-[10px] text-gray-500 font-medium">Chronological learning milestones log</p>
              </div>

              <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden divide-y divide-white/5 text-xs font-semibold leading-relaxed">
                {[
                  { name: "Chloe Jenkins", action: "unlocked certificate in", target: "Advanced Neural Networks", time: "Just now" },
                  { name: "Alex Rivera", action: "submitted quiz blueprint", target: "Attention Gradients quiz: 96%", time: "12 mins ago" },
                  { name: "Yuki Tanaka", action: "attended Live Q&A Stream", target: "Generative Models Stream", time: "1 hour ago" }
                ].map((act, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-start gap-4">
                    <div>
                      <strong className="text-white font-bold">{act.name}</strong>{' '}
                      <span className="text-gray-500">{act.action}</span>
                      <div className="text-[11px] text-gray-400 font-bold mt-0.5 line-clamp-1">{act.target}</div>
                    </div>
                    <span className="text-[9px] text-gray-600 font-black uppercase mt-0.5 shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </div>

      {/* AI INSIGHTS DIAGNOSTICS OVERLAY MODAL */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-8 shadow-2xl z-10 space-y-6"
            >
              {/* Close trigger */}
              <button 
                onClick={() => setShowAiModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Sparkles className="text-purple-400" size={20} /> AI Student Analytics Co-Pilot
                </h3>
                <p className="text-xs text-gray-500 mt-1">Unified model diagnostic reports formulated across cohort metadata checkpoints.</p>
              </div>

              {/* Suggestions logs */}
              <div className="space-y-4 text-xs font-semibold leading-relaxed">
                
                {/* Outliers */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
                  <h4 className="text-[10px] text-purple-400 font-black uppercase tracking-wider flex items-center gap-1">
                    <Award size={12} /> Top Learning Behavior Pattern
                  </h4>
                  <p className="text-gray-300">
                    Cohorts scoring &gt;90% on attention mechanisms spent an average of 4.2 hours debugging the Google Colab weight-visualizers.
                  </p>
                </div>

                {/* At risk alerts */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                  <h4 className="text-[10px] text-red-400 font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> Dropout Warning Signal
                  </h4>
                  <p className="text-gray-300">
                    Syllabus dropout peak identified on Module 3 Section 2 calculus derivations. Dropouts increase by 24% if students skip the first assessment quiz.
                  </p>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-1">
                  <h4 className="text-[10px] text-cyan-400 font-black uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb size={12} /> Suggested Teaching Intervention
                  </h4>
                  <p className="text-gray-300">
                    AI co-pilot suggests deploying a spontaneous competitive Leaderboard Quiz on Backprop derivatives to trigger high attendance spikes.
                  </p>
                </div>

              </div>

              <Button 
                onClick={() => {
                  setShowAiModal(false);
                  alert("Syncing recommended optimization templates to active course blue-prints...");
                }}
                variant="gradient"
                className="w-full py-3.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"
              >
                Apply Diagnostic Suggestions
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Analytics;
