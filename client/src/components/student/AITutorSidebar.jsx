import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sparkles, Send, Trash2, Video, AlertCircle, HelpCircle, MessageSquare } from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";
import { toast } from "react-toastify";

const AITutorSidebar = ({ courseId, moduleId, lectureId, timestamp }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("lecture_only"); // lecture_only vs general
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const formatTimestamp = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  const fetchHistory = async () => {
    if (!lectureId) return;
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/ai/chat/history/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load AI chat history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [lectureId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customQ = "") => {
    const textToSend = customQ || question;
    if (!textToSend.trim()) return;

    // Append optimism
    const tempUserMsg = {
      role: "user",
      content: `[Timestamp: ${formatTimestamp(timestamp)}] ${textToSend}`,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat/current-video",
        {
          courseId,
          moduleId,
          lectureId,
          timestamp,
          mode,
          question: textToSend
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Tutor is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/ai/chat/history/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
      toast.success("Chat history cleared.");
    } catch (err) {
      toast.error("Failed to clear chat history.");
    }
  };

  const suggestions = [
    "Summarize this lecture.",
    "Give key points.",
    "Generate flashcards.",
    "Ask me an MCQ.",
    "Give real-world applications."
  ];

  return (
    <GlassCard className="p-5 border-white/10 rounded-[2rem] flex flex-col h-[500px] justify-between bg-gradient-to-b from-white/[0.01] to-transparent">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">AI Lecture Tutor</h4>
            <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">Khan-Academy Tutor Mode</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          disabled={messages.length === 0}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors disabled:opacity-30"
          title="Clear Chat"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl mt-3 shrink-0 text-[10px] font-bold">
        <button
          onClick={() => setMode("lecture_only")}
          className={`flex-1 py-1 rounded-lg transition-all ${
            mode === "lecture_only" ? "bg-purple-600 text-white shadow" : "text-gray-400 hover:text-white"
          }`}
        >
          Lecture Only
        </button>
        <button
          onClick={() => setMode("general")}
          className={`flex-1 py-1 rounded-lg transition-all ${
            mode === "general" ? "bg-purple-600 text-white shadow" : "text-gray-400 hover:text-white"
          }`}
        >
          Lecture + General
        </button>
      </div>

      {/* Timestamp Status Widget */}
      <div className="flex items-center gap-1.5 p-2 bg-purple-500/5 border border-purple-500/15 rounded-xl mt-2 text-[9px] font-bold text-purple-400 shrink-0 select-none">
        <Video size={10} />
        <span>Tutor synced at video timestamp: {formatTimestamp(timestamp)}</span>
      </div>

      {/* Messages Box */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 custom-scrollbar min-h-0 text-xs">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 gap-3">
            <MessageSquare size={24} className="text-gray-600 animate-bounce" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ask anything about the video content</p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[9px] font-bold bg-white/5 hover:bg-purple-650/20 text-gray-300 hover:text-white border border-white/5 rounded-xl px-2.5 py-1 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-xs max-w-[85%] leading-relaxed font-semibold ${
                msg.role === "user"
                  ? "bg-purple-600/10 border-purple-500/20 text-white ml-auto"
                  : "bg-white/[0.02] border-white/5 text-gray-300"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="relative shrink-0 mt-auto">
        <input
          type="text"
          placeholder="Ask AI Tutor (e.g. explain this segment)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
          className="w-full pl-4 pr-12 py-3.5 bg-white/[0.02] border border-white/5 focus:border-purple-500/50 rounded-2xl text-xs font-semibold text-white focus:outline-none placeholder-gray-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !question.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 disabled:opacity-30 p-1.5"
        >
          <Send size={14} />
        </button>
      </div>
    </GlassCard>
  );
};

export default AITutorSidebar;
