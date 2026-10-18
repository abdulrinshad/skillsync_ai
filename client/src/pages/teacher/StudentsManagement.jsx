import React, { useState, useEffect } from "react";
import { getTeacherStudents } from "../../services/teacherStudentService";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Eye,
  MessageSquare,
  Award,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
  Activity,
  Send,
  Download,
  FileText,
  AlertCircle,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Zap,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';

// Skeleton Stat Card
const SkeletonStat = () => (
  <div className="p-5 rounded-[1.8rem] border border-white/5 bg-[#0a0f24]/30 backdrop-blur-md space-y-3 animate-pulse">
    <div className="w-12 h-6 bg-white/10 rounded-lg" />
    <div className="w-24 h-4 bg-white/5 rounded" />
    <div className="w-16 h-3 bg-white/5 rounded" />
  </div>
);

// Skeleton Table Row
const SkeletonRow = () => (
  <tr className="border-b border-white/5 animate-pulse">
    <td className="py-4 px-6"><div className="w-10 h-10 bg-white/10 rounded-full" /></td>
    <td className="py-4 px-6"><div className="w-28 h-4 bg-white/10 rounded" /></td>
    <td className="py-4 px-6"><div className="w-32 h-4 bg-white/5 rounded" /></td>
    <td className="py-4 px-6"><div className="w-36 h-4 bg-white/10 rounded" /></td>
    <td className="py-4 px-6"><div className="w-20 h-4 bg-white/5 rounded" /></td>
    <td className="py-4 px-6"><div className="w-24 h-3 bg-white/10 rounded-full" /></td>
    <td className="py-4 px-6"><div className="w-20 h-5 bg-white/5 rounded-full" /></td>
    <td className="py-4 px-6"><div className="w-16 h-5 bg-white/5 rounded-full" /></td>
    <td className="py-4 px-6"><div className="w-20 h-8 bg-white/10 rounded-xl" /></td>
  </tr>
);

const StudentsManagement = () => {
  const navigate = useNavigate();

  // Mouse cursor glow positioning
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Data fetching state
  const [data, setData] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completedStudents: 0,
    certificatesIssued: 0,
    averageProgress: 0,
    studentSatisfaction: 0,
    students: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchStudents = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await getTeacherStudents();

    console.log("STUDENTS API:", response);

    setData(response);

  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchStudents();
}, []);
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Selected student drawer state
  const [selectedStudent, setSelectedStudent] = useState(null);

  

  // Calculate unique list of courses for course dropdown filter
  const courseList = Array.from(new Set(data.students.map(s => s.course))).filter(Boolean);

  // Filter & Sort calculation
  const filteredStudents = data.students
    .filter(s => {
      const matchesSearch = 
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesCourse = courseFilter === 'All' || s.course === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      }
      if (sortBy === 'Oldest') {
        return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
      }
      if (sortBy === 'Highest Progress') {
        return b.progress - a.progress;
      }
      if (sortBy === 'Lowest Progress') {
        return a.progress - b.progress;
      }
      return 0;
    });

  // Action Panel triggers
  const handleAnnouncement = () => {
    alert('Announcement dispatch system loaded. Ready to send messages to all matching cohort students.');
  };

  const handleExport = () => {
    alert('Exporting student catalog sheet in progress... Downloading CSV catalog.');
  };

  const handleIssueCertificates = () => {
    alert('Certificate manager initialized. Dispatching automatic certificates for all completed students.');
  };

  const handleGenerateReport = () => {
    alert('Student metrics synthesis system parsing current performance charts... Report compiled successfully.');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-32 bg-[#020617] -mx-4 lg:-mx-8 -my-6 lg:-my-8 px-4 lg:px-8 py-6 lg:py-8">
      {/* Background glowing mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0" />

      {/* Radial Hover Glow Cursor Tracker */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.06), transparent 45%)`
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Students
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-purple-400" />
              Monitor student progress, enrollments, achievements, certificates, engagement and course performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => navigate('/teacher/create-course')}
              variant="gradient"
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={14} /> Create Course
            </Button>
          </div>
        </motion.div>

        {/* TOP STATISTICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => <SkeletonStat key={idx} />)
          ) : (
            <>
              {[
                { label: 'Total Students', value: data.totalStudents, color: 'purple', desc: 'Registered accounts' },
                { label: 'Active Students', value: data.activeStudents, color: 'cyan', desc: 'Currently studying' },
                { label: 'Completed Students', value: data.completedStudents, color: 'green', desc: 'Finished curriculum' },
                { label: 'Certificates Issued', value: data.certificatesIssued, color: 'orange', desc: 'Credentials granted' },
                { label: 'Average Progress', value: `${data.averageProgress}%`, color: 'purple', desc: 'Overall success' },
                { label: 'Student Satisfaction', value: `${data.studentSatisfaction}%`, color: 'cyan', desc: 'High feedback score' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-[1.8rem] border border-white/5 bg-white/[0.01] backdrop-blur-md group hover:border-white/10 transition-colors"
                >
                  <div className="text-2xl font-black text-white mb-1">
                    {stat.value.toLocaleString()}
                  </div>
                  <div
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'cyan' ? 'text-cyan-400' :
                      stat.color === 'orange' ? 'text-orange-400' :
                      'text-purple-400'
                    }`}
                  >
                    {stat.label}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1">{stat.desc}</div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* SEARCH + FILTER BAR */}
        <GlassCard className="rounded-[1.8rem] border-white/5 p-5 flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-white/[0.01] to-transparent z-20">
          <div className="relative group w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, course..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <Filter size={12} className="mr-2 text-purple-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Statuses</option>
                <option value="Active" className="bg-slate-900">Active</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="Completed" className="bg-slate-900">Completed</option>
              </select>
            </div>

            {/* Course Filter */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <GraduationCap size={12} className="mr-2 text-cyan-400" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer max-w-[160px]"
              >
                <option value="All" className="bg-slate-900">All Courses</option>
                {courseList.map((c, i) => (
                  <option key={i} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/5 text-xs text-gray-400 flex-1 md:flex-initial">
              <SlidersHorizontal size={12} className="mr-2 text-orange-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none py-2 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Newest" className="bg-slate-900">Newest</option>
                <option value="Oldest" className="bg-slate-900">Oldest</option>
                <option value="Highest Progress" className="bg-slate-900">Highest Progress</option>
                <option value="Lowest Progress" className="bg-slate-900">Lowest Progress</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* ERROR STATE */}
        {error && (
          <div className="p-6 rounded-[2.5rem] border border-red-500/20 bg-red-950/20 flex items-center gap-4">
            <AlertCircle className="text-red-400 shrink-0" size={24} />
            <div>
              <h3 className="font-extrabold text-sm text-red-200">System Error Occurred</h3>
              <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* MAIN STUDENTS TABLE CONTAINER */}
        <div className="overflow-x-auto glass-card rounded-[2rem] border border-white/5 bg-[#0f172a]/20 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Avatar</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Course</th>
                <th className="py-4 px-6">Enrollment Date</th>
                <th className="py-4 px-6">Progress</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Certificate</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                        <Users size={32} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white">No Students Found</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto">
                          Students enrolled in your courses will appear here.
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate('/teacher/create-course')}
                        variant="gradient"
                        className="px-5 py-2.5 text-xs font-black uppercase tracking-wider"
                      >
                        Create Course
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-xs text-gray-300"
                  >
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                        {student.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-white">{student.studentName}</td>
                    <td className="py-4 px-6 font-medium text-gray-500">{student.studentEmail}</td>
                    <td className="py-4 px-6 font-semibold">{student.course}</td>
                    <td className="py-4 px-6 text-gray-500 font-semibold">
                      {new Date(student.enrollmentDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5 min-w-[110px]">
                        <span className="font-bold text-[11px] text-cyan-400 w-8">{student.progress}%</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        color={
                          student.status === 'Completed' ? 'green' :
                          student.status === 'In Progress' ? 'purple' :
                          'cyan'
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge color={student.certificate === 'Issued' ? 'green' : 'orange'}>
                        {student.certificate}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          title="View Profile Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => alert(`Opening dialog to chat with ${student.studentName}`)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Message Student"
                        >
                          <MessageSquare size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (student.certificate === 'Issued') {
                              alert(`Displaying certificate issued for ${student.studentName}`);
                            } else {
                              alert(`Enabling credentials portal to grant certification to ${student.studentName}`);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Certificate Details"
                        >
                          <Award size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW STUDENT DRAWER */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* Drawer Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black z-[100] backdrop-blur-sm"
            />

            {/* Sliding Drawer element */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-[#0c122c]/95 border-l border-white/5 backdrop-blur-2xl z-[110] shadow-2xl overflow-y-auto flex flex-col no-scrollbar"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0c122c]/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Student Blueprint Details</span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Contents */}
              <div className="p-6 flex-1 space-y-6">
                {/* Profile Overview Card */}
                <div className="flex flex-col items-center text-center p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] rounded-full" />
                  <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xl shadow-lg mb-4">
                    {selectedStudent.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-extrabold text-base text-white">{selectedStudent.studentName}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-semibold flex items-center gap-1.5 justify-center">
                    <Mail size={12} className="text-purple-400" /> {selectedStudent.studentEmail}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5 font-bold uppercase tracking-wider">
                    Member Since {new Date(selectedStudent.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </p>
                </div>

                {/* Course details card */}
                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Course enrollment details</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold">Course Title</span>
                      <span className="text-white font-extrabold line-clamp-1 mt-0.5">{selectedStudent.course}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold">Enrollment Date</span>
                      <span className="text-white font-extrabold mt-0.5 block">
                        {new Date(selectedStudent.enrollmentDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold">Completion Status</span>
                      <div className="mt-1">
                        <Badge
                          color={
                            selectedStudent.status === 'Completed' ? 'green' :
                            selectedStudent.status === 'In Progress' ? 'purple' :
                            'cyan'
                          }
                        >
                          {selectedStudent.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold">Certificates Granted</span>
                      <span className="text-white font-extrabold mt-0.5 block flex items-center gap-1">
                        <Award size={12} className="text-green-400" /> {selectedStudent.certificatesEarned} credential(s)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                      <span>Curriculum built completion progress</span>
                      <span className="text-cyan-400 font-extrabold">{selectedStudent.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        style={{ width: `${selectedStudent.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* STUDENT PERFORMANCE SECTION */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400">Core Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Learning Speed', value: `${selectedStudent.learningSpeed}%`, desc: 'Velocity index' },
                      { label: 'Engagement Score', value: `${selectedStudent.engagementScore}%`, desc: 'LMS interaction' },
                      { label: 'Consistency Score', value: `${selectedStudent.consistencyScore}%`, desc: 'Weekly learning streak' },
                      { label: 'Attendance Score', value: `${selectedStudent.attendanceScore}%`, desc: 'Live streams presence' }
                    ].map((metric, i) => (
                      <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <div className="text-lg font-black text-white">{metric.value}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{metric.label}</div>
                        <div className="text-[9px] text-gray-600 mt-0.5">{metric.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANALYTICS SECTION (RECHARTS) */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Activity Analytics Overviews</h4>

                  {/* 1. Progress Trend Line Chart */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-cyan-400" /> Progress Trend
                    </span>
                    <div className="h-[120px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedStudent.progressTrend}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <Tooltip contentStyle={{ background: '#090b1c', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '8px', fontSize: 10 }} />
                          <Line type="monotone" dataKey="progress" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2. Course Completion Pie Chart */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <PieIcon size={12} className="text-purple-400" /> Completion Rate Allocation
                    </span>
                    <div className="h-[120px] w-full flex items-center justify-between">
                      <div className="w-[120px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: selectedStudent.progress },
                                { name: 'Remaining', value: 100 - selectedStudent.progress }
                              ]}
                              innerRadius={22}
                              outerRadius={38}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              <Cell fill="#a855f7" />
                              <Cell fill="rgba(255,255,255,0.05)" />
                            </Pie>
                            <Tooltip contentStyle={{ background: '#090b1c', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px', fontSize: 10 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 pl-4 space-y-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex justify-between items-center text-purple-400">
                          <span>Completed:</span>
                          <span>{selectedStudent.progress}%</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500">
                          <span>Remaining:</span>
                          <span>{100 - selectedStudent.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Student Activity Bar Chart */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Activity size={12} className="text-orange-400" /> Weekly Activity (Study Hours)
                    </span>
                    <div className="h-[120px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedStudent.activity}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <Tooltip contentStyle={{ background: '#090b1c', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', fontSize: 10 }} />
                          <Bar dataKey="hours" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS PANEL */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direct operations panel</h4>
                  <div className="grid grid-cols-2 gap-3.5">
                    <Button
                      onClick={handleAnnouncement}
                      variant="outline"
                      className="p-3 py-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                    >
                      <Send className="text-purple-400" size={16} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Send Announcement</span>
                    </Button>

                    <Button
                      onClick={handleExport}
                      variant="outline"
                      className="p-3 py-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                    >
                      <Download className="text-green-400" size={16} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Export Student</span>
                    </Button>

                    <Button
                      onClick={handleIssueCertificates}
                      variant="outline"
                      className="p-3 py-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                    >
                      <Award className="text-cyan-400" size={16} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Issue Certificates</span>
                    </Button>

                    <Button
                      onClick={handleGenerateReport}
                      variant="outline"
                      className="p-3 py-4 flex flex-col items-center justify-center text-center gap-2 border-white/5 bg-white/[0.01] hover:bg-white/5 rounded-2xl cursor-pointer"
                    >
                      <FileText className="text-orange-400" size={16} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Generate Report</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsManagement;
