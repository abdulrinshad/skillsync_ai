import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Database, Activity, AlertTriangle, ShieldAlert, 
  Cpu, HardDrive, Wifi, CheckCircle, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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

const sysData = [
  { time: '10:00', cpu: 45, ram: 60, db: 30 },
  { time: '10:10', cpu: 55, ram: 62, db: 45 },
  { time: '10:20', cpu: 85, ram: 75, db: 80 },
  { time: '10:30', cpu: 65, ram: 68, db: 50 },
  { time: '10:40', cpu: 40, ram: 65, db: 35 },
  { time: '10:50', cpu: 45, ram: 65, db: 30 },
];

const ControlCenter = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden selection:bg-rose-500/30">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-rose-100">Super Admin Control Center</h1>
            <p className="text-gray-400 mt-1">Mission critical infrastructure monitoring, AI anomaly detection, and DB health.</p>
          </div>
          <Badge color="red" className="animate-pulse !px-4 !py-2 uppercase tracking-widest text-sm border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            Root Access Granted
          </Badge>
        </div>

        {/* Live Status Row */}
        <motion.div variants={{hidden: {opacity:0}, visible: {opacity:1}}} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="text-emerald-400" size={20} />
              <div><p className="text-xs text-gray-400 uppercase">App Servers</p><p className="font-bold">Online (12 Nodes)</p></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          </GlassCard>
          <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="text-emerald-400" size={20} />
              <div><p className="text-xs text-gray-400 uppercase">Primary DB (Postgres)</p><p className="font-bold">Healthy (Replica Sync)</p></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          </GlassCard>
          <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="text-emerald-400" size={20} />
              <div><p className="text-xs text-gray-400 uppercase">CDN / Edge Network</p><p className="font-bold">Routing Optimal</p></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          </GlassCard>
          <GlassCard className="p-4 border-orange-500/30 bg-orange-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="text-orange-400" size={20} />
              <div><p className="text-xs text-gray-400 uppercase">Payment Webhooks</p><p className="font-bold">Degraded Latency</p></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
          </GlassCard>
        </motion.div>

        {/* Charts & Monitoring */}
        <motion.div variants={{hidden: {opacity:0, y:20}, visible: {opacity:1, y:0}}} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Cpu className="text-indigo-400" /> Resource Utilization
              </h2>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}%`} />
                  <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
                  <Line type="monotone" dataKey="cpu" name="CPU Load" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ram" name="Memory Usage" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="db" name="DB Connections" stroke="#f43f5e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)] bg-gradient-to-br from-black/40 to-rose-500/5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-rose-400" />
                <h3 className="font-bold text-sm">Security Anomalies</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-black/40 border border-white/5 p-3 rounded-lg border-l-2 border-l-rose-500">
                  <p className="text-xs font-bold">Unusual API Rate Limit Hits</p>
                  <p className="text-[10px] text-gray-400 mt-1">Endpoint: /api/v1/auth/login. Origin: 192.168.4.x subnet.</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-lg border-l-2 border-l-orange-500">
                  <p className="text-xs font-bold">Elevated Error Rate (50x)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Video transcoding service failing for 4% of jobs.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold text-sm mb-4">System Alerts</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2 hover:bg-white/5 rounded-md transition-colors border border-transparent hover:border-white/5">
                  <span className="text-gray-300">Disk Space (Node-04)</span>
                  <span className="text-orange-400">88%</span>
                </div>
                <div className="flex justify-between text-xs p-2 hover:bg-white/5 rounded-md transition-colors border border-transparent hover:border-white/5">
                  <span className="text-gray-300">SSL Cert Renewal</span>
                  <span className="text-emerald-400">Valid (340 days)</span>
                </div>
              </div>
            </GlassCard>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default ControlCenter;
