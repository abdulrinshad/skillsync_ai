import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Calendar,
  CheckCircle,
  Award,
  ChevronRight,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";

const ContinueLearningWidget = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchContinueLearning = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/progress/continue-learning", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load continue learning progress list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContinueLearning();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-8 rounded-[2.5rem] border-white/5 animate-pulse space-y-6 h-80 flex flex-col justify-between">
        <div className="flex gap-6 items-center">
          <div className="w-40 h-24 rounded-2xl bg-white/5 shrink-0" />
          <div className="space-y-3 w-full">
            <div className="h-4 bg-white/5 rounded-full w-2/3" />
            <div className="h-3 bg-white/5 rounded-full w-1/2" />
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full w-full" />
        <div className="h-10 bg-white/5 rounded-2xl w-32" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <GlassCard className="p-8 rounded-[2.5rem] border-white/5 text-center space-y-4">
        <div className="w-16 h-16 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center mx-auto">
          <BookOpen size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Start Your Learning Journey</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Explore our wide catalog of AI and software engineering courses to begin earning XP.</p>
        </div>
        <Link to="/dashboard/explore" className="inline-block">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center gap-2">
            Explore Courses <ArrowRight size={14} />
          </Button>
        </Link>
      </GlassCard>
    );
  }

  const activeCourse = courses[activeIndex];
  const thumbnail = activeCourse.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800";

  const handleResume = (course) => {
    if (!course.activeModule) {
      navigate(`/courses/${course.courseId}`);
      return;
    }
    navigate(`/courses/${course.courseId}/modules/${course.activeModule._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
            <Play size={20} fill="currentColor" />
          </div>
          Continue Learning
        </h2>
        
        {courses.length > 1 && (
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {courses.length} courses in progress
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Active Hero Course Details */}
        <motion.div
          layout
          key={activeCourse.courseId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-card p-6 md:p-8 rounded-[2.5rem] border-purple-500/20 bg-gradient-to-br from-purple-950/5 via-transparent to-cyan-950/5 flex flex-col gap-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Thumbnail */}
            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden relative shrink-0">
              <img src={thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={activeCourse.courseTitle} />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleResume(activeCourse)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-extrabold text-xl leading-tight text-white group-hover:text-purple-400 transition-colors">
                    {activeCourse.courseTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Instructor: {activeCourse.instructorName}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-white">{activeCourse.totalProgress}%</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Overall</span>
                </div>
              </div>

              {activeCourse.activeModule ? (
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span className="truncate max-w-[70%]">Module: {activeCourse.activeModule.title}</span>
                    <span className="text-purple-400">{activeCourse.activeModule.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${activeCourse.activeModule.progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">No module activity recorded. Click resume to start.</div>
              )}
            </div>
          </div>

          {/* Dynamic Action & Statistics Bar */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Clock size={14} /> <span>{activeCourse.timeRemainingHours} hrs left</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Calendar size={14} /> <span>Est: {new Date(activeCourse.completionDatePrediction).toLocaleDateString()}</span>
              </div>
            </div>

            {activeCourse.completed ? (
              <div className="flex gap-2">
                <Link to="/dashboard/certificates">
                  <Button className="py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-2">
                    <Award size={12} /> Claim Certificate
                  </Button>
                </Link>
                <Link to={`/courses/${activeCourse.courseId}`}>
                  <Button variant="outline" className="py-2.5 px-6 border-white/10 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl">
                    Review Details
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => handleResume(activeCourse)}
                className="py-3 px-8 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                <Play size={12} fill="currentColor" /> {activeCourse.activeLecture ? `Resume: ${activeCourse.activeLecture.title}` : "Resume Learning"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Secondary Courses List */}
        {courses.length > 1 && (
          <div className="lg:col-span-4 space-y-3 w-full">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-2">Other Enrolled Courses</h4>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {courses.map((course, idx) => {
                if (idx === activeIndex) return null;
                const cardThumb = course.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800";
                return (
                  <div
                    key={course.courseId}
                    onClick={() => setActiveIndex(idx)}
                    className="p-3 bg-white/[0.02] border border-white/5 hover:border-purple-500/20 rounded-2xl cursor-pointer flex items-center gap-4 transition-all duration-300 group/item"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                      <img src={cardThumb} className="w-full h-full object-cover" alt={course.courseTitle} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-300 line-clamp-1 group-hover/item:text-purple-400 transition-colors">
                        {course.courseTitle}
                      </h5>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-semibold text-gray-500">
                        <span>{course.totalProgress}% done</span>
                        <span>{course.timeRemainingHours} hrs left</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-700 group-hover/item:text-white transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueLearningWidget;
