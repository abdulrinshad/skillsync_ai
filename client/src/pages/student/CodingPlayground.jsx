import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Sparkles, Play, Send, RefreshCw, ArrowLeft, Terminal, AlertCircle } from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const CodingPlayground = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  // Selections
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [language, setLanguage] = useState("js");
  const [sourceCode, setSourceCode] = useState(`// Write your solution here\nfunction main() {\n  console.log("Hello, SkillSync AI!");\n}\nmain();`);
  const [loading, setLoading] = useState(true);

  // Run status
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");

  // AI Review Status
  const [aiReview, setAiReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

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
      console.error("Failed to load courses:", err);
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

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (lang === "py" || lang === "python") {
      setSourceCode(`# Write your Python solution here\ndef main():\n    print("Hello, SkillSync AI!")\n\nif __name__ == "__main__":\n    main()`);
    } else if (lang === "cpp") {
      setSourceCode(`// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, SkillSync AI!" << endl;\n    return 0;\n}`);
    } else if (lang === "java") {
      setSourceCode(`// Write your Java solution here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SkillSync AI!");\n    }\n}`);
    } else {
      setSourceCode(`// Write your solution here\nfunction main() {\n  console.log("Hello, SkillSync AI!");\n}\nmain();`);
    }
  };

  const handleRun = async () => {
    try {
      setRunning(true);
      setConsoleOutput("Compiling and executing code...");
      setErrorOutput("");
      
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/code/run",
        { language, sourceCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConsoleOutput(res.data.stdout || "");
      setErrorOutput(res.data.stderr || "");
      if (!res.data.stdout && !res.data.stderr) {
        setConsoleOutput("Program executed successfully with zero output.");
      }
    } catch (err) {
      toast.error("Execution failed.");
      setConsoleOutput("");
      setErrorOutput("Compile error or container timeout.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourseId || !selectedModuleId) {
      toast.error("Please configure course and module contexts.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/code/submit",
        { courseId: selectedCourseId, moduleId: selectedModuleId, language, sourceCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.isPassed) {
        toast.success(`Success! Code compiled and tests passed. +${res.data.xpAwarded} XP rewarded!`);
      } else {
        toast.warning("Code compiled but returned verification failures.");
      }
      setConsoleOutput(res.data.submission.stdout || "");
      setErrorOutput(res.data.submission.stderr || "");
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIReview = async () => {
    try {
      setLoadingReview(true);
      setAiReview("");
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/code/ai-review",
        { language, sourceCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiReview(res.data.review || "");
      toast.success("🧠 AI Copilot Audit prepared successfully!");
    } catch (err) {
      toast.error("AI Copilot is busy.");
    } finally {
      setLoadingReview(false);
    }
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
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div>
          <Badge color="purple" className="mb-2">DevPlayground</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Coding Playground</h1>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Write, Compile, and Audit code inside a sandboxed cloud IDE</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Context selector + Output Console (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 border-white/5 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white">1. Workspace Config</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Course Context</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-[#080c16] border border-white/5 focus:border-purple-500/30 rounded-2xl p-3 text-xs text-white focus:outline-none"
                  >
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Module Context</label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full bg-[#080c16] border border-white/5 focus:border-purple-500/30 rounded-2xl p-3 text-xs text-white focus:outline-none"
                  >
                    {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Programming Language</label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full bg-[#080c16] border border-white/5 focus:border-purple-500/30 rounded-2xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="js">JavaScript (Node v18)</option>
                    <option value="py">Python (v3.10)</option>
                    <option value="cpp">C++ (GCC v10)</option>
                    <option value="java">Java (OpenJDK v15)</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* Output Panel */}
            <GlassCard className="p-6 border-white/5 rounded-3xl space-y-4">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Terminal size={14} className="text-cyan-400" /> Output Console
              </h4>

              <div className="bg-black/80 rounded-2xl border border-white/5 p-4 h-[200px] overflow-y-auto font-mono text-[11px] leading-relaxed">
                {errorOutput && (
                  <pre className="text-red-400 whitespace-pre-wrap mb-2">
                    [ERROR] {errorOutput}
                  </pre>
                )}
                {consoleOutput ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap">{consoleOutput}</pre>
                ) : (
                  <span className="text-gray-600 italic">No execution logs output yet. Click 'Run Code' to compile.</span>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right panel: Editor + AI Review (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="border-white/5 rounded-[2rem] overflow-hidden bg-slate-950 flex flex-col justify-between h-[450px]">
              <div className="flex justify-between items-center p-4 bg-black/40 border-b border-white/5 shrink-0 text-xs font-bold text-gray-400">
                <span>VS Code Monaco Sandbox</span>
                <span>Language: {language.toUpperCase()}</span>
              </div>

              <div className="flex-1 min-h-0 relative">
                <Editor
                  height="100%"
                  language={language === "js" ? "javascript" : language === "py" ? "python" : language}
                  theme="vs-dark"
                  value={sourceCode}
                  onChange={(val) => setSourceCode(val || "")}
                  options={{
                    fontSize: 12,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>

              {/* IDE Buttons */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3 shrink-0">
                <Button
                  onClick={handleRun}
                  disabled={running}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1.5"
                >
                  <Play size={12} /> Run Code
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-550 text-white flex items-center justify-center gap-1.5"
                >
                  <Send size={12} /> Submit
                </Button>
                <Button
                  onClick={handleAIReview}
                  disabled={loadingReview}
                  className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider border border-cyan-500/20 bg-cyan-950/10 hover:bg-cyan-950/20 text-cyan-400 flex items-center justify-center gap-1"
                  title="AI Code Review"
                >
                  <Sparkles size={12} /> Review
                </Button>
              </div>
            </GlassCard>

            {/* AI Review Details */}
            {aiReview && (
              <GlassCard className="p-6 border-cyan-500/20 bg-cyan-950/5 space-y-4 rounded-3xl">
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles size={16} className="text-cyan-400 animate-pulse" /> Copilot Code Audit
                </h4>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {aiReview}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPlayground;
