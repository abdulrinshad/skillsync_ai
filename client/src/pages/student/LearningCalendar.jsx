import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  BookOpen,
  HelpCircle,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Zap
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const LearningCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("study");
  const [newPriority, setNewPriority] = useState("medium");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/calendar", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newTitle) {
      toast.error("Event title is required");
      return;
    }
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/calendar", {
        title: newTitle,
        description: newDesc,
        eventType: newType,
        priority: newPriority,
        date: selectedDate,
        startTime: newStartTime,
        endTime: newEndTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Event scheduled successfully");
      setShowAddForm(false);
      setNewTitle("");
      setNewDesc("");
      fetchEvents();
    } catch (err) {
      toast.error("Failed to add calendar event.");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/calendar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Scheduled event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Failed to delete event.");
    }
  };

  // Month navigation helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    return events.filter(e => new Date(e.date).toDateString() === dateStr);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventIcon = (type) => {
    switch (type) {
      case "quiz": return <HelpCircle size={14} className="text-yellow-400" />;
      case "notes": return <FileText size={14} className="text-cyan-400" />;
      default: return <BookOpen size={14} className="text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background glow styling */}
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
            <Badge color="cyan" className="mb-2">Study Schedule</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Learning Calendar</h1>
            <p className="text-gray-400 text-sm mt-2">Organize revision days, schedule quiz attempts, and block personal study slots.</p>
          </div>

          <Button
            variant="gradient"
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-xs self-start md:self-auto uppercase tracking-widest shadow-lg"
          >
            <Plus size={16} /> Plan Event
          </Button>
        </div>

        {/* Calendar Grid & Sidebar agenda */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Grid Calendar (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <GlassCard className="p-6 border-white/5 rounded-3xl bg-gradient-to-b from-white/[0.01] to-transparent">
              {/* Navigation Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-white">
                  {currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day Name Labels */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day}>{day}</div>)}
              </div>

              {/* Days Grid Cells */}
              <div className="grid grid-cols-7 gap-2">
                {blanks.map(b => <div key={`blank-${b}`} className="aspect-square bg-transparent" />)}
                
                {daysArray.map((day) => {
                  const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isSelected = selectedDate.toDateString() === cellDate.toDateString();
                  const isToday = new Date().toDateString() === cellDate.toDateString();
                  const dayEvents = getEventsForDate(cellDate);

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDate(cellDate)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2 transition-all relative border ${
                        isSelected
                          ? "bg-purple-600 border-purple-400 text-white shadow-lg"
                          : isToday
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                            : "bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-xs font-black self-start">{day}</span>
                      
                      {/* Priority Event Dots */}
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1 justify-center w-full mt-auto">
                          {dayEvents.slice(0, 3).map((e, idx) => (
                            <span
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${
                                e.priority === "high" ? "bg-red-500" : e.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Agenda list for selected date (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 border-white/5 rounded-3xl space-y-6 bg-gradient-to-b from-white/[0.01] to-transparent h-full flex flex-col">
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Agenda Schedule</span>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <Calendar size={32} className="text-gray-600 mb-2" />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">No study slots scheduled for this day.</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {selectedDateEvents.map((event) => (
                    <div key={event._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 relative group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-white/5 rounded-xl text-purple-400">
                            {getEventIcon(event.eventType)}
                          </span>
                          <div>
                            <h4 className="text-xs font-black text-white leading-tight">{event.title}</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{event.startTime} - {event.endTime}</p>
                          </div>
                        </div>

                        {!event.isAutoGenerated && (
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete custom slot"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                          {event.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                        <Badge color={event.priority === "high" ? "red" : event.priority === "medium" ? "yellow" : "cyan"} className="text-[8px] font-black shrink-0 px-1 py-0.5 uppercase">
                          {event.priority} priority
                        </Badge>
                        <Badge color={event.status === "completed" ? "green" : "purple"} className="text-[8px] font-black shrink-0 px-1 py-0.5 uppercase">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Add Event Overlay Form */}
        <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#020617] border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-md w-full space-y-6 shadow-2xl relative"
              >
                <div>
                  <h3 className="text-xl font-black text-white">Schedule Study Session</h3>
                  <p className="text-xs text-gray-500 mt-1">Book a custom session for {selectedDate.toLocaleDateString()}.</p>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advanced ML Revision"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea
                      placeholder="e.g. Review Backpropagation and neural networks cheat sheets"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows={2}
                      className="w-full pl-4 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-bold text-gray-400 focus:outline-none"
                      >
                        <option value="study">Study Plan</option>
                        <option value="quiz">Quiz Revision</option>
                        <option value="notes">Notes Reading</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-bold text-gray-400 focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Start Time</label>
                      <input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">End Time</label>
                      <input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-500 transition-colors text-white"
                    >
                      Schedule
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearningCalendar;
