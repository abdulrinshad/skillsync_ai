import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Zap, 
  Sparkles, 
  Award, 
  Flame, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  MessageSquare,
  Trophy,
  Target,
  CheckCircle2,
  Clock3,
  Users,
  BrainCircuit,
  VolumeX,
  Volume2,
  ShieldAlert
} from 'lucide-react';
import { GlassCard, Button } from '../../components/ui';
import DailyGoalCard from '../../components/student/DailyGoalCard';
import ContinueLearningWidget from '../../components/student/ContinueLearningWidget';
import RecentlyViewedWidget from '../../components/student/RecentlyViewedWidget';
import EstimatedTimeCard from '../../components/student/EstimatedTimeCard';
import LastActivityCard from '../../components/student/LastActivityCard';

import TimelineWidget from '../../components/student/TimelineWidget';
import CalendarWidget from '../../components/student/CalendarWidget';





const StatCard = ({ icon: Icon, label, value, color, delay, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 rounded-[2rem] flex flex-col justify-between group cursor-pointer transition-all duration-300 overflow-hidden relative"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-[40px] -mr-8 -mt-8 group-hover:opacity-20 transition-opacity`} />
    
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color.replace('bg-', 'bg-')}/20 flex items-center justify-center text-xl shadow-inner border border-white/5`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={10} /> {trend}
        </span>
      )}
    </div>
    
    <div>
      <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const navigate = useNavigate();
  const [recentWatch, setRecentWatch] = React.useState(null);

  const [stats, setStats] = React.useState({
    totalCourses: 0,
    completedCourses: 0,
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
  });

  const [criticalReminders, setCriticalReminders] = React.useState([]);

  React.useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/reminders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const critical = data.filter(r => r.priority === "critical" && r.status !== "completed");
          setCriticalReminders(critical);
        }
      } catch (err) {
        console.error("Failed to fetch critical reminders", err);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/progress/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    const fetchRecentWatch = async () => {
      try {
        const token = localStorage.getItem("token_student") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/progress/continue-recent", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setRecentWatch(data);
        }
      } catch (err) {
        console.error("Failed to fetch recent watch progress", err);
      }
    };

    fetchStats();
    fetchRecentWatch();
    fetchReminders();
  }, []);


  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {criticalReminders.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-[2rem] flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-500/20 text-red-500 rounded-xl">
              <ShieldAlert size={18} />
            </span>
            <div>
              <h4 className="text-sm font-black text-white">{criticalReminders[0].title}</h4>
              <p className="text-xs text-gray-405 font-bold uppercase tracking-wider mt-0.5">{criticalReminders[0].description}</p>
            </div>
          </div>
          <Link to="/dashboard/reminders">
            <Button variant="primary" className="py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-650 hover:bg-red-500 text-white shrink-0">
              Go To Action
            </Button>
          </Link>
        </div>
      )}

      {/* Hero Welcome Section */}
      <motion.section 
        variants={itemVariants}
        className="relative rounded-[2.5rem] overflow-hidden p-8 lg:p-12 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-cyan-500/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-purple-400 mb-6"
            >
              <Sparkles size={14} /> AI-POWERED LEARNING SYSTEM
            </motion.div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight">
              Ready to master <br />
              <span className="text-gradient">Machine Learning?</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              You're in the top 5% of learners this week. Complete 2 more lessons to maintain your daily streak!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Button variant="gradient" className="px-8 py-4 text-sm rounded-2xl flex items-center gap-2 group">
                Continue Learning <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    className="w-10 h-10 rounded-full border-2 border-[#020617]" 
                    alt="user"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-white/5 border-2 border-[#020617] flex items-center justify-center text-[10px] font-bold">
                  +12k
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Learning right now</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 w-full lg:w-auto">
             <div className="glass-morphism p-6 rounded-[2rem] border-white/10 flex items-center gap-4 min-w-[240px]">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
                  <Flame size={28} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.currentStreak} Days</div>
                  <div className="text-xs text-gray-500 font-medium">Current Streak</div>
                </div>
             </div>
             <div className="glass-morphism p-6 rounded-[2rem] border-white/10 flex items-center gap-4 min-w-[240px]">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                  <Award size={28} />
                </div>
                <div>
                  <div className="text-2xl font-bold"># {stats.leaderboardRank || 1}</div>
                  <div className="text-xs text-gray-500 font-medium">Global Rank</div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="Total Study Time" value={`${stats.totalStudyHours || 0} hrs`} color="bg-blue-500" delay={0.1} />
        <StatCard icon={CheckCircle2} label="Courses Completed" value={stats.completedCourses} color="bg-cyan-500" delay={0.2} />
        <StatCard icon={Award} label="Certificates Earned" value={stats.certificatesEarned || 0} color="bg-orange-500" delay={0.3} />
        <StatCard icon={Zap} label="Total XP" value={stats.totalXP.toLocaleString()} color="bg-yellow-500" delay={0.4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Last Activity Resume Card */}
          <LastActivityCard />

          {/* Continue Learning Section */}
          <section>
            <ContinueLearningWidget />
          </section>


          {/* Recently Viewed History Widget */}
          <section>
            <RecentlyViewedWidget />
          </section>


          {/* Activity Timeline */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
                <TrendingUp size={20} />
              </div>
              Recent Activity
            </h2>
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5">
               <div className="space-y-8">
                  {[
                    { action: 'Completed Quiz', target: 'Introduction to CNNs', time: '2 hours ago', icon: BrainCircuit, color: 'text-purple-400 bg-purple-400/10' },
                    { action: 'Unlocked Certificate', target: 'Deep Learning Specialization', time: 'Yesterday', icon: Award, color: 'text-yellow-400 bg-yellow-400/10' },
                    { action: 'New Achievement', target: '7-Day Streak Master', time: '2 days ago', icon: Flame, color: 'text-orange-400 bg-orange-400/10' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 relative">
                       {i !== 2 && <div className="absolute left-6 top-10 bottom-[-32px] w-px bg-white/5" />}
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${item.color}`}>
                          <item.icon size={20} />
                       </div>
                       <div className="flex-1 pt-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-sm">{item.action}</h4>
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.time}</span>
                          </div>
                          <p className="text-sm text-gray-400 font-medium">{item.target}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar / Right Column */}
        <div className="space-y-10">
          {/* Daily Learning Goal Progress Ring */}
          <DailyGoalCard />

          {/* AI Assistant Widget */}
          <GlassCard className="bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-500/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-white/10 animate-float">
                  <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg leading-none">AI Learning Assistant</h3>
                   <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/5 mb-6">
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "I've noticed you're struggling with Backpropagation. I've prepared a 5-minute visual guide for you. Want to see it?"
                </p>
              </div>
              <div className="space-y-3">
                <Button variant="gradient" className="w-full text-xs py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> Yes, Show Me
                </Button>
                <Button variant="outline" className="w-full text-xs py-4 rounded-xl font-bold">Maybe later</Button>
              </div>
            </div>
          </GlassCard>

          {/* Estimated Completion Timer Card */}
          {recentWatch?.courseId?._id && (
            <EstimatedTimeCard courseId={recentWatch.courseId._id || recentWatch.courseId} />
          )}

          {/* Chronological Learning Timeline Preview */}
          <TimelineWidget />

          {/* Agenda Schedule Calendar Preview */}
          <CalendarWidget />

          {/* Study Statistics */}


          <section className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6 relative overflow-hidden bg-gradient-to-b from-[#0a0f24]/50 to-transparent">

             <div className="absolute top-0 right-0 p-6 text-purple-500/10 pointer-events-none">
                <Clock3 size={80} />
             </div>
             <h3 className="font-extrabold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Clock3 size={16} /> Study Statistics
             </h3>
             
             <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-lg font-black text-white">{stats.dailyStudyTime || 0}m</div>
                   <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Daily</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-lg font-black text-white">{stats.weeklyStudyTime || 0}m</div>
                   <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Weekly</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-lg font-black text-white">{stats.monthlyStudyTime || 0}m</div>
                   <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Monthly</div>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-semibold">
                <div className="flex justify-between">
                   <span className="text-gray-400">Quiz Average:</span>
                   <span className="text-cyan-400 font-extrabold">{stats.quizAverage || 0}%</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-400">Average Module Progress:</span>
                   <span className="text-purple-400 font-extrabold">{stats.averageModuleProgress || 0}%</span>
                </div>
             </div>
          </section>

          {/* Leaderboard Preview */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Trophy className="text-yellow-500" size={24} /> Top Learners
              </h2>
              <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest">Global</button>
            </div>
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
               {[
                 { name: 'Sarah Wilson', xp: '12,450', rank: 1, img: 'https://i.pravatar.cc/100?u=sarah', color: 'text-yellow-500' },
                 { name: 'David Kim', xp: '10,200', rank: 2, img: 'https://i.pravatar.cc/100?u=david', color: 'text-gray-400' },
                 { name: 'Emma Watson', xp: '9,800', rank: 3, img: 'https://i.pravatar.cc/100?u=emma', color: 'text-orange-600' },
               ].map((user, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ bg: 'rgba(255,255,255,0.03)' }}
                   className={`flex items-center gap-4 p-5 ${i !== 2 ? 'border-b border-white/5' : ''} cursor-pointer group transition-colors`}
                 >
                    <div className={`text-sm font-black ${user.color} w-4`}>#{user.rank}</div>
                    <div className="relative">
                      <img src={user.img} className="w-12 h-12 rounded-2xl border border-white/10 group-hover:border-purple-500/50 transition-colors" alt={user.name} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#020617]" />
                    </div>
                    <div className="flex-1">
                       <div className="text-sm font-bold group-hover:text-purple-400 transition-colors">{user.name}</div>
                       <div className="text-[10px] font-bold text-gray-500 tracking-wider mt-0.5">{user.xp} XP</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-white transition-colors" />
                 </motion.div>
               ))}
               <div className="p-5 bg-white/[0.02]">
                 <button className="w-full py-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-[0.2em]">Full Standings</button>
               </div>
            </div>
          </section>

          {/* Upcoming Live Classes */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="text-cyan-500" size={24} /> Live Sessions
            </h2>
            <div className="space-y-4">
               {[
                 { title: 'Generative AI Workshop', time: 'In 45 mins', instructor: 'Marcus V.', avatar: 'https://i.pravatar.cc/100?u=marcus' },
                 { title: 'Prompt Engineering Lab', time: 'Tomorrow', instructor: 'Lena S.', avatar: 'https://i.pravatar.cc/100?u=lena' }
               ].map((live, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ x: 4 }}
                   className="glass-card p-5 rounded-[2rem] border-white/5 flex items-center justify-between group cursor-pointer"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors">
                          <img src={live.avatar} className="w-full h-full object-cover" alt="avatar" />
                       </div>
                       <div>
                          <h4 className="font-bold text-sm group-hover:text-purple-400 transition-colors">{live.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{live.time}</span>
                          </div>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <Play size={14} fill="currentColor" />
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;

