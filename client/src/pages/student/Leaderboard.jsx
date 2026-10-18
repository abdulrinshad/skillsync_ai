import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Star, 
  TrendingUp, 
  Award, 
  Target, 
  ChevronRight, 
  Clock, 
  Users, 
  BarChart3,
  BrainCircuit,
  Timer,
  ChevronDown,
  Sparkles
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
  { name: 'Mon', xp: 250 },
  { name: 'Tue', xp: 480 },
  { name: 'Wed', xp: 320 },
  { name: 'Thu', xp: 600 },
  { name: 'Fri', xp: 850 },
  { name: 'Sat', xp: 400 },
  { name: 'Sun', xp: 520 },
];

const RankCard = ({ student, rank, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ x: 5, scale: 1.01 }}
    className={`glass-card p-4 rounded-3xl border-white/5 hover:border-purple-500/30 transition-all group flex items-center justify-between cursor-pointer ${rank <= 3 ? 'bg-gradient-to-r from-purple-900/10 to-transparent' : ''}`}
  >
    <div className="flex items-center gap-6">
       <div className={`w-10 text-center font-black text-xl ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-600' : 'text-gray-600'}`}>
          {rank === 1 ? <Crown className="mx-auto animate-bounce" size={24} /> : `#${rank}`}
       </div>
       <div className="relative">
          <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 ${rank === 1 ? 'border-yellow-500' : 'border-white/10'} group-hover:border-purple-500 transition-colors shadow-2xl`}>
             <img src={student.avatar} className="w-full h-full object-cover" alt="avatar" />
          </div>
          {rank === 1 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[#020617]">
               <Sparkles size={12} />
            </div>
          )}
       </div>
       <div>
          <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors leading-tight flex items-center gap-2">
            {student.name}
            {student.isPro && <Badge color="purple" className="text-[8px] px-1.5 py-0">PRO</Badge>}
          </h3>
          <div className="flex items-center gap-4 mt-1">
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Flame size={12} className="text-orange-500" /> {student.streak} Day Streak
             </div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Target size={12} className="text-cyan-400" /> Lvl. {student.level}
             </div>
          </div>
       </div>
    </div>
    
    <div className="text-right pr-4">
       <div className="text-xl font-black text-white group-hover:text-purple-400 transition-colors">{student.xp.toLocaleString()}</div>
       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">XP Points</div>
    </div>
  </motion.div>
);

const AchievementBadge = ({ icon: Icon, title, color }) => (
  <div className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group cursor-pointer hover:bg-white/5 transition-all">
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-lg border border-white/5 group-hover:scale-110 transition-transform group-hover:rotate-6`}>
      <Icon size={32} />
    </div>
    <h4 className="font-bold text-sm uppercase tracking-wide leading-tight group-hover:text-white transition-colors">{title}</h4>
  </div>
);

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState('Global');
  const categories = ['Global', 'Coding', 'AI', 'Design', 'Marketing', 'Business'];

  const leaderboardData = [
    { name: 'Alex Rivera', xp: 24850, streak: 42, level: 32, avatar: 'https://i.pravatar.cc/100?u=alex', isPro: true },
    { name: 'Sarah Chen', xp: 22100, streak: 12, level: 28, avatar: 'https://i.pravatar.cc/100?u=sarah', isPro: true },
    { name: 'Marcus V.', xp: 19500, streak: 28, level: 25, avatar: 'https://i.pravatar.cc/100?u=marcus', isPro: false },
    { name: 'Lena Smith', xp: 18200, streak: 5, level: 22, avatar: 'https://i.pravatar.cc/100?u=lena', isPro: true },
    { name: 'John Doe', xp: 15400, streak: 18, level: 19, avatar: 'https://i.pravatar.cc/100?u=john', isPro: false }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#020617] to-purple-900/40 opacity-80" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black text-yellow-500 mb-8 uppercase tracking-[0.2em]"
          >
            <Trophy size={14} className="animate-bounce" /> Season 12 Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-none"
          >
            Compete. Learn. <span className="text-gradient">Rise.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed"
          >
            Join the global arena of elite learners. Rise through the ranks, earn XP, and claim your place among the best.
          </motion.p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          {/* Category Selector */}
          <section className="flex items-center gap-4 p-1.5 bg-white/5 rounded-3xl border border-white/5 overflow-x-auto no-scrollbar">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 {cat}
               </button>
             ))}
          </section>

          {/* Leaderboard List */}
          <section className="space-y-6">
             {leaderboardData.map((student, i) => (
               <RankCard key={i} student={student} rank={i + 1} delay={0.1 * i} />
             ))}
             <div className="flex justify-center mt-8">
                <Button variant="outline" className="px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 group">
                   Show Full Ranking <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                </Button>
             </div>
          </section>

          {/* Achievement Showcase */}
          <section>
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center text-yellow-500">
                   <Award size={20} />
                </div>
                Elite Achievements
             </h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                <AchievementBadge icon={Crown} title="Top Learner" color="bg-yellow-500/10 text-yellow-500" />
                <AchievementBadge icon={Zap} title="Quiz Master" color="bg-purple-500/10 text-purple-400" />
                <AchievementBadge icon={BrainCircuit} title="AI Genius" color="bg-cyan-500/10 text-cyan-400" />
                <AchievementBadge icon={Flame} title="Streak God" color="bg-orange-500/10 text-orange-500" />
             </div>
          </section>
        </div>

        {/* Right Column: Stats & Motivation */}
        <div className="space-y-12">
          
          {/* Weekly Race Widget */}
          <section className="glass-card p-8 rounded-[2.5rem] border-purple-500/20 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-cyan-900/10" />
             <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none">Weekly<br/><span className="text-gray-500">XP Race</span></h3>
                      <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         <Timer size={14} className="text-purple-400" /> 2d 14h Left
                      </div>
                   </div>
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner">
                      <TrendingUp size={24} />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-5 bg-white/5 rounded-[2rem] border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                               <img src="https://i.pravatar.cc/100?u=me" alt="me" />
                            </div>
                            <span className="text-xs font-black">Your Rank: #12</span>
                         </div>
                         <Badge color="purple">TOP 10%</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '75%' }}
                           className="h-full bg-gradient-to-r from-purple-600 to-cyan-500"
                         />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">540 XP to next rank</p>
                   </div>
                   <Button variant="gradient" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                      Boost My Progress
                   </Button>
                </div>
             </div>
          </section>

          {/* Personal Analytics Chart */}
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="font-black text-lg uppercase tracking-tight">XP Trends</h3>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400">
                   <BarChart3 size={20} />
                </div>
             </div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        fontSize: '10px'
                      }}
                    />
                    <Area type="monotone" dataKey="xp" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="text-xl font-black">4.8h</div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg. Daily</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="text-xl font-black">92%</div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accuracy</div>
                </div>
             </div>
          </section>

          {/* AI Motivation Widget */}
          <GlassCard className="bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-white/10 animate-float">
                      <BrainCircuit size={32} />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-white">AI Coach</h3>
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest leading-none">Smart Advice<br/>Ready</span>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-5 bg-black/20 rounded-[2rem] border border-white/5">
                      <p className="text-xs font-medium text-gray-300 leading-relaxed italic">
                        "Your coding accuracy increased by <span className="text-purple-400 font-black">15%</span> this week. Reach the top 5 by completing the 'AI Advanced' quiz tonight."
                      </p>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group/tip cursor-pointer hover:bg-white/10 transition-colors">
                         <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover/tip:bg-purple-500 group-hover/tip:text-white transition-all">
                            <Star size={14} />
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New XP Goal: 1,000 pts</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group/tip cursor-pointer hover:bg-white/10 transition-colors">
                         <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover/tip:bg-cyan-500 group-hover/tip:text-white transition-all">
                            <Clock size={14} />
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Early Bird Bonus Active</span>
                      </div>
                   </div>
                </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
