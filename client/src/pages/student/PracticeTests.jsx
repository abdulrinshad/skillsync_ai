import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Sparkles, Timer, ArrowLeft, Trophy, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const PracticeTests = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  
  // Selection States
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(true);

  // Active Test States
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [testRunning, setTestRunning] = useState(false);
  const timerRef = useRef(null);

  // Result States
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/enrollments/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const courseList = res.data.map(e => e.courseId).filter(Boolean);
      setCourses(courseList);
      
      if (courseList.length > 0) {
        setSelectedCourseId(courseList[0]._id);
      }
    } catch (err) {
      console.error("Failed to load enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId) => {
    if (!courseId) return;
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(res.data || []);
      if (res.data?.length > 0) {
        setSelectedModuleId(res.data[0]._id);
      } else {
        setSelectedModuleId("");
      }
    } catch (err) {
      console.error("Failed to load modules:", err);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Timer Tick
  useEffect(() => {
    if (testRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testRunning, timeLeft]);

  const handleStartTest = async () => {
    if (!selectedCourseId || !selectedModuleId) {
      toast.error("Please configure course and module selections.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/practice-tests/generate",
        { courseId: selectedCourseId, moduleId: selectedModuleId, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveTest(res.data);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(300);
      setTestRunning(true);
      setResult(null);
      toast.success("🧠 AI Certification Exam loaded. Let's begin!");
    } catch (err) {
      toast.error("AI is busy preparing questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async (autoSubmit = false) => {
    if (submitting) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const duration = 300 - timeLeft;
      
      const res = await axios.post(
        `http://localhost:5000/api/practice-tests/${activeTest._id}/submit`,
        { answers, timeTaken: duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);
      setTestRunning(false);
      if (autoSubmit) {
        toast.warning("⏰ Time limit exceeded! Assessment submitted automatically.");
      } else {
        toast.success(`Exam completed! Score: ${res.data.percentage}%. +${res.data.xpAwarded} XP earned!`);
      }
    } catch (err) {
      toast.error("Failed to score practice test.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Configuration Setup Form */}
        {!testRunning && !result && (
          <GlassCard className="p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <div>
              <Badge color="purple" className="mb-2">Assessment Center</Badge>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">AI Practice Tests</h1>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Generate Adaptive, Exam-Oriented Certifications</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-[#080c16] border border-white/5 focus:border-purple-500/30 rounded-2xl p-4 text-xs text-white focus:outline-none"
                >
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Select Module</label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full bg-[#080c16] border border-white/5 focus:border-purple-500/30 rounded-2xl p-4 text-xs text-white focus:outline-none"
                >
                  {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Difficulty</label>
                <div className="flex gap-3 mt-1.5 text-xs font-bold">
                  {["easy", "medium", "hard"].map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-3 rounded-xl border transition-all uppercase tracking-wider ${
                        difficulty === diff
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} /> Generate Custom AI Test
            </Button>
          </GlassCard>
        )}

        {/* Active Exam Interface */}
        {testRunning && activeTest && (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Left Side: Question block (col-span-8) */}
            <div className="md:col-span-8 space-y-6">
              <GlassCard className="p-6 border-white/5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    Question {currentIndex + 1} of {activeTest.questions.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold font-mono">
                    <Timer size={14} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-white leading-relaxed">{activeTest.questions[currentIndex].question}</p>

                <div className="grid gap-2.5 pt-3">
                  {activeTest.questions[currentIndex].options.map((opt, oIdx) => {
                    const isSelected = answers[currentIndex] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setAnswers({ ...answers, [currentIndex]: opt })}
                        className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-colors ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10 text-white font-bold"
                            : "border-white/5 bg-slate-950/20 hover:border-white/10 hover:bg-white/5 text-gray-400"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <Button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className="py-1.5 px-4 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl"
                  >
                    Previous
                  </Button>
                  {currentIndex === activeTest.questions.length - 1 ? (
                    <Button
                      onClick={() => handleSubmitTest(false)}
                      className="py-1.5 px-5 bg-purple-600 hover:bg-purple-550 text-white text-xs rounded-xl font-bold uppercase tracking-wider"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="py-1.5 px-4 bg-purple-600 hover:bg-purple-550 text-white text-xs rounded-xl font-bold"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Side: Palette navigator (col-span-4) */}
            <div className="md:col-span-4 space-y-4">
              <GlassCard className="p-5 border-white/5 rounded-3xl">
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider border-b border-white/5 pb-2 mb-3">Navigation Palette</h4>
                <div className="flex flex-wrap gap-2.5">
                  {activeTest.questions.map((_, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const isCurrent = currentIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center border transition-all ${
                          isCurrent
                            ? "border-purple-500 bg-purple-500/10 text-white"
                            : isAnswered
                              ? "border-green-500/30 bg-green-950/20 text-green-400"
                              : "border-white/5 bg-slate-950 text-gray-500"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Scorecard Results Dashboard */}
        {result && (
          <GlassCard className="p-8 rounded-[2.5rem] border-purple-500/20 bg-purple-950/5 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto">
                <Trophy size={32} />
              </div>
              <div>
                <Badge color="green" className="uppercase font-extrabold text-[8px] tracking-wider shrink-0 px-2 py-0.5">Grade {result.grade}</Badge>
                <h2 className="text-3xl font-black text-white mt-2">Test Completed!</h2>
                <p className="text-sm text-gray-400 mt-1">Accuracy Score: <span className="text-purple-400 font-bold">{result.percentage}%</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-4 border-y border-white/5">
              <div>
                <span className="text-2xl font-black text-white">{result.test.score} / {result.test.questions.length}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Correct Answers</span>
              </div>
              <div>
                <span className="text-2xl font-black text-purple-400">+{result.xpAwarded}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">XP Earned</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Tutor Feedback & Analysis</h3>
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                <p className="text-xs text-gray-300 font-medium leading-relaxed">{result.aiFeedback}</p>
                <p className="text-[10px] text-orange-400 font-bold">Weak Areas: {result.weakAreas}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 shrink-0">
              <Button
                onClick={() => setResult(null)}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-550 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Done
              </Button>
              <Button
                onClick={handleStartTest}
                className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Retake Exam
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default PracticeTests;
