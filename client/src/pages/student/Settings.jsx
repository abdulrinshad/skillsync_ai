import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  CreditCard, 
  Cpu, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Mail, 
  Smartphone, 
  Globe, 
  Zap, 
  Sparkles,
  Monitor,
  Eye,
  Trash2,
  Download,
  Key,
  ShieldAlert,
  SmartphoneNfc,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Moon,
  Sun,
  Layout,
  RefreshCcw,
  Target,
  Brain,
  Layers,
  History,
  PlusCircle
} from 'lucide-react';
import { GlassCard, Button, Badge, Input } from '../../components/ui';

const SettingToggle = ({ icon: Icon, title, description, active, onToggle, badge }) => (
  <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-600/10 transition-all border border-white/5 relative">
        <Icon size={24} />
        {badge && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-[#020617]" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-white leading-none">{title}</h4>
          {badge && <Badge color="cyan" className="px-1.5 py-0 text-[8px]">{badge}</Badge>}
        </div>
        <p className="text-[10px] text-gray-500 font-medium tracking-tight mt-1">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full relative transition-all duration-500 ${active ? 'bg-gradient-to-r from-purple-600 to-cyan-500' : 'bg-white/10'}`}
    >
      <motion.div 
        animate={{ x: active ? 26 : 4 }}
        className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-lg"
      />
    </button>
  </div>
);

const SectionHeader = ({ title, subtitle, icon: Icon, color = "purple" }) => {
  const colorMap = {
    purple: "bg-purple-600/20 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-600/20 text-cyan-400 border-cyan-500/20",
    orange: "bg-orange-600/20 text-orange-400 border-orange-500/20",
    green: "bg-green-600/20 text-green-400 border-green-500/20"
  };

  return (
    <div className="flex items-center gap-6 mb-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border animate-float ${colorMap[color]}`}>
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    classes: true,
    ai: true,
    weekly: true
  });
  const [twoFactor, setTwoFactor] = useState(true);
  const [theme, setTheme] = useState('Dark');
  const [accentColor, setAccentColor] = useState('#8b5cf6');

  const sidebarItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'appearance', label: 'Appearance & UI', icon: Palette },
    { id: 'ai', label: 'AI Preferences', icon: Brain },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'account', label: 'Account Management', icon: Layers },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-[3.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50" />
        
        {/* Animated background shapes */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"
        />

        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 mx-auto border border-white/10 shadow-2xl backdrop-blur-xl animate-float"
          >
            <Sparkles size={28} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight"
          >
            Manage Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Experience.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm lg:text-base font-medium max-w-xl mx-auto"
          >
            Fine-tune your AI-powered learning workspace. Customize security, aesthetics, and intelligent assistance to match your workflow.
          </motion.p>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
           <div className="glass-card p-3 rounded-[2.5rem] border-white/5 sticky top-32">
              <div className="p-4 mb-4">
                <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">Navigation</h2>
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${activeSection === item.id ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <item.icon size={18} className={activeSection === item.id ? 'text-white' : 'text-gray-500'} />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-white/5">
                  <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                    <LogOut size={18} /> Logout All Sessions
                  </button>
              </div>
           </div>
        </aside>

        {/* Settings Content Area */}
        <main className="lg:col-span-9">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeSection}
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit="hidden"
               className="space-y-10"
             >
                {activeSection === 'profile' && (
                  <section className="glass-card p-10 rounded-[3.5rem] border-white/5 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] -mr-32 -mt-32" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
                       <div className="relative group cursor-pointer">
                          <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-white/10 group-hover:border-purple-500 transition-all shadow-2xl relative">
                             <img src="https://i.pravatar.cc/300?u=skillsync" className="w-full h-full object-cover" alt="profile" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={32} className="text-white" />
                             </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-[#020617] group-hover:scale-110 transition-transform">
                             <PlusCircle size={20} />
                          </div>
                       </div>
                       <div className="flex-1 space-y-3 text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                             <h3 className="text-3xl font-black">Alex Rivera</h3>
                             <Badge color="purple" className="w-fit mx-auto sm:mx-0">PRO MEMBER</Badge>
                          </div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Student ID: SS-9921-2026</p>
                          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400">Master Learner</div>
                             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-400">UI/UX Expert</div>
                          </div>
                       </div>
                       <Button variant="outline" className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-white/5">Update Photo</Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                       <Input label="Full Name" defaultValue="Alex Rivera" placeholder="Enter your full name" />
                       <Input label="Username" defaultValue="arivera_ai" placeholder="Choose a username" icon={User} />
                       <Input label="Email Address" defaultValue="alex.rivera@skillsync.ai" placeholder="Your email address" icon={Mail} />
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Timezone</label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all appearance-none cursor-pointer">
                             <option className="bg-[#020617]">UTC -07:00 (Pacific Time)</option>
                             <option className="bg-[#020617]">UTC +00:00 (GMT)</option>
                             <option className="bg-[#020617]">UTC +05:30 (IST)</option>
                          </select>
                       </div>
                       <div className="sm:col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Personal Bio</label>
                          <textarea rows={4} defaultValue="Passionate about AI-driven design and large-scale engineering. Currently mastering advanced neural networks and generative AI patterns." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium resize-none text-gray-300" />
                       </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 gap-4">
                       <button className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Discard Changes</button>
                       <Button variant="gradient" className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20">Save Profile</Button>
                    </div>
                  </section>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-8">
                     <SectionHeader 
                       title="Security & Access" 
                       subtitle="Protect your account with advanced authentication"
                       icon={ShieldCheck}
                     />
                     
                     <div className="grid lg:grid-cols-2 gap-8">
                        {/* Security Score */}
                        <GlassCard className="rounded-[2.5rem] border-white/5 flex flex-col justify-between overflow-hidden relative group">
                           <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-500/10 blur-[60px] group-hover:bg-green-500/20 transition-colors" />
                           <div>
                              <div className="flex items-center justify-between mb-8">
                                 <h4 className="text-sm font-black uppercase tracking-widest">Security Pulse</h4>
                                 <Badge color="green">EXCELLENT</Badge>
                              </div>
                              <div className="flex items-end gap-2 mb-2">
                                 <span className="text-5xl font-black text-white">94</span>
                                 <span className="text-gray-500 font-bold mb-1">/100</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: '94%' }}
                                   className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                 />
                              </div>
                              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Your account security is in the top 2% of users. AI suggests enabling biometrics for 100/100 score.</p>
                           </div>
                           <Button variant="outline" className="w-full mt-8 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5">View Insights</Button>
                        </GlassCard>

                        {/* Password Change */}
                        <GlassCard className="rounded-[2.5rem] border-white/5 space-y-6">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <Key size={16} className="text-purple-400" /> Update Password
                           </h4>
                           <div className="space-y-4">
                              <Input type="password" label="Current Password" placeholder="••••••••" />
                              <Input type="password" label="New Password" placeholder="••••••••" />
                           </div>
                           <Button variant="primary" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest">Update Credentials</Button>
                        </GlassCard>
                     </div>

                     <div className="grid gap-6">
                        <SettingToggle 
                          icon={SmartphoneNfc} 
                          title="Two-Factor Authentication" 
                          description="Add an extra layer of security by requiring a verification code." 
                          active={twoFactor}
                          onToggle={() => setTwoFactor(!twoFactor)}
                          badge="RECOMMENDED"
                        />
                        <SettingToggle 
                          icon={Fingerprint} 
                          title="Biometric Login" 
                          description="Use FaceID or Fingerprint to quickly access your dashboard." 
                          active={false}
                          onToggle={() => {}}
                        />
                        <SettingToggle 
                          icon={ShieldAlert} 
                          title="Advanced Threat Protection" 
                          description="AI monitors for suspicious login patterns and unusual activity." 
                          active={true}
                          onToggle={() => {}}
                        />
                     </div>

                     {/* Login Activity */}
                     <GlassCard className="rounded-[2.5rem] border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <Clock size={16} className="text-cyan-400" /> Recent Login Activity
                           </h4>
                           <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:underline">See All</button>
                        </div>
                        <div className="space-y-4">
                           {[
                              { device: 'MacBook Pro 16"', location: 'San Francisco, US', time: 'Active now', icon: Monitor, current: true },
                              { device: 'iPhone 15 Pro', location: 'London, UK', time: '2 hours ago', icon: Smartphone, current: false },
                              { device: 'Chrome on Windows', location: 'Tokyo, JP', time: 'Yesterday at 09:42', icon: Globe, current: false },
                           ].map((login, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                                       <login.icon size={20} />
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-2">
                                          <h5 className="text-xs font-bold text-white">{login.device}</h5>
                                          {login.current && <Badge color="purple" className="text-[8px] py-0">CURRENT</Badge>}
                                       </div>
                                       <p className="text-[10px] text-gray-500 font-medium">{login.location} • {login.time}</p>
                                    </div>
                                 </div>
                                 {!login.current && (
                                    <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                                       <LogOut size={16} />
                                    </button>
                                 )}
                              </div>
                           ))}
                        </div>
                     </GlassCard>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div className="space-y-8">
                     <SectionHeader 
                       title="Notification Preferences" 
                       subtitle="Control how and when you hear from SkillSync AI"
                       icon={Bell}
                     />
                     <div className="grid gap-6">
                        <SettingToggle 
                          icon={Mail} 
                          title="Email Summaries" 
                          description="Receive weekly intelligent summaries of your learning progress." 
                          active={notifications.email}
                          onToggle={() => setNotifications({...notifications, email: !notifications.email})}
                        />
                        <SettingToggle 
                          icon={Smartphone} 
                          title="Mobile Push Notifications" 
                          description="Get instant alerts for live classes, quizzes, and new content." 
                          active={notifications.push}
                          onToggle={() => setNotifications({...notifications, push: !notifications.push})}
                        />
                        <SettingToggle 
                          icon={Zap} 
                          title="Live Session Reminders" 
                          description="We'll notify you 15 minutes before any scheduled live class starts." 
                          active={notifications.classes}
                          onToggle={() => setNotifications({...notifications, classes: !notifications.classes})}
                        />
                        <SettingToggle 
                          icon={Cpu} 
                          title="AI Skill Suggestions" 
                          description="Let our AI nudge you when it finds courses that match your career path." 
                          active={notifications.ai}
                          onToggle={() => setNotifications({...notifications, ai: !notifications.ai})}
                          badge="NEW"
                        />
                        <SettingToggle 
                          icon={History} 
                          title="Weekly Performance Reports" 
                          description="Detailed PDF reports on your productivity and focus metrics." 
                          active={notifications.weekly}
                          onToggle={() => setNotifications({...notifications, weekly: !notifications.weekly})}
                        />
                     </div>
                  </div>
                )}

                {activeSection === 'appearance' && (
                  <div className="space-y-10">
                     <SectionHeader 
                       title="Appearance & UI" 
                       subtitle="Customize your workspace aesthetics"
                       icon={Palette}
                       color="cyan"
                     />
                     
                     <div className="grid gap-8">
                        <GlassCard className="rounded-[3rem] border-white/5 p-10 space-y-10">
                           <div className="space-y-6">
                              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                 <Monitor size={16} className="text-purple-400" /> Platform Theme
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                 {[
                                    { name: 'Dark', icon: Moon, desc: 'Optimized for focus' },
                                    { name: 'Light', icon: Sun, desc: 'High contrast' },
                                    { name: 'Glass', icon: Sparkles, desc: 'Dynamic translucency' }
                                 ].map(t => (
                                   <button 
                                     key={t.name}
                                     onClick={() => setTheme(t.name)}
                                     className={`p-6 rounded-[2.5rem] border transition-all text-center group relative overflow-hidden ${theme === t.name ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
                                   >
                                      <t.icon size={32} className={`mx-auto mb-4 ${theme === t.name ? 'text-black' : 'opacity-40 group-hover:opacity-100'}`} />
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">{t.name}</span>
                                      <span className={`text-[8px] font-bold ${theme === t.name ? 'text-gray-600' : 'text-gray-600'}`}>{t.desc}</span>
                                      {theme === t.name && (
                                         <motion.div layoutId="theme-active" className="absolute inset-0 border-2 border-purple-500 rounded-[2.5rem] pointer-events-none" />
                                      )}
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="pt-10 border-t border-white/5 space-y-6">
                              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                 <Zap size={16} className="text-cyan-400" /> Accent Color
                              </h4>
                              <div className="flex flex-wrap gap-4">
                                 {[
                                    { color: '#8b5cf6', name: 'Royal Purple' },
                                    { color: '#06b6d4', name: 'Cyber Cyan' },
                                    { color: '#f43f5e', name: 'Ruby Red' },
                                    { color: '#10b981', name: 'Emerald' },
                                    { color: '#f59e0b', name: 'Amber' },
                                    { color: '#ec4899', name: 'Neon Pink' }
                                 ].map(c => (
                                   <button 
                                     key={c.color} 
                                     onClick={() => setAccentColor(c.color)}
                                     className={`group relative flex flex-col items-center gap-2`}
                                   >
                                      <div 
                                        style={{ backgroundColor: c.color }} 
                                        className={`w-14 h-14 rounded-2xl cursor-pointer transition-all flex items-center justify-center ${accentColor === c.color ? 'ring-4 ring-white ring-offset-4 ring-offset-[#020617] scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                                      >
                                         {accentColor === c.color && <CheckCircle2 size={20} className="text-white" />}
                                      </div>
                                      <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity mt-2">{c.name}</span>
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="pt-10 border-t border-white/5 space-y-6">
                              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                 <Layout size={16} className="text-gray-400" /> Layout Preferences
                              </h4>
                              <div className="grid sm:grid-cols-2 gap-6">
                                 <SettingToggle 
                                   icon={RefreshCcw} 
                                   title="Compact Mode" 
                                   description="Reduces padding and font sizes for maximum data density." 
                                   active={false}
                                   onToggle={() => {}}
                                 />
                                 <SettingToggle 
                                   icon={Eye} 
                                   title="Motion Effects" 
                                   description="Toggle Framer Motion animations across the dashboard." 
                                   active={true}
                                   onToggle={() => {}}
                                 />
                              </div>
                           </div>
                        </GlassCard>
                     </div>
                  </div>
                )}

                {activeSection === 'ai' && (
                  <div className="space-y-10">
                     <SectionHeader 
                       title="AI Learning Preferences" 
                       subtitle="Tailor your intelligent study companion"
                       icon={Brain}
                     />
                     
                     <GlassCard className="rounded-[3.5rem] border-purple-500/20 relative overflow-hidden group p-10">
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/10 blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000" />
                        
                        <div className="relative z-10 space-y-12">
                           <div className="grid lg:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14} className="text-purple-400" /> Intelligence Focus
                                 </h4>
                                 <div className="flex flex-col gap-3">
                                    {[
                                       { id: 'accuracy', title: 'Deep Accuracy', desc: 'Prioritize factual correctness and detailed explanations.' },
                                       { id: 'speed', title: 'Conversational', desc: 'Focus on natural dialogue and fast response times.' },
                                       { id: 'visual', title: 'Visual First', desc: 'Generate charts, diagrams and code snippets often.' }
                                    ].map(mode => (
                                      <button 
                                        key={mode.id} 
                                        className={`flex items-start gap-4 p-5 rounded-[2rem] border transition-all text-left ${mode.id === 'accuracy' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'}`}
                                      >
                                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${mode.id === 'accuracy' ? 'bg-black/5 text-black' : 'bg-white/5 text-gray-500'}`}>
                                            {mode.id === 'accuracy' ? <ShieldCheck size={18} /> : mode.id === 'speed' ? <Zap size={18} /> : <Palette size={18} />}
                                         </div>
                                         <div>
                                            <h5 className="text-xs font-black uppercase tracking-widest mb-1">{mode.title}</h5>
                                            <p className="text-[10px] font-medium opacity-70">{mode.desc}</p>
                                         </div>
                                      </button>
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-8">
                                 <div className="space-y-6">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                       <Sparkles size={14} className="text-yellow-500" /> Learning Style
                                    </h4>
                                    <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex">
                                       {['Fast-Paced', 'Balanced', 'Deep Dive'].map(style => (
                                         <button 
                                           key={style}
                                           className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${style === 'Balanced' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                                         >
                                            {style}
                                         </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="space-y-6">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                       <Monitor size={14} className="text-cyan-400" /> AI Interface
                                    </h4>
                                    <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex">
                                       {['Floating', 'Docked', 'Invisible'].map(ui => (
                                         <button 
                                           key={ui}
                                           className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ui === 'Floating' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                                         >
                                            {ui}
                                         </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-10 border-t border-white/5 grid sm:grid-cols-2 gap-6">
                              <SettingToggle 
                                icon={Globe} 
                                title="Predictive Roadmaps" 
                                description="AI will proactively suggest career moves based on your mastery." 
                                active={true}
                                onToggle={() => {}}
                              />
                              <SettingToggle 
                                icon={Sparkles} 
                                title="Auto-Generated Quizzes" 
                                description="Automatically create quizzes after you finish a video lesson." 
                                active={true}
                                onToggle={() => {}}
                              />
                           </div>
                        </div>
                     </GlassCard>
                  </div>
                )}

                {activeSection === 'billing' && (
                  <div className="space-y-8">
                     <SectionHeader 
                       title="Subscription & Billing" 
                       subtitle="Manage your plan and payment history"
                       icon={CreditCard}
                     />
                     
                     <div className="grid lg:grid-cols-3 gap-8">
                        <GlassCard className="lg:col-span-2 rounded-[3rem] border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-[#020617] to-transparent p-10 flex flex-col sm:flex-row items-center justify-between gap-10 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-32 -mt-32" />
                           <div className="space-y-6 text-center sm:text-left relative z-10">
                              <Badge color="purple" className="px-4 py-1">PRO ANNUAL PLAN</Badge>
                              <h3 className="text-5xl font-black tracking-tight">SkillSync <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">PRO</span></h3>
                              <div className="space-y-2">
                                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Next renewal: May 15, 2027</p>
                                 <p className="text-xs text-gray-500 font-medium">$199.00 / year • Master Card •••• 4242</p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3 min-w-[200px] relative z-10">
                              <Button variant="gradient" className="w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/25">Upgrade to Elite</Button>
                              <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Cancel Subscription</button>
                           </div>
                        </GlassCard>

                        <GlassCard className="rounded-[3rem] border-white/5 p-10 space-y-8 flex flex-col justify-between">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-cyan-400" /> Pro Benefits
                           </h4>
                           <ul className="space-y-4">
                              {[
                                 'Unlimited AI Tutoring',
                                 'Advanced Career Maps',
                                 'Certificates of Mastery',
                                 'Early Access Features',
                                 'Cloud Study Lab'
                              ].map(f => (
                                 <li key={f} className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                       <CheckCircle2 size={12} />
                                    </div>
                                    {f}
                                 </li>
                              ))}
                           </ul>
                           <button className="w-full text-center text-[10px] font-black text-purple-400 uppercase tracking-widest hover:underline mt-4">View All Features</button>
                        </GlassCard>
                     </div>

                     <GlassCard className="rounded-[3rem] border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <History size={16} className="text-gray-400" /> Billing History
                           </h4>
                           <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:underline">Download All</button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <th className="pb-4 px-4">Invoice ID</th>
                                    <th className="pb-4 px-4">Date</th>
                                    <th className="pb-4 px-4">Amount</th>
                                    <th className="pb-4 px-4">Status</th>
                                    <th className="pb-4 px-4 text-right">Receipt</th>
                                 </tr>
                              </thead>
                              <tbody className="text-xs font-medium">
                                 {[
                                    { id: 'INV-2026-001', date: 'May 15, 2026', amount: '$199.00', status: 'Paid' },
                                    { id: 'INV-2025-042', date: 'May 15, 2025', amount: '$199.00', status: 'Paid' },
                                    { id: 'INV-2024-012', date: 'May 15, 2024', amount: '$149.00', status: 'Paid' },
                                 ].map((inv, i) => (
                                    <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                                       <td className="py-5 px-4 text-white">{inv.id}</td>
                                       <td className="py-5 px-4 text-gray-500">{inv.date}</td>
                                       <td className="py-5 px-4 text-white font-bold">{inv.amount}</td>
                                       <td className="py-5 px-4"><Badge color="green">{inv.status}</Badge></td>
                                       <td className="py-5 px-4 text-right">
                                          <button className="text-gray-500 hover:text-white transition-colors">
                                             <Download size={16} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </GlassCard>
                  </div>
                )}

                {activeSection === 'account' && (
                  <div className="space-y-10">
                     <SectionHeader 
                       title="Account Management" 
                       subtitle="Control your data and account status"
                       icon={Layers}
                       color="orange"
                     />
                     
                     <div className="grid lg:grid-cols-2 gap-8">
                        <GlassCard className="rounded-[3rem] border-white/5 p-10 space-y-8">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                              <Eye size={16} className="text-purple-400" /> Privacy Controls
                           </h4>
                           <div className="space-y-6">
                              <SettingToggle 
                                icon={Globe} 
                                title="Public Profile" 
                                description="Allow other students to see your certificates and XP." 
                                active={true}
                                onToggle={() => {}}
                              />
                              <SettingToggle 
                                icon={Search} 
                                title="Indexable Activity" 
                                description="Show up in search results and leaderboards." 
                                active={true}
                                onToggle={() => {}}
                              />
                           </div>
                        </GlassCard>

                        <GlassCard className="rounded-[3rem] border-white/5 p-10 space-y-8">
                           <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                              <Download size={16} className="text-cyan-400" /> Your Data
                           </h4>
                           <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Download a copy of your personal data, including course progress, AI chat history, and billing info.</p>
                           <div className="flex gap-4">
                              <Button variant="outline" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5">Export JSON</Button>
                              <Button variant="outline" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5">Request PDF</Button>
                           </div>
                        </GlassCard>
                     </div>

                     {/* Danger Zone */}
                     <section className="space-y-6">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
                           <AlertTriangle size={14} /> Danger Zone
                        </h4>
                        <GlassCard className="rounded-[3rem] border-red-500/20 bg-red-500/5 p-10">
                           <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                              <div className="space-y-2 text-center sm:text-left">
                                 <h5 className="text-xl font-black text-white">Delete Account</h5>
                                 <p className="text-[10px] text-gray-400 font-medium max-w-sm">This action is permanent. All your progress, certificates, and AI data will be wiped from our servers.</p>
                              </div>
                              <Button variant="outline" className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 border-red-500/20 hover:bg-red-500/10">Delete Permanently</Button>
                           </div>
                        </GlassCard>
                     </section>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Settings;
