import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCourse } from "../../services/courseService";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Plus,
  Trash2,
  Cpu,
  Video,
  Upload,
  CheckCircle,
  ChevronDown,
  Eye,
  Save,
  Globe,
  Clock,
  DollarSign,
  Percent,
  Users,
  PlusCircle,
  FileText,
  BrainCircuit,
  ArrowUp,
  ArrowDown,
  Image,
  X,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/ui';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Cursor glow state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCreateCourse = async () => {
    try {
      if (!courseTitle.trim()) {
        return toast.error("Course title is required");
      }

      if (!courseDesc.trim()) {
        return toast.error("Course description is required");
      }

      setLoading(true);

      const payload = {
        title: courseTitle,
        description: courseDesc,
        thumbnail: thumbnailUrl || "",

        category: courseCategory,
        level: courseLevel,
        language: courseLanguage,
        duration: courseDuration,

        price: isPaid ? Number(coursePrice || 0) : 0,
        discount: Number(courseDiscount || 0),
        enrollmentLimit: Number(enrollmentLimit || 0),

        outcomes,
        prerequisites,

        curriculum: curriculum.map((module) => ({
          title: module.title,
          lessons: module.lessons.map((lesson) => ({
            title: lesson.title,
            type: lesson.type,
          })),
        })),

        status: "draft",
      };

      console.log("COURSE PAYLOAD", payload);

      const response = await createCourse(payload);

      toast.success(
        response?.data?.message ||
        response?.message ||
        "Course created successfully"
      );

      navigate("/teacher/courses");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  // Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('Artificial Intelligence');
  const [courseLevel, setCourseLevel] = useState('Intermediate');
  const [courseLanguage, setCourseLanguage] = useState('English');
  const [courseDuration, setCourseDuration] = useState('');

  // Thumbnail State
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Pricing & Enrollment State
  const [isPaid, setIsPaid] = useState(true);
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDiscount, setCourseDiscount] = useState('');
  const [enrollmentLimit, setEnrollmentLimit] = useState('');

  // Learning Outcomes State
  const [outcomes, setOutcomes] = useState([
    'Understand mathematical formulations of backpropagation gradients',
    'Design and train multi-layer Transformer blocks from scratch'
  ]);
  const [newOutcome, setNewOutcome] = useState('');

  // Prerequisites State
  const [prerequisites, setPrerequisites] = useState([
    'Proficiency in Python and NumPy',
    'Basic knowledge of vector calculus and linear algebra'
  ]);
  const [newPrereq, setNewPrereq] = useState('');

  // Curriculum State (Modules & Lessons)
  const [curriculum, setCurriculum] = useState([
    {
      id: 1,
      title: 'Module 1: Foundations & Prerequisites',
      lessons: [
        { id: 101, title: 'Course Overview & Workspace Setup', type: 'video' },
        { id: 102, title: 'Linear Algebra & Calculus Refresher', type: 'pdf' }
      ]
    }
  ]);

  // AI Assistant Panel State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadType, setAiLoadType] = useState(null); // 'outline' | 'outcomes' | 'quiz' | 'desc' | 'thumbnail'
  const [aiLogs, setAiLogs] = useState([]);

  // Form handlers
  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes([...outcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index) => {
    setOutcomes(outcomes.filter((_, i) => i !== index));
  };

  const handleAddPrereq = () => {
    if (newPrereq.trim()) {
      setPrerequisites([...prerequisites, newPrereq.trim()]);
      setNewPrereq('');
    }
  };

  const handleRemovePrereq = (index) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  // Thumbnail Simulation
  const handleThumbnailUploadSimulate = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setThumbnailUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800');
        }
      }, 150);
    }
  };

  const generateAiThumbnail = () => {
    setAiLoading(true);
    setAiLoadType('thumbnail');
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setAiLoading(false);
        setAiLoadType(null);
        // Random stunning high-tech preset images
        const presets = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
        ];
        const randomImage = presets[Math.floor(Math.random() * presets.length)];
        setThumbnailUrl(randomImage);
      }
    }, 100);
  };

  // Curriculum functions
  const handleAddModule = () => {
    const nextId = curriculum.length > 0 ? Math.max(...curriculum.map(m => m.id)) + 1 : 1;
    setCurriculum([...curriculum, {
      id: nextId,
      title: `Module ${nextId}: Untitled Module`,
      lessons: []
    }]);
  };

  const handleRemoveModule = (moduleId) => {
    setCurriculum(curriculum.filter(m => m.id !== moduleId));
  };

  const handleUpdateModuleTitle = (moduleId, title) => {
    setCurriculum(curriculum.map(m => m.id === moduleId ? { ...m, title } : m));
  };

  const handleAddLesson = (moduleId) => {
    setCurriculum(curriculum.map(m => {
      if (m.id === moduleId) {
        const nextLessId = m.lessons.length > 0 ? Math.max(...m.lessons.map(l => l.id)) + 1 : 101;
        return {
          ...m,
          lessons: [...m.lessons, { id: nextLessId, title: 'Untitled Lesson', type: 'video' }]
        };
      }
      return m;
    }));
  };

  const handleUpdateLesson = (moduleId, lessonId, key, value) => {
    setCurriculum(curriculum.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [key]: value } : l)
        };
      }
      return m;
    }));
  };

  const handleRemoveLesson = (moduleId, lessonId) => {
    setCurriculum(curriculum.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        };
      }
      return m;
    }));
  };

  const moveLesson = (moduleId, index, direction) => {
    const targetModule = curriculum.find(m => m.id === moduleId);
    if (!targetModule) return;

    const list = [...targetModule.lessons];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap elements
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    setCurriculum(curriculum.map(m => m.id === moduleId ? { ...m, lessons: list } : m));
  };

  // AI Generation helpers
  const triggerAiGenerator = (type) => {
    setAiLoading(true);
    setAiLoadType(type);
    setAiLogs(['Initializing neural connections...', 'Scanning course contexts...']);

    let logSteps = [];
    if (type === 'outline') {
      logSteps = [
        'Parsing course title and keywords...',
        'Formulating modular learning pathways...',
        'Structuring lecture drafts and assessments...',
        'Compiling syllabus hierarchy database...',
        'Injecting custom modules...'
      ];
    } else if (type === 'outcomes') {
      logSteps = [
        'Analyzing industry competency benchmarks...',
        'Synthesizing actionable learning targets...',
        'Drafting Bloom\'s Taxonomy aligned sentences...',
        'Pushing outcome checkpoints...'
      ];
    } else if (type === 'desc') {
      logSteps = [
        'Structuring value propositions...',
        'Crafting marketing blueprints...',
        'Injecting optimization keywords for high CTR...',
        'Polishing course summary parameters...'
      ];
    } else if (type === 'quiz') {
      logSteps = [
        'Analyzing curriculum structures...',
        'Formulating diagnostic multiple choice questions...',
        'Adding cognitive distractors...',
        'Configuring scoring triggers...'
      ];
    }

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logSteps.length) {
        setAiLogs(prev => [...prev, logSteps[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setAiLoading(false);
        setAiLoadType(null);
        setAiLogs([]);

        // Populate states based on action
        if (type === 'outline') {
          const generatedTitle = courseTitle || 'Advanced Generative Models';
          setCurriculum([
            {
              id: 1,
              title: 'Module 1: Mathematical Principles & Variational Bounds',
              lessons: [
                { id: 201, title: 'Markov Chains & Gaussian Diffusion Math', type: 'video' },
                { id: 202, title: 'Variational Lower Bound Optimization Calculus', type: 'pdf' },
                { id: 203, title: 'Prerequisites Assessment Quiz', type: 'quiz' }
              ]
            },
            {
              id: 2,
              title: 'Module 2: Time-conditioned U-Net Configurations',
              lessons: [
                { id: 204, title: 'Symmetric Skip Connections & Cross Attention', type: 'video' },
                { id: 205, title: 'U-Net Spatial Resolution Loss Functions', type: 'video' },
                { id: 206, title: 'Coding Lab: Building U-Net from scratch', type: 'pdf' }
              ]
            },
            {
              id: 3,
              title: 'Module 3: Latent Formulations & Classifier-Free Guidance',
              lessons: [
                { id: 207, title: 'Latent Space vs Pixel Space sampling speeds', type: 'video' },
                { id: 208, title: 'CFG Multiplier parameter tuning workshop', type: 'video' },
                { id: 209, title: 'Final Capstone Project & Quiz', type: 'quiz' }
              ]
            }
          ]);
          if (!courseDuration) setCourseDuration('12 hours');
        } else if (type === 'outcomes') {
          setOutcomes(prev => [
            ...prev,
            'Implement classifier-free guidance factors to tune diffusion outputs',
            'Optimize neural pipelines using weight decay and cosine schedules',
            'Deploy local quantized LLM weights behind custom Web API endpoints'
          ]);
        } else if (type === 'desc') {
          setCourseDesc(`Unlock the full potential of next-generation AI pipelines with this masterclass on ${courseTitle || 'Generative Architectures'}. Designed for senior researchers and engineers, this course offers hands-on coding modules that take you from variational mathematical theory directly to customized training pipelines. You will build, fine-tune, and optimize high-end models, implementing causal masking, attention visualizers, and spatial convolutions with raw tensor math.`);
        } else if (type === 'quiz') {
          // Add a quiz lesson to the first module
          if (curriculum.length > 0) {
            setCurriculum(curriculum.map((m, idx) => {
              if (idx === 0) {
                const nextId = m.lessons.length > 0 ? Math.max(...m.lessons.map(l => l.id)) + 1 : 101;
                return {
                  ...m,
                  lessons: [...m.lessons, { id: nextId, title: 'AI-Generated Quiz: Attention Gradients & Dropout', type: 'quiz' }]
                };
              }
              return m;
            }));
          }
        }
      }
    }, 700);
  };

  // Completion calculation
  const getCompletionPercent = () => {
    let score = 0;
    if (courseTitle) score += 20;
    if (courseDesc) score += 20;
    if (thumbnailUrl) score += 15;
    if (outcomes.length > 0) score += 15;
    if (prerequisites.length > 0) score += 15;
    if (curriculum.some(m => m.lessons.length > 0)) score += 15;
    return score;
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-32 bg-[#020617] -mx-4 lg:-mx-8 -my-6 lg:-my-8 px-4 lg:px-8 py-6 lg:py-8">
      {/* Background Radial Glow Mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0" />

      {/* Radial Hover Glow Cursor Tracker */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.06), transparent 45%)`
        }}
      />

      <div className="relative z-10 space-y-10">

        {/* 1. PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Create New Course
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-400" /> Build and launch AI-powered learning experiences
            </p>
          </div>

          {/* Action buttons and profile badge */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Dr Sarah Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20">
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-purple-500/30 shrink-0">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="avatar" />
              </div>
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Sarah Chen (Gold Tier)</span>
            </div>

            <Button
              onClick={() => alert('Course blueprint saved successfully to draft folder.')}
              variant="outline"
              className="px-4 py-2.5 text-xs flex items-center gap-2 border-white/10 hover:bg-white/5"
            >
              <Save size={14} /> Save Draft
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={loading}
              variant="gradient"
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create Course <Globe size={14} />
                </>
              )}
            </Button>
          </div>
        </motion.div>


        {/* MAIN FORM AND PREVIEW GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT 2/3 COLUMN: FORMS AND CONSTRUCTORS */}
          <div className="xl:col-span-2 space-y-10">

            {/* 2. COURSE INFORMATION CARD */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-40 h-40 bg-purple-500/5 blur-[50px] pointer-events-none" />

              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <FileText className="text-purple-400" size={18} /> Course Metadata Blueprint
                </h3>
                <p className="text-xs text-gray-500 mt-1">Specify core configuration headers and information data sets</p>
              </div>

              <div className="space-y-4">
                {/* Title input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Generative AI Foundations & Transformer Architectures"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>

                {/* Description textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Short Description</label>
                  <textarea
                    rows={4}
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Synthesize a brief value pitch summarizing what student cohorts will learn..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm resize-none leading-relaxed"
                  />
                </div>

                {/* Dropdowns row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm cursor-pointer"
                    >
                      <option value="Artificial Intelligence" className="bg-slate-900">Artificial Intelligence</option>
                      <option value="Software Engineering" className="bg-slate-900">Software Engineering</option>
                      <option value="Data Structures" className="bg-slate-900">Data Science</option>
                      <option value="Cyber Security" className="bg-slate-900">Cyber Security</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Difficulty Level</label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm cursor-pointer"
                    >
                      <option value="Beginner" className="bg-slate-900">Beginner</option>
                      <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                      <option value="Advanced" className="bg-slate-900">Advanced Mathematical</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Language</label>
                    <select
                      value={courseLanguage}
                      onChange={(e) => setCourseLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm cursor-pointer"
                    >
                      <option value="English" className="bg-slate-900">English</option>
                      <option value="Spanish" className="bg-slate-900">Spanish</option>
                      <option value="Japanese" className="bg-slate-900">Japanese</option>
                      <option value="German" className="bg-slate-900">German</option>
                    </select>
                  </div>
                </div>

                {/* Duration input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Estimated Course Duration</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                      <Clock size={16} />
                    </div>
                    <input
                      type="text"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="e.g. 14.5 hours"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>


            {/* 3. THUMBNAIL UPLOAD SECTION */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-45 h-45 bg-cyan-500/5 blur-[50px] pointer-events-none" />

              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Image className="text-cyan-400" size={18} /> Course Thumbnail Media
                </h3>
                <p className="text-xs text-gray-500 mt-1">Upload high-res banners or deploy the AI image synthesizer co-pilot to generate abstract templates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Upload drag drop */}
                <div className="relative group border-2 border-dashed border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 bg-white/[0.01] hover:bg-cyan-500/[0.01] transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px]">
                  <input
                    type="file"
                    onChange={handleThumbnailUploadSimulate}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />

                  {isUploading ? (
                    <div className="space-y-3 flex flex-col items-center w-full">
                      <Cpu className="animate-spin text-cyan-400" size={24} />
                      <p className="text-xs font-bold">Uploading files to bucket...</p>
                      <div className="w-3/4 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
                      <p className="font-extrabold text-xs text-white">Click or drag local files here</p>
                      <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">JPEG or PNG, up to 8MB</p>
                    </>
                  )}
                </div>

                {/* Live upload preview / AI Generator */}
                <div className="space-y-4">
                  <div className="relative h-[120px] rounded-xl border border-white/5 overflow-hidden bg-slate-950/70 flex items-center justify-center">
                    {thumbnailUrl ? (
                      <>
                        <img src={thumbnailUrl} className="w-full h-full object-cover" alt="thumbnail preview" />
                        <button
                          onClick={() => setThumbnailUrl(null)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-600 font-bold text-xs gap-1">
                        <Image size={20} />
                        <span>No Thumbnail Set</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={generateAiThumbnail}
                    disabled={aiLoading}
                    variant="gradient"
                    className="w-full text-xs py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center gap-2"
                  >
                    {aiLoading && aiLoadType === 'thumbnail' ? (
                      <>
                        <Cpu className="animate-spin text-white" size={14} /> AI Synthesizing ({uploadProgress}%)
                      </>
                    ) : (
                      <>
                        <Wand2 size={14} /> Synthesize AI Thumbnail
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>


            {/* 4. PRICING & ENROLLMENT */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-35 h-35 bg-green-500/5 blur-[50px] pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <DollarSign className="text-green-400" size={18} /> Pricing & Cohort Limits
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure pricing tier schedules and maximal registration limits</p>
                </div>

                {/* Free or paid toggle slider */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setIsPaid(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${!isPaid ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setIsPaid(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${isPaid ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {isPaid ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Base Price (USD)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors">
                        <DollarSign size={16} />
                      </div>
                      <input
                        type="number"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        placeholder="99"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount (%)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors">
                        <Percent size={16} />
                      </div>
                      <input
                        type="number"
                        value={courseDiscount}
                        onChange={(e) => setCourseDiscount(e.target.value)}
                        placeholder="20"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Enrollment Limit</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors">
                        <Users size={16} />
                      </div>
                      <input
                        type="number"
                        value={enrollmentLimit}
                        onChange={(e) => setEnrollmentLimit(e.target.value)}
                        placeholder="0 (Unlimited)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-xs text-green-400/90 font-semibold">
                  This course will be published as Free. Any student registered in the portal will be able to enroll immediately.
                </div>
              )}
            </GlassCard>


            {/* 5. LEARNING OUTCOMES SECTION */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-35 h-35 bg-purple-500/5 blur-[50px] pointer-events-none" />

              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <CheckCircle className="text-purple-400" size={18} /> Course Learning Outcomes
                </h3>
                <p className="text-xs text-gray-500 mt-1">Outline what competencies student cohorts will master at graduation checkpoints</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="e.g. Fine-tune generative weights using LoRA adaptation"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOutcome();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddOutcome}
                    variant="outline"
                    className="p-3 border-white/10 hover:bg-white/5 rounded-xl shrink-0"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                {/* Outcomes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence initial={false}>
                    {outcomes.map((outcome, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 group hover:border-purple-500/20 transition-all"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="text-purple-400 shrink-0 mt-0.5" size={14} />
                          <span className="text-xs text-gray-300 font-semibold leading-relaxed">{outcome}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveOutcome(idx)}
                          className="text-gray-500 hover:text-red-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>


            {/* 6. COURSE REQUIREMENTS SECTION */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-35 h-35 bg-cyan-500/5 blur-[50px] pointer-events-none" />

              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <AlertTriangle className="text-cyan-400" size={18} /> Prerequisites & Course Requirements
                </h3>
                <p className="text-xs text-gray-500 mt-1">Flag diagnostic benchmarks and knowledge milestones needed prior to enrollment</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrereq}
                    onChange={(e) => setNewPrereq(e.target.value)}
                    placeholder="e.g. Conceptual understanding of SGD and loss calculation loops"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPrereq();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddPrereq}
                    variant="outline"
                    className="p-3 border-white/10 hover:bg-white/5 rounded-xl shrink-0"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                {/* Requirements list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence initial={false}>
                    {prerequisites.map((prereq, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 group hover:border-cyan-500/20 transition-all"
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="text-cyan-400 shrink-0 mt-0.5" size={14} />
                          <span className="text-xs text-gray-300 font-semibold leading-relaxed">{prereq}</span>
                        </div>
                        <button
                          onClick={() => handleRemovePrereq(idx)}
                          className="text-gray-500 hover:text-red-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>


            {/* 7. CURRICULUM BUILDER */}
            <GlassCard className="rounded-[2rem] border-white/5 p-8 relative overflow-hidden space-y-6">
              <div className="absolute right-0 top-0 w-40 h-40 bg-purple-500/5 blur-[50px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={18} /> Curriculum Syllabus Builder
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Organize modules, insert video streams, note worksheets, or code assessments</p>
                </div>

                <Button
                  onClick={handleAddModule}
                  variant="outline"
                  className="px-3.5 py-2 text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-2 border-white/10 text-white shrink-0"
                >
                  <Plus size={14} /> Add Module
                </Button>
              </div>

              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {curriculum.map((mod, modIdx) => (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 hover:border-white/10 transition-colors relative"
                    >
                      {/* Module Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center font-black text-xs text-purple-400">
                            #{modIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => handleUpdateModuleTitle(mod.id, e.target.value)}
                            className="flex-1 bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-white font-extrabold placeholder:text-gray-600"
                            placeholder="e.g. Module 1: Foundations of Deep Learning"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveModule(mod.id)}
                          className="text-gray-500 hover:text-red-400 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors py-1 px-2 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 size={12} /> Delete Module
                        </button>
                      </div>

                      {/* Lessons list inside Module */}
                      <div className="space-y-3">
                        {mod.lessons.length === 0 ? (
                          <div className="py-6 text-center text-xs text-gray-600 font-semibold border border-dashed border-white/5 rounded-xl">
                            No lessons added yet. Click "Add Lesson" below.
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {mod.lessons.map((less, lessIdx) => (
                              <motion.div
                                key={less.id}
                                layout
                                className="p-3 px-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-4 group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {/* Type indicators */}
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${less.type === 'video' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' :
                                    less.type === 'pdf' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                                      'bg-pink-500/15 text-pink-400 border-pink-500/25'
                                    }`}>
                                    {less.type === 'video' && <Video size={14} />}
                                    {less.type === 'pdf' && <FileText size={14} />}
                                    {less.type === 'quiz' && <BrainCircuit size={14} />}
                                  </div>

                                  <input
                                    type="text"
                                    value={less.title}
                                    onChange={(e) => handleUpdateLesson(mod.id, less.id, 'title', e.target.value)}
                                    className="flex-1 bg-transparent border-none p-0 text-xs focus:outline-none focus:ring-0 text-gray-300 font-bold placeholder:text-gray-700"
                                    placeholder="Lesson Title"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Lesson Type selector */}
                                  <select
                                    value={less.type}
                                    onChange={(e) => handleUpdateLesson(mod.id, less.id, 'type', e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-gray-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="video" className="bg-slate-900">Video</option>
                                    <option value="pdf" className="bg-slate-900">PDF Notes</option>
                                    <option value="quiz" className="bg-slate-900">Quiz</option>
                                  </select>

                                  {/* Reordering commands */}
                                  <div className="flex flex-col">
                                    <button
                                      onClick={() => moveLesson(mod.id, lessIdx, 'up')}
                                      disabled={lessIdx === 0}
                                      className="p-0.5 hover:text-white text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                      <ChevronUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => moveLesson(mod.id, lessIdx, 'down')}
                                      disabled={lessIdx === mod.lessons.length - 1}
                                      className="p-0.5 hover:text-white text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                      <ChevronDown size={12} />
                                    </button>
                                  </div>

                                  {/* Delete lesson */}
                                  <button
                                    onClick={() => handleRemoveLesson(mod.id, less.id)}
                                    className="p-1 hover:text-red-400 text-gray-600 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add Lesson action */}
                      <button
                        onClick={() => handleAddLesson(mod.id)}
                        className="w-full border border-dashed border-white/5 hover:border-purple-500/20 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-purple-400/80 hover:text-purple-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white/[0.005]"
                      >
                        <Plus size={12} /> Add Lesson Resource
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>

          </div>


          {/* RIGHT 1/3 COLUMN: AI ASSISTANT CORE & LIVE PREVIEW */}
          <div className="space-y-10">

            {/* 9. LIVE COURSE PREVIEW CARD */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Live Catalog Preview</h4>
                <p className="text-[10px] text-gray-500 font-medium">Observe how students view your course in the search catalog</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-white/5 p-6 bg-gradient-to-b from-[#0a0f24] to-[#020617] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[140px] bg-slate-950/80 border-b border-white/5 overflow-hidden rounded-t-2xl">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-cyan-900/40 flex items-center justify-center">
                      <div className="text-center space-y-1 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                        <Sparkles size={20} className="mx-auto text-purple-400 animate-pulse mb-1" />
                        <span>Media Placeholder</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge color="purple">{courseLevel}</Badge>
                  </div>
                </div>

                <div className="mt-40 space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base leading-snug text-white line-clamp-2">
                      {courseTitle || 'Untitled Course Blueprint'}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=50" className="w-full h-full object-cover" alt="avatar" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold">Dr. Sarah Chen • Lead AI Faculty</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                    {courseDesc || 'Course description details are automatically mirrored here as they are written in the description field...'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3 text-[10px] text-gray-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" />
                      <span>{courseDuration || 'No duration set'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-purple-400" />
                      <span>
                        {enrollmentLimit && parseInt(enrollmentLimit) > 0
                          ? `Limit: ${enrollmentLimit} seats`
                          : 'Unlimited seats'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing line */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Price Royalty</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        {isPaid ? (
                          <>
                            <span className="text-xl font-black text-green-400">
                              ${coursePrice ? Math.round(parseFloat(coursePrice) * (1 - (parseFloat(courseDiscount || '0') / 100))) : '99'}
                            </span>
                            {courseDiscount && parseFloat(courseDiscount) > 0 && (
                              <span className="text-xs text-gray-600 line-through font-bold">
                                ${coursePrice}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xl font-black text-green-400 uppercase">Free</span>
                        )}
                      </div>
                    </div>

                    <Badge color="cyan">{courseCategory}</Badge>
                  </div>
                </div>
              </GlassCard>
            </section>


            {/* 8. AI COURSE ASSISTANT PANEL */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">AI Generative Assistant</h4>
                <p className="text-[10px] text-gray-500 font-medium">Deploy generative algorithms to auto-complete metadata</p>
              </div>

              <GlassCard className="bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden rounded-[2.5rem] p-6 space-y-6">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none animate-pulse-slow" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 border border-white/10 animate-float shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white leading-none">Generative Co-Pilot</h3>
                    <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest mt-1 block">Active</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Enter a topic or title and deploy AI subagents to write outlines, outcomes, and full descriptions.
                </p>

                {aiLoading ? (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400 animate-pulse">
                      <Cpu size={14} className="animate-spin text-purple-400" />
                      <span>AI Agent thinking...</span>
                    </div>
                    <div className="space-y-1 font-mono text-[9px] text-gray-500 max-h-[100px] overflow-y-auto scrollbar">
                      {aiLogs.map((log, i) => (
                        <div key={i} className="flex gap-1">
                          <span className="text-purple-500">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      onClick={() => triggerAiGenerator('outline')}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wand2 size={12} /> Generate Course Outline
                    </button>

                    <button
                      onClick={() => triggerAiGenerator('outcomes')}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wand2 size={12} /> Generate Outcomes
                    </button>

                    <button
                      onClick={() => triggerAiGenerator('quiz')}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wand2 size={12} /> Generate Quiz Lesson
                    </button>

                    <button
                      onClick={() => triggerAiGenerator('desc')}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wand2 size={12} /> Generate Course Description
                    </button>
                  </div>
                )}

                {/* AI Suggestions Card */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb size={12} className="text-yellow-500" /> Blueprint Quality Score
                  </h4>

                  {/* Progress gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-400">Completeness</span>
                      <span className="text-purple-400">{getCompletionPercent()}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" style={{ width: `${getCompletionPercent()}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 text-[10px] font-semibold text-gray-400">
                    {[
                      { text: 'Add at least 3 learning outcomes', done: outcomes.length >= 3 },
                      { text: 'Write a comprehensive course description', done: courseDesc.length > 50 },
                      { text: 'Populate syllabus curriculum modules', done: curriculum.some(m => m.lessons.length > 0) }
                    ].map((sug, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {sug.done ? (
                          <Check size={10} className="text-green-400 shrink-0" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                        )}
                        <span className={sug.done ? 'text-gray-500 line-through' : 'text-gray-300'}>
                          {sug.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </GlassCard>
            </section>

          </div>

        </div>


        {/* 10. FINAL ACTION SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-[2rem] border border-white/5 bg-[#0a0f24]/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="font-extrabold text-sm">Review & Launch Checklist</h4>
            <p className="text-xs text-gray-500 mt-0.5">Ensure all metadata conforms to the catalog safety protocols.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => alert('Course blueprint saved successfully to draft folder.')}
              variant="outline"
              className="flex-1 md:flex-initial text-xs py-3 px-6 border-white/10 text-gray-300 hover:text-white"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => alert(`Opening Live Course Preview for: ${courseTitle || 'Untitled Course'}`)}
              variant="outline"
              className="flex-1 md:flex-initial text-xs py-3 px-6 border-white/10 text-gray-300 hover:text-white"
            >
              Preview Course
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={loading}
              variant="gradient"
              className="flex-1 md:flex-initial text-xs font-black uppercase tracking-wider py-3 px-8"
            >
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CreateCourse;
