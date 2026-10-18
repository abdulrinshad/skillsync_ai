import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Book, 
  PlayCircle, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  Cpu, 
  LifeBuoy, 
  ChevronRight, 
  Play, 
  Clock, 
  ExternalLink, 
  Users, 
  Zap, 
  Sparkles,
  Send,
  PlusCircle,
  MessageCircle,
  PhoneCall,
  Mail,
  Video,
  FileText,
  UserCircle,
  AlertCircle
} from 'lucide-react';
import { GlassCard, Button, Badge, Input } from '../../components/ui';

const HelpCategoryCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer overflow-hidden relative"
  >
    <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/5 blur-[50px] group-hover:bg-purple-600/10 transition-colors" />
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-600/10 transition-all border border-white/5 mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-lg font-black mb-2 text-white group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
      Browse Articles <ChevronRight size={14} />
    </div>
  </motion.div>
);

const ArticleCard = ({ title, preview, author, readTime, isNew }) => (
  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      {isNew && <Badge color="cyan">NEW</Badge>}
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
        <Clock size={12} /> {readTime} min read
      </div>
    </div>
    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{preview}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[8px] font-bold">
          {author[0]}
        </div>
        <span className="text-[10px] font-medium text-gray-400">{author}</span>
      </div>
      <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Read More</button>
    </div>
  </div>
);

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const categories = [
    { icon: UserCircle, title: 'Account Issues', description: 'Login problems, password resets, and profile management.' },
    { icon: Book, title: 'Courses & Learning', description: 'Accessing materials, assignment submissions, and progress.' },
    { icon: PlayCircle, title: 'Live Classes', description: 'Joining sessions, technical requirements, and schedules.' },
    { icon: CreditCard, title: 'Payments & Billing', description: 'Subscription plans, invoices, and payment methods.' },
    { icon: Award, title: 'Certificates', description: 'Claiming certificates, sharing achievements, and validation.' },
    { icon: Cpu, title: 'AI Features', description: 'Using AI notes, quiz generation, and intelligent tutoring.' },
    { icon: ShieldCheck, title: 'Security & Privacy', description: 'Two-factor auth, data privacy, and account protection.' },
    { icon: AlertCircle, title: 'Technical Problems', description: 'Platform bugs, video player issues, and mobile app support.' },
  ];

  const popularArticles = [
    { title: 'Getting Started with AI Notes', preview: 'Learn how to generate intelligent summaries and mind maps from your lecture recordings.', author: 'Sarah Drasner', readTime: 5, isNew: true },
    { title: 'Troubleshooting Live Stream Lag', preview: 'A comprehensive guide to optimizing your connection for high-definition live classes.', author: 'Alex Rivera', readTime: 8, isNew: false },
    { title: 'Managing Your Pro Subscription', preview: 'How to upgrade, downgrade, or update your billing information easily.', author: 'James Wilson', readTime: 4, isNew: false },
    { title: 'Earning Mastery Certificates', preview: 'Everything you need to know about completing courses and receiving your credentials.', author: 'Emma Watson', readTime: 6, isNew: false },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 relative">
      {/* Hero Section */}
      <section className="relative h-[450px] rounded-[4rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50" />
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-purple-600/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -45, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-1/4 -right-1/4 w-[100%] h-[100%] bg-cyan-600/10 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-cyan-400 mb-8 mx-auto border border-white/10 shadow-2xl backdrop-blur-2xl animate-float"
          >
            <LifeBuoy size={32} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
          >
            How Can We <span className="text-gradient">Help You?</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base lg:text-lg font-medium max-w-2xl mx-auto mb-12"
          >
            Get instant answers from our AI assistant or explore our knowledge base to master the SkillSync AI platform.
          </motion.p>

          {/* Smart Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 blur-2xl group-focus-within:opacity-100 opacity-50 transition-opacity rounded-3xl" />
            <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center shadow-2xl overflow-hidden">
               <div className="pl-6 text-gray-500">
                  <Search size={22} />
               </div>
               <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search for help articles, tutorials, or FAQs..."
                 className="w-full bg-transparent border-none py-4 px-4 text-white focus:outline-none placeholder:text-gray-600 font-medium"
               />
               <Button variant="gradient" className="rounded-full px-8 py-3.5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/20">Find Solutions</Button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Trending:</span>
              {['Refund Policy', 'API Access', 'Dark Mode', 'Certificate Link'].map(tag => (
                <button key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">{tag}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="space-y-10">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Explore Categories</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Browse help topics by category</p>
          </div>
          <Button variant="outline" className="rounded-2xl text-[10px] font-black border-white/5">View All Categories</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <HelpCategoryCard key={i} {...cat} delay={i * 0.05} />
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Popular Articles */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <FileText size={20} />
              </div>
              Popular Help Articles
            </h2>
            <Badge color="purple">TOP SEARCHES</Badge>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
             {popularArticles.map((article, i) => (
               <ArticleCard key={i} {...article} />
             ))}
          </div>

          {/* Video Tutorials */}
          <div className="pt-10 space-y-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <Video size={20} />
              </div>
              Video Tutorials
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
               {[
                 { title: 'Mastering AI Tutoring', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop' },
                 { title: 'Platform Walkthrough', duration: '08:20', thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop' }
               ].map((video, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl mb-4">
                       <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="tutorial" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Play size={24} className="text-white fill-white ml-1" />
                          </div>
                       </div>
                       <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white">
                          {video.duration}
                       </div>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{video.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Official SkillSync Tutorial</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Support Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Create Ticket */}
          <GlassCard className="rounded-[3rem] border-purple-500/20 p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all" />
            <div className="relative z-10">
               <h3 className="text-lg font-black mb-2">Need Direct Help?</h3>
               <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">Can't find what you're looking for? Open a support ticket and our team will get back to you within 4 hours.</p>
               <Button variant="gradient" className="w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/25">
                 <PlusCircle size={18} className="mr-2" /> Create Support Ticket
               </Button>
            </div>
          </GlassCard>

          {/* Ticket Status */}
          <GlassCard className="rounded-[3rem] border-white/5 p-8 space-y-6">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Recent Tickets</h4>
            <div className="space-y-4">
              {[
                { id: '#SK-8821', title: 'Payment failed for Pro...', status: 'Resolved', date: '2 days ago' },
                { id: '#SK-9012', title: 'Certificate download err...', status: 'In Progress', date: 'Today' }
              ].map((ticket, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-purple-400">{ticket.id}</span>
                    <Badge color={ticket.status === 'Resolved' ? 'green' : 'orange'}>{ticket.status}</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors truncate">{ticket.title}</h5>
                  <p className="text-[10px] text-gray-500 mt-2">{ticket.date}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">View All Tickets</button>
          </GlassCard>

          {/* Community Support */}
          <GlassCard className="rounded-[3rem] border-white/5 p-8 space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                  <Users size={20} />
                </div>
                <div>
                   <h4 className="text-sm font-black">Community Support</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Join the discussion</p>
                </div>
             </div>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">Join 20k+ students in our Discord community and get help from experts.</p>
             <Button variant="outline" className="w-full rounded-2xl text-[10px] font-black uppercase tracking-widest border-white/5">
                Join Student Forum
             </Button>
          </GlassCard>
        </aside>
      </div>

      {/* Contact Section */}
      <section className="pt-20 border-t border-white/5">
        <div className="grid lg:grid-cols-3 gap-8">
           {[
             { icon: MessageCircle, title: 'Live Chat Support', desc: 'Chat with our agents in realtime.', action: 'Start Chat', availability: 'Available Now', response: 'Under 2 mins' },
             { icon: Mail, title: 'Email Support', desc: 'Send us a detailed message.', action: 'Send Email', availability: '24/7 Monitoring', response: 'Within 4 hours' },
             { icon: PhoneCall, title: 'Schedule a Call', desc: 'Book a 15-min technical session.', action: 'Book Now', availability: 'Pro Members Only', response: 'Next: 2:00 PM' }
           ].map((contact, i) => (
             <GlassCard key={i} className="rounded-[2.5rem] border-white/5 p-8 text-center space-y-6 hover:border-cyan-500/30 transition-all group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-600/10 transition-all mx-auto border border-white/5">
                   <contact.icon size={32} />
                </div>
                <div>
                   <h3 className="text-lg font-black">{contact.title}</h3>
                   <p className="text-xs text-gray-500 font-medium mt-2">{contact.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em]">
                      <span className="text-gray-600">Availability</span>
                      <span className="text-cyan-400">{contact.availability}</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em]">
                      <span className="text-gray-600">Avg. Response</span>
                      <span className="text-purple-400">{contact.response}</span>
                   </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl text-[10px] font-black border-white/5 group-hover:bg-white/5">{contact.action}</Button>
             </GlassCard>
           ))}
        </div>
      </section>

      {/* AI Floating Assistant Widget */}
      <AnimatePresence>
        {!isAIChatOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAIChatOpen(true)}
            className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-premium rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center z-[100] group"
          >
             <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" />
             <Cpu size={32} className="text-white animate-float" />
             <div className="absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ask AI for Help
             </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 right-10 w-96 h-[600px] glass-morphism rounded-[3rem] shadow-[0_0_50px_rgba(139,92,246,0.3)] z-[100] border border-purple-500/20 flex flex-col overflow-hidden"
          >
             {/* Chat Header */}
             <div className="p-6 bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                      <Cpu size={20} />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white">AI Support Bot</h4>
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                         <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Always Online</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setIsAIChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                   <ChevronRight size={18} className="rotate-90" />
                </button>
             </div>

             {/* Chat Content */}
             <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-black/40">
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 flex-shrink-0 border border-purple-500/20">
                      <Cpu size={16} />
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed max-w-[85%]">
                      Hello Alex! I'm your AI Support Assistant. How can I help you with your SkillSync experience today?
                   </div>
                </div>

                <div className="flex flex-col gap-2 pl-11">
                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Suggested Topics:</span>
                   {['Reset my password', 'Certificate issues', 'Pro plan benefits'].map(tip => (
                     <button key={tip} className="w-fit px-4 py-2 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-purple-400 hover:bg-purple-500/10 transition-all text-left">
                        {tip}
                     </button>
                   ))}
                </div>

                <div className="flex gap-3 justify-end">
                   <div className="p-4 rounded-2xl bg-purple-600 text-white text-xs leading-relaxed max-w-[85%] font-medium">
                      I'm having trouble downloading my Neural Networks certificate.
                   </div>
                </div>

                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 flex-shrink-0 border border-purple-500/20">
                      <Cpu size={16} />
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed max-w-[85%]">
                      <Sparkles size={14} className="text-yellow-500 mb-2" />
                      I see that you've completed 98% of the Neural Networks course. You just need to finish the final assessment to unlock your certificate. Would you like me to take you to the quiz?
                   </div>
                </div>
             </div>

             {/* Chat Input */}
             <div className="p-6 bg-[#020617] border-t border-white/5">
                <div className="relative">
                   <input 
                     placeholder="Type your question..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all"
                   />
                   <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all">
                      <Send size={18} />
                   </button>
                </div>
                <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest mt-4">AI may generate incorrect info. Use with care.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpCenter;
