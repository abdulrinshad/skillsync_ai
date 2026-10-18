import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Mic, 
  Plus, 
  MoreVertical, 
  Share2, 
  Download, 
  Copy, 
  Edit3, 
  BrainCircuit, 
  Zap, 
  History, 
  BarChart3, 
  BookOpen, 
  Star,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/ui';

const ToolCard = ({ icon: Icon, title, description, color }) => (
  <div className="glass-card p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-lg border border-white/5 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">{title}</h4>
    <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
  </div>
);

const NoteCard = ({ note, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all`}>
        <FileText size={24} />
      </div>
      <Badge color="cyan">AI GENERATED</Badge>
    </div>
    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">{note.title}</h3>
    <p className="text-xs text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">{note.snippet}</p>
    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      <div className="flex items-center gap-2">
        <History size={12} /> {note.date}
      </div>
      <div className="flex items-center gap-2">
        <Star size={12} className="text-yellow-500 fill-yellow-500" /> {note.rating}
      </div>
    </div>
  </motion.div>
);

const AINotes = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

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
        className="relative h-[300px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#020617] to-cyan-900/20 opacity-80" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-purple-400 mb-8 mx-auto border border-white/10 shadow-2xl animate-float"
          >
            <Sparkles size={32} />
          </motion.div>
          <motion.h1 
            className="text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-none"
          >
            AI-Powered <span className="text-gradient">Smart Notes.</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed"
          >
            Instantly transform lectures, videos, and complex topics into intelligent, structured study materials.
          </motion.p>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* AI Notes Generator Input */}
          <section>
             <GlassCard className="rounded-[3rem] p-10 border-purple-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                   <Cpu size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                         <label className="text-xs font-black text-purple-400 uppercase tracking-widest ml-1">Topic or Context</label>
                         <div className="relative group/input">
                            <Plus className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                            <input 
                               placeholder="What should I generate notes for? (e.g. Quantum Computing Basics)"
                               className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all font-medium placeholder:text-gray-600 shadow-2xl"
                            />
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            <Upload size={16} className="text-cyan-400" /> Upload Material
                         </button>
                         <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            <Mic size={16} className="text-purple-400" /> Voice Input
                         </button>
                      </div>
                      
                      <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        variant="gradient" 
                        className="px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl relative overflow-hidden min-w-[200px]"
                      >
                         {isGenerating ? (
                           <>
                             <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                             Generating...
                           </>
                         ) : (
                           <>Generate Notes <Sparkles size={18} /></>
                         )}
                      </Button>
                   </div>
                </div>
             </GlassCard>
          </section>

          {/* Recent Notes Grid */}
          <section>
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                   <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                      <History size={20} />
                   </div>
                   Recently Generated
                </h2>
                <div className="flex gap-4">
                   <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest">View Workspace</button>
                </div>
             </div>
             <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Neural Networks Architecture', snippet: 'A comprehensive deep dive into multi-layer perceptrons, backpropagation, and activation functions...', date: '2h ago', rating: 4.9 },
                  { title: 'AI Ethics in 2026', snippet: 'Analyzing the societal impact of large-scale agentic models and the importance of alignment...', date: 'Yesterday', rating: 4.8 },
                  { title: 'Vite & Tailwind v4', snippet: 'Optimizing modern frontend performance using the latest utility-first CSS features...', date: '3 days ago', rating: 5.0 },
                  { title: 'Reinforcement Learning', snippet: 'Explaining Markov Decision Processes and Q-learning algorithms through practical examples...', date: '1 week ago', rating: 4.7 }
                ].map((note, i) => (
                  <NoteCard key={i} note={note} delay={0.1 * i} />
                ))}
             </div>
          </section>

          {/* AI Insights & Revision Panel */}
          <section className="glass-card rounded-[3rem] p-10 border-white/5 bg-gradient-to-br from-[#020617] via-[#020617] to-cyan-900/10 group">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg border border-white/5">
                   <BrainCircuit size={24} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">AI Study Insights</h2>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={16} /> Quick Revision Points
                   </h4>
                   <ul className="space-y-4">
                      {[
                        "Gradient descent optimization paths",
                        "Normalization techniques for deep models",
                        "The role of attention mechanisms"
                      ].map((p, i) => (
                        <li key={i} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                           <div className="w-5 h-5 rounded-full border-2 border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-purple-500 group-hover:bg-purple-500 transition-all">
                              <CheckCircle2 size={10} className="opacity-0 group-hover:opacity-100 text-white" />
                           </div>
                           <span className="text-xs font-medium text-gray-300 leading-relaxed">{p}</span>
                        </li>
                      ))}
                   </ul>
                </div>
                
                <div className="space-y-6">
                   <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={16} /> Related Concepts
                   </h4>
                   <div className="flex flex-wrap gap-3">
                      {["Convolutional Layers", "Hyperparameters", "Backprop", "Loss Functions", "Tensors", "Autoencoders"].map((c, i) => (
                        <Badge key={i} color="cyan" className="px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-cyan-500/20 transition-all">
                           {c}
                        </Badge>
                      ))}
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <Button variant="outline" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                         Build Flashcard Deck
                      </Button>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-12">
          {/* Productivity Analytics */}
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5" />
             <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                   <h3 className="font-black text-lg uppercase tracking-tight leading-none">Productivity<br/><span className="text-gray-500">Analytics</span></h3>
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 shadow-inner">
                      <BarChart3 size={20} />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex items-end justify-between gap-2 h-24">
                      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.1 * i, duration: 1 }}
                          className={`flex-1 rounded-t-lg transition-all duration-500 ${i === 3 ? 'bg-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                        />
                      ))}
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div className="text-xl font-black">24</div>
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Notes Gen</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div className="text-xl font-black">85%</div>
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Efficiency</div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* AI Study Tools Showcase */}
          <section className="space-y-4">
             <h3 className="text-lg font-black mb-6 px-2 flex items-center gap-3">
                <Zap size={20} className="text-yellow-500" /> AI Toolbelt
             </h3>
             <ToolCard 
               icon={Sparkles} 
               title="Summarization" 
               description="Condense 2-hour lectures into 5-minute reads." 
               color="bg-purple-500/10 text-purple-400"
             />
             <ToolCard 
               icon={BrainCircuit} 
               title="Flashcard Gen" 
               description="Auto-generate quiz decks from your notes." 
               color="bg-cyan-500/10 text-cyan-400"
             />
             <ToolCard 
               icon={Mic} 
               title="Audio Transcribe" 
               description="Convert voice recordings to structured text." 
               color="bg-indigo-500/10 text-indigo-400"
             />
          </section>
          
          {/* Smart Revision Widget */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-6 shadow-lg border border-purple-500/20 animate-float">
                   <History size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Revision</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                   Our AI determined it's the perfect time to review <span className="text-white">'Backpropagation'</span>.
                </p>
                <Button variant="outline" className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
                   Start 5m Review
                </Button>
             </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default AINotes;
