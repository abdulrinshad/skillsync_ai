import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  Plus, 
  Upload, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  BarChart3, 
  History, 
  Zap, 
  Flame, 
  Target, 
  HelpCircle,
  Cpu,
  Layers,
  Settings2
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/ui';

const QuizHistoryCard = ({ quiz, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ x: 5 }}
    className="glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-purple-500/30 transition-all group flex items-center justify-between"
  >
    <div className="flex items-center gap-6">
       <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all`}>
          <BrainCircuit size={28} />
       </div>
       <div>
          <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors leading-tight">{quiz.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             <div className="flex items-center gap-1"><Target size={12} /> {quiz.difficulty}</div>
             <div className="flex items-center gap-1"><Timer size={12} /> {quiz.time}</div>
          </div>
       </div>
    </div>
    <div className="text-right">
       <div className={`text-2xl font-black ${quiz.score >= 80 ? 'text-green-400' : 'text-purple-400'}`}>{quiz.score}%</div>
       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Final Score</div>
    </div>
  </motion.div>
);

const AIQuiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');

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
        className="relative h-[350px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-cyan-400 mb-8 uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} className="animate-pulse" /> AI Assessment Engine
          </motion.div>
          <motion.h1 
            className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-none"
          >
            Intelligent <span className="text-gradient">AI Quizzes.</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed"
          >
            Test your knowledge with personalized assessments generated in real-time based on your learning progress.
          </motion.p>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          {/* AI Quiz Generator Panel */}
          <section>
             <GlassCard className="rounded-[3rem] p-10 border-purple-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-purple-500/5 group-hover:text-purple-500/10 transition-colors">
                   <Layers size={140} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-10">
                   <div className="space-y-4">
                      <label className="text-xs font-black text-purple-400 uppercase tracking-widest ml-1">Quiz Topic</label>
                      <div className="relative group/input">
                         <HelpCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                         <input 
                            placeholder="Enter a topic (e.g. Deep Learning, React Hooks, UI/UX Principles)"
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all font-medium placeholder:text-gray-600 shadow-2xl"
                         />
                      </div>
                   </div>

                   <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-xs font-black text-cyan-400 uppercase tracking-widest ml-1">Difficulty Level</label>
                         <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                            {['Beginner', 'Intermediate', 'Expert'].map(d => (
                              <button 
                                key={d}
                                onClick={() => setSelectedDifficulty(d)}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDifficulty === d ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                              >
                                {d}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-xs font-black text-indigo-400 uppercase tracking-widest ml-1">Quiz Type</label>
                         <div className="relative">
                            <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple-500/50 appearance-none">
                               <option className="bg-[#020617]">Multiple Choice (MCQ)</option>
                               <option className="bg-[#020617]">Coding Challenge</option>
                               <option className="bg-[#020617]">True / False</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/5">
                      <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                         <Upload size={16} className="text-purple-400" /> Upload Source Material
                      </button>
                      <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        variant="gradient" 
                        className="px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl relative overflow-hidden min-w-[220px]"
                      >
                         {isGenerating ? (
                           <>
                             <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                             Building Quiz...
                           </>
                         ) : (
                           <>Start Generation <Zap size={18} fill="currentColor" /></>
                         )}
                      </Button>
                   </div>
                </div>
             </GlassCard>
          </section>

          {/* Performance Analytics & Stats */}
          <section>
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
                   <BarChart3 size={20} />
                </div>
                Performance Analytics
             </h2>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 border border-white/5 group-hover:bg-green-500 group-hover:text-white transition-all">
                         <CheckCircle2 size={24} />
                      </div>
                      <Badge color="green">+4.2% UP</Badge>
                   </div>
                   <div>
                      <div className="text-4xl font-black mb-1">82.5%</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg. Quiz Accuracy</div>
                   </div>
                </div>
                
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-white/5 group-hover:bg-purple-500 group-hover:text-white transition-all">
                         <Zap size={24} />
                      </div>
                      <Badge color="purple">GOLD TIER</Badge>
                   </div>
                   <div>
                      <div className="text-4xl font-black mb-1">1,250</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">XP Earned Today</div>
                   </div>
                </div>
             </div>
          </section>

          {/* Quiz History */}
          <section>
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                      <History size={20} />
                   </div>
                   Quiz History
                </h2>
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Clear History</button>
             </div>
             <div className="space-y-4">
                {[
                  { title: 'Advanced Neural Networks', difficulty: 'Expert', time: '12m 45s', score: 92 },
                  { title: 'Introduction to Prompt Engineering', difficulty: 'Beginner', time: '08m 12s', score: 100 },
                  { title: 'UI UX Design Systems', difficulty: 'Intermediate', time: '15m 30s', score: 75 }
                ].map((quiz, i) => (
                  <QuizHistoryCard key={i} quiz={quiz} delay={0.1 * i} />
                ))}
             </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-12">
          
          {/* Gamification Tracker */}
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5" />
             <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="font-black text-lg uppercase tracking-tight">Gamified<br/><span className="text-gray-500">Progress</span></h3>
                   <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/20 animate-float">
                      <Flame size={20} />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly Challenge</span>
                         <span className="text-xs font-black text-white">4/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '80%' }}
                           className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                         />
                      </div>
                      <p className="text-[9px] text-gray-500 mt-2 font-medium">Complete 1 more quiz to earn <span className="text-white font-bold">500 XP</span></p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                         <Trophy className="text-yellow-500 mb-2" size={20} />
                         <div className="text-xs font-black">Rank #12</div>
                         <div className="text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-widest">Global</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                         <Badge className="mb-2" color="purple">PRO</Badge>
                         <div className="text-xs font-black">Lvl. 18</div>
                         <div className="text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-widest">Learner</div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* AI Study Recommendations */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner border border-white/10 animate-float">
                      <Cpu size={28} />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg leading-none text-white">Smart Insights</h3>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">Based on last quiz</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                      <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <XCircle size={12} /> Weak Areas
                      </h5>
                      <ul className="space-y-2 text-xs font-medium text-gray-400">
                         <li>• Transformer Attention Maps</li>
                         <li>• Layer Normalization</li>
                      </ul>
                   </div>
                   <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                      <h5 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Sparkles size={12} /> Pro Tip
                      </h5>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                         "Review the 'Attention Is All You Need' paper to improve your Expert level score."
                      </p>
                   </div>
                </div>
                
                <Button variant="outline" className="w-full py-4 mt-8 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5 hover:bg-white/5 transition-all">
                   View Learning Roadmap
                </Button>
             </div>
          </GlassCard>

          {/* Quick Challenges */}
          <section className="space-y-4">
             <h3 className="text-lg font-black mb-6 px-2 flex items-center gap-3 text-white">
                <Zap size={20} className="text-purple-400" /> Quick Quizzes
             </h3>
             {[
               { title: "Daily AI Ethics", reward: "100 XP", icon: BrainCircuit },
               { title: "Code Syntax Sprint", reward: "250 XP", icon: Layers }
             ].map((c, i) => (
               <div key={i} className="glass-card p-5 rounded-3xl border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <c.icon size={18} />
                     </div>
                     <div>
                        <h4 className="font-bold text-xs leading-tight group-hover:text-purple-400 transition-colors">{c.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge color="orange" className="text-[8px] px-1.5">{c.reward}</Badge>
                        </div>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-all" />
               </div>
             ))}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default AIQuiz;
