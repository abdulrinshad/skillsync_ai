import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, ShieldAlert, TrendingUp, MoreVertical,
  UserCheck, UserX, AlertTriangle, Shield, CheckCircle, Activity,
  Trash2, Mail, Calendar, Eye, Zap, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
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

const growthData = [
  { name: 'Mon', users: 120, students: 95, teachers: 25 },
  { name: 'Tue', users: 150, students: 110, teachers: 40 },
  { name: 'Wed', users: 200, students: 160, teachers: 40 },
  { name: 'Thu', users: 180, students: 140, teachers: 40 },
  { name: 'Fri', users: 250, students: 190, teachers: 60 },
  { name: 'Sat', users: 300, students: 250, teachers: 50 },
  { name: 'Sun', users: 350, students: 290, teachers: 60 },
];



const ManageUsers = () => {
  const [activeRole, setActiveRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }


      );
     

      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoint = selectedUser.isBlocked
        ? `/api/admin/users/${selectedUser._id}/unblock`
        : `/api/admin/users/${selectedUser._id}/block`;

      await axios.patch(
        `http://localhost:5000${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchUsers();

      setSelectedUser(null);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchUsers();

      setSelectedUser(null);

    } catch (error) {
      console.error(error);
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

   // 👇 PUT IT HERE
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center text-white">
            Loading users...
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-indigo-500/30">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Users</h1>
            <p className="text-gray-400 mt-1">Oversee all platform accounts, monitor registration trends, and manage roles.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2"><Mail size={16} /> Broadcast Email</Button>
            <Button variant="primary" className="flex items-center gap-2"><Users size={16} /> Invite User</Button>
          </div>
        </div>

        {/* Analytics Top Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="text-indigo-400" /> Registration Trends
                </h2>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500/50">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="students" name="New Students" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
                  <Area type="monotone" dataKey="teachers" name="New Teachers" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTeachers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-rose-500/20 bg-gradient-to-br from-black/40 to-rose-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <ShieldAlert size={20} className="text-rose-400" />
              <h3 className="font-bold">AI Risk Detection</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex gap-3 hover:bg-white/5 transition-colors">
                <AlertTriangle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-200">Suspicious Activity (Marcus J.)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Multiple IP logins detected within 10 minutes. Account auto-suspended.</p>
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex gap-3 hover:bg-white/5 transition-colors">
                <UserX size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-200">Spam Bot Network Identified</p>
                  <p className="text-[10px] text-gray-400 mt-1">12 new accounts flagged and quarantined pending manual review.</p>
                </div>
              </div>
            </div>
          </GlassCard>

        </motion.div>

        {/* User Management Directory */}
        <motion.div variants={itemVariants} className="flex gap-6">
          <GlassCard className={`p-0 overflow-hidden flex flex-col transition-all duration-300 ${selectedUser ? 'w-full lg:w-2/3' : 'w-full'}`}>
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
                {['All', 'Student', 'Teacher', 'Admin'].map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${activeRole === role ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}`}
                  >
                    {role}s
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 font-medium">User Details</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Risk Score</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users
                    .filter(u => activeRole === 'All' || u.role.toLowerCase() === activeRole.toLowerCase())
                    .map((user) => (
                      <tr
                        key={user._id}
                        className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${selectedUser?._id === user._id ? 'bg-white/[0.05]' : ''}`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-200 text-sm">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge color={user.role === "admin" ? 'red' : user.role === "teacher" ? 'purple' : 'blue'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            color={
                              user.isBlocked
                                ? "red"
                                : user.isVerified
                                  ? "green"
                                  : "orange"
                            }
                          >
                            {user.isBlocked
                              ? "Blocked"
                              : user.isVerified
                                ? "Active"
                                : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-500 text-xs">
                            N/A
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* User Details Drawer */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: '33.333333%' }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="hidden lg:block shrink-0"
              >
                <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors z-10"
                  >
                    &times;
                  </button>

                  <div className="flex flex-col items-center text-center mb-6 pt-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-black/40 shadow-xl mb-3">
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-lg">{selectedUser.fullName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{selectedUser.email}</p>
                    <Badge
                      color={
                        selectedUser.role === "admin"
                          ? "red"
                          : selectedUser.role === "teacher"
                            ? "purple"
                            : "blue"
                      }
                    >
                      {selectedUser.role}
                    </Badge>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Account ID</span>
                        <span className="font-mono text-gray-300">{selectedUser._id}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Join Date</span>
                        <span className="text-gray-300">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Status</span>
                        <Badge
                          color={
                            selectedUser.isBlocked
                              ? "red"
                              : selectedUser.isVerified
                                ? "green"
                                : "orange"
                          }
                          className="!px-1.5 !py-0"
                        >
                          {selectedUser.isBlocked
                            ? "Blocked"
                            : selectedUser.isVerified
                              ? "Active"
                              : "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">AI Security Analysis</h4>
                      <div className="flex items-start gap-2">
                        {selectedUser.isBlocked ? (
                          <AlertTriangle
                            size={16}
                            className="text-rose-400 mt-0.5 shrink-0"
                          />
                        ) : (
                          <CheckCircle
                            size={16}
                            className="text-emerald-400 mt-0.5 shrink-0"
                          />
                        )}

                        <p className="text-xs text-gray-300 leading-relaxed">
                          {selectedUser.isBlocked
                            ? "This account is currently blocked by the administrator."
                            : selectedUser.isVerified
                              ? "User account is verified and active."
                              : "User registration is pending verification."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-auto grid grid-cols-2 gap-2">

                    {selectedUser.isBlocked ? (
                      <Button
                        variant="outline"
                        onClick={handleToggleUserStatus}
                        className="text-xs py-2 w-full text-emerald-400 hover:border-emerald-500/30"
                      >
                        Activate User
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleToggleUserStatus}
                        className="text-xs py-2 w-full text-orange-400 hover:border-orange-500/30"
                      >
                        Suspend User
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      onClick={handleDeleteUser}
                      className="text-xs py-2 w-full flex items-center justify-center gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </Button>

                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default ManageUsers;
