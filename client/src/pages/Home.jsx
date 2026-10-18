import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  BsArrowRight, BsPlayFill, BsCheckCircleFill, BsStars, 
  BsLightningFill, BsCpuFill, BsShieldLockFill, BsGlobe,
  BsTwitter, BsGithub, BsLinkedin, BsDiscord
} from 'react-icons/bs';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { 
  Sparkles, 
  BrainCircuit, 
  Video, 
  MessageSquare, 
  Trophy, 
  Activity, 
  Zap,
  Play,
  Cpu,
  Layers,
  Bot,
  BarChart3,
  LineChart,
  MessageSquare as MessageSquareIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Sub-components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-dark py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <BsStars className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            SkillSync AI
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          {['Features', 'Dashboard', 'Courses', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <Link to="/login" className="px-6 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all">
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {['Features', 'Dashboard', 'Courses', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white text-lg">
                  {item}
                </a>
              ))}
              <Link to="/login" className="w-full py-3 bg-white text-black rounded-xl font-bold text-center">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroDashboardMockup = () => {
  return (
    <div className="relative w-full h-full bg-[#020617]/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/10 flex flex-col group">
      {/* Fake Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
        <div className="flex items-center gap-4">
           <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
           </div>
           <div className="w-32 h-6 bg-white/5 rounded-full border border-white/5" />
        </div>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Fake Sidebar */}
        <div className="w-20 border-r border-white/5 p-4 space-y-6 flex flex-col items-center">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className={`w-10 h-10 rounded-xl ${i === 1 ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/5 text-gray-600'} flex items-center justify-center border`}>
                {i === 1 ? <Sparkles size={18} /> : <div className="w-4 h-4 bg-current rounded-sm opacity-20" />}
             </div>
           ))}
        </div>

        {/* Fake Main Content */}
        <div className="flex-1 p-8 overflow-hidden relative">
           {/* Floating AI Insight Card */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute top-10 right-10 w-64 glass p-6 rounded-3xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.1)] z-20"
           >
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Suggestion</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                "Based on your 98% progress in React basics, I've prepared an advanced Next.js workshop."
              </p>
           </motion.div>

           {/* Main Stats Grid */}
           <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Courses Completed', val: '12', color: 'purple' },
                { label: 'Learning Streak', val: '24 Days', color: 'cyan' }
              ].map((stat, i) => ( stat &&
                <div key={i} className="glass p-6 rounded-3xl border-white/5 group-hover:border-white/10 transition-colors">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{stat.label}</p>
                   <h4 className="text-2xl font-black text-white">{stat.val}</h4>
                   <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full bg-${stat.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                      />
                   </div>
                </div>
              ))}
           </div>

           {/* Course Cards Mockup */}
           <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass p-4 rounded-2xl border-white/5 space-y-4">
                   <div className="aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-white/10 rounded" />
                      <div className="h-2 w-1/2 bg-white/5 rounded" />
                   </div>
                </div>
              ))}
           </div>

           {/* Floating AI Bubble */}
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-premium rounded-full shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center"
           >
              <Bot size={28} className="text-white" />
           </motion.div>
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="h-10 border-t border-white/5 flex items-center justify-between px-6 bg-white/[0.01]">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">System Online</span>
         </div>
         <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">AI Tutoring Active</span>
      </div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background Orbs */}
      <motion.div style={{ y: y1 }} className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-sm font-medium text-purple-400 mb-8"
        >
          <BsStars />
          <span>New: AI-Powered Learning Paths are here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          Master any skill with <br />
          <span className="text-gradient">Artificial Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          SkillSync AI combines world-class curriculum with advanced AI tutoring to create 
          a personalized learning experience that adapts to your pace and style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/register" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all text-center">
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Start Learning Free <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <button className="px-8 py-4 glass text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
            <BsPlayFill className="text-xl" /> Watch Demo
          </button>
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
          className="mt-24 relative max-w-5xl mx-auto group"
        >
          {/* Animated Glow Backdrop */}
          <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 blur-[100px] rounded-[5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-20 glass p-2.5 rounded-[2.5rem] overflow-hidden border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="aspect-video relative overflow-hidden rounded-[2rem]">
               <HeroDashboardMockup />
            </div>
          </div>

          {/* Floating UI Elements Around Preview */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-12 -left-12 w-48 glass p-4 rounded-2xl border-white/10 z-30 hidden lg:block"
          >
             <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">Live Progress</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full">
                <div className="h-full w-2/3 bg-cyan-400" />
             </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -right-10 w-56 glass p-5 rounded-2xl border-white/10 z-30 hidden lg:block"
          >
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                   <Sparkles size={16} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white">Neural Path</span>
             </div>
             <div className="space-y-1.5">
                <div className="h-1 w-full bg-white/5 rounded" />
                <div className="h-1 w-4/5 bg-white/5 rounded" />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Marquee = () => {
  const companies = ['Meta', 'Google', 'Amazon', 'Netflix', 'Tesla', 'OpenAI', 'Microsoft'];
  return (
    <div className="py-20 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Trusted by engineering teams at</p>
      </div>
      <div className="flex gap-20 animate-marquee whitespace-nowrap">
        {[...companies, ...companies].map((company, i) => (
          <span key={i} className="text-3xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default">
            {company}
          </span>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group perspective-1000"
    >
      <motion.div
        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
        className="glass p-10 rounded-[3rem] border-white/5 h-full relative overflow-hidden transition-all duration-500 group-hover:border-purple-500/30 group-hover:shadow-[0_0_50px_rgba(139,92,246,0.15)]"
      >
        {/* Interactive Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
          }}
        />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all duration-500 shadow-inner">
            <Icon size={32} />
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
          <p className="text-gray-400 leading-relaxed font-medium text-sm">{desc}</p>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />
      </motion.div>
    </motion.div>
  );
};

const PromotionalShowcase = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-[#020617]">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-xs font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            Next Generation AI Learning
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-white">
            Your Personal <br />
            <span className="text-gradient">AI Learning</span> <br />
            Companion.
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            Experience an educational ecosystem that evolves with you. Our neural tutoring system 
            understands your cognitive patterns, creating an optimized path to mastery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-6">
            <Link to="/register" className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] text-center">
              Start Learning Now
            </Link>
            <button className="px-10 py-5 glass text-white rounded-2xl font-black text-sm uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={14} className="fill-white" />
              </div>
              Watch AI Demo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
             <div>
                <h4 className="text-3xl font-black text-white">99.2%</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Accuracy Rate</p>
             </div>
             <div>
                <h4 className="text-3xl font-black text-white">24/7</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Instant Support</p>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Holographic Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative group"
        >
          {/* Main Container */}
          <div className="relative z-10 glass-dark rounded-[3.5rem] p-6 border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.1)] aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-500/10 opacity-50" />
            
            {/* Mockup Top Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center">
                     <Bot size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SkillSync AI Assistant</span>
               </div>
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
               </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-12 gap-4 h-full">
               {/* Left Column: Stats & Chats */}
               <div className="col-span-4 space-y-4">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="glass p-4 rounded-2xl border-white/10"
                  >
                     <LineChart size={20} className="text-cyan-400 mb-2" />
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: ['20%', '80%', '40%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-cyan-400" />
                     </div>
                     <span className="text-[8px] font-black uppercase text-gray-500 mt-2 block">Learning Velocity</span>
                  </motion.div>
                  
                  <div className="glass p-4 rounded-2xl border-white/10 space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex gap-2">
                          <div className="w-5 h-5 rounded-md bg-white/5 flex-shrink-0" />
                          <div className="space-y-1 w-full">
                             <div className="h-1.5 w-full bg-white/10 rounded" />
                             <div className="h-1.5 w-1/2 bg-white/5 rounded" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Right Column: Video/Main UI */}
               <div className="col-span-8 space-y-4">
                  <div className="relative aspect-video glass rounded-3xl border-white/10 overflow-hidden group/vid">
                     <img 
                       src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000" 
                       className="w-full h-full object-cover opacity-40 group-hover/vid:scale-110 transition-transform duration-700" 
                       alt="Mockup"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                        >
                           <Play size={16} className="fill-white text-white ml-1" />
                        </motion.div>
                     </div>
                     <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,1)]" />
                     </div>
                  </div>

                  <div className="glass p-6 rounded-[2.5rem] border-white/10 relative overflow-hidden group/ai">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[30px] rounded-full" />
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                           <Sparkles size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Real-time Insights</span>
                     </div>
                     <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                       "I've noticed you're excelling at Neural Architecture. Let's explore Gradient Descent optimizations next..."
                     </p>
                  </div>
               </div>
            </div>

            {/* Floating Particles/Elements */}
            <div className="absolute inset-0 pointer-events-none">
               {[...Array(5)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ 
                     y: [0, -100], 
                     opacity: [0, 1, 0],
                     x: [0, (i % 2 === 0 ? 50 : -50)] 
                   }}
                   transition={{ 
                     duration: 3 + i, 
                     repeat: Infinity, 
                     delay: i * 0.5 
                   }}
                   className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
                   style={{ 
                     left: `${20 + (i * 15)}%`, 
                     bottom: '10%' 
                   }}
                 />
               ))}
            </div>
          </div>

          {/* Background Glows */}
          <div className="absolute -inset-10 bg-purple-600/20 blur-[100px] rounded-full group-hover:bg-purple-600/30 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Note Generator",
      desc: "Transform your lecture recordings and PDFs into intelligent, structured notes and mind maps automatically."
    },
    {
      icon: BrainCircuit,
      title: "AI Quiz Generator",
      desc: "Challenge yourself with custom quizzes generated instantly from your study materials to reinforce learning."
    },
    {
      icon: Video,
      title: "Live Classes",
      desc: "Join interactive, high-definition live sessions with industry experts and real-time collaborative coding."
    },
    {
      icon: MessageSquare,
      title: "Realtime Doubt Chat",
      desc: "Never get stuck again. Our AI-integrated chat provides instant explanations and troubleshooting 24/7."
    },
    {
      icon: Trophy,
      title: "Gamification",
      desc: "Stay motivated with XP, streaks, and global leaderboards. Compete with students worldwide as you learn."
    },
    {
      icon: Activity,
      title: "Smart Tracking",
      desc: "Visualize your journey with predictive analytics that show your mastery levels and career readiness."
    }
  ];

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-6"
          >
            <Zap size={12} />
            <span>Advanced Ecosystem</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Everything Needed To <br />
            <span className="text-gradient">Learn Smarter.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed"
          >
            Experience a cohesive AI-powered learning environment designed to accelerate 
            your professional growth and technical mastery.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FeatureCard 
              key={i} 
              icon={f.icon} 
              title={f.title} 
              desc={f.desc} 
              delay={i * 0.1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AIOSInterface = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section id="dashboard" className="py-32 px-6 relative overflow-hidden bg-[#020617]">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
           {[...Array(20)].map((_, i) => (
             <motion.circle
               key={i}
               cx={Math.random() * 1000}
               cy={Math.random() * 1000}
               r="1.5"
               fill="#8b5cf6"
               animate={{ 
                 opacity: [0.2, 0.5, 0.2],
                 scale: [1, 1.5, 1] 
               }}
               transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
             />
           ))}
           <motion.path 
             d="M0,500 Q250,250 500,500 T1000,500" 
             stroke="url(#grad1)" 
             strokeWidth="0.5" 
             fill="none" 
             animate={{ d: ["M0,500 Q250,250 500,500 T1000,500", "M0,500 Q250,750 500,500 T1000,500", "M0,500 Q250,250 500,500 T1000,500"] }}
             transition={{ duration: 10, repeat: Infinity }}
           />
           <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#8b5cf6" />
                 <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6"
          >
             <Cpu size={12} />
             <span>Core Intelligence OS v4.0</span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white">
            Beyond <span className="text-gradient">Dashboards.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            An intelligent operating system that lives and breathes with your learning journey. 
            Real-time synchronization, neural pathing, and zero-latency feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start relative h-[800px] lg:h-[700px]">
          {/* Main Holographic Panel */}
          <motion.div 
            style={{ y: y1, rotateX: rotate }}
            className="lg:col-span-7 h-full glass-dark rounded-[3.5rem] border-white/10 p-8 shadow-[0_0_100px_rgba(139,92,246,0.15)] relative overflow-hidden flex flex-col group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5" />
             
             {/* HUD Header */}
             <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Bot size={24} className="text-white" />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-white">Neural Assistant</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                         <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active Link Established</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <span className="text-[8px] font-black text-gray-600 uppercase block mb-1">Latency</span>
                      <span className="text-xs font-black text-cyan-400">12ms</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[8px] font-black text-gray-600 uppercase block mb-1">Sync</span>
                      <span className="text-xs font-black text-purple-400">99.8%</span>
                   </div>
                </div>
             </div>

             {/* Live AI Chat Interface */}
             <div className="flex-1 space-y-8 relative z-10 overflow-y-auto no-scrollbar py-4">
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <Bot size={16} />
                   </div>
                   <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed max-w-[85%] font-medium">
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        Analyzing your current progress in "Advanced Neural Networks". I've detected a 15% increase in your comprehension of backpropagation. Ready to proceed to Transformers?
                      </motion.span>
                   </div>
                </div>

                <div className="flex gap-4 justify-end">
                   <div className="p-5 rounded-3xl bg-purple-600/90 text-white text-xs leading-relaxed max-w-[85%] font-bold shadow-xl shadow-purple-500/20">
                      Yes, let's start with Attention Mechanisms.
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <Sparkles size={16} />
                   </div>
                   <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed max-w-[85%] font-medium italic">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Generating personalized study path...
                      </motion.span>
                   </div>
                </div>
             </div>

             {/* HUD Footer */}
             <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                <div className="relative">
                   <div className="absolute inset-y-0 left-5 flex items-center text-purple-400">
                      <Zap size={14} />
                   </div>
                   <input 
                     readOnly
                     value="Ask AI tutor anything..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none"
                   />
                </div>
             </div>
          </motion.div>

          {/* Right Column: Floating Widgets */}
          <div className="lg:col-span-5 h-full space-y-8 relative">
             {/* XP & Progress Widget */}
             <motion.div 
               style={{ y: y2 }}
               className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden group shadow-2xl"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full group-hover:bg-cyan-500/20 transition-all" />
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10">
                      <Trophy size={24} />
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Mastery</span>
                      <h4 className="text-3xl font-black text-white mt-1">28,450 <span className="text-xs text-cyan-400 font-black">XP</span></h4>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-widest">
                         <span className="text-gray-400">Skill Level 84</span>
                         <span className="text-white">Next: 30,000 XP</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: '84%' }}
                           transition={{ duration: 2, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Coding', val: '92%' },
                        { label: 'Theory', val: '78%' },
                        { label: 'AI Sync', val: '99%' }
                      ].map((s, i) => (
                        <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                           <div className="text-[10px] font-black text-white mb-1">{s.val}</div>
                           <div className="text-[7px] font-black text-gray-600 uppercase tracking-widest">{s.label}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>

             {/* Live Course Feed Widget */}
             <motion.div 
               style={{ y: y1 }}
               className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden flex-1 shadow-2xl"
             >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 border border-white/10">
                      <Layers size={20} />
                   </div>
                   <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Path Suggestions</h4>
                </div>
                <div className="space-y-4">
                   {[
                     { title: 'Generative AI Mastery', type: 'Course', difficulty: 'Advanced' },
                     { title: 'Vector DB Architecture', type: 'Live Session', difficulty: 'Expert' }
                   ].map((item, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">{item.type}</span>
                           <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.difficulty}</span>
                        </div>
                        <h5 className="text-xs font-black text-white group-hover:text-purple-400 transition-colors">{item.title}</h5>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                   View Full Neural Map
                </button>
             </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Data Stream at Bottom */}
      <div className="mt-20 border-t border-white/5 pt-10 overflow-hidden whitespace-nowrap opacity-20">
         <motion.div 
           animate={{ x: [0, -1000] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="flex gap-20 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]"
         >
            {[...Array(10)].map((_, i) => (
              <span key={i}>AI_SYNC_ACTIVE: CORE_LEVEL_84 // SYSTEM_STABLE_12ms // NEURAL_PATH_GENERATING...</span>
            ))}
         </motion.div>
      </div>
    </section>
  );
};

const Showcase = AIOSInterface;

const Courses = () => {
  const courses = [
    { title: "Advanced Neural Networks", level: "Expert", price: "$99", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
    { title: "AI-First UX Design", level: "Intermediate", price: "$79", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
    { title: "Prompt Engineering 101", level: "Beginner", price: "Free", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section id="courses" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Popular <span className="text-gradient">Courses</span></h2>
            <p className="text-gray-400">Master the most in-demand AI skills with our premium curriculum.</p>
          </div>
          <button className="px-8 py-3 glass rounded-full hover:bg-white/10 transition-all font-semibold">View All Courses</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-3xl overflow-hidden border-white/5 hover:border-white/20 transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 px-3 py-1 glass-dark rounded-full text-xs font-bold">{c.level}</div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">{c.title}</h3>
                <div className="flex justify-between items-center">
                   <span className="text-2xl font-bold text-white">{c.price}</span>
                   <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-cyan-400 transition-colors">
                     <BsArrowRight />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple <span className="text-gradient">Pricing</span></h2>
          <p className="text-gray-400">Choose the plan that fits your learning journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: "0", features: ["Access to free courses", "Community access", "Basic AI tutor"] },
            { name: "Pro", price: "29", features: ["All courses", "Advanced AI tutor", "Priority support", "Certs"], highlight: true },
            { name: "Enterprise", price: "99", features: ["Team dashboard", "Custom AI paths", "API access", "White-labeling"] }
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[2.5rem] border transition-all ${plan.highlight ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-purple-500/50 relative overflow-hidden' : 'glass border-white/5'}`}
            >
              {plan.highlight && <div className="absolute top-6 right-6 px-3 py-1 bg-purple-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular</div>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-400">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <BsCheckCircleFill className="text-purple-400 text-sm" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`w-full py-4 rounded-2xl font-bold transition-all text-center block ${plan.highlight ? 'bg-white text-black hover:bg-gray-200' : 'glass text-white hover:bg-white/10'}`}>
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "How does the AI personalization work?", a: "Our AI analyzes your interaction patterns, quiz results, and coding speed to dynamically adjust the difficulty and focus of the curriculum." },
    { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time from your billing settings. You'll retain access until the end of the current period." },
    { q: "Are the certifications industry-recognized?", a: "Absolutely. Our certifications are backed by industry leaders and include verified blockchain hashes for authenticity." }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Common <span className="text-gradient">Questions</span></h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden border-white/5">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <span className="font-bold">{faq.q}</span>
                <span className={`text-2xl transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-gray-400"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <BsStars className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SkillSync AI</span>
            </div>
            <p className="text-gray-400 max-w-xs mb-8">
              Empowering the next generation of creators with AI-driven learning experiences.
            </p>
            <div className="flex gap-4">
              {[BsTwitter, BsGithub, BsLinkedin, BsDiscord].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:text-purple-400 transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-gray-500">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certifications</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Scholarships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentorship</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-gray-500">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          © 2024 SkillSync AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="bg-[#020617] text-white selection:bg-purple-500/30">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <PromotionalShowcase />
        <Features />
        <Showcase />
        <Courses />
        <Pricing />
        <FAQ />
        
        {/* Final CTA */}
        <section className="py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-cyan-500/20 pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">Ready to start your <br /><span className="text-gradient">AI Journey?</span></h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto relative z-10">Join 50,000+ learners already mastering the future with SkillSync AI.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/register" className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all text-center">Get Started for Free</Link>
              <button className="px-10 py-5 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">Contact Sales</button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
