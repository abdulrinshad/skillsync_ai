import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Settings, BarChart2, Shield, AlertTriangle, 
  Activity, Server, Database, Search, Bell, Menu, Plus, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Globe, Lock,
  Zap, Clock, FileText, CheckCircle, XCircle, MoreVertical,
  Cpu, Thermometer, ShieldAlert, Key, Eye, HelpCircle, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import PendingCurriculumReviews from './PendingCurriculumReviews';
import ReviewModal from './ReviewModal';
import { GlassCard, Badge, Button } from '../../components/ui';

// CustomTooltip for Charting
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

// Data Mocks
const trafficData = [
  { time: '00:00', users: 1200, load: 45 },
  { time: '04:00', users: 800, load: 30 },
  { time: '08:00', users: 3500, load: 65 },
  { time: '12:00', users: 5200, load: 85 },
  { time: '16:00', users: 4800, load: 75 },
  { time: '20:00', users: 2800, load: 55 },
];

const AdminDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState({}); // groupKey -> Array of itemIds
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const groupReviews = (data) => {
    // Backend getPendingReviews already groups by courseId and moduleId
    return data;
  };

  const fetchPendingReviews = async () => {
    try {
      setLoadingReviews(true);
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/pending-reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const groupedData = groupReviews(res.data);
      setPendingReviews(groupedData);
      setSelectedItemIds({});
    } catch (error) {
      console.error("Failed to fetch pending reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleToggleItemSelect = (groupKey, itemId) => {
    setSelectedItemIds(prev => {
      const currentList = prev[groupKey] || [];
      const newList = currentList.includes(itemId)
        ? currentList.filter(id => id !== itemId)
        : [...currentList, itemId];
      return {
        ...prev,
        [groupKey]: newList
      };
    });
  };

  const handleApproveItem = async (courseId, specifiedItemId, specifiedItemType) => {
    if (!specifiedItemId || !specifiedItemType) return;

    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/approve-item`, {
        itemId: specifiedItemId,
        itemType: specifiedItemType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Item approved successfully");
      
      if (selectedReview && selectedReview.courseId === courseId) {
        const updatedChanges = selectedReview.changes.filter(c => c.id !== specifiedItemId);
        if (updatedChanges.length === 0) {
          setSelectedReview(null);
        } else {
          setSelectedReview({ ...selectedReview, changes: updatedChanges });
        }
      }
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve item");
    }
  };

  const handleRejectItem = async (courseId, specifiedItemId, specifiedItemType) => {
    if (!specifiedItemId || !specifiedItemType) return;

    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/reject-item`, {
        itemId: specifiedItemId,
        itemType: specifiedItemType,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Item rejected successfully");
      
      if (selectedReview && selectedReview.courseId === courseId) {
        const updatedChanges = selectedReview.changes.filter(c => c.id !== specifiedItemId);
        if (updatedChanges.length === 0) {
          setSelectedReview(null);
        } else {
          setSelectedReview({ ...selectedReview, changes: updatedChanges });
        }
      }
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject item");
    }
  };

  const handleApproveSelected = async (courseId, groupKey) => {
    const itemIds = selectedItemIds[groupKey] || [];
    if (itemIds.length === 0) return;
    
    const review = pendingReviews.find(r => r.key === groupKey);
    if (!review) return;

    const itemsToApprove = itemIds.map(id => {
      const ch = review.changes.find(c => c.id === id);
      return { id, type: ch?.type };
    }).filter(item => item.type);

    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/approve-selected`, {
        items: itemsToApprove
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Selected items approved successfully");
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve selected items");
    }
  };

  const handleRejectSelected = async (courseId, groupKey) => {
    const itemIds = selectedItemIds[groupKey] || [];
    if (itemIds.length === 0) return;
    
    const review = pendingReviews.find(r => r.key === groupKey);
    if (!review) return;

    const itemsToReject = itemIds.map(id => {
      const ch = review.changes.find(c => c.id === id);
      return { id, type: ch?.type };
    }).filter(item => item.type);

    const reason = prompt("Enter rejection reason for selected items:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/reject-selected`, {
        items: itemsToReject,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Selected items rejected successfully");
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject selected items");
    }
  };

  const handleApproveAll = async (courseId) => {
    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/approve-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("All curriculum changes approved successfully");
      setSelectedReview(null);
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve all changes");
    }
  };

  const handleRejectAll = async (courseId) => {
    const reason = prompt("Enter rejection reason for all changes:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token_admin") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/reject-all`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("All curriculum changes rejected successfully");
      setSelectedReview(null);
      fetchPendingReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject all changes");
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

  return (
    <motion.div 
      className="space-y-8 max-w-7xl mx-auto p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Control Console</h1>
        <p className="text-gray-400 mt-1">Enterprise overview of platform health, security, and growth.</p>
      </div>

      {/* Overview Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '124,592', icon: Users, color: 'blue', trend: '+12.5%', isUp: true },
          { label: 'Active Teachers', value: '12,845', icon: BookOpen, color: 'purple', trend: '+5.2%', isUp: true },
          { label: 'Total Revenue', value: '$8.4M', icon: Activity, color: 'emerald', trend: '+24.8%', isUp: true },
          { label: 'System Health', value: '99.9%', icon: HeartPulseIcon, color: 'cyan', trend: 'Stable', isUp: null }
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl`} />
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon size={18} />
              </div>
              {stat.isUp !== null && (
                <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
                </div>
              )}
              {stat.isUp === null && (
                <Badge color="green" className="!px-1.5 !py-0.5 text-[10px]">Optimal</Badge>
              )}
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</h3>
          </GlassCard>
        ))}
      </motion.div>

      {/* Curriculum Review Console component */}
      <motion.div variants={itemVariants}>
        <PendingCurriculumReviews
          pendingReviews={pendingReviews}
          selectedItemIds={selectedItemIds}
          onToggleItemSelect={handleToggleItemSelect}
          onReview={setSelectedReview}
          onApproveItem={handleApproveItem}
          onRejectItem={handleRejectItem}
          onApproveAll={handleApproveAll}
          onRejectAll={handleRejectAll}
          onApproveSelected={handleApproveSelected}
          onRejectSelected={handleRejectSelected}
          loadingReviews={loadingReviews}
        />
      </motion.div>

      {/* Review Modal Dialog */}
      <ReviewModal
        selectedReview={selectedReview}
        onClose={() => setSelectedReview(null)}
        onApproveItem={handleApproveItem}
        onRejectItem={handleRejectItem}
        onApproveAll={handleApproveAll}
        onRejectAll={handleRejectAll}
      />

      {/* System Monitoring & Security */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <GlassCard className="p-6 lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="text-indigo-400" /> Platform Traffic & Load
              </h2>
            </div>
            <div className="flex gap-2">
              <Badge color="purple">Live Activity</Badge>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" name="Active Users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="load" name="Server Load (%)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          {/* System Health */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Infrastructure</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Cluster Capacity</span>
                </div>
                <span className="text-sm font-bold">78%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-blue-500" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-emerald-400" />
                  <span className="text-sm text-gray-300">Database I/O</span>
                </div>
                <span className="text-sm font-bold">42%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[42%] bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-orange-400" />
                  <span className="text-sm text-gray-300">API Latency</span>
                </div>
                <span className="text-sm font-bold text-orange-400">124ms</span>
              </div>
            </div>
          </GlassCard>

          {/* AI SOC Insights */}
          <GlassCard className="p-5 border-rose-500/30 bg-gradient-to-br from-black/40 to-rose-500/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />
             <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={18} className="text-rose-500" />
              <h3 className="font-bold text-sm text-rose-100">Security Operations</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Failed Logins (1h)</span>
                <span className="font-bold text-rose-400">1,204</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">DDoS Protection</span>
                <span className="font-bold text-emerald-400">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Threat Level</span>
                <Badge color="green" className="!text-[10px]">Low</Badge>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Operations & AI Assistant */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Admin Assistant */}
        <GlassCard className="p-6 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Platform Assistant</h2>
              <p className="text-xs text-gray-400">Automated insights and optimization</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4 hover:bg-white/5 transition-colors">
              <Thermometer size={20} className="text-orange-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold mb-1">Server Scaling Recommended</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Anticipating a 40% traffic spike in the APAC region in 2 hours based on new course launches. Recommend provisioning 3 additional nodes.</p>
                <button className="mt-2 text-xs font-bold text-orange-400 hover:underline">Auto-Scale Now</button>
              </div>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4 hover:bg-white/5 transition-colors">
              <Activity size={20} className="text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold mb-1">Revenue Forecast Update</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Monthly revenue is projected to exceed targets by 12% ($102k) due to higher-than-expected enterprise subscriptions.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Real-time Activity Feed */}
        <GlassCard className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="text-purple-400" /> Activity Feed
            </h2>
            <Button variant="outline" className="text-xs py-1 px-3">View All</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {[
              { icon: Users, color: 'blue', text: 'New enterprise client registered: TechCorp Inc.', time: '2 mins ago' },
              { icon: AlertTriangle, color: 'orange', text: 'Spike in API errors on route /api/v1/payments.', time: '15 mins ago' },
              { icon: Shield, color: 'emerald', text: 'Automated security scan completed. 0 vulnerabilities.', time: '1 hour ago' },
              { icon: BookOpen, color: 'purple', text: 'Course "Advanced Go" flagged for review.', time: '3 hours ago' },
              { icon: Key, color: 'rose', text: 'Multiple failed admin login attempts from IP 192.168.1.1', time: '5 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 rounded-xl flex items-start gap-4 transition-colors cursor-pointer">
                <div className={`p-2 rounded-lg bg-${activity.color}-500/20 text-${activity.color}-400 shrink-0`}>
                  <activity.icon size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-200">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </motion.div>
    </motion.div>
  );
};

// Helper component for the dashboard icons
const HeartPulseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

export default AdminDashboard;
