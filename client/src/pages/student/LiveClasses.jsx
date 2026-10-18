import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  Play, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  Monitor, 
  BarChart3, 
  FileText,
  Radio,
  Timer,
  Mic,
  MoreVertical,
  Activity
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/ui';

const LiveSessionCard = ({ session, isLive, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 hover:border-purple-500/30 transition-all group relative"
  >
    <div className="h-48 relative">
      <img src={session.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={session.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
      
      <div className="absolute top-4 left-4 flex gap-2">
        {isLive ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500 rounded-full text-[10px] font-black text-white shadow-lg shadow-red-500/20">
            <Radio size={10} className="animate-pulse" /> LIVE NOW
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-black text-white shadow-lg">
            <Timer size={10} /> {session.countdown}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
         <div className="w-8 h-8 rounded-full border-2 border-[#020617] overflow-hidden shadow-xl">
            <img src={session.instructorImg} className="w-full h-full object-cover" alt="instructor" />
         </div>
         <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
            {session.instructor}
         </span>
      </div>
    </div>
    
    <div className="p-6 space-y-4">
      <h3 className="font-bold text-lg leading-tight group-hover:text-purple-400 transition-colors">{session.title}</h3>
      
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-1">
               <Users size={12} className="text-purple-400" /> {session.participants} Students
            </div>
            <div className="flex items-center gap-1">
               <Clock size={12} className="text-cyan-400" /> {session.duration}
            </div>
         </div>
      </div>

      <Button variant={isLive ? "gradient" : "outline"} className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest group-hover:shadow-2xl transition-all">
        {isLive ? "Join Classroom" : "Remind Me"}
      </Button>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="glass-card p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all group">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-lg border border-white/5 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">{title}</h4>
    <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
  </div>
);

const LiveClasses = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const schedule = [
    { time: "09:00 AM", title: "Advanced ML Concepts", instructor: "Dr. Sarah", color: "border-purple-500 bg-purple-500/10" },
    { time: "11:30 AM", title: "UX Research in AI", instructor: "Marcus V.", color: "border-cyan-500 bg-cyan-500/10" },
    { time: "02:00 PM", title: "Natural Language Lab", instructor: "Lena S.", color: "border-blue-500 bg-blue-500/10" },
    { time: "04:30 PM", title: "AI Ethics Symposium", instructor: "Alex R.", color: "border-indigo-500 bg-indigo-500/10" },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="relative h-[400px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full animate-pulse-slow" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-400 mb-8 uppercase tracking-[0.2em]"
          >
            <Radio size={14} className="animate-pulse" /> 12 Sessions Live Now
          </motion.div>
          <motion.h1 
            className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-none"
          >
            Immersive <span className="text-gradient">Live Learning.</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed"
          >
            Experience the future of education with real-time AI collaboration, spatial audio, and interactive digital labs.
          </motion.p>
        </div>
      </motion.section>

      {/* Ongoing Live Sessions */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 shadow-lg shadow-red-500/20">
                <Activity size={20} className="animate-pulse" />
              </div>
              Ongoing Now
           </h2>
           <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Global Live Feed</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: 'Generative AI Deep Dive', instructor: 'Marcus V.', instructorImg: 'https://i.pravatar.cc/100?u=marcus', participants: '1.2k', duration: '1.5h', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
             { title: 'UI/UX for Spatial Computing', instructor: 'Dr. Sarah Chen', instructorImg: 'https://i.pravatar.cc/100?u=sarah', participants: '850', duration: '2h', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' }
           ].map((session, i) => (
             <LiveSessionCard key={i} session={session} isLive={true} delay={0.1 * i} />
           ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Upcoming Classes */}
          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                <Calendar size={20} />
              </div>
              Coming Up Today
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
               {[
                 { title: 'Neural Networks Laboratory', instructor: 'Lena S.', instructorImg: 'https://i.pravatar.cc/100?u=lena', participants: '450', duration: '1h', countdown: 'In 2h', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800' },
                 { title: 'Prompt Engineering Lab', instructor: 'Alex R.', instructorImg: 'https://i.pravatar.cc/100?u=alex', participants: '300', duration: '1.5h', countdown: 'In 4h', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' }
               ].map((session, i) => (
                 <LiveSessionCard key={i} session={session} isLive={false} delay={0.1 * i} />
               ))}
            </div>
          </section>

          {/* Weekly Schedule Timetable */}
          <section>
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
                  <Clock size={20} />
                </div>
                Schedule Timetable
             </h2>
             <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4">
                {schedule.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border-l-4 hover:bg-white/5 transition-all cursor-pointer group gap-4 bg-white/[0.02] border-white/5">
                     <div className="flex items-center gap-6">
                        <div className="text-sm font-black text-gray-500 w-20">{item.time}</div>
                        <div className={`w-1 h-10 rounded-full ${item.color.split(' ')[0].replace('border-', 'bg-')}`} />
                        <div>
                           <h4 className="font-bold text-lg group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h4>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.instructor}</p>
                        </div>
                     </div>
                     <Badge color={item.color.includes('purple') ? 'purple' : 'cyan'}>Remind Me</Badge>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-12">
          {/* AI Classroom Assistant */}
          <GlassCard className="bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-white/10 animate-float">
                  <Sparkles size={28} />
                </div>
                <div>
                   <h3 className="font-bold text-lg leading-none">Class Assistant</h3>
                   <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest leading-none">Auto-Summaries<br/>Active</span>
                </div>
              </div>
              
              <div className="space-y-6">
                 <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                    <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Live Highlights</h5>
                    <ul className="space-y-3 text-xs font-medium text-gray-400 leading-relaxed">
                       <li className="flex gap-2">
                          <span className="text-purple-500">•</span>
                          <span>Discussion on Transformers peaked at 10:45 AM.</span>
                       </li>
                       <li className="flex gap-2">
                          <span className="text-purple-500">•</span>
                          <span>AI generating real-time transcript...</span>
                       </li>
                    </ul>
                 </div>
                 
                 <Button variant="outline" className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Open Smart Chat
                 </Button>
              </div>
            </div>
          </GlassCard>

          {/* Recorded Sessions */}
          <section>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <Play className="text-cyan-500" size={24} fill="currentColor" /> Replays
            </h2>
            <div className="space-y-4">
               {[
                 { title: 'Intro to GANs', date: 'Yesterday', duration: '1.2h' },
                 { title: 'Ethics in AI', date: '2 days ago', duration: '45m' }
               ].map((replay, i) => (
                 <div key={i} className="glass-card p-4 rounded-3xl border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                          <Play size={16} fill="currentColor" />
                       </div>
                       <div>
                          <h4 className="font-bold text-sm leading-tight group-hover:text-purple-400 transition-colors">{replay.title}</h4>
                          <p className="text-[9px] font-bold text-gray-500 uppercase mt-1 tracking-widest">{replay.date} • {replay.duration}</p>
                       </div>
                    </div>
                    <MoreVertical size={16} className="text-gray-700" />
                 </div>
               ))}
            </div>
          </section>

          {/* Features Showcase */}
          <section className="space-y-4">
             <FeatureCard 
               icon={Monitor} 
               title="Spatial Audio" 
               description="Immersive 3D audio for real classroom feel." 
               color="bg-purple-500/10 text-purple-400"
             />
             <FeatureCard 
               icon={BarChart3} 
               title="Live Polls" 
               description="Interactive real-time student engagement." 
               color="bg-cyan-500/10 text-cyan-400"
             />
             <FeatureCard 
               icon={FileText} 
               title="AI Notes" 
               description="Auto-generated notes synced to video." 
               color="bg-indigo-500/10 text-indigo-400"
             />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveClasses;
