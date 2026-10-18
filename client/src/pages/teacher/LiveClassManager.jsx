import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Video, VideoOff, Mic, MicOff, Settings, Users, MessageSquare, 
  Monitor, Radio, Calendar, BarChart2, Clock, Activity, Zap, Plus,
  ChevronRight, MoreVertical, Presentation, Share, Download, Sparkles,
  Search, Filter, ExternalLink, CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell
} from 'recharts';

// Mock UI components for this self-contained file.
// In a real scenario, these might be imported from '../../components/ui'
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
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'
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
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
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
      <div className="bg-gray-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-300 text-xs mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Data Mocks
const engagementData = [
  { time: '0m', score: 65, active: 40 },
  { time: '10m', score: 75, active: 55 },
  { time: '20m', score: 85, active: 70 },
  { time: '30m', score: 92, active: 85 },
  { time: '40m', score: 88, active: 80 },
  { time: '50m', score: 95, active: 90 },
  { time: '60m', score: 98, active: 95 },
];

const participationData = [
  { name: 'Mon', chat: 120, questions: 45, polls: 80 },
  { name: 'Tue', chat: 150, questions: 60, polls: 95 },
  { name: 'Wed', chat: 180, questions: 55, polls: 110 },
  { name: 'Thu', chat: 140, questions: 40, polls: 85 },
  { name: 'Fri', chat: 200, questions: 75, polls: 130 },
];

const upcomingClasses = [
  { id: 1, title: 'Advanced Neural Networks', course: 'Deep Learning Mastery', time: '10:00 AM', date: 'Today', students: 145, status: 'starting_soon' },
  { id: 2, title: 'React Performance Tuning', course: 'Frontend Pro', time: '2:30 PM', date: 'Today', students: 89, status: 'scheduled' },
  { id: 3, title: 'System Design Interview Prep', course: 'Tech Career Prep', time: '11:00 AM', date: 'Tomorrow', students: 210, status: 'scheduled' }
];

const recordedSessions = [
  { id: 1, title: 'Intro to Python Data Structures', duration: '1h 15m', views: 1240, date: '2 days ago', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80' },
  { id: 2, title: 'UX Design Fundamentals', duration: '55m', views: 890, date: '1 week ago', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80' },
  { id: 3, title: 'Cloud Architecture Basics', duration: '1h 30m', views: 1560, date: '2 weeks ago', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80' }
];

const LiveClassManager = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Alex Rivera', role: 'student', msg: 'The self-attention slides look incredible!', time: '13:42' },
    { id: 2, user: 'Chloe Jenkins', role: 'student', msg: 'Are GAN models covered next week?', time: '13:44' },
    { id: 3, user: 'AI Assistant', role: 'bot', msg: 'I noticed 3 students asking about GANs. Would you like to launch a quick poll?', time: '13:45' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && chatInput.trim() !== '') {
      setChatMessages([...chatMessages, { id: Date.now(), user: 'Dr. Sarah Chen', role: 'instructor', msg: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setChatInput('');
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

  return (
    <motion.div 
      className="space-y-8 pb-20 text-white min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* 1. Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Live Class Manager
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Schedule, manage, and monitor your live learning sessions with AI-powered analytics and low-latency streaming tools.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            AI Schedule Assistant
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar size={16} />
            Schedule New Class
          </Button>
          <Button 
            variant={isStreaming ? 'danger' : 'primary'} 
            className="flex items-center gap-2"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            <Radio size={16} className={isStreaming ? 'animate-pulse' : ''} />
            {isStreaming ? 'End Live Session' : 'Start Instant Class'}
          </Button>
        </div>
      </motion.div>

      {/* 2. Analytics Overview Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Upcoming Classes', value: '4', icon: Calendar, color: 'blue', trend: '+1 this week' },
          { title: 'Live Sessions Running', value: isStreaming ? '1' : '0', icon: Radio, color: isStreaming ? 'red' : 'gray', trend: isStreaming ? 'Active now' : 'None active' },
          { title: 'Total Participants', value: '1,248', icon: Users, color: 'purple', trend: '+12% vs last month' },
          { title: 'Avg Engagement Score', value: '92%', icon: Activity, color: 'cyan', trend: '+5% vs last month' },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-6 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:bg-${stat.color}-500/20 transition-all`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon size={24} />
              </div>
              <Badge color={stat.color} className="bg-transparent border-none text-[10px]">{stat.trend}</Badge>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Control & Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 4. Live Session Control Center */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Monitor className="text-cyan-400" /> Live Studio
              </h2>
              {isStreaming && (
                <Badge color="red" className="animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> LIVE
                </Badge>
              )}
            </div>
            
            <GlassCard className="rounded-[2rem] border-white/10 p-2 relative overflow-hidden bg-black/60 aspect-video flex flex-col justify-between group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />
              
              {/* Stream Overlay Top */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge color={isStreaming ? 'red' : 'purple'}>
                    {isStreaming ? 'BROADCASTING' : 'PRE-STAGE'}
                  </Badge>
                  <span className="text-xs font-bold text-gray-300 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    00:{isStreaming ? '14:22' : '00:00'}
                  </span>
                </div>
                {isStreaming && (
                  <div className="flex gap-2 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Users size={14} className="text-cyan-400" />
                    <span>245 Viewers</span>
                  </div>
                )}
              </div>

              {/* Stream Content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-8">
                {videoOn ? (
                  <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Host" className="w-full h-full rounded-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-gray-400 mb-4">
                    <VideoOff size={32} />
                  </div>
                )}
                <h3 className="font-extrabold text-2xl text-white tracking-tight">Advanced Neural Networks</h3>
                <p className="text-sm text-cyan-400 font-medium mt-1">Dr. Sarah Chen</p>
              </div>

              {/* Stage Controls */}
              <div className="relative z-10 p-4 flex justify-center">
                <div className="flex gap-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <button onClick={() => setVideoOn(!videoOn)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                    {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button onClick={() => setMicOn(!micOn)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <div className="w-px h-8 bg-white/10 self-center mx-1" />
                  <button className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                    <Presentation size={20} />
                  </button>
                  <button className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 6. & 11. Performance Dashboard & Participation Analytics */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-purple-400" /> Real-time Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-300">Engagement Score</h3>
                  <Badge color="green">Healthy</Badge>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-300">Weekly Participation</h3>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={participationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="chat" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="questions" stackId="a" fill="#06b6d4" />
                      <Bar dataKey="polls" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* 3. & 5. Upcoming Classes & Calendar View */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-400" /> Schedule
              </h2>
              <Button variant="outline" className="text-xs py-1.5">View Full Calendar</Button>
            </div>
            <GlassCard className="p-0 overflow-hidden border-white/10">
              <div className="divide-y divide-white/5">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex flex-col items-center justify-center border border-white/10">
                        <span className="text-xs font-bold text-gray-400 uppercase">{cls.date === 'Today' ? 'TODAY' : 'TMRW'}</span>
                        <span className="text-sm font-black text-white">{cls.time.split(' ')[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{cls.title}</h4>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                          <span className="text-purple-400">{cls.course}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="flex items-center gap-1"><Users size={14} /> {cls.students} registered</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      {cls.status === 'starting_soon' ? (
                        <Button variant="primary" className="w-full md:w-auto shadow-lg shadow-purple-500/20">Start Class</Button>
                      ) : (
                        <Button variant="secondary" className="w-full md:w-auto">Edit details</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* 7. Recorded Sessions Library */}
          <motion.div variants={itemVariants} className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Video className="text-green-400" /> Recent Recordings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recordedSessions.map((rec) => (
                <GlassCard key={rec.id} className="p-2 overflow-hidden group">
                  <div className="relative rounded-xl overflow-hidden aspect-video mb-3">
                    <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                        <Play size={20} className="text-white ml-1" />
                      </div>
                    </div>
                    <Badge color="purple" className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md">{rec.duration}</Badge>
                  </div>
                  <div className="px-2 pb-2">
                    <h4 className="font-bold text-sm truncate">{rec.title}</h4>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>{rec.views} views</span>
                      <span>{rec.date}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Interaction & Tools */}
        <div className="space-y-6">
          
          {/* 8. AI Teaching Assistant */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold">AI Co-Pilot</h3>
                  <p className="text-xs text-gray-400">Active monitoring</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 animate-pulse shrink-0" />
                  <p className="text-sm text-gray-300">Pacing seems slightly fast. Consider pausing for questions before moving to the next module.</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-300">Suggested poll ready: "Do you understand backpropagation?" <button className="text-cyan-400 hover:underline mt-1 block">Launch Poll</button></p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 9. Class Discussion & Q&A Board */}
          <motion.div variants={itemVariants} className="h-[450px]">
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-white/10">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-purple-400" />
                  <h3 className="font-bold text-sm">Live Discussion</h3>
                </div>
                <Badge color="green">14 Online</Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1 group">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${msg.role === 'instructor' ? 'text-purple-400' : msg.role === 'bot' ? 'text-cyan-400' : 'text-blue-400'}`}>
                        {msg.user}
                      </span>
                      {msg.role === 'instructor' && <Badge color="purple" className="px-1.5 py-0 text-[8px]">HOST</Badge>}
                      {msg.role === 'bot' && <Sparkles size={10} className="text-cyan-400" />}
                      <span className="text-[10px] text-gray-600">{msg.time}</span>
                    </div>
                    <div className={`text-sm p-3 rounded-2xl rounded-tl-sm w-fit max-w-[90%] ${
                      msg.role === 'instructor' 
                        ? 'bg-purple-500/20 text-purple-100 border border-purple-500/20' 
                        : msg.role === 'bot'
                        ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20'
                        : 'bg-white/5 text-gray-200 border border-white/5'
                    }`}>
                      {msg.msg}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/10 bg-black/40">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button 
                    onClick={() => handleSendMessage({ key: 'Enter' })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Share size={14} className="rotate-90" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 10. Interactive Tools Showcase */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Classroom Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="flex flex-col items-center justify-center gap-2 py-4 h-auto border border-white/5 hover:border-purple-500/30">
                  <BarChart2 size={24} className="text-purple-400" />
                  <span className="text-xs">Quick Poll</span>
                </Button>
                <Button variant="secondary" className="flex flex-col items-center justify-center gap-2 py-4 h-auto border border-white/5 hover:border-blue-500/30">
                  <monitor size={24} className="text-blue-400" />
                  <span className="text-xs">Whiteboard</span>
                </Button>
                <Button variant="secondary" className="flex flex-col items-center justify-center gap-2 py-4 h-auto border border-white/5 hover:border-cyan-500/30">
                  <CheckCircle size={24} className="text-cyan-400" />
                  <span className="text-xs">Quiz Mode</span>
                </Button>
                <Button variant="secondary" className="flex flex-col items-center justify-center gap-2 py-4 h-auto border border-white/5 hover:border-green-500/30">
                  <Users size={24} className="text-green-400" />
                  <span className="text-xs">Breakout</span>
                </Button>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default LiveClassManager;
