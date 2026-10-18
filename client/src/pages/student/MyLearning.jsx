import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  Award, 
  Flame, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  Layout,
  MessageSquare,
  Trophy,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';

const chartData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 2.0 },
  { name: 'Thu', hours: 4.5 },
  { name: 'Fri', hours: 3.2 },
  { name: 'Sat', hours: 5.0 },
  { name: 'Sun', hours: 4.2 },
];

const ProgressCard = ({ enrollment, delay }) => {
  const course = enrollment.courseId || {};
  const instructorName = course.teacherId?.fullName || "Verified Instructor";
  const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
  const remainingLessons = course.curriculum?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 5 }}
      className="glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-purple-500/30 transition-all group flex flex-col md:flex-row gap-6 items-center"
    >
      <div className="w-full md:w-40 h-28 rounded-2xl overflow-hidden relative shrink-0">
        <img src={thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/courses/${course._id}/roadmap`} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-2xl">
            <Play size={18} fill="currentColor" />
          </Link>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-purple-400 transition-colors">{course.title || "Untitled Course"}</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">{instructorName} • {remainingLessons} sections left</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-white">{enrollment.progressDetails?.progressPercentage || 0}%</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${enrollment.progressDetails?.progressPercentage || 0}%` }}
              transition={{ duration: 1.5, delay: delay + 0.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-500" 
            />
          </div>
          <div className="flex justify-between items-center">
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020617] bg-gray-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i + (course.title || "")}`} alt="user" />
                  </div>
                ))}
                <div className="text-[9px] font-bold text-gray-500 ml-4 flex items-center tracking-tight">+1.2k others learning</div>
             </div>
             <Link to={`/courses/${course._id}/roadmap`}>
               <Button variant="outline" className="py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                 Continue Learning
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/enrollments/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Hero Welcome & Stats Section */}
      <motion.section 
        variants={itemVariants}
        className="relative rounded-[3rem] overflow-hidden p-8 lg:p-12 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-cyan-500/10 opacity-50" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <Badge color="purple" className="mb-6">STUDENT DASHBOARD</Badge>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-none">
              Welcome back, <br />
              <span className="text-gradient">John Smith.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
              Track your progress, explore new courses, and verify certificates in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="glass-card px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
                    <Flame size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-none">12 Days</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Streak</div>
                  </div>
               </div>
               <div className="glass-card px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-none">4,850</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total XP</div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 glass-morphism p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group/card">
             <div className="absolute top-0 right-0 p-6 text-purple-500/20">
                <Sparkles size={60} />
             </div>
             <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <BrainCircuit size={20} className="text-purple-400" /> AI Insights
             </h3>
             <div className="space-y-4 text-sm font-medium text-gray-400">
                <p className="leading-relaxed">
                  "Keep going! Reviewing your syllabus concepts regularly will ensure high comprehension scores."
                </p>
                <div className="pt-4 border-t border-white/5">
                   <div className="flex justify-between text-xs mb-2">
                      <span>Weekly Goal Progress</span>
                      <span className="text-purple-400">75%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        className="h-full bg-purple-500"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Learning Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Play size={20} fill="currentColor" />
                </div>
                Continue Learning
              </h2>
              <Link to="/dashboard/explore" className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">
                Explore More Courses
              </Link>
            </div>
            <div className="space-y-6">
               {enrollments.length > 0 ? (
                 enrollments.map((enrollment, i) => (
                   <ProgressCard key={enrollment._id} enrollment={enrollment} delay={0.1 * i} />
                 ))
               ) : (
                 <div className="glass-card p-8 rounded-[2.5rem] border-white/5 text-center text-gray-400">
                   You are not enrolled in any courses yet. <Link to="/dashboard/explore" className="text-purple-400 underline font-bold">Explore Courses</Link>
                 </div>
               )}
            </div>
          </section>

          {/* Learning Analytics */}
          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
                <BarChart3 size={20} />
              </div>
              Learning Analytics
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 lg:col-span-2">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Study Hours</h4>
                        <div className="text-3xl font-black text-white mt-1">24.5h <span className="text-sm font-bold text-green-400 ml-2">+12%</span></div>
                     </div>
                     <div className="flex gap-2">
                        {['Day', 'Week', 'Month'].map(t => (
                          <button key={t} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Week' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            {t}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} 
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="hours" 
                          stroke="#8b5cf6" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorHours)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col justify-between group cursor-pointer transition-all hover:border-cyan-500/30">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-inner border border-white/5">
                        <CheckCircle2 size={24} />
                     </div>
                     <Badge color="cyan">85% SCORE</Badge>
                  </div>
                  <div>
                    <div className="text-3xl font-black leading-tight">{enrollments.length * 12}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Lessons Completed</div>
                  </div>
               </div>

               <div className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col justify-between group cursor-pointer transition-all hover:border-yellow-500/30">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all shadow-inner border border-white/5">
                        <Trophy size={24} />
                     </div>
                     <Badge color="orange">TOP 5%</Badge>
                  </div>
                  <div>
                    <div className="text-3xl font-black leading-tight">0</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Certificates Earned</div>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Extras */}
        <div className="space-y-12">
          {/* Level Progression */}
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 relative mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray="276"
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * 0.65) }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="text-purple-500" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-black">12</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase">Level</div>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Master Learner</h3>
              <p className="text-xs text-gray-500 font-medium mb-6">350 XP to Level 13</p>
              <div className="grid grid-cols-4 gap-3 w-full">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className={`h-10 rounded-xl flex items-center justify-center border transition-all ${i < 4 ? 'bg-purple-600/10 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                      <Award size={20} />
                   </div>
                 ))}
              </div>
            </div>
          </section>

          {/* AI Study Assistant */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-white/10">
                  <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg leading-none">Smart Reminders</h3>
                   <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Personalized</span>
                </div>
              </div>
              <div className="space-y-4">
                 {[
                   { text: "Your course quiz modules will become available as you progress.", time: "Reminder", icon: Calendar },
                   { text: "Try Pomodoro method tonight for focus.", time: "Study Tip", icon: Zap }
                 ].map((tip, i) => (
                   <div key={i} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <tip.icon className="text-purple-400 shrink-0" size={16} />
                      <div>
                         <p className="text-xs text-gray-300 font-medium">{tip.text}</p>
                         <span className="text-[9px] font-bold text-gray-500 uppercase mt-1 block">{tip.time}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default MyLearning;
