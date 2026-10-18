import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, FileText, Video, HelpCircle, Layers, Cpu } from 'lucide-react';
import { GlassCard, Badge } from '../../components/ui';

const TeacherChangeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/courses/teacher/curriculum/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data || []);
      } catch (error) {
        console.error("Failed to fetch change history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'module': return <Layers className="text-purple-400" size={16} />;
      case 'lecture': return <Video className="text-blue-400" size={16} />;
      case 'resource': return <FileText className="text-emerald-400" size={16} />;
      case 'ai notes': return <Cpu className="text-cyan-400" size={16} />;
      case 'quiz': return <HelpCircle className="text-yellow-400" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Curriculum History</h1>
          <p className="text-xs text-gray-400 mt-1">Review the status and logs of your submitted lectures, materials, and quizzes.</p>
        </div>
      </div>

      <GlassCard className="p-6 border-white/5 bg-white/[0.02]">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading moderation history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">
            No curriculum items have been approved or rejected yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-gray-500">
                  <th className="pb-4">Course</th>
                  <th className="pb-4">Item Name</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Action Date</th>
                  <th className="pb-4">Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {history.map((item, idx) => (
                  <motion.tr 
                    key={item.id + idx}
                    variants={itemVariants}
                    className="text-xs text-gray-300 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-4 pr-4 font-bold text-white max-w-[200px] truncate">{item.courseTitle}</td>
                    <td className="py-4 pr-4 font-semibold max-w-[250px] truncate">{item.title}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-wider">
                        {getIcon(item.type)}
                        <span>{item.type}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge 
                        color={item.status === 'Approved' ? 'green' : 'red'}
                        className="text-[9px] uppercase font-bold tracking-wider py-0.5 px-2.5 rounded-full"
                      >
                        {item.status === 'Approved' ? (
                          <span className="flex items-center gap-1"><CheckCircle size={10} /> Approved</span>
                        ) : (
                          <span className="flex items-center gap-1"><XCircle size={10} /> Rejected</span>
                        )}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-gray-500 font-medium">
                      {new Date(item.updatedAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 text-gray-400 italic max-w-[200px] truncate">
                      {item.status === 'Rejected' && item.rejectionReason ? (
                        <span className="text-red-400/90 font-medium">Rejection Reason: {item.rejectionReason}</span>
                      ) : (
                        <span className="text-gray-600 font-bold">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default TeacherChangeHistory;
