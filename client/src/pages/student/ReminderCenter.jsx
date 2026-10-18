import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  CheckCircle,
  Trash2,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Volume2,
  Calendar
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const ReminderCenter = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reminders"); // reminders / settings

  // Snooze modal states
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState(null);

  // Settings states
  const [studyTime, setStudyTime] = useState("19:00");
  const [channels, setChannels] = useState({ email: true, browser: true });
  const [weekendNotifications, setWeekendNotifications] = useState(true);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/reminders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(res.data || []);
    } catch (err) {
      console.error("Failed to load reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/reminders/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Reminder completed!");
      fetchReminders();
    } catch (err) {
      toast.error("Failed to update reminder.");
    }
  };

  const handleDismiss = async (id) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Reminder dismissed.");
      fetchReminders();
    } catch (err) {
      toast.error("Failed to dismiss reminder.");
    }
  };

  const openSnoozeDialog = (id) => {
    setSelectedReminderId(id);
    setShowSnoozeModal(true);
  };

  const handleSnooze = async (minutes) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/reminders/${selectedReminderId}/snooze`, { minutes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Snoozed for ${minutes} minutes`);
      setShowSnoozeModal(false);
      fetchReminders();
    } catch (err) {
      toast.error("Failed to snooze reminder.");
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success("Reminder configurations saved successfully!");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "red";
      case "high": return "orange";
      case "medium": return "purple";
      default: return "cyan";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge color="cyan" className="mb-2">Consistency Engine</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Reminder Center</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("reminders")}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                activeTab === "reminders"
                  ? "bg-purple-600/20 border-purple-500/30 text-purple-400"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Bell size={12} className="inline mr-1" /> Today's Reminders
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                activeTab === "settings"
                  ? "bg-purple-600/20 border-purple-500/30 text-purple-400"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Settings size={12} className="inline mr-1" /> settings
            </button>
          </div>
        </div>

        {/* Tab contents */}
        {activeTab === "reminders" ? (
          <div className="space-y-4">
            {loading ? (
              <div className="w-full h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            ) : reminders.length === 0 ? (
              <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">No study reminders active right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <GlassCard
                    key={reminder._id}
                    className="p-6 border-white/5 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-br from-white/[0.01] to-transparent"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge color={getPriorityColor(reminder.priority)} className="text-[8px] font-black uppercase shrink-0">
                          {reminder.priority} priority
                        </Badge>
                        {reminder.status === "snoozed" && (
                          <Badge color="yellow" className="text-[8px] font-black uppercase shrink-0">
                            Snoozed until {new Date(reminder.snoozedUntil).toLocaleTimeString()}
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white">{reminder.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold max-w-xl">{reminder.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        variant="gradient"
                        onClick={() => handleComplete(reminder._id)}
                        className="py-2.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white"
                      >
                        <CheckCircle size={10} /> Complete
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openSnoozeDialog(reminder._id)}
                        className="py-2.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                      >
                        <Clock size={10} /> Snooze
                      </Button>
                      <button
                        onClick={() => handleDismiss(reminder._id)}
                        className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all"
                        title="Dismiss alert"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        ) : (
          <GlassCard className="p-8 border-white/5 rounded-[2.5rem] bg-gradient-to-b from-white/[0.01] to-transparent">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <h3 className="text-lg font-black text-white border-b border-white/5 pb-2">Reminder Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Preferred Study Hours</label>
                  <input
                    type="time"
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                    className="w-full p-3.5 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Weekend Reminders</label>
                  <select
                    value={weekendNotifications ? "yes" : "no"}
                    onChange={(e) => setWeekendNotifications(e.target.value === "yes")}
                    className="w-full p-3.5 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-bold text-gray-400 focus:outline-none"
                  >
                    <option value="yes">Enable weekend study alerts</option>
                    <option value="no">DND (Do Not Disturb) weekends</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Notification Channels</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-300">
                    <input
                      type="checkbox"
                      checked={channels.email}
                      onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                      className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                    />
                    Email notifications (weekly reports, streak warnings)
                  </label>
                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-300">
                    <input
                      type="checkbox"
                      checked={channels.browser}
                      onChange={(e) => setChannels({ ...channels, browser: e.target.checked })}
                      className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                    />
                    In-app and browser popup reminders
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-purple-600 hover:bg-purple-500 transition-colors text-white"
              >
                Save Settings
              </Button>
            </form>
          </GlassCard>
        )}
      </div>

      {/* Snooze overlay Modal */}
      <AnimatePresence>
        {showSnoozeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#020617] border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-sm w-full space-y-6 shadow-2xl relative"
            >
              <div>
                <h3 className="text-lg font-black text-white">Snooze Reminder</h3>
                <p className="text-xs text-gray-500 mt-1">Select how long to postpone this learning reminder.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 10, label: "10 mins" },
                  { value: 30, label: "30 mins" },
                  { value: 60, label: "1 hour" },
                  { value: 1440, label: "Tomorrow" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSnooze(opt.value)}
                    className="p-4 bg-white/[0.02] border border-white/5 hover:border-purple-550 hover:bg-purple-600/5 rounded-2xl text-xs font-bold text-white transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowSnoozeModal(false)}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border-white/10 hover:bg-white/5 text-gray-450 hover:text-white transition-all"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReminderCenter;
