import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  BrainCircuit, 
  Trophy, 
  Award, 
  Settings, 
  Calendar,
  Target,
  Heart,
  Download,
  Clock,
  Zap,
  Flame,





  Bell, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User, 
  HelpCircle,
  Sparkles,
  Menu,
  X,
  GraduationCap,
  Plus,
  BookOpenCheck,
  BarChart3,
  Video,
  DollarSign,
  Users,
  ClipboardList,
  Code,
  ShoppingCart
} from 'lucide-react';



import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link to={path}>
    <motion.div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all relative group ${
        active 
          ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-purple-500/30' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <motion.div 
          layoutId="active-pill-student"
          className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full"
        />
      )}
      <Icon size={20} className={`flex-shrink-0 ${active ? 'text-purple-400' : 'group-hover:text-white transition-colors'}`} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-white/10">
          {label}
        </div>
      )}
    </motion.div>
  </Link>
);

const StudentLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);
    return () => {
      window.removeEventListener("cart-updated", fetchCartCount);
    };
  }, []);

  const getMenuItems = () => {
    switch (user?.role || 'student') {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/dashboard/admin' },
          { icon: Users, label: 'Manage Users', path: '/dashboard/admin/users' },
          { icon: GraduationCap, label: 'Manage Teachers', path: '/dashboard/admin/teachers' },
          { icon: BookOpenCheck, label: 'Manage Courses', path: '/dashboard/admin/courses' },
          { icon: BarChart3, label: 'Reports', path: '/dashboard/admin/reports' },
          { icon: BarChart3, label: 'Analytics', path: '/dashboard/admin/analytics' },
          { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        ];
      case 'teacher':
        return [
          { icon: LayoutDashboard, label: 'Teacher Dashboard', path: '/dashboard/teacher' },
          { icon: Plus, label: 'Create Course', path: '/dashboard/teacher/create-course' },
          { icon: BookOpenCheck, label: 'Manage Courses', path: '/dashboard/teacher/courses' },
          { icon: BarChart3, label: 'Student Analytics', path: '/dashboard/teacher/analytics' },
          { icon: Video, label: 'Live Classes Manager', path: '/dashboard/teacher/live' },
          { icon: DollarSign, label: 'Earnings', path: '/dashboard/teacher/earnings' },
          { icon: Settings, label: 'Profile Settings', path: '/dashboard/settings' },
        ];
      case 'student':
      default:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Search, label: 'Explore Courses', path: '/dashboard/explore' },
          { icon: BookOpen, label: 'My Learning', path: '/dashboard/learning' },
          { icon: Target, label: 'Weekly Challenge', path: '/dashboard/weekly-goals' },
          { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
          { icon: Heart, label: 'Favorites', path: '/dashboard/favorites' },
          { icon: Download, label: 'Downloads', path: '/dashboard/downloads' },
          { icon: Clock, label: 'Timeline', path: '/dashboard/timeline' },
          { icon: PlayCircle, label: 'Live Classes', path: '/dashboard/live' },
          { icon: Trophy, label: 'Achievements', path: '/dashboard/achievements' },
          { icon: Zap, label: 'XP Ledger', path: '/dashboard/xp' },
          { icon: Flame, label: 'Streak Rewards', path: '/dashboard/streaks' },
          { icon: Bell, label: 'Reminder Center', path: '/dashboard/reminders' },
          { icon: Users, label: 'Following', path: '/dashboard/following' },
          { icon: ClipboardList, label: 'Practice Tests', path: '/dashboard/practice-tests' },
          { icon: Code, label: 'Coding Playground', path: '/dashboard/playground' },
          { icon: Trophy, label: 'Leaderboard', path: '/dashboard/leaderboard' },


          { icon: Award, label: 'Certificates', path: '/dashboard/certificates' },


          { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
          { icon: HelpCircle, label: 'Help Center', path: '/dashboard/help' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex bg-mesh overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ 
          width: isCollapsed ? 88 : 280,
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        className={`fixed left-0 top-0 h-full bg-[#0f172a]/40 backdrop-blur-2xl border-r border-white/5 z-[60] flex flex-col transition-all duration-300 lg:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SkillSync <span className="text-purple-400">AI</span></span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-9 h-9 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center mx-auto"
              >
                <Sparkles className="text-white w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          {(!user?.role || user?.role === 'student') && (
            <Link to="/dashboard/help">
              <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white transition-all group ${location.pathname === '/dashboard/help' ? 'bg-white/5 text-white' : ''}`}>
                <HelpCircle size={20} className="flex-shrink-0 group-hover:text-purple-400 transition-colors" />
                {!isCollapsed && <span className="font-medium text-sm">Help Center</span>}
              </div>
            </Link>
          )}
          <Link to="/">
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all group`}>
              <LogOut size={20} className="flex-shrink-0 group-hover:rotate-12 transition-transform" />
              {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
            </div>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-[#020617]/60 backdrop-blur-xl z-[40]">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400"
            >
              <Menu size={20} />
            </button>
            
            <div className="max-w-xl w-full hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors w-4 h-4" />
                <input 
                  placeholder="Search courses, AI notes, or quizzes..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* XP Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20">
               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
               <span className="text-xs font-bold text-purple-400 tracking-wide">2,450 XP</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-gray-400 hover:text-white relative transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#020617]" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-morphism rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Notifications</h3>
                      <button className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Mark all as read</button>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">AI Recommended Path</div>
                            <div className="text-[11px] text-gray-500 leading-relaxed mt-0.5">Based on your recent progress in Neural Networks...</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-white transition-colors border-t border-white/5 pt-4">View All Notifications</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart Badge */}
            {(!user || user.role === "student") && (
              <Link to="/dashboard/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full text-[10px] font-black w-5 h-5 flex items-center justify-center border border-[#020617] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile */}
            <div className="relative ml-2">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-500/10">
                  {(user?.name || user?.email || 'JS').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="hidden lg:block text-left mr-2">
                  <div className="text-sm font-bold leading-none">{user?.name || 'John Smith'}</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-medium">Student (Pro)</div>
                </div>
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-60 glass-morphism rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 bg-white/5 border-b border-white/5">
                      <div className="font-bold text-sm">{user?.name || 'John Smith'}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email || 'john.smith@skillsync.ai'}</div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-all group">
                        <User size={18} className="group-hover:text-purple-400 transition-colors" /> My Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-all group">
                        <Settings size={18} className="group-hover:text-purple-400 transition-colors" /> Settings
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-400/80 hover:text-red-400 transition-all group">
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Logout
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
