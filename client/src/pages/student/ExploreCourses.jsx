import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Sparkles,
  Star,
  Users,
  Clock,
  Play,
  ChevronRight,
  BrainCircuit,
  TrendingUp,
  Zap,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Award,
  ShoppingCart,
  Heart
} from 'lucide-react';

import { GlassCard, Button, Badge } from '../../components/ui';

const CategoryCard = ({ title, icon: Icon, count, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, scale: 1.05 }}
    className="glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner border border-white/5">
      <Icon size={28} />
    </div>
    <h3 className="font-bold text-sm mb-1">{title}</h3>
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{count} Courses</p>
  </motion.div>
);

const CourseCard = ({ course, delay, cartCourseIds = [], enrolledCourseIds = [], favoritedCourseIds = [], onAddToCart, onToggleFavorite }) => {
  const isEnrolled = enrolledCourseIds.includes(course._id);
  const isInCart = cartCourseIds.includes(course._id);
  const isFavorited = favoritedCourseIds.includes(course._id);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 hover:border-purple-500/30 transition-all group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

      <div className="relative bg-[#0f172a]/40 rounded-[2.5rem] overflow-hidden h-full flex flex-col">
        <div className="h-48 relative overflow-hidden">
          <img
            src={
              course.thumbnail ||
              "https://via.placeholder.com/600x400"
            }
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={course.title}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />

          <div className="absolute top-4 left-4">
            <Badge
              color={
                course.level === "Beginner"
                  ? "green"
                  : course.level === "Intermediate"
                    ? "purple"
                    : "orange"
              }
            >
              {course.level}
            </Badge>
          </div>

          {/* Floating Heart Toggle */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(course._id);
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full flex items-center justify-center text-red-500 border border-white/10 transition-colors z-10"
          >
            <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
          </button>

          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-black shadow-lg">
              ₹{course.price}
            </span>
          </div>
        </div>


        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {course.teacherId?.fullName?.charAt(0)}
            </div>

            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {course.teacherId?.fullName}
            </span>
          </div>

          <h3 className="font-bold text-lg mb-3 leading-tight group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 mb-4">
            {course.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">

              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white font-bold">
                  4.8
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{course.totalStudents}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>
                  {course.duration || "N/A"}
                </span>
              </div>

            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-4">
            <Link to={`/courses/${course._id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full py-3 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all text-center"
              >
                View
              </Button>
            </Link>

            {isEnrolled ? (
              <Link to="/dashboard/learning" className="flex-1">
                <Button
                  variant="primary"
                  className="w-full py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-500 transition-all text-center text-white"
                >
                  Continue
                </Button>
              </Link>
            ) : isInCart ? (
              <Link to="/dashboard/cart" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-2xl text-xs font-bold border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-center"
                >
                  Go to Cart
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                onClick={() => onAddToCart(course._id)}
                className="flex-1 py-3 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-500 transition-all text-center text-white"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExploreCourses = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIRecoOn, setIsAIRecoOn] = useState(true);

  const categories = [
    { title: 'Machine Learning', icon: BrainCircuit, count: 124 },
    { title: 'Data Science', icon: TrendingUp, count: 86 },
    { title: 'Development', icon: Zap, count: 210 },
    { title: 'AI Ethics', icon: Award, count: 32 },
  ];

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCourseIds, setCartCourseIds] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [favoritedCourseIds, setFavoritedCourseIds] = useState([]);


  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

      setCourses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartAndEnrollments = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) return;

      const cartRes = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartItems = cartRes.data?.items || [];
      setCartCourseIds(cartItems.map((item) => item.courseId?._id || item.courseId));

      const enrollmentsRes = await axios.get("http://localhost:5000/api/enrollments/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourseIds(enrollmentsRes.data.map((enrollment) => enrollment.courseId?._id || enrollment.courseId));

      const favRes = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritedCourseIds(favRes.data.map(f => f._id));
    } catch (error) {
      console.error("Error fetching cart/enrollments/favorites:", error);
    }
  };

  const handleToggleFavorite = async (courseId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to manage favorites.");
        return;
      }
      const isFav = favoritedCourseIds.includes(courseId);
      if (isFav) {
        await axios.delete(`http://localhost:5000/api/favorites/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritedCourseIds(favoritedCourseIds.filter(id => id !== courseId));
        toast.success("Removed from wishlist");
      } else {
        await axios.post("http://localhost:5000/api/favorites", { courseId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritedCourseIds([...favoritedCourseIds, courseId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Wishlist action failed.");
    }
  };


  const handleAddToCart = async (courseId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add courses to your cart.");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        toast.success("Course added to cart successfully!");
        setCartCourseIds((prev) => [...prev, courseId]);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCartAndEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading Courses...
      </div>
    );
  }
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000" />

        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse-slow" />

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-purple-400 mb-8 uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} className="animate-pulse" /> Discover Your Potential
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-none"
          >
            Explore <span className="text-gradient">Intelligence.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed"
          >
            Master the skills of the future with our AI-curated curriculum designed by world-class experts.
          </motion.p>
        </div>
      </section>

      {/* Discovery Bar */}
      <section className="grid lg:grid-cols-4 gap-6 items-center">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for 'Large Language Models', 'Python', or 'UX'..."
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all font-medium placeholder:text-gray-600 shadow-2xl"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card flex-1 p-1 rounded-2xl flex border-white/5">
            <button className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-white/10 text-white flex items-center justify-center gap-2">
              <Filter size={14} /> Filter
            </button>
            <button className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <SlidersHorizontal size={14} /> Sort
            </button>
          </div>
        </div>

        <div className="glass-card p-4 rounded-[2rem] border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isAIRecoOn ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-gray-500'}`}>
              <BrainCircuit size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest leading-none">AI Smart<br /><span className="text-gray-500">Recs</span></span>
          </div>
          <button
            onClick={() => setIsAIRecoOn(!isAIRecoOn)}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isAIRecoOn ? 'bg-purple-600' : 'bg-white/10'}`}
          >
            <motion.div
              animate={{ x: isAIRecoOn ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
            />
          </button>
        </div>
      </section>

      {/* Trending Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="text-purple-400" /> Trending Domains
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={i} {...cat} delay={0.1 * i} />
          ))}
        </div>
      </section>

      {/* Course List */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="text-cyan-400" /> {isAIRecoOn ? 'Tailored for You' : 'All Courses'}
          </h2>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            <button className="p-2 rounded-lg bg-white/10 text-white shadow-sm">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors">
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <CourseCard
              key={course._id}
              course={course}
              delay={0.1 * i}
              cartCourseIds={cartCourseIds}
              enrolledCourseIds={enrolledCourseIds}
              favoritedCourseIds={favoritedCourseIds}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>


        <div className="flex justify-center mt-12">
          <Button variant="outline" className="px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 group">
            Load More <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* AI Recommendation Widget */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card rounded-[3rem] p-10 border-purple-500/20 relative overflow-hidden group"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="w-16 h-16 bg-purple-600/20 rounded-[1.5rem] flex items-center justify-center text-purple-400 mb-8 mx-auto lg:mx-0 shadow-lg border border-purple-500/20 animate-float">
              <BrainCircuit size={32} />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight">
              Can't decide where <br />to start? <span className="text-gradient">Ask our AI.</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg mb-8">
              Answer 3 simple questions about your goals and our AI will build a personalized multi-course learning path just for you.
            </p>
            <Button variant="gradient" className="px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl">
              Start AI Interview <ChevronRight size={18} />
            </Button>
          </div>

          <div className="lg:w-1/3 w-full">
            <div className="glass-morphism p-8 rounded-[2.5rem] border-white/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-xs">AI</div>
                <div>
                  <div className="text-xs font-black text-purple-400 uppercase tracking-widest">Active Assistant</div>
                  <div className="text-[10px] text-gray-500 font-bold">Processing your profile...</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 text-xs font-medium text-gray-300 leading-relaxed">
                  "I see you've completed 70% of Python Basics. Based on market trends, I suggest moving to Machine Learning next."
                </div>
                <div className="p-4 bg-purple-600/20 rounded-2xl rounded-tr-none border border-purple-500/20 text-xs font-bold text-white leading-relaxed ml-8">
                  "Sounds great! Show me the path."
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ExploreCourses;
