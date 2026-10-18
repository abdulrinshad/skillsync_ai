import {
  getMyCourses,
  deleteCourseById,
  publishCourseById
} from "../../services/courseService";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  DollarSign,
  Edit3,
  Trash2,
  ArrowUpRight,
  Cpu,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  Copy,
  Award,
  TrendingUp,
  FileText,
  Sparkles,
  Activity,
  Download,
  Check,
  X,
  Play,
  Video,
  Upload,
  BrainCircuit,
  PieChart as PieIcon,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Settings
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
  Cell
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

// Shimmer Skeleton Loader Component
const SkeletonCard = () => (
  <div className="p-6 rounded-[2.5rem] border border-white/5 bg-[#0a0f24]/30 backdrop-blur-md space-y-4 animate-pulse">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-full md:w-44 h-28 bg-white/5 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3 w-full">
        <div className="flex gap-2">
          <div className="w-16 h-5 bg-white/5 rounded-full" />
          <div className="w-24 h-5 bg-white/5 rounded-full" />
        </div>
        <div className="w-2/3 h-6 bg-white/10 rounded-lg" />
        <div className="flex gap-6">
          <div className="w-24 h-4 bg-white/5 rounded" />
          <div className="w-20 h-4 bg-white/5 rounded" />
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
        <div className="w-20 h-9 bg-white/5 rounded-xl" />
        <div className="w-20 h-9 bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

const ManageCourses = () => {
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await getMyCourses();

      console.log(response);

      setCourses(response.courses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Glow cursor state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRevenue, setFilterRevenue] = useState('all'); // 'all' | 'high' (> $20k) | 'low' (< $20k)
  const [sortBy, setSortBy] = useState('title'); // 'title' | 'students' | 'revenue' | 'rating'

  // Selection states (for bulk actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Graphical state
  const [chartTab, setChartTab] = useState('monthly'); // 'monthly' | 'growth'
  const [leaderboardTab, setLeaderboardTab] = useState('top'); // 'top' | 'enrolled' | 'rated' | 'revenue'


  // Modals state
  const [editingCourse, setEditingCourse] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [bulkExporting, setBulkExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      if (!window.confirm("Delete this course?")) return;

      await deleteCourseById(id);

      setCourses(prev =>
        prev.filter(course => course._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateCourse = (course) => {
    const duplicate = {
      ...course,
      id: Date.now(),
      title: `${course.title} (Copy)`,
      students: 0,
      earnings: 0,
      rating: 0.0,
      status: 'draft',
      progress: Math.min(course.approvalStatus, 50) // Reset built progress slightly
    };
    setCourses([...courses, duplicate]);
    alert(`Course blueprint duplicated as draft: ${duplicate.title}`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCourses(courses.map(c => c.id === editingCourse._id ? editingCourse : c));
    setEditingCourse(null);
    alert('Changes saved successfully.');
  };

  // Bulk operations
  const toggleSelectCourse = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map(c => c.id));
    }
  };

  const handleBulkPublish = () => {
    setCourses(courses.map(c => selectedIds.includes(c.id) ? { ...c, status: 'published' } : c));
    setSelectedIds([]);
    alert('Selected courses published.');
  };

  const handleBulkUnpublish = () => {
    setCourses(courses.map(c => selectedIds.includes(c.id) ? { ...c, status: 'draft' } : c));
    setSelectedIds([]);
    alert('Selected courses reverted to draft.');
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected courses?`)) {
      setCourses(courses.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkExport = () => {
    setBulkExporting(true);
    setExportProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setBulkExporting(false);
        alert(`Export complete! Generated catalog JSON for ${selectedIds.length} courses.`);
        setSelectedIds([]);
      }
    }, 150);
  };

  // Filters calculation
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;

    let matchesRevenue = true;
    if (filterRevenue === 'high') matchesRevenue = c.price >= 5000;
    if (filterRevenue === 'low') matchesRevenue = c.price < 5000;

    return matchesSearch && matchesCategory && matchesStatus && matchesRevenue;
  }).sort((a, b) => {
    if (sortBy === 'students')
      return b.totalStudents - a.totalStudents;

    if (sortBy === 'revenue')
      return b.price - a.price;
    return 0;
  });

  // Overview metrics calculations
  const totalStudents = courses.reduce(
    (acc, curr) => acc + (curr.totalStudents || 0),
    0
  );

  const totalEarnings = courses.reduce(
    (acc, curr) => acc + (curr.price || 0),
    0
  );
  const activeCount = courses.filter(c => c.status === 'published').length;
  const draftCount = courses.filter(c => c.status === 'draft').length;

  // Recharts Chart datasets
  const monthlyEarningsData = [
    { name: 'Jan', earnings: 14200, enrollments: 180 },
    { name: 'Feb', earnings: 22800, enrollments: 240 },
    { name: 'Mar', earnings: 35600, enrollments: 380 },
    { name: 'Apr', earnings: 51200, enrollments: 520 },
    { name: 'May', earnings: 84600, enrollments: 910 },
    { name: 'Jun', earnings: totalEarnings, enrollments: totalStudents }
  ];

  // Pie chart dataset (Category distribution)
  const categoryChartData = [
    { name: 'Artificial Intelligence', value: courses.filter(c => c.category === 'Artificial Intelligence').reduce((acc, curr) => acc + curr.earnings, 0), color: '#a855f7' },
    { name: 'WebGL & Graphics', value: courses.filter(c => c.category === 'WebGL & Graphics').reduce((acc, curr) => acc + curr.earnings, 0), color: '#ec4899' },
    { name: 'Cyber Security', value: courses.filter(c => c.category === 'Cyber Security').reduce((acc, curr) => acc + curr.earnings, 0), color: '#f59e0b' },
    { name: 'Software Engineering', value: courses.filter(c => c.category === 'Software Engineering').reduce((acc, curr) => acc + curr.earnings, 0), color: '#06b6d4' }
  ].filter(x => x.value > 0);

  // Leaderboard sets
  const leaderboardCourses = {
    top: [...courses].sort((a, b) => b.rating - a.rating).slice(0, 3),
    enrolled: [...courses].sort((a, b) => b.students - a.students).slice(0, 3),
    rated: [...courses].sort((a, b) => b.rating - a.rating).filter(c => c.rating > 0).slice(0, 3),
    revenue: [...courses].sort((a, b) => b.earnings - a.earnings).slice(0, 3)
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-32 bg-[#020617] -mx-4 lg:-mx-8 -my-6 lg:-my-8 px-4 lg:px-8 py-6 lg:py-8">
      {/* Background radial glowing mesh */}
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
              Manage Courses
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-purple-400" /> Monitor, edit and optimize your courses
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Header statistics counters */}
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-xs font-black uppercase text-purple-300 tracking-wider">
              Courses: <span className="text-white text-sm">{courses.length}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-xs font-black uppercase text-cyan-300 tracking-wider">
              Students: <span className="text-white text-sm">{totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 text-xs font-black uppercase text-green-300 tracking-wider">
              Revenue: <span className="text-white text-sm">${totalEarnings.toLocaleString()}</span>
            </div>
            <Button
              onClick={() => navigate('/teacher/create-course')}
              variant="gradient"
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={14} /> Create Course
            </Button>
          </div>
        </motion.div>


        {/* 3. COURSE STATISTICS OVERVIEW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {[
            { label: "Approved & Published", val: activeCount, color: "green", desc: "Published and live" },
            { label: "Draft / Pending", val: draftCount, color: "orange", desc: "Blueprints under review" },
            { label: "Published Items", val: activeCount, color: "purple", desc: "Total index assets" },
            { label: "Total Enrollments", val: totalStudents, prefix: "", color: "cyan", desc: "Registered accounts" },
            { label: "Revenue Generated", val: totalEarnings, prefix: "$", color: "green", desc: "Net royal royalties" },
            { label: "Completion Rate", val: 88.4, suffix: "%", color: "pink", desc: "Cohort success average" }
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-[1.8rem] border border-white/5 bg-white/[0.01] backdrop-blur-md group hover:border-white/10 transition-colors">
              <div className="text-2xl font-black text-white mb-1">
                {stat.prefix || ''}{stat.val.toLocaleString()}{stat.suffix || ''}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-wider ${stat.color === 'green' ? 'text-green-400' :
                stat.color === 'cyan' ? 'text-cyan-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'pink' ? 'text-pink-400' :
                      'text-orange-400'
                }`}>{stat.label}</div>
              <div className="text-[9px] text-gray-500 mt-1">{stat.desc}</div>
            </div>
          ))}
        </motion.div>


        {/* SEARCH & FILTERS BAR */}
        <GlassCard className="rounded-[1.8rem] border-white/5 p-5 relative overflow-hidden flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-white/[0.01] to-transparent z-20">
          {/* Search Input */}
          <div className="relative group w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus blueprints, category tags..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all text-white placeholder:text-gray-600"
            />
          </div>

          {/* Filter selection tools */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

            {/* Category selection */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <Filter size={12} className="mr-2 text-purple-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Categories</option>
                <option value="Artificial Intelligence" className="bg-slate-900">AI Core</option>
                <option value="WebGL & Graphics" className="bg-slate-900">WebGL & Graphics</option>
                <option value="Cyber Security" className="bg-slate-900">Cyber Security</option>
                <option value="Software Engineering" className="bg-slate-900">Software Eng.</option>
              </select>
            </div>

            {/* Status selection */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <Badge color="purple" className="mr-2 animate-pulse-slow font-black">AI</Badge>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Statuses</option>
                <option value="published" className="bg-slate-900">Published</option>
                <option value="draft" className="bg-slate-900">Draft Blueprint</option>
              </select>
            </div>

            {/* Revenue Filter */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <DollarSign size={12} className="mr-2 text-green-400" />
              <select
                value={filterRevenue}
                onChange={(e) => setFilterRevenue(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Pricing</option>
                <option value="high" className="bg-slate-900">High (&gt;$20K)</option>
                <option value="low" className="bg-slate-900">Low (&lt;$20K)</option>
              </select>
            </div>

            {/* Sort Selection */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <SlidersHorizontal size={12} className="mr-2 text-cyan-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="title" className="bg-slate-900">Sort by Title</option>
                <option value="students" className="bg-slate-900">Sort by Students</option>
                <option value="revenue" className="bg-slate-900">Sort by Revenue</option>
                <option value="rating" className="bg-slate-900">Sort by Rating</option>
              </select>
            </div>

          </div>
        </GlassCard>


        {/* MAIN SPLIT PANEL GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT 2/3 COLUMN: SKELETONS / LIST OF CARDS */}
          <div className="xl:col-span-2 space-y-6">

            {/* Checked items count indicator */}
            <div className="flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filteredCourses.length > 0 && selectedIds.length === filteredCourses.length}
                  onChange={toggleSelectAll}
                  className="rounded border-white/10 text-purple-600 bg-white/5 focus:ring-0 cursor-pointer"
                />
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Select All Course Blueprints</span>
              </div>
              <span className="text-gray-500 font-medium">Showing {filteredCourses.length} of {courses.length} courses</span>
            </div>

            {/* Shimmer loading / card list switcher */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeletons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </motion.div>
              ) : filteredCourses.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center rounded-[2.5rem] border border-white/5 bg-slate-950/40 backdrop-blur-xl flex flex-col items-center justify-center space-y-3"
                >
                  <AlertTriangle className="text-gray-600 animate-bounce" size={32} />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">No courses match query guidelines</h3>
                    <p className="text-xs text-gray-500 mt-1">Try resetting filter dropdown fields or refining search terms.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="courses-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredCourses.map((course) => {
                    const isSelected = selectedIds.includes(course._id);
                    return (
                      <motion.div
                        key={course._id}
                        layout
                        onClick={() => navigate(`/teacher/courses/${course._id}`)}
                        className={`p-5 rounded-[2rem] border relative overflow-hidden transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-purple-500/[0.03] border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.05)]'
                          : 'bg-white/[0.01] border-white/5 hover:border-cyan-500/20'
                          }`}
                      >
                        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10" onClick={(e) => e.stopPropagation()}>

                          {/* Selector checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCourse(course._id)}
                            className="rounded border-white/10 text-purple-600 bg-white/5 focus:ring-0 cursor-pointer md:shrink-0"
                          />

                          {/* Image Thumbnail */}
                          <div className="w-full md:w-36 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 relative">
                            <img
                              src={
                                course.thumbnail ||
                                "https://via.placeholder.com/300x200"
                              }
                              className="w-full h-full object-cover"
                              alt={course.title}
                            />
                            <div className="absolute top-2 left-2">
                              {course.approvalStatus === 'approved' ? (
                                <Badge color="green">Approved & Published</Badge>
                              ) : course.approvalStatus === 'rejected' ? (
                                <Badge color="red">Rejected</Badge>
                              ) : (
                                <Badge color="orange">Pending Review</Badge>
                              )}
                            </div>
                          </div>

                          {/* Course descriptions */}
                          <div className="flex-1 space-y-2 text-center md:text-left w-full">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                {course.category}
                              </span>
                              {course.status > 0 && (
                                <span className="text-[10px] text-yellow-500 font-black flex items-center gap-0.5">
                                  ★ {course.status}
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-sm leading-snug text-white line-clamp-1">{course.title}</h3>

                            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              <div>
                                <span className="block text-[8px] text-gray-600">Students</span>
                                <span className="text-white font-extrabold flex items-center gap-1 mt-0.5">
                                  <Users size={10} className="text-cyan-400" />
                                  {course.totalStudents.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-600">Royalties</span>
                                <span className="text-white font-extrabold flex items-center gap-1 mt-0.5">
                                  <DollarSign size={10} className="text-green-400" />
                                  ${course.price.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-600">Curriculum Built</span>
                                <span className="text-white font-extrabold flex items-center gap-1 mt-0.5">
                                  <SlidersHorizontal size={10} className="text-purple-400" />
                                  {course.approvalStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action triggers */}
                          <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-center md:justify-end items-center">
                            <button
                               onClick={() => navigate(`/teacher/courses/${course._id}`)}
                               className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                               title="Manage Workspace"
                             >
                               <Edit3 size={14} />
                             </button>

                            <button
                              onClick={() => setPreviewCourse(course)}
                              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                              title="Live preview"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleDuplicateCourse(course)}
                              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                              title="Duplicate course"
                            >
                              <Copy size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
                              title="Delete blueprint"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>


            {/* 9. REVENUE ANALYTICS WIDGET */}
            <GlassCard className="rounded-[2rem] border-white/5 p-6 space-y-6 bg-gradient-to-b from-white/[0.01] to-transparent">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Academy Analytics overview</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Recharts analytical evaluations for royalties and cohort growth trajectories</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-wider shrink-0">
                  <button
                    onClick={() => setChartTab('monthly')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${chartTab === 'monthly' ? 'bg-purple-600 text-white font-extrabold' : 'text-gray-400 hover:text-white'}`}
                  >
                    Earnings
                  </button>
                  <button
                    onClick={() => setChartTab('growth')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${chartTab === 'growth' ? 'bg-purple-600 text-white font-extrabold' : 'text-gray-400 hover:text-white'}`}
                  >
                    Cohort Growth
                  </button>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartTab === 'monthly' ? (
                    <BarChart data={monthlyEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <Tooltip contentStyle={{ background: 'rgba(9, 11, 28, 0.95)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px' }} />
                      <Bar dataKey="earnings" name="Royalties ($)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={monthlyEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <Tooltip contentStyle={{ background: 'rgba(9, 11, 28, 0.95)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="enrollments" name="Active Enrolled" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#glowArea)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>


          {/* RIGHT COLUMN: CAROUSEL LEADERBOARDS & AI INSIGHTS & ACTIONS */}
          <div className="space-y-10">

            {/* 10. QUICK ACTIONS SHORTCUTS */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Quick Operations</h4>
                <p className="text-[10px] text-gray-500 font-medium">Direct workspace actions and shortcut tools</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate('/teacher/create-course')}
                  variant="outline"
                  className="p-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                >
                  <Plus className="text-purple-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Create Course</span>
                </Button>

                <Button
                  onClick={() => alert('Launching holographic live class settings...')}
                  variant="outline"
                  className="p-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                >
                  <Video className="text-green-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Live Class</span>
                </Button>

                <Button
                  onClick={() => alert('Launching files content indexing panel...')}
                  variant="outline"
                  className="p-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                >
                  <Upload className="text-cyan-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Upload lectures</span>
                </Button>

                <Button
                  onClick={() => alert('Launching quiz templates generation dialog...')}
                  variant="outline"
                  className="p-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                >
                  <BrainCircuit className="text-pink-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-wider">AI Quiz</span>
                </Button>
              </div>
            </section>


            {/* 6. AI INSIGHTS HEALTH CHECK */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">AI Performance insights</h4>
                <p className="text-[10px] text-gray-500 font-medium">Contextual diagnostics parsed from student analytics</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-white/5 p-6 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 relative overflow-hidden space-y-6">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={16} />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Course Health</span>
                  </div>
                  <Badge color="cyan">96% Excellent</Badge>
                </div>

                <div className="space-y-4 text-xs font-semibold leading-relaxed">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> Suggested Improvement
                    </div>
                    <p className="text-[11px] text-gray-300">
                      WebGL dropouts detected in Module 2. Consider generating code-sandbox notes to boost completion.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb size={10} /> Optimization Tip
                    </div>
                    <p className="text-[11px] text-gray-300">
                      AI modeling queries peaked during Generative AI course stream. spontaneous Live Q&A recommended.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </section>


            {/* 5. COURSE LEADERBOARDS CAROUSEL */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Academy Performance Leaderboards</h4>
                <p className="text-[10px] text-gray-500 font-medium">Top categories parsed across metrics filters</p>
              </div>

              <GlassCard className="rounded-[2.5rem] border-white/5 p-6 bg-gradient-to-br from-white/[0.01] to-transparent">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-wider mb-4 overflow-x-auto no-scrollbar gap-1">
                  {[
                    { id: 'top', label: 'Top Rated' },
                    { id: 'enrolled', label: 'Most Enrolled' },
                    { id: 'revenue', label: 'Revenue leaders' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setLeaderboardTab(tab.id)}
                      className={`flex-1 text-center py-2 px-2.5 rounded transition-all cursor-pointer whitespace-nowrap ${leaderboardTab === tab.id
                        ? 'bg-purple-600 text-white font-extrabold'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3.5">
                  {leaderboardCourses[leaderboardTab]?.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center font-black text-[10px] text-purple-400">
                          #{idx + 1}
                        </span>
                        <div className="font-bold text-white line-clamp-1 w-[130px]">{item.title}</div>
                      </div>

                      <span className="text-[11px] font-black text-cyan-400">
                        {leaderboardTab === 'top' && `${item.rating} ★`}
                        {leaderboardTab === 'enrolled' && `${item.students.toLocaleString()} students`}
                        {leaderboardTab === 'revenue' && `$${item.earnings.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>


            {/* 7. RECENT ACTIVITY FEED */}
            <section className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Real-Time Activity Feed</h4>
                <p className="text-[10px] text-gray-500 font-medium">Live logs for student checkpoints</p>
              </div>

              <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden divide-y divide-white/5">
                {[
                  { name: "Alex Rivera", act: "enrolled in", target: "Generative AI Foundations", time: "2 mins ago" },
                  { name: "Chloe Jenkins", act: "submitted review", target: "Neural Networks: 5 stars ★", time: "1 hour ago" },
                  { name: "Yuki Tanaka", act: "completed final project on", target: "WebGL Graphics", time: "3 hours ago" }
                ].map((act, i) => (
                  <div key={i} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white font-bold">{act.name}</strong>{' '}
                      <span className="text-gray-500">{act.act}</span>
                      <div className="text-[11px] text-gray-400 font-semibold mt-0.5 line-clamp-1">{act.target}</div>
                    </div>
                    <span className="text-[9px] text-gray-600 font-bold uppercase shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </div>

      {/* 8. BULK ACTIONS SLIDING PANEL (Appear when elements selected) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between gap-4"
          >
            <div className="text-xs font-bold text-gray-300">
              <span className="text-purple-400 font-extrabold text-sm mr-1.5">{selectedIds.length}</span>
              Blueprints Selected
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleBulkPublish}
                variant="outline"
                className="py-2 px-3 text-[10px] font-black uppercase tracking-wider border-white/10 hover:bg-white/5 text-green-400"
              >
                Publish
              </Button>
              <Button
                onClick={handleBulkUnpublish}
                variant="outline"
                className="py-2 px-3 text-[10px] font-black uppercase tracking-wider border-white/10 hover:bg-white/5 text-orange-400"
              >
                Unpublish
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="py-2 px-3 text-[10px] font-black uppercase tracking-wider border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </Button>
              <Button
                onClick={handleBulkExport}
                disabled={bulkExporting}
                variant="primary"
                className="py-2 px-4 text-[10px] font-black uppercase tracking-wider bg-white text-black hover:bg-gray-200"
              >
                {bulkExporting ? `Exporting (${exportProgress}%)` : 'Export Catalog'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* INTERACTIVE EDIT MODULE MODAL */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCourse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-8 shadow-2xl z-10 space-y-6"
            >
              <button
                onClick={() => setEditingCourse(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Edit3 className="text-purple-400" size={20} /> Edit Course Blueprint
                </h3>
                <p className="text-xs text-gray-500 mt-1">Configure live metadata tags and catalog categories</p>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Course Title</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Category</label>
                    <select
                      value={editingCourse.category}
                      onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white cursor-pointer"
                    >
                      <option value="Artificial Intelligence" className="bg-slate-900">Artificial Intelligence</option>
                      <option value="WebGL & Graphics" className="bg-slate-900">WebGL & Graphics</option>
                      <option value="Cyber Security" className="bg-slate-900">Cyber Security</option>
                      <option value="Software Engineering" className="bg-slate-900">Software Engineering</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Status</label>
                    <select
                      value={editingCourse.status}
                      onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white cursor-pointer"
                    >
                      <option value="published" className="bg-slate-900">Published</option>
                      <option value="draft" className="bg-slate-900">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Royalties ($)</label>
                    <input
                      type="number"
                      value={editingCourse.price}
                      onChange={(e) => setEditingCourse({ ...editingCourse, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Cohort progress (%)</label>
                    <input
                      type="number"
                      value={editingCourse.approvalStatus}
                      onChange={(e) => setEditingCourse({ ...editingCourse, approvalStatus: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider mt-2"
                >
                  Save Configuration changes
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* INTERACTIVE PREVIEW MODAL */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCourse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-6 shadow-2xl z-10 space-y-6"
            >
              <button
                onClick={() => setPreviewCourse(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="h-40 relative rounded-2xl border border-white/5 overflow-hidden bg-slate-900">
                <img
                  src={
                    previewCourse.thumbnail ||
                    "https://via.placeholder.com/300x200"
                  }
                />
                <div className="absolute top-3 left-3">
                  <Badge color="purple">{previewCourse.category}</Badge>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-lg text-xs font-black text-green-400 border border-white/5">
                  Price: ${previewCourse.price.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-base text-white">{previewCourse.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">Instructor: Dr. Sarah Chen • Lead AI Faculty</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-500 uppercase">Syllabus Completion</span>
                    <span className="text-cyan-400">{previewCourse.approvalStatus}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" style={{ width: `${previewCourse.approvalStatus}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs font-semibold text-gray-400">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Active cohort</span>
                    <span className="text-white font-extrabold mt-0.5 block">{previewCourse.totalStudents.toLocaleString()} students</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Average cohort rating</span>
                    <span className="text-white font-extrabold mt-0.5 block">★ {previewCourse.status || 'N/A'}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setPreviewCourse(null);
                    alert(`Directing mock learning flow for: ${previewCourse.title}`);
                  }}
                  variant="gradient"
                  className="w-full py-3 text-xs font-black uppercase tracking-wider"
                >
                  Join Mock Classroom
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageCourses;
