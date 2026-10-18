import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
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
  BookOpenCheck,
  Plus,
  Video,
  DollarSign,
  PlayCircle,
  FileText,
  BrainCircuit,
  Trophy,
  Award
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
          layoutId="active-pill-admin"
          className="absolute left-0 w-1 h-6 bg-red-500 rounded-r-full"
        />
      )}
      <Icon size={20} className={`flex-shrink-0 ${active ? 'text-red-400' : 'group-hover:text-white transition-colors'}`} />
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

const AdminLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (courseId, notificationId) => {
    if (!courseId) return;
    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/courses/admin/${courseId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.patch(`http://localhost:5000/api/admin/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Course approved and published successfully!");
      fetchNotifications();
      if (location.pathname === "/admin/courses") {
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve course.");
    }
  };

  const handleReject = async (courseId, notificationId) => {
    if (!courseId) return;
    const reason = prompt("Please enter the reason for rejecting this curriculum:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("A rejection reason is required.");
      return;
    }
    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/courses/admin/${courseId}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.patch(`http://localhost:5000/api/admin/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Course curriculum rejected.");
      fetchNotifications();
      if (location.pathname === "/admin/courses") {
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject course.");
    }
  };

  const getMenuItems = () => {
    switch (user?.role || 'admin') {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin' },
          { icon: Users, label: 'Manage Users', path: '/admin/users' },
          { icon: GraduationCap, label: 'Manage Teachers', path: '/admin/teachers' },
          { icon: BookOpenCheck, label: 'Manage Courses', path: '/admin/courses' },
          { icon: FileText, label: 'Reports & Audits', path: '/admin/reports' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
          { icon: BrainCircuit, label: 'Control Center', path: '/admin/control' },
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
          { icon: PlayCircle, label: 'Live Classes', path: '/dashboard/live' },
          { icon: FileText, label: 'AI Notes', path: '/dashboard/notes' },
          { icon: BrainCircuit, label: 'AI Quiz', path: '/dashboard/quiz' },
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
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SkillSync <span className="text-red-400">Admin</span></span>
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors w-4 h-4" />
                <input 
                  placeholder="Audit users, platform course releases..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* System Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
               <span className="text-xs font-bold text-red-400 tracking-wide">System Optimal</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-1.5 px-3 h-10 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm font-bold"
              >
                <Bell size={20} className={notifications.length > 0 ? "text-red-400 animate-pulse" : ""} />
                {notifications.length > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{notifications.length}</span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-96 glass-morphism rounded-2xl shadow-2xl p-4 z-50 overflow-hidden text-xs max-h-[80vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm">Pending Curriculum Reviews</h3>
                      <span className="text-[10px] text-gray-500 font-bold">{notifications.length} Unread</span>
                    </div>
                    <div className="space-y-3">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-4">No pending curriculum reviews.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif._id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2.5">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <div className="font-bold text-white text-sm">{notif.course?.title || "Untitled Course"}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Teacher: {notif.sender?.fullName || "Unknown"}</div>
                                <div className="text-[9px] text-gray-500 mt-0.5">Submitted: {new Date(notif.createdAt).toLocaleDateString()}</div>
                                <div className="text-[9px] text-gray-500">Status: {notif.status}</div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <Link 
                                to="/admin/courses"
                                onClick={() => setShowNotifications(false)}
                                className="flex-1 text-center py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-[10px] uppercase transition-colors"
                              >
                                Review
                              </Link>
                              <button
                                onClick={() => handleApprove(notif.course?._id, notif._id)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] uppercase transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(notif.course?._id, notif._id)}
                                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] uppercase transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative ml-2">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-500/10">
                  {(user?.name || user?.email || 'AD').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="hidden lg:block text-left mr-2">
                  <div className="text-sm font-bold leading-none">{user?.name || 'Super Admin'}</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-medium">Administrator</div>
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
                      <div className="font-bold text-sm">{user?.name || 'Super Admin'}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email || 'admin@skillsync.ai'}</div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-all group">
                        <User size={18} className="group-hover:text-red-400 transition-colors" /> Admin Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-all group">
                        <Settings size={18} className="group-hover:text-red-400 transition-colors" /> Settings
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

export default AdminLayout;
