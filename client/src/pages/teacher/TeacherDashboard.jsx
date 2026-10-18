import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Award, 
  BrainCircuit, 
  Sparkles, 
  Plus, 
  Video, 
  Upload, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Play, 
  Activity, 
  ArrowUpRight, 
  CheckCircle, 
  BookOpenCheck,
  ChevronDown,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Target,
  BarChart3,
  Cpu,
  Trophy,
  Star,
  Zap,
  RefreshCw,
  Search,
  Check,
  FileText,
  HelpCircle,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';

// Numerical ticker for animated counters
const AnimatedCounter = ({ value, duration = 1.5, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numericStr = String(value).replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    let start = 0;
    const end = target;
    const isInt = Number.isInteger(end);
    
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * (end - start);

      if (isInt) {
        setCount(Math.floor(current));
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  // Format with commas for large numbers
  const formattedCount = typeof count === 'number' && Number.isInteger(count) && count > 999 
    ? count.toLocaleString() 
    : count;

  return (
    <span>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};

// Recharts Custom Tooltip (Glassmorphism styled)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm mt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-300 font-medium">{entry.name}:</span>
            <span className="text-white font-extrabold">
              {entry.name.includes('$') || entry.name.toLowerCase().includes('revenue') 
                ? `$${entry.value.toLocaleString()}` 
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TeacherDashboard = () => {
  // Glow cursor track state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Section States
  const [performanceTab, setPerformanceTab] = useState('enrollment'); // 'enrollment' | 'revenue' | 'completion'
  const [aiInsightTab, setAiInsightTab] = useState('recommendations'); // 'recommendations' | 'insights' | 'improvements' | 'topics'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'interactions' | 'updates' | 'grading'
  
  // Modals States
  const [activeModal, setActiveModal] = useState(null); // 'create-course' | 'upload' | 'live-class' | 'quiz' | 'notes'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedResult, setGeneratedResult] = useState('');
  
  // Quiz parameters
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDiff, setQuizDiff] = useState('intermediate');
  const [quizCourse, setQuizCourse] = useState('Generative AI Foundations');

  // Notes parameters
  const [notesTopic, setNotesTopic] = useState('');
  const [notesCourse, setNotesCourse] = useState('Advanced Neural Networks');

  // Course parameters
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDiff, setNewCourseDiff] = useState('intermediate');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // Live schedule state
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState('60 mins');
  const [scheduleCourse, setScheduleCourse] = useState('Generative AI Foundations');
  
  // Live classes database (modifiable state)
  const [liveSessions, setLiveSessions] = useState([
    {
      id: 1,
      title: "Advanced NLP & Transformer Architectures",
      time: "Starts in 25 mins",
      joined: 245,
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
      isLive: true,
      activeStudents: 142
    },
    {
      id: 2,
      title: "AI Ethics & Global Compliance Special Q&A",
      time: "Tomorrow, 4:00 PM EST",
      joined: 120,
      avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=200",
      isLive: false,
      activeStudents: 0
    }
  ]);

  // Handle adding mock scheduled class
  const handleScheduleClassSubmit = (e) => {
    e.preventDefault();
    if (!scheduleTitle || !scheduleTime) return;

    const newSession = {
      id: Date.now(),
      title: scheduleTitle,
      time: new Date(scheduleTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + " EST",
      joined: 0,
      avatar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200",
      isLive: false,
      activeStudents: 0
    };

    setLiveSessions([newSession, ...liveSessions]);
    setScheduleTitle('');
    setScheduleTime('');
    setActiveModal(null);
  };

  // Simulated AI Generator process (typewriter effect + progress bar)
  const runAiGeneration = (type, topic) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedResult('');
    
    let progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setTimeout(() => {
      setIsGenerating(false);
      let outputText = '';
      if (type === 'quiz') {
        outputText = `### AI GENERATED QUIZ: ${topic || 'Attention Mechanisms'}\n` +
          `**Difficulty**: ${quizDiff.toUpperCase()} | **Target**: ${quizCourse}\n\n` +
          `**Q1: What is the primary purpose of the scaling factor (1/√d_k) in Scaled Dot-Product Attention?**\n` +
          `*   [ ] A) To reduce memory footprint during backpropagation.\n` +
          `*   [x] B) To prevent dot products from growing large in magnitude, pushing the softmax into regions with extremely small gradients.\n` +
          `*   [ ] C) To stabilize the learning rate dynamically across training steps.\n\n` +
          `**Q2: Which component of a Transformer architecture allows the parallelization of sequence processing?**\n` +
          `*   [x] A) Multi-Head Self-Attention layers.\n` +
          `*   [ ] B) Layer Normalization steps.\n` +
          `*   [ ] C) Positional Encoding vectors.\n\n` +
          `**Q3: True or False: In a decoder layer, causal masking prevents attention heads from attending to future tokens.**\n` +
          `*   [x] True\n` +
          `*   [ ] False`;
      } else if (type === 'notes') {
        outputText = `### AI STUDY NOTES: ${topic || 'Backpropagation & Gradient Descent'}\n` +
          `**Topic Context**: Advanced Neural Networks | **Synthesized from**: 3 Video Lectures & 1 Notebook\n\n` +
          `#### Key Equations & Mathematial Framework\n` +
          `$$\\delta^l_j = \\frac{\\partial C}{\\partial z^l_j} = \\sum_k \\frac{\\partial C}{\\partial z^{l+1}_k} \\frac{\\partial z^{l+1}_k}{\\partial z^l_j}$$\n` +
          `The error vector for a layer $l$ is calculated using the Hadamard product:\n` +
          `$$\\delta^l = ((W^{l+1})^T \\delta^{l+1}) \\odot \\sigma'(z^l)$$\n\n` +
          `#### Summary of Core Concepts\n` +
          `1.  **Forward Pass**: Activations flow through the network layers, generating the predicted output vector $a^L$ and calculating total loss $C$.\n` +
          `2.  **Backward Pass**: Computes gradients of the cost function relative to all weights and biases using the chain rule.\n` +
          `3.  **Weight Adjustments**: Updates weight matrices: $W^l \\rightarrow W^l - \\eta \\delta^l (a^{l-1})^T$.\n\n` +
          `*Recommendation*: Use adaptive optimization (AdamW) with weight decay to prevent activation saturation in early layers.`;
      } else if (type === 'create-course') {
        outputText = `### AI GENERATED SYLLABUS: ${topic || 'Intro to Diffusion Models'}\n` +
          `**Difficulty**: ${newCourseDiff.toUpperCase()}\n\n` +
          `#### Phase 1: Mathematical Foundations (Weeks 1-2)\n` +
          `*   Forward Noising Process (Markov chains, Gaussian noise insertion)\n` +
          `*   Reverse Denoising Process (Variational Lower Bound optimizations)\n\n` +
          `#### Phase 2: Architecture Implementation (Weeks 3-4)\n` +
          `*   Designing the time-conditioned U-Net architecture\n` +
          `*   Integrating Sinusoidal Time Embeddings and Cross-Attention layers\n\n` +
          `#### Phase 3: Advanced Optimizations & Control (Weeks 5-6)\n` +
          `*   Classifier-Free Guidance (CFG) configuration\n` +
          `*   Fine-tuning via LoRA and ControlNet adapters`;
      }
      setGeneratedResult(outputText);
    }, 3200);
  };

  // Analytics datasets
  const analyticsData = [
    { label: "Total Students", value: 14250, change: "+18%", color: "purple", desc: "Total enrolled in academy", trend: true },
    { label: "Active Courses", value: 8, change: "Active", color: "cyan", desc: "Syllabi actively deployed", trend: null },
    { label: "Total Revenue", value: 124500, prefix: "$", change: "+24.5%", color: "green", desc: "Net teacher royalties", trend: true },
    { label: "Completion Rate", value: 94.2, suffix: "%", change: "+4.2%", color: "orange", desc: "Student cohort completion", trend: true },
    { label: "Monthly Growth", value: 32.8, prefix: "+", suffix: "%", change: "Highest", color: "pink", desc: "Enrollment growth velocity", trend: true },
    { label: "Active Learners", value: 2200, change: "+15%", color: "purple-cyan", desc: "Engaged in chat & lectures now", trend: true }
  ];

  // Recharts Chart Datasets
  const chartData = {
    enrollment: [
      { name: 'Jan', Students: 3200, Growth: 1200 },
      { name: 'Feb', Students: 4800, Growth: 1600 },
      { name: 'Mar', Students: 6900, Growth: 2100 },
      { name: 'Apr', Students: 9500, Growth: 2600 },
      { name: 'May', Students: 11800, Growth: 2300 },
      { name: 'Jun', Students: 14250, Growth: 2450 }
    ],
    revenue: [
      { name: 'Jan', Revenue: 18500, Profit: 12000 },
      { name: 'Feb', Revenue: 29800, Profit: 19500 },
      { name: 'Mar', Revenue: 44200, Profit: 31000 },
      { name: 'Apr', Revenue: 68500, Profit: 48000 },
      { name: 'May', Revenue: 95600, Profit: 67000 },
      { name: 'Jun', Revenue: 124500, Profit: 89000 }
    ],
    completion: [
      { name: 'Generative AI', Graduated: 94, Dropped: 6 },
      { name: 'Neural Networks', Graduated: 88, Dropped: 12 },
      { name: 'LLM Fine-tuning', Graduated: 85, Dropped: 15 },
      { name: 'ML Operations', Graduated: 76, Dropped: 24 },
      { name: 'Computer Vision', Graduated: 91, Dropped: 9 }
    ]
  };

  // Top Performing Courses dataset
  const topCourses = [
    {
      title: "Generative AI Foundations & Transformer Architectures",
      enrolled: 4890,
      revenue: 68460,
      completion: 94.2,
      rating: 4.98,
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Advanced Neural Networks & Backpropagation Math",
      enrolled: 3420,
      revenue: 45600,
      completion: 88.5,
      rating: 4.92,
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Ethical Hacking and Security protocols with LLMs",
      enrolled: 1240,
      revenue: 12450,
      completion: 78.0,
      rating: 4.85,
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // Activity Feed database
  const activityFeed = [
    {
      id: 1,
      type: "interactions",
      name: "Alex Rivera",
      action: "posted a discussion thread",
      target: "Module 3: Why scale inputs in Attention Q&A?",
      time: "Just now",
      avatar: "https://i.pravatar.cc/100?u=alex",
      status: "Unanswered"
    },
    {
      id: 2,
      type: "updates",
      name: "DeepSeek R1 Integration",
      action: "completed syllabus injection to",
      target: "Generative AI Course: Section 5.4",
      time: "10 mins ago",
      avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=200",
      status: "Synced"
    },
    {
      id: 3,
      type: "grading",
      name: "Yuki Tanaka",
      action: "submitted assignment notebook",
      target: "Transformer Encoder-Decoder Layer.ipynb",
      time: "42 mins ago",
      avatar: "https://i.pravatar.cc/100?u=yuki",
      status: "Requires Grading"
    },
    {
      id: 4,
      type: "interactions",
      name: "Chloe Jenkins",
      action: "completed quiz milestone",
      target: "Backpropagation Math: Score 100%",
      time: "1 hour ago",
      avatar: "https://i.pravatar.cc/100?u=chloe",
      status: "Completed"
    },
    {
      id: 5,
      type: "updates",
      name: "System Guard",
      action: "blocked anomalous activity from user",
      target: "Botting warning flag on quiz submissions",
      time: "3 hours ago",
      avatar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200",
      status: "Flagged"
    }
  ];

  const filteredFeed = activityFilter === 'all' 
    ? activityFeed 
    : activityFeed.filter(act => act.type === activityFilter);

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-24 bg-[#020617] -mx-4 lg:-mx-8 -my-6 lg:-my-8 px-4 lg:px-8 py-6 lg:py-8">
      {/* Background Radial Glow Mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0" />
      
      {/* Interactive Cursor Glow Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.09), rgba(6, 182, 212, 0.07), transparent 45%)`
        }}
      />

      {/* Floating Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: i % 2 === 0 ? 'rgba(139, 92, 246, 0.25)' : 'rgba(6, 182, 212, 0.25)',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, Math.random() * -120 - 60],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-10">

        {/* 1. HERO WELCOME SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-[2rem] border border-white/5 overflow-hidden group bg-gradient-to-br from-[#0c0f24]/90 via-[#0a0518]/70 to-[#020617]/95 backdrop-blur-xl shadow-2xl"
        >
          {/* Subtle glowing mesh overlays */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/30 p-0.5 bg-gradient-to-br from-purple-600 to-cyan-500 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                    className="w-full h-full object-cover rounded-xl"
                    alt="Professor Sarah Chen" 
                  />
                </div>
                {/* Glow online ping border */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#020617]"></span>
                </span>
              </div>

              <div>
                {/* AI badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-[10px] font-black text-purple-400 mb-2 uppercase tracking-widest"
                >
                  <Sparkles size={10} className="animate-pulse text-cyan-400" /> AI-Powered Instructor
                </motion.div>
                
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                  Welcome back, <span className="text-gradient">Dr. Sarah Chen</span>
                </h1>
                
                <p className="text-gray-400 text-sm mt-1">
                  Lead AI Architect & Machine Learning Faculty • Stanford Labs Co-Pilot
                </p>
              </div>
            </div>

            {/* Quick overview stats panel */}
            <div className="flex items-center gap-6 bg-white/[0.02] backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-inner self-stretch md:self-auto justify-around">
              <div className="text-center px-2">
                <div className="text-3xl font-black text-white">4.95<span className="text-yellow-500 text-lg">★</span></div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Instructor Rating</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center px-2">
                <div className="text-3xl font-black text-purple-400">#3</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Global Ranking</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center px-2">
                <div className="text-3xl font-black text-cyan-400">Lvl 8</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Teacher Standing</div>
              </div>
            </div>
            
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Your autonomous AI Teaching Assistants have successfully handled <strong className="text-cyan-400">142 chatbot inquiries</strong> in the last 4 hours. No manual intervention required.
            </p>
            <div className="flex gap-3">
              <a href="https://skillsync.ai/academy" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-4 py-2 text-xs flex items-center gap-2 text-gray-300 hover:text-white border-white/10 bg-white/5">
                  Explore Academy Hub <ExternalLink size={12} />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>


        {/* 2. ANALYTICS CARDS GRID */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {analyticsData.map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative overflow-hidden p-6 rounded-[2rem] border border-white/5 group bg-white/[0.02] backdrop-blur-md transition-all duration-300"
            >
              {/* Card gradient spots */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[45px] -mr-8 -mt-8 group-hover:bg-purple-600/10 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-purple-500/15 text-purple-400' :
                  stat.color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400' :
                  stat.color === 'green' ? 'bg-green-500/15 text-green-400' :
                  stat.color === 'orange' ? 'bg-orange-500/15 text-orange-400' :
                  stat.color === 'pink' ? 'bg-pink-500/15 text-pink-400' :
                  'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 text-white'
                }`}>
                  {stat.label === 'Total Students' && <Users size={20} />}
                  {stat.label === 'Active Courses' && <BookOpenCheck size={20} />}
                  {stat.label === 'Total Revenue' && <DollarSign size={20} />}
                  {stat.label === 'Completion Rate' && <Award size={20} />}
                  {stat.label === 'Monthly Growth' && <TrendingUp size={20} />}
                  {stat.label === 'Active Learners' && <BrainCircuit size={20} />}
                </div>
                <Badge color={stat.color === 'purple-cyan' ? 'cyan' : stat.color}>{stat.change}</Badge>
              </div>

              <div className="text-3xl font-black tracking-tight mb-1">
                <AnimatedCounter 
                  value={stat.value} 
                  prefix={stat.prefix || ''} 
                  suffix={stat.suffix || ''} 
                />
              </div>
              
              <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">{stat.label}</div>
              <p className="text-[9px] text-gray-600 font-medium leading-relaxed mt-1 line-clamp-1 group-hover:text-gray-400 transition-colors">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>


        {/* 6. QUICK ACTIONS ROW */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {/* Action 1: Create Course */}
          <button 
            onClick={() => setActiveModal('create-course')}
            className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent border border-purple-500/20 hover:border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.03)] transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">Create Course</div>
            <div className="text-[9px] text-purple-400/80 mt-1 font-semibold">AI Curriculum Designer</div>
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-purple-400" />
            </div>
          </button>

          {/* Action 2: Upload Content */}
          <button 
            onClick={() => setActiveModal('upload')}
            className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.03)] transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">Upload Content</div>
            <div className="text-[9px] text-cyan-400/80 mt-1 font-semibold">Lecture PDFs & Jupyter Labs</div>
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-cyan-400" />
            </div>
          </button>

          {/* Action 3: Start Live Class */}
          <button 
            onClick={() => setActiveModal('live-class')}
            className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-green-900/20 via-emerald-900/10 to-transparent border border-green-500/20 hover:border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.03)] transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-3 group-hover:scale-110 transition-transform">
              <Video size={20} />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-green-300 transition-colors">Start Live Class</div>
            <div className="text-[9px] text-green-400/80 mt-1 font-semibold">Holographic Meet Setup</div>
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-green-400" />
            </div>
          </button>

          {/* Action 4: Generate AI Quiz */}
          <button 
            onClick={() => {
              setActiveModal('quiz');
              setQuizTopic('');
              setGeneratedResult('');
            }}
            className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-pink-900/20 via-rose-900/10 to-transparent border border-pink-500/20 hover:border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.03)] transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-110 transition-transform">
              <BrainCircuit size={20} />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-pink-300 transition-colors">Generate AI Quiz</div>
            <div className="text-[9px] text-pink-400/80 mt-1 font-semibold">Automated Q&A builder</div>
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-pink-400" />
            </div>
          </button>

          {/* Action 5: Generate AI Notes */}
          <button 
            onClick={() => {
              setActiveModal('notes');
              setNotesTopic('');
              setGeneratedResult('');
            }}
            className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-amber-900/20 via-yellow-900/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.03)] transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">Generate AI Notes</div>
            <div className="text-[9px] text-amber-400/80 mt-1 font-semibold">Markdown transcript summaries</div>
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-amber-400" />
            </div>
          </button>
        </motion.div>


        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 z-10 relative">
          
          {/* LEFT 2/3 COLUMN: COURSE PERFORMANCE & TOP COURSES & AI ASSISTANT PANEL */}
          <div className="xl:col-span-2 space-y-10">

            {/* 4. COURSE PERFORMANCE SECTION */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-600/5 blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold flex items-center gap-3 tracking-tight">
                    <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/25">
                      <BarChart3 size={20} />
                    </div>
                    Course Performance Metrics
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Evaluate registration scaling, weekly revenue cycles, and cohort milestones</p>
                </div>

                {/* Graph Tab selectors */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                  <button 
                    onClick={() => setPerformanceTab('enrollment')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${performanceTab === 'enrollment' ? 'bg-gradient-premium text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Enrollments
                  </button>
                  <button 
                    onClick={() => setPerformanceTab('revenue')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${performanceTab === 'revenue' ? 'bg-gradient-premium text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Revenue
                  </button>
                  <button 
                    onClick={() => setPerformanceTab('completion')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${performanceTab === 'completion' ? 'bg-gradient-premium text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Completion Rates
                  </button>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {performanceTab === 'enrollment' ? (
                    <AreaChart data={chartData.enrollment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01}/>
                        </linearGradient>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Students" name="Cumulative Enrolled" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#enrollmentGrad)" />
                      <Area type="monotone" dataKey="Growth" name="New Signups" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#growthGrad)" />
                    </AreaChart>
                  ) : performanceTab === 'revenue' ? (
                    <BarChart data={chartData.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Revenue" name="Gross Earnings ($)" fill="#a855f7" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Profit" name="Net Royalties ($)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={chartData.completion} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" fontSize={11} width={110} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Graduated" name="Graduation Rate (%)" fill="#06b6d4" radius={[0, 6, 6, 0]} barSize={12} />
                      <Bar dataKey="Dropped" name="Drop-out/Incomplete (%)" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={12} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Chart footer insights */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5 text-center text-xs">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Peak Student Inflow</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    May-June <span className="text-cyan-400">(+4,750 joiners)</span>
                  </div>
                </div>
                <div className="border-x border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Top Earning Course</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    Generative AI <span className="text-green-400">$68.4K</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Average Completion</div>
                  <div className="font-extrabold text-white flex items-center justify-center gap-1">
                    88.4% <span className="text-purple-400">Superior</span>
                  </div>
                </div>
              </div>
            </GlassCard>


            {/* 8. TOP PERFORMING COURSES */}
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/15 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/25">
                    <Trophy size={20} />
                  </div>
                  Top Performing Academy Courses
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Detailed leaderboard based on student enrollment quantities and overall rating score</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topCourses.map((course, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0f24]/50 backdrop-blur-md flex flex-col justify-between"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
                    
                    {/* Glowing highlight */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-[8px] transition-opacity pointer-events-none z-0" />

                    <div className="h-40 relative overflow-hidden">
                      <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-3 py-1 bg-slate-950/70 border border-white/10 rounded-full text-[10px] font-black text-white flex items-center gap-1 backdrop-blur-md">
                          <Star size={10} className="fill-yellow-500 text-yellow-500" /> {course.rating}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/30 text-[9px] font-black uppercase text-purple-400 rounded-full tracking-wider">
                          Rank #{idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-sm leading-snug text-white group-hover:text-purple-300 transition-colors line-clamp-2 h-10 mb-4">
                        {course.title}
                      </h3>

                      <div className="space-y-4">
                        {/* Student and Earnings info */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-400">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Students</span>
                            <span className="text-white font-extrabold flex items-center gap-1.5 mt-0.5">
                              <Users size={12} className="text-purple-400" />
                              {course.enrolled.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Total Earnings</span>
                            <span className="text-white font-extrabold flex items-center gap-1.5 mt-0.5">
                              <DollarSign size={12} className="text-green-400" />
                              ${course.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Completion progress slider bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-gray-500 uppercase tracking-wider">Completion Rate</span>
                            <span className="text-cyan-400">{course.completion}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: `${course.completion}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>


            {/* 3. AI TEACHING ASSISTANT PANEL */}
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/25">
                    <BrainCircuit size={20} className="animate-pulse" />
                  </div>
                  AI Teaching Assistant Core
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Autonomous evaluation, recommendation generator, and cohort sentiment monitors</p>
              </div>

              <GlassCard className="rounded-[2rem] border-white/5 p-6 bg-gradient-to-br from-white/[0.01] to-transparent">
                <div className="flex border-b border-white/5 pb-4 mb-6 overflow-x-auto gap-2 no-scrollbar">
                  {[
                    { id: 'recommendations', label: 'AI recommendations', icon: Lightbulb },
                    { id: 'insights', label: 'Student Engagement', icon: Users },
                    { id: 'improvements', label: 'Course Improvement', icon: AlertTriangle },
                    { id: 'topics', label: 'Trending Topics', icon: TrendingUp }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAiInsightTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                        aiInsightTab === tab.id 
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {aiInsightTab === 'recommendations' && (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <h4 className="font-extrabold text-sm text-white">Interactive Coding Lab Suggestion</h4>
                          </div>
                          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                            NLP student retention is dropping at Module 4. We recommend adding a Google Colab notebook demonstrating Attention scaling metrics to reduce attrition by 12%.
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            setActiveModal('notes');
                            setNotesTopic('Google Colab Attention Weights Visualizer');
                          }}
                          variant="outline" 
                          className="text-[11px] font-black tracking-wide uppercase px-4 py-2.5 text-cyan-400 hover:text-cyan-300"
                        >
                          Generate Notes
                        </Button>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            <h4 className="font-extrabold text-sm text-white">Quiz Scheduling Notification</h4>
                          </div>
                          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                            Students have reviewed the 'Transformer Encoder' notes but haven't taken a quiz yet. AI recommends scheduling a competitive leaderboard quiz this weekend.
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            setActiveModal('quiz');
                            setQuizTopic('Transformer Encoders & Attention Layers');
                          }}
                          variant="outline" 
                          className="text-[11px] font-black tracking-wide uppercase px-4 py-2.5 text-purple-400 hover:text-purple-300"
                        >
                          Generate Quiz
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {aiInsightTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
                          <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-3">Student Engagement Breakdown</h4>
                          <div className="space-y-3">
                            {[
                              { label: 'Highly Engaged', val: '58%', color: 'bg-purple-500' },
                              { label: 'Attentive', val: '32%', color: 'bg-cyan-500' },
                              { label: 'Need Review / Dropout risk', val: '10%', color: 'bg-red-500' }
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span>{item.label}</span>
                                  <span className="text-white">{item.val}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between">
                          <div>
                            <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-2">Student Sentiment Analysis</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              "The scaling factor division was confusing at first, but the AI chatbot code explanation cleared up the math."
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mt-4">
                            <span>Evaluated from 240+ chat inputs</span>
                            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">Positive sentiment index: 92%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {aiInsightTab === 'improvements' && (
                    <motion.div
                      key="improvements"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <AlertTriangle size={20} />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-sm text-white">Module 3 Dropout Rate Warning (Advanced ML)</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Gradient vanishing and mathematical backprop derivatives has a high drop-off rate of 28% compared to visual modules. Cohort completion time increased by 3.2 days in this module.
                          </p>
                          <div className="pt-2 flex gap-3">
                            <Button 
                              onClick={() => {
                                setActiveModal('notes');
                                setNotesTopic('Mathematical Derivation of backpropagation and loss gradients');
                              }}
                              variant="primary" 
                              className="text-[10px] font-black uppercase py-2 px-4 bg-white text-black"
                            >
                              Generate AI Study Notes
                            </Button>
                            <Button 
                              onClick={() => {
                                setActiveModal('quiz');
                                setQuizTopic('Backpropagation derivative calculations');
                              }}
                              variant="outline" 
                              className="text-[10px] font-black uppercase py-2 px-4 border-white/10 hover:bg-white/5 text-white"
                            >
                              Add Diagnostic Quiz
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {aiInsightTab === 'topics' && (
                    <motion.div
                      key="topics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {[
                        { title: "DeepSeek R1 Architectures", trend: "+148% growth", desc: "Students are asking for distillation and local weights configuration." },
                        { title: "Diffusion Denoising & VLB", trend: "+84% growth", desc: "High search keywords in generative media course drafts." },
                        { title: "Retrieval-Augmented Generation", trend: "+62% growth", desc: "Core interest index in pipeline implementation." }
                      ].map((topic, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-xs text-white">{topic.title}</h4>
                              <Badge color="purple">{topic.trend}</Badge>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed">{topic.desc}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setActiveModal('create-course');
                              setNewCourseTitle(topic.title);
                            }}
                            className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 mt-4 flex items-center gap-1 text-left self-start cursor-pointer"
                          >
                            Build syllabus module <ChevronRight size={10} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </section>

          </div>


          {/* RIGHT COLUMN: ACHIEVEMENTS & LIVE CLASSES & ACTIVITY FEED */}
          <div className="space-y-10">

            {/* 9. ACHIEVEMENT SECTION */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Award className="text-purple-400" size={20} /> Academy Achievements
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">Your global standing, teaching credentials, and instructor level</p>
              </div>

              <GlassCard className="rounded-[2rem] border-white/5 p-6 bg-gradient-to-br from-white/[0.01] to-transparent relative overflow-hidden">
                {/* Background light glow */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none" />

                <div className="flex items-center gap-4 mb-6">
                  {/* Level status badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-500/30">
                    Lvl 8
                  </div>
                  <div>
                    <div className="font-black text-base text-white">Dr. Sarah Chen</div>
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Gold Tier Lead Instructor</div>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">XP Progress</span>
                    <span className="text-cyan-400">24,500 / 30,000 XP</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: '81.6%' }} />
                  </div>
                  <div className="text-[9px] text-gray-500 font-medium">Earn +5,500 XP to advance to Level 9 and unlock AI Live translation feeds!</div>
                </div>

                {/* Badges Earned */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Badges Earned</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-[10px] text-white">AI Pioneer</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">10+ AI co-pilots</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/20">
                        <Users size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-[10px] text-white">Engage Guru</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">&gt;90% rate</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 shrink-0 border border-green-500/20">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-[10px] text-white">Million Club</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">Royalties threshold</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                        <Star size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-[10px] text-white">Top Rated</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">Avg 4.95 stars</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>


            {/* 7. LIVE CLASSES WIDGET */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Calendar className="text-cyan-400" size={20} /> Live Classes & Streams
                </h2>
                <Button 
                  onClick={() => {
                    setActiveModal('live-class');
                  }} 
                  className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10"
                >
                  Schedule Class
                </Button>
              </div>

              <GlassCard className="rounded-[2rem] border-white/5 p-6 space-y-6 bg-gradient-to-br from-white/[0.01] to-transparent">
                <div className="space-y-4">
                  {liveSessions.map((sess) => (
                    <div key={sess.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={sess.avatar} className="w-full h-full object-cover" alt={sess.title} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors line-clamp-1">{sess.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {sess.isLive ? (
                              <>
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">{sess.time}</span>
                                <span className="text-[9px] text-gray-500">•</span>
                                <span className="text-[9px] text-cyan-400 font-bold">{sess.activeStudents} active learners</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{sess.time}</span>
                                {sess.joined > 0 && (
                                  <>
                                    <span className="text-[9px] text-gray-500">•</span>
                                    <span className="text-[9px] text-gray-400 font-bold">{sess.joined} registered</span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (sess.isLive) {
                            alert(`Entering holographic stream room for: ${sess.title}`);
                          } else {
                            // Instantly switch to Live for testing interaction
                            setLiveSessions(prev => prev.map(s => s.id === sess.id ? { ...s, isLive: true, time: "LIVE NOW", activeStudents: 85 } : s));
                          }
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer ${sess.isLive ? 'bg-gradient-premium text-white' : 'bg-white/5 text-gray-500 hover:text-white transition-colors'}`}
                      >
                        <Play size={12} fill={sess.isLive ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-600/10 border border-purple-500/20 p-4 rounded-xl flex gap-3">
                  <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-purple-300 leading-relaxed">
                    <strong className="text-white">AI Co-pilot Insight:</strong> Students showed high interest in the Attention Math quiz. Recommending a spontaneous Live Q&A today at 5:00 PM.
                  </p>
                </div>
              </GlassCard>
            </section>


            {/* 5. RECENT ENROLLMENTS & 10. ACTIVITY FEED */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Activity className="text-purple-400" size={20} /> Student Activity Feed
                </h2>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">Real-time sync</span>
              </div>

              <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
                
                {/* Filters */}
                <div className="flex bg-white/5 p-1 border-b border-white/5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All activities' },
                    { id: 'interactions', label: 'Student Q&A' },
                    { id: 'updates', label: 'Course updates' },
                    { id: 'grading', label: 'Pending Assessment' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActivityFilter(filter.id)}
                      className={`flex-1 text-center py-2 px-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                        activityFilter === filter.id 
                          ? 'bg-purple-500/10 text-purple-400 font-extrabold' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Timeline rows */}
                <div className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {filteredFeed.map((act) => (
                      <motion.div 
                        key={act.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
                        className="flex items-center justify-between p-5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors">
                            <img src={act.avatar} className="w-full h-full object-cover" alt={act.name} />
                          </div>
                          <div>
                            <div className="text-xs">
                              <strong className="text-white font-bold">{act.name}</strong>{' '}
                              <span className="text-gray-500">{act.action}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-gray-400 line-clamp-1 mt-0.5">{act.target}</div>
                          </div>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            act.status === 'Requires Grading' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
                            act.status === 'Flagged' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                            act.status === 'Synced' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' :
                            'bg-purple-500/15 text-purple-400 border-purple-500/20'
                          }`}>
                            {act.status}
                          </span>
                          <div className="text-[9px] text-gray-600 font-bold uppercase mt-1.5">{act.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="p-4 bg-white/[0.01] border-t border-white/5">
                  <button 
                    onClick={() => alert("Redirecting to Advanced Student Activity Auditing...")}
                    className="w-full text-center py-2 text-xs font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-[0.15em] cursor-pointer"
                  >
                    View All Student Activities
                  </button>
                </div>

              </div>
            </section>

          </div>

        </div>

      </div>

      {/* QUICK ACTIONS & LIVE CLASS MODAL DIALOGS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isGenerating) {
                  setActiveModal(null);
                  setGeneratedResult('');
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-8 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  if (!isGenerating) {
                    setActiveModal(null);
                    setGeneratedResult('');
                  }
                }}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Content Switcher */}
              
              {/* ACTION A: CREATE COURSE */}
              {activeModal === 'create-course' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <Sparkles className="text-purple-400" size={20} /> AI Course Syllabus Generator
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Provide a subject or topic outline, and the SkillSync AI core will design a complete curriculum drafts.</p>
                  </div>

                  {!isGenerating && !generatedResult ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Proposed Course Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Intro to Neural Fields & NeRFs"
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Target Difficulty</label>
                          <select 
                            value={newCourseDiff} 
                            onChange={(e) => setNewCourseDiff(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm cursor-pointer"
                          >
                            <option value="beginner" className="bg-slate-900">Beginner Level</option>
                            <option value="intermediate" className="bg-slate-900">Intermediate Level</option>
                            <option value="advanced" className="bg-slate-900">Advanced Level</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">AI Tutor Deployment</label>
                          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cyan-400 text-sm font-bold flex items-center justify-between">
                            <span>Deploy 1 AI Co-Pilot Agent</span>
                            <Badge color="cyan">Active</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Brief Description (Optional)</label>
                        <textarea 
                          rows={3}
                          placeholder="Write a brief prompt details for the AI curriculum co-pilot..."
                          value={newCourseDesc}
                          onChange={(e) => setNewCourseDesc(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm resize-none"
                        />
                      </div>

                      <Button 
                        onClick={() => runAiGeneration('create-course', newCourseTitle)}
                        variant="gradient" 
                        className="w-full uppercase font-black tracking-widest text-xs py-3.5 mt-2"
                      >
                        Generate Syllabus drafts
                      </Button>
                    </div>
                  ) : isGenerating ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="animate-spin text-purple-400" size={32} />
                      <div className="text-center">
                        <p className="font-extrabold text-sm text-white">SkillSync Co-pilot is reading mathematical textbooks...</p>
                        <p className="text-xs text-gray-500 mt-1">Generating modules, schedules, and code sandbox requirements</p>
                      </div>
                      <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" style={{ width: `${generationProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 font-mono overflow-y-auto max-h-[300px] whitespace-pre-line leading-relaxed scrollbar">
                        {generatedResult}
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => {
                            alert("Syllabus successfully exported! Draft course created under your registry.");
                            setGeneratedResult('');
                            setActiveModal(null);
                          }}
                          variant="primary" 
                          className="flex-1 uppercase font-black text-xs py-3 bg-white text-black"
                        >
                          Approve and Create Draft
                        </Button>
                        <Button 
                          onClick={() => setGeneratedResult('')}
                          variant="outline" 
                          className="flex-1 uppercase font-black text-xs py-3 border-white/10 text-white"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION B: UPLOAD CONTENT */}
              {activeModal === 'upload' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <Upload className="text-cyan-400" size={20} /> Lecture Material & Labs Uploader
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Upload lecture notes (PDF/Markdown) or coding tasks. Our AI automatically transcripes, generates index tags, and pre-trains student chatbots.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Target Course Assignment</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all text-sm cursor-pointer">
                        <option value="genai" className="bg-slate-900">Generative AI Foundations & Transformer Architectures</option>
                        <option value="neural" className="bg-slate-900">Advanced Neural Networks & Backpropagation Math</option>
                        <option value="cyber" className="bg-slate-900">Ethical Hacking and Security protocols with LLMs</option>
                      </select>
                    </div>

                    <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-2xl p-8 flex flex-col items-center justify-center transition-all bg-white/[0.01] hover:bg-cyan-500/[0.01] cursor-pointer">
                      <Upload className="text-cyan-400 mb-3 animate-bounce" size={32} />
                      <p className="font-extrabold text-sm text-white">Drag & drop files here, or browse local folders</p>
                      <p className="text-[10px] text-gray-500 mt-1">Supports PDF, Markdown, IPython Notebook (.ipynb) up to 64MB</p>
                    </div>

                    <div className="flex gap-2 items-center text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                      <Sparkles size={12} /> AI will automatically chunk syllabus materials and inject embeddings into vector indices.
                    </div>

                    <Button 
                      onClick={() => {
                        alert("Uploading lecture files to secure SkillSync S3. AI indexing launched in the background...");
                        setActiveModal(null);
                      }}
                      variant="gradient" 
                      className="w-full uppercase font-black text-xs py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-cyan-500"
                    >
                      Start Indexing Process
                    </Button>
                  </div>
                </div>
              )}

              {/* ACTION C: START LIVE CLASS */}
              {activeModal === 'live-class' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <Video className="text-green-400" size={20} /> Schedule or Host Live Stream Room
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Configure your SkillSync AI Meet session. Setup target topics and schedule times.</p>
                  </div>

                  <form onSubmit={handleScheduleClassSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Live Stream Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Q&A and code audit of Custom Attention layers"
                        value={scheduleTitle}
                        onChange={(e) => setScheduleTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Target Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Duration & Options</label>
                        <select 
                          value={scheduleDuration} 
                          onChange={(e) => setScheduleDuration(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm cursor-pointer"
                        >
                          <option value="30 mins" className="bg-slate-900">30 minutes</option>
                          <option value="60 mins" className="bg-slate-900">60 minutes</option>
                          <option value="90 mins" className="bg-slate-900">90 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Associated Course</label>
                        <select 
                          value={scheduleCourse} 
                          onChange={(e) => setScheduleCourse(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm cursor-pointer"
                        >
                          <option value="Generative AI" className="bg-slate-900">Generative AI Foundations</option>
                          <option value="Neural Networks" className="bg-slate-900">Advanced Neural Networks</option>
                          <option value="Ethical Hacking" className="bg-slate-900">Ethical Hacking & LLMs</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Stream Mode</label>
                        <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-green-400 text-sm font-bold flex items-center justify-between">
                          <span>Real-Time WebRTC (Holographic)</span>
                          <Badge color="green">Secure</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button 
                        type="submit"
                        variant="gradient" 
                        className="flex-1 uppercase font-black text-xs py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                      >
                        Schedule stream Session
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => {
                          alert("Initializing immediate WebRTC stream connection. Activating video broadcast channel...");
                          
                          // Prepend immediate live session
                          const immediateSess = {
                            id: Date.now(),
                            title: scheduleTitle || "Spontaneous Q&A Stream",
                            time: "LIVE NOW",
                            joined: 0,
                            avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
                            isLive: true,
                            activeStudents: 1
                          };
                          setLiveSessions([immediateSess, ...liveSessions]);
                          setActiveModal(null);
                        }}
                        variant="primary"
                        className="flex-1 uppercase font-black text-xs py-3.5 bg-white text-black"
                      >
                        Go Live Immediately
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* ACTION D: GENERATE AI QUIZ */}
              {activeModal === 'quiz' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <BrainCircuit className="text-pink-400" size={20} /> AI Diagnostic Quiz Builder
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Specify your topic guidelines, and the AI agent will formulate multiple choice and logic questions.</p>
                  </div>

                  {!isGenerating && !generatedResult ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Quiz Topic or Syllabus Section</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Scaled Dot-Product Attention gradients"
                          value={quizTopic}
                          onChange={(e) => setQuizTopic(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Course target</label>
                          <select 
                            value={quizCourse}
                            onChange={(e) => setQuizCourse(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all text-sm cursor-pointer"
                          >
                            <option value="Generative AI Foundations" className="bg-slate-900">Generative AI Foundations</option>
                            <option value="Advanced Neural Networks" className="bg-slate-900">Advanced Neural Networks</option>
                            <option value="Ethical Hacking with LLMs" className="bg-slate-900">Ethical Hacking with LLMs</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Difficulty</label>
                          <select 
                            value={quizDiff}
                            onChange={(e) => setQuizDiff(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all text-sm cursor-pointer"
                          >
                            <option value="beginner" className="bg-slate-900">Beginner</option>
                            <option value="intermediate" className="bg-slate-900">Intermediate</option>
                            <option value="advanced" className="bg-slate-900">Advanced Mathematical</option>
                          </select>
                        </div>
                      </div>

                      <Button 
                        onClick={() => runAiGeneration('quiz', quizTopic)}
                        variant="gradient" 
                        className="w-full uppercase font-black text-xs py-3.5 mt-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white"
                      >
                        Formulate AI Quiz
                      </Button>
                    </div>
                  ) : isGenerating ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="animate-spin text-pink-400" size={32} />
                      <div className="text-center">
                        <p className="font-extrabold text-sm text-white">AI Assistant is extracting concepts from lectures...</p>
                        <p className="text-xs text-gray-500 mt-1">Generating distractors, scoring logic, and math expressions</p>
                      </div>
                      <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${generationProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 font-mono overflow-y-auto max-h-[300px] whitespace-pre-line leading-relaxed scrollbar">
                        {generatedResult}
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => {
                            alert("Quiz successfully synchronized! Added as a cohort diagnostic tool.");
                            setGeneratedResult('');
                            setActiveModal(null);
                          }}
                          variant="primary" 
                          className="flex-1 uppercase font-black text-xs py-3 bg-white text-black"
                        >
                          Approve & Publish Quiz
                        </Button>
                        <Button 
                          onClick={() => setGeneratedResult('')}
                          variant="outline" 
                          className="flex-1 uppercase font-black text-xs py-3 border-white/10 text-white"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION E: GENERATE AI NOTES */}
              {activeModal === 'notes' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <FileText className="text-amber-400" size={20} /> AI Study Notes & Synthesizer
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Generate comprehensive mathematical study sheets or concept digests from the lecture logs.</p>
                  </div>

                  {!isGenerating && !generatedResult ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Synthesis Target Topic</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Backpropagation gradients and matrix calculus proofs"
                          value={notesTopic}
                          onChange={(e) => setNotesTopic(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Reference Syllabus Course</label>
                        <select 
                          value={notesCourse}
                          onChange={(e) => setNotesCourse(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all text-sm cursor-pointer"
                        >
                          <option value="Advanced Neural Networks" className="bg-slate-900">Advanced Neural Networks & Backpropagation Math</option>
                          <option value="Generative AI Foundations" className="bg-slate-900">Generative AI Foundations & Transformer Architectures</option>
                          <option value="Ethical Hacking with LLMs" className="bg-slate-900">Ethical Hacking and Security protocols with LLMs</option>
                        </select>
                      </div>

                      <Button 
                        onClick={() => runAiGeneration('notes', notesTopic)}
                        variant="gradient" 
                        className="w-full uppercase font-black text-xs py-3.5 mt-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white"
                      >
                        Synthesize Study Notes
                      </Button>
                    </div>
                  ) : isGenerating ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="animate-spin text-amber-400" size={32} />
                      <div className="text-center">
                        <p className="font-extrabold text-sm text-white">Synthesizing audio transcripts & slides...</p>
                        <p className="text-xs text-gray-500 mt-1">Formatting markdown summary tables, math equations, and examples</p>
                      </div>
                      <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${generationProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 font-mono overflow-y-auto max-h-[300px] whitespace-pre-line leading-relaxed scrollbar">
                        {generatedResult}
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => {
                            alert("Notes successfully pushed to Student Dashboard! Cohort notified via email.");
                            setGeneratedResult('');
                            setActiveModal(null);
                          }}
                          variant="primary" 
                          className="flex-1 uppercase font-black text-xs py-3 bg-white text-black"
                        >
                          Publish to Student Hub
                        </Button>
                        <Button 
                          onClick={() => setGeneratedResult('')}
                          variant="outline" 
                          className="flex-1 uppercase font-black text-xs py-3 border-white/10 text-white"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
