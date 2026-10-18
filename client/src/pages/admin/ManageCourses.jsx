import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, Eye, CheckCircle, XCircle,
  MoreVertical, Star, Users, DollarSign, AlertTriangle,
  Sparkles, Layers, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'
  };
  return (
    <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color]} flex items-center gap-1 w-fit ${className}`}>
      {children}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold" style={{ color: entry.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: {entry.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const enrollmentData = [
  { name: 'Mon', enrollments: 120 },
  { name: 'Tue', enrollments: 180 },
  { name: 'Wed', enrollments: 250 },
  { name: 'Thu', enrollments: 210 },
  { name: 'Fri', enrollments: 290 },
  { name: 'Sat', enrollments: 380 },
  { name: 'Sun', enrollments: 420 },
];



const ManageCoursesAdmin = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/courses/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Courses:", res.data);

    setCourses(
  Array.isArray(res.data)
    ? res.data
    : res.data.courses || []
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const filteredCourses = courses.filter((course) => {
  const matchesSearch =
    course.title?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    activeFilter === "All"
      ? true
      : activeFilter === "approved"
        ? (course.approvalStatus === "approved" || course.approvalStatus === "published")
        : course.approvalStatus === activeFilter;

  return matchesSearch && matchesFilter;
});

  
const handleViewCourse = async (id) => {
  try {
    const token = localStorage.getItem("token_admin") || localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/courses/admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedCourse(res.data);
  } catch (error) {
    console.error(error);
  }
};

const approveCourse = async (id) => {
  try {
    const token = localStorage.getItem("token_admin") || localStorage.getItem("token");

    const res = await axios.patch(
      `http://localhost:5000/api/courses/admin/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API RESPONSE:", res.data);
    alert("Course approved and published successfully");

    fetchCourses();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to approve course.");
  }
};

const rejectCourse = async (id) => {
  try {
    const token = localStorage.getItem("token_admin") || localStorage.getItem("token");

    await axios.patch(
      `http://localhost:5000/api/courses/admin/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Course rejected successfully");
    fetchCourses();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to reject course.");
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

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading Courses...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-cyan-500/30">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Content Management</h1>
            <p className="text-gray-400 mt-1">Review platform courses, enforce quality standards, and manage catalog categories.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2"><Layers size={16} /> Categories</Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-cyan-500/20"><Sparkles size={16} /> Global Featured</Button>
          </div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Published Courses', value: '4,285', icon: FileText, color: 'blue', trend: '+140 this week' },
            { label: 'Pending Reviews', value: '124', icon: Eye, color: 'orange', trend: 'Requires action' },
            { label: 'Flagged Content', value: '12', icon: AlertTriangle, color: 'red', trend: 'Critical alerts' },
            { label: 'Global Enrollments', value: '2.4M', icon: Users, color: 'cyan', trend: '+45k this week' },
          ].map((stat, idx) => (
            <GlassCard key={idx} className="p-5 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
              <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400 w-fit mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</h3>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">{stat.trend}</p>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <GlassCard className="p-0 overflow-hidden lg:col-span-2 flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {['All', 'approved', 'pending', 'rejected'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${activeFilter === filter ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Course Info</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">
                      Price
                    </th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-200 text-sm truncate max-w-[200px]">
                          {course.title}
                        </p>

                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {course.teacherId?.fullName}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                          {course.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          color={
                            (course.approvalStatus === "approved" || course.approvalStatus === "published")
                              ? "green"
                              : course.approvalStatus === "rejected"
                                ? "red"
                                : "orange"
                          }
                        >
                          {course.approvalStatus || "pending"}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-cyan-400">
                          ₹{course.price || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {!(course.approvalStatus === "approved" || course.approvalStatus === "published") ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="success"
                              className="!p-1.5 rounded-lg"
                              onClick={() => approveCourse(course._id)}
                            >
                              <CheckCircle size={16} />
                            </Button>

                            <Button
                              variant="danger"
                              className="!p-1.5 rounded-lg"
                              onClick={() => rejectCourse(course._id)}
                            >
                              <XCircle size={16} />
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
                            onClick={() => handleViewCourse(course._id)}
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles size={18} className="text-cyan-400" />
                <h3 className="font-bold text-sm">AI Content Guard</h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className="text-rose-400" />
                    <span className="text-xs font-bold text-gray-200">Plagiarism Detected</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Course "Crypto Trading Algorithms" shares 85% syllabus overlap with an existing top-tier course. Review required.</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-gray-200">Auto-Approval Running</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Processing 42 course submissions from Verified Instructors (Quality Score &gt; 95).
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Platform Enrollments</h3>
                <TrendingUp size={16} className="text-cyan-400" />
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient id="colorEnrolls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="enrollments" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEnrolls)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default ManageCoursesAdmin;
