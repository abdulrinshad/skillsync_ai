import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  BookOpen,
  ArrowRight,
  Star,
  Users,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          category: selectedCategory,
          level: selectedLevel,
          sort: sortBy
        }
      });
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Failed to load wishlist items:", err);
      toast.error("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [search, selectedCategory, selectedLevel, sortBy]);

  const handleRemoveFavorite = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removed from wishlist");
      setFavorites(favorites.filter(f => f._id !== courseId));
    } catch (err) {
      toast.error("Failed to remove favorite.");
    }
  };

  const handleEnroll = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      // Redirect to detail page to complete enrollment/purchase
      navigate(`/courses/${courseId}`);
    } catch (err) {
      toast.error("Enrollment routing failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Header */}
        <div>
          <Badge color="purple" className="mb-2">Wishlist</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Favorite Courses</h1>
          <p className="text-gray-400 text-sm mt-2">Saved programs and syllabus paths for your professional catalog.</p>
        </div>

        {/* Filter controls panel */}
        <div className="grid sm:grid-cols-12 gap-4 items-center bg-white/[0.01] border border-white/5 p-4 rounded-3xl">
          {/* Search bar */}
          <div className="sm:col-span-4 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/5 rounded-2xl text-xs font-bold text-gray-300 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/5 rounded-2xl text-xs font-bold text-gray-300 focus:outline-none"
            >
              <option value="recent">Recently Added</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          <div className="sm:col-span-2 text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block pr-2">
              {favorites.length} saved
            </span>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <GlassCard className="p-12 rounded-[3rem] border-white/5 text-center space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center mx-auto">
              <Heart size={36} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 mt-2">Browse the catalog to add courses you'd like to pursue later.</p>
            </div>
            <Link to="/dashboard/explore" className="inline-block">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl flex items-center gap-2">
                Explore Catalog <ArrowRight size={14} />
              </Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {favorites.map((course) => (
                <motion.div
                  layout
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 hover:border-purple-500/20 transition-all duration-300 group cursor-pointer relative"
                >
                  {/* Thumbnail */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                    
                    {/* Floating Heart Toggle */}
                    <button
                      onClick={(e) => handleRemoveFavorite(e, course._id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full flex items-center justify-center text-red-500 border border-white/10 transition-colors"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>

                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">Instructor: {course.instructorName}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={12} />
                        <span>{course.studentsEnrolled}</span>
                      </div>
                    </div>

                    {/* Enrollment progress status bar */}
                    {course.enrolled ? (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">Learning Progress</span>
                          <span className="text-purple-400">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Status: Not Enrolled</span>
                        <span className="text-sm font-extrabold text-cyan-400">{course.price > 0 ? `$${course.price}` : "Free"}</span>
                      </div>
                    )}

                    {/* Actions button */}
                    <div className="pt-2">
                      {course.enrolled ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course._id}`);
                          }}
                          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <BookOpen size={14} /> Continue Study
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnroll(e, course._id)}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-colors"
                        >
                          Enroll Now <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
