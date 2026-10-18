import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Trash2,
  Search,
  FileText,
  Clock,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Database,
  ArrowLeft,
  XCircle,
  RefreshCw,
  FolderOpen,
  Award
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const DownloadManager = () => {
  const [data, setData] = useState({ storageUsedMB: 0, totalDownloads: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Local state for simulated active downloads queue
  const [activeQueue, setActiveQueue] = useState([
    {
      id: "active-1",
      fileName: "Advanced_Neural_Networks_CheatSheet.pdf",
      fileType: "pdf",
      fileSize: 1024 * 1024 * 5.4, // 5.4MB
      progress: 45,
      speed: "1.2 MB/s",
      remainingTime: "3s",
      status: "downloading"
    },
    {
      id: "active-2",
      fileName: "Generative_AI_Lab_Exercise_SourceCode.zip",
      fileType: "zip",
      fileSize: 1024 * 1024 * 24.8, // 24.8MB
      progress: 12,
      speed: "2.4 MB/s",
      remainingTime: "9s",
      status: "downloading"
    }
  ]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/downloads/history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, fileType: selectedType }
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load downloads logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, selectedType]);

  // Simulate downloading ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.status !== "downloading") return item;

          const nextProgress = item.progress + Math.floor(Math.random() * 8) + 2;
          if (nextProgress >= 100) {
            // Log completed file to backend database history
            handleRegisterCompletedDownload(item);
            toast.success(`Completed: ${item.fileName}`);
            return null; // filter out from active queue
          }
          return {
            ...item,
            progress: nextProgress,
            speed: `${(Math.random() * 2 + 1).toFixed(1)} MB/s`,
            remainingTime: `${Math.ceil(((100 - nextProgress) * (item.fileSize / 100)) / (2 * 1024 * 1024))}s`
          };
        }).filter(Boolean)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegisterCompletedDownload = async (item) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const dummyCourseId = "660c1bf6bf765bf9d8ab870c"; // Fallback dummy ID if not present
      const dummyModuleId = "660c1bf6bf765bf9d8ab870d";

      await axios.post("http://localhost:5000/api/downloads/log", {
        courseId: dummyCourseId,
        moduleId: dummyModuleId,
        resourceId: item.id,
        fileName: item.fileName,
        fileType: item.fileType,
        fileSize: item.fileSize,
        downloadStatus: "completed"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to log download completion:", err);
    }
  };

  const handleTogglePause = (id) => {
    setActiveQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "downloading" ? "paused" : "downloading" }
          : item
      )
    );
  };

  const handleCancelDownload = (id) => {
    setActiveQueue((prev) => prev.filter((item) => item.id !== id));
    toast.info("Download cancelled");
  };

  const handleDeleteHistory = async (id) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/downloads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removed from download logs");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete download log.");
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all download records? This won't delete files on your physical device.")) return;
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/downloads/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Download history cleared");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to clear history.");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "pdf": return <FileText size={16} className="text-red-400" />;
      case "zip": return <Database size={16} className="text-yellow-400" />;
      case "certificate": return <Award size={16} className="text-purple-400" fill="currentColor" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge color="cyan" className="mb-2">Local Files</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none animate-slide-up">Downloads Manager</h1>
            <p className="text-gray-400 text-sm mt-2">Manage your offline notes, code exercise materials, and certificates.</p>
          </div>

          {data.history?.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all self-start md:self-auto"
            >
              Clear Logs
            </button>
          )}
        </div>

        {/* Storage Metrics Panel */}
        <div className="grid sm:grid-cols-3 gap-6">
          <GlassCard className="p-6 border-white/5 flex items-center gap-4 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-600/10 text-cyan-400 rounded-xl flex items-center justify-center shrink-0">
              <Database size={24} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Storage Used</span>
              <span className="text-2xl font-black text-white">{data.storageUsedMB} MB</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 flex items-center gap-4 rounded-2xl">
            <div className="w-12 h-12 bg-purple-600/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <Download size={24} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Downloads</span>
              <span className="text-2xl font-black text-white">{data.totalDownloads + activeQueue.length} files</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 flex items-center gap-4 rounded-2xl">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Sandbox Limit</span>
              <span className="text-2xl font-black text-white">512 MB</span>
            </div>
          </GlassCard>
        </div>

        {/* Active downloads section */}
        {activeQueue.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Active Queue</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {activeQueue.map((item) => (
                <div key={item.id} className="p-5 bg-purple-600/5 border border-purple-500/20 rounded-3xl space-y-4 relative overflow-hidden group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl text-purple-400">
                        {getIcon(item.fileType)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white truncate max-w-[200px]">{item.fileName}</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                          {(item.fileSize / (1024 * 1024)).toFixed(1)} MB • {item.speed} • {item.remainingTime} left
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePause(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-colors"
                      >
                        {item.status === "downloading" ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                      </button>
                      <button
                        onClick={() => handleCancelDownload(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 border border-white/5 transition-colors"
                      >
                        <XCircle size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold text-gray-400">
                      <span className="uppercase tracking-wider">{item.status}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* History logs grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Download History</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-10 py-2 bg-white/[0.02] border border-white/5 focus:border-cyan-500/50 rounded-xl text-[10px] font-bold text-white focus:outline-none"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF files</option>
                <option value="zip">ZIP archives</option>
                <option value="certificate">Certificates</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data.history.length === 0 ? (
            <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[2.5rem] text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
              No downloaded files found in logs history.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {data.history.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl flex justify-between items-center gap-4 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-white/5 rounded-xl text-cyan-400">
                        {getIcon(log.fileType)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-white truncate max-w-[220px]">{log.fileName}</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                          {(log.fileSize / (1024 * 1024)).toFixed(1)} MB • {new Date(log.downloadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toast.success("Opening file details...")}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
                        title="Open File"
                      >
                        <FolderOpen size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(log._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 border border-white/5 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DownloadManager;
