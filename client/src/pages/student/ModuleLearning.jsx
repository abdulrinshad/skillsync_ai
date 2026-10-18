import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Clock,
  Award,
  Globe,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Play,
  FileText,
  Video,
  ChevronLeft,
  Download,
  Trophy,
  Check,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  RefreshCw,
  List
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import AITutorSidebar from "../../components/student/AITutorSidebar";
import FlashcardPlayer from "../../components/student/FlashcardPlayer";
import MindMapViewer from "../../components/student/MindMapViewer";




const ModuleLearning = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  // Core State
  const [course, setCourse] = useState(null);
  const [moduleItem, setModuleItem] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [resumed, setResumed] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const lastSavedTimeRef = useRef(0);


  // Tab controls under the video
  const [activePlayerTab, setActivePlayerTab] = useState("lecture");

  // Selected Module Contents (resources, quiz, notes, etc.)
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [expandedNoteSections, setExpandedNoteSections] = useState({});
  const [mcqUserAnswers, setMcqUserAnswers] = useState({});
  const [cheatSheet, setCheatSheet] = useState("");
  const [learningObjectives, setLearningObjectives] = useState([]);
  const [quiz, setQuiz] = useState({ questions: [] });
  const [assignments, setAssignments] = useState({ assignments: [] });
  const [coding, setCoding] = useState({ exercises: [] });
  const [flashcards, setFlashcards] = useState({ cards: [] });
  const [questions, setQuestions] = useState({ questions2Mark: [], questions5Mark: [], questions10Mark: [], interviewQuestions: [], companyQuestions: [] });

  // Interactive Quiz Attempt states
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(600); // 10 minutes timer
  const quizTimerRef = useRef(null);

  // Bonus AI states
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [testMeQuiz, setTestMeQuiz] = useState(null);
  const [loadingTestMe, setLoadingTestMe] = useState(false);
  const [personalNotes, setPersonalNotes] = useState("");
  const [loadingPersonalNotes, setLoadingPersonalNotes] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Course Info
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(courseRes.data);

      // Fetch Module Info / Content
      const contentRes = await axios.get(`http://localhost:5000/api/modules/${moduleId}/content`, { headers });
      const content = contentRes.data;
      
      const resourcesRes = await axios.get(`http://localhost:5000/api/resources/student/module/${moduleId}`, { headers });
      setResources(resourcesRes.data || []);
      setNotes(content.notes || []);
      setCheatSheet(content.cheatSheet || "");
      setLearningObjectives(content.learningObjectives || []);
      setQuiz(content.quiz || { questions: [] });
      setAssignments(content.assignments || { assignments: [] });
      setCoding(content.coding || { exercises: [] });
      setFlashcards(content.flashcards || { cards: [] });
      setQuestions(content.questions || { questions2Mark: [], questions5Mark: [], questions10Mark: [], interviewQuestions: [], companyQuestions: [] });

      // Fetch Lectures (API Requirement: GET /api/modules/:moduleId/lectures)
      const lecturesRes = await axios.get(`http://localhost:5000/api/modules/${moduleId}/lectures`, { headers });
      const fetchedLectures = lecturesRes.data || [];
      setLectures(fetchedLectures);
      
      // Fetch continue watching progress
      try {
        const resumeRes = await axios.get(`http://localhost:5000/api/progress/continue/${courseId}`, { headers });
        if (resumeRes.data) {
          setResumeData(resumeRes.data);
          const resumeLecId = resumeRes.data.lectureId?._id || resumeRes.data.lectureId;
          const foundLec = fetchedLectures.find(l => l._id === resumeLecId);
          if (foundLec) {
            setSelectedLecture(foundLec);
          } else if (fetchedLectures.length) {
            setSelectedLecture(fetchedLectures[0]);
          }
        } else if (fetchedLectures.length) {
          setSelectedLecture(fetchedLectures[0]);
        }
      } catch (err) {
        if (fetchedLectures.length) {
          setSelectedLecture(fetchedLectures[0]);
        }
      }

      // Fetch Course Progress
      const progressRes = await axios.get(`http://localhost:5000/api/progress/${courseId}`, { headers });
      setCourseProgress(progressRes.data);

      // Find the specific module title
      const modulesListRes = await axios.get(`http://localhost:5000/api/modules/course/${courseId}`, { headers });
      const currentMod = modulesListRes.data?.find(m => m._id === moduleId);
      setModuleItem(currentMod || { title: "Module Workspace" });

    } catch (err) {
      console.error("Failed to load module workspace details:", err);
      toast.error("Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [courseId, moduleId]);

  // Live MCQ Quiz timer
  useEffect(() => {
    if (activePlayerTab === "quiz" && !quizFinished) {
      quizTimerRef.current = setInterval(() => {
        setQuizTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(quizTimerRef.current);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(quizTimerRef.current);
    }
    return () => clearInterval(quizTimerRef.current);
  }, [activePlayerTab, quizFinished]);

  const submitQuiz = async () => {
    if (quizFinished) return;
    try {
      let score = 0;
      const questionsList = quiz?.questions || [];
      questionsList.forEach((q) => {
        const selected = selectedAnswers[q._id]?.trim().toLowerCase();
        const correct = q.correctAnswer?.trim().toLowerCase();
        if (selected === correct) score++;
      });

      setQuizScore(score);
      setQuizFinished(true);
      clearInterval(quizTimerRef.current);

      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const duration = 600 - quizTimeLeft;
      const answersPayload = Object.keys(selectedAnswers).map((qId) => ({
        questionId: qId,
        selectedAnswer: selectedAnswers[qId],
      }));

      const res = await axios.post(`http://localhost:5000/api/modules/${moduleId}/quiz/attempt`, {
        answers: answersPayload,
        completionTime: duration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.progress) {
        setCourseProgress(res.data.progress);
      }

      toast.success(`Quiz submitted! Score: ${score} / ${questionsList.length}. +${res.data.xpEarned} XP rewarded!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz attempt");
    }
  };

  // Bonus AI: Explain Again
  const handleExplainAgain = async () => {
    setLoadingExplanation(true);
    setAiExplanation("");
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/modules/${moduleId}/explain-again`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiExplanation(res.data.explanation);
    } catch (err) {
      toast.error("AI is busy, please try again.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  // Bonus AI: Test Me
  const handleTestMe = async () => {
    setLoadingTestMe(true);
    setTestMeQuiz(null);
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/modules/${moduleId}/test-me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestMeQuiz(res.data.questions);
      toast.success("🧠 Live Quiz generated on current lecture!");
    } catch (err) {
      toast.error("AI is busy.");
    } finally {
      setLoadingTestMe(false);
    }
  };

  // Bonus AI: Personal Notes
  const handlePersonalNotes = async () => {
    setLoadingPersonalNotes(true);
    setPersonalNotes("");
    try {
      await new Promise(r => setTimeout(r, 1200));
      setPersonalNotes(`📘 Personalized Notes for: ${course?.title} -> ${moduleItem?.title}\n\n1. You have completed lectures and reviewed reference documents.\n2. Keep in mind: ${learningObjectives[0] || "core module paradigms"}.\n3. Practice recommendation: Focus on implementing coding exercises locally to seal parameters configurations.`);
      toast.success("Personalized progress review prepared!");
    } catch (err) {
      toast.error("AI notes not available.");
    } finally {
      setLoadingPersonalNotes(false);
    }
  };

  const handleMarkComplete = async (targetLec) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const currentLec = targetLec || selectedLecture;
      if (!currentLec) return;

      const res = await axios.post(`http://localhost:5000/api/progress/module/${moduleId}/lecture`, {
        lectureId: currentLec._id,
        courseId: courseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourseProgress(res.data.progress);
      toast.success(`Lecture completed! +${res.data.xpAwarded || 10} XP`);
      
      if (res.data.progress.completed) {
        toast.success("🎉 Course Completed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    }
  };

  const handleVideoEnded = async (lec) => {
    await handleMarkComplete(lec);
    if (autoNext) {
      const currentIndex = lectures.findIndex(l => l._id === lec._id);
      if (currentIndex !== -1 && currentIndex + 1 < lectures.length) {
        toast.info("Auto-playing next lecture...");
        setSelectedLecture(lectures[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    if (selectedLecture) {
      const activeEl = document.getElementById(`playlist-item-${selectedLecture._id}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedLecture]);

  const handleTimeUpdate = async (e) => {
    const currentTime = Math.floor(e.target.currentTime);
    setCurrentTimestamp(currentTime);
    const duration = e.target.duration || 0;

    if (duration > 0) {
      const pct = Math.round((currentTime / duration) * 100);

      // Save continue watching progress every 10 seconds
      if (currentTime > 0 && currentTime % 10 === 0 && currentTime !== lastSavedTimeRef.current) {
        lastSavedTimeRef.current = currentTime;
        try {
          const token = localStorage.getItem("token_student") || localStorage.getItem("token");
          const res = await axios.post("http://localhost:5000/api/progress/continue", {
            courseId,
            moduleId,
            lectureId: selectedLecture._id,
            currentSecond: currentTime,
            watchedPercentage: pct
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.data.progress) {
            setCourseProgress(res.data.progress);
          }
          if (res.data.xpAwarded > 0) {
            toast.success(`Lecture completed! +${res.data.xpAwarded} XP`);
          }
        } catch (err) {
          console.error("Failed to auto-save watch progress:", err);
        }
      }
    }
  };

  const handleLoadedMetadata = (e) => {
    const modProg = courseProgress?.moduleProgress?.find(m => m.moduleId === moduleId || m.moduleId?._id === moduleId);
    if (modProg && selectedLecture && (modProg.lastLecture === selectedLecture._id || modProg.lastLecture?._id === selectedLecture._id) && !resumed) {
      e.target.currentTime = modProg.currentSecond;
      setResumed(true);
      toast.info(`Resumed lecture at ${formatTime(modProg.currentSecond)}`);
    }
  };

  const handleResourcePreview = (resource) => {
    const resourceUrl = resource.resourceType === "link" ? resource.fileUrl : `http://localhost:5000${resource.fileUrl}`;
    window.open(resourceUrl, "_blank");
  };

  const handleResourceDownload = async (resource) => {
    const token = localStorage.getItem("token_student") || localStorage.getItem("token");
    const resourceId = resource._id;
    const resourceUrl = resource.resourceType === "link" ? resource.fileUrl : `http://localhost:5000${resource.fileUrl}`;

    // 1. Call download tracking API (Isolated)
    try {
      await axios.post(`http://localhost:5000/api/resources/download/${resourceId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to track download count:", err);
    }

    // 2. Call progress tracking API (Isolated)
    try {
      const res = await axios.post("http://localhost:5000/api/progress/resource-complete", {
        courseId,
        moduleId,
        resourceId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(res.data.progress);
    } catch (err) {
      console.error("Failed to mark resource complete:", err);
    }

    // 3. ALWAYS trigger actual browser download
    try {
      if (resource.resourceType !== "link") {
        try {
          const response = await axios.get(resourceUrl, { 
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` }
          });
          const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = resource.fileName || resource.title || "download";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (fetchErr) {
          console.error("Axios blob fetch failed, falling back to direct navigation:", fetchErr);
          const link = document.createElement("a");
          link.href = resourceUrl;
          link.download = resource.fileName || resource.title || "download";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        window.open(resourceUrl, "_blank");
      }
      toast.success("Download started!");
    } catch (err) {
      console.error("Browser download failed:", err);
      toast.error("Failed to download resource file");
    }

    // Reload resources (Isolated)
    try {
      const resourcesRes = await axios.get(`http://localhost:5000/api/resources/student/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(resourcesRes.data || []);
    } catch (err) {
      console.error("Failed to reload resources:", err);
    }
  };

  const handleMarkResourceComplete = async (resourceId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/progress/resource-complete", {
        courseId,
        moduleId,
        resourceId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(res.data.progress);
      toast.success("Resource marked complete! +5 XP");

      const resourcesRes = await axios.get(`http://localhost:5000/api/resources/student/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(resourcesRes.data || []);
    } catch (err) {
      console.error("Failed to mark resource complete:", err);
      toast.error("Failed to mark complete");
    }
  };

  const handleNotesComplete = async () => {
    const currentModule = moduleItem;
    console.log("courseId:", courseId);
    console.log("moduleId:", moduleId);
    console.log("currentModule:", currentModule);
    console.log("requestBody:", { courseId, moduleId });

    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/progress/notes-complete", {
        courseId,
        moduleId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response.data);
      setCourseProgress(response.data.progress);
      toast.success("AI Notes marked completed! +5 XP");
    } catch (error) {
      console.log("FULL ERROR", error);
      console.log("SERVER RESPONSE", error.response?.data);
      console.log("REQUEST BODY", { courseId, moduleId });
      console.error("Failed to mark notes completed:", error);
    }
  };

  const getModuleCompletionDetails = () => {
    const modProg = courseProgress?.moduleProgress?.find(m => m.moduleId === moduleId || m.moduleId?._id === moduleId);
    const isNotesDone = modProg?.notesCompleted || false;
    const isQuizDone = modProg?.quizCompleted || false;

    // 1. Lecture Progress (Weight: 40)
    const totalLecs = lectures.length;
    const completedLecs = lectures.filter(lec => 
      modProg?.completedLectures?.includes(lec._id) || 
      modProg?.completedLectures?.some(cl => cl._id === lec._id || cl === lec._id)
    ).length;
    const lectureProgress = totalLecs > 0 ? (completedLecs / totalLecs) * 40 : 40;

    // 2. Resource Progress (Weight: 20)
    const totalRes = resources.length;
    const completedRes = resources.filter(res => 
      modProg?.completedResources?.includes(res._id) || 
      modProg?.completedResources?.some(cr => cr._id === res._id || cr === res._id)
    ).length;
    const resourceProgress = totalRes > 0 ? (completedRes / totalRes) * 20 : 20;

    // 3. Notes Progress (Weight: 20)
    const notesProgress = isNotesDone ? 20 : 0;

    // 4. Quiz Progress (Weight: 20)
    const quizProgress = isQuizDone ? 20 : 0;

    const percentage = Math.round(lectureProgress + resourceProgress + notesProgress + quizProgress);
    
    return { count: totalLecs, completedCount: completedLecs, percentage };
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background blur */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Course Syllabus
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
              {moduleItem?.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Course: {course?.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedLecture && courseProgress && !(courseProgress.completedLectures?.includes(selectedLecture._id) || courseProgress.completedLectures?.some(cl => cl._id === selectedLecture._id || cl === selectedLecture._id)) && (
              <Button onClick={() => handleMarkComplete(selectedLecture)} className="py-1.5 px-4 bg-green-600/20 hover:bg-green-600/40 text-green-400 font-bold text-xs rounded-xl border border-green-500/30 flex items-center gap-2">
                <Check size={14} /> Mark Lecture Complete
              </Button>
            )}
            {selectedLecture && (courseProgress?.completedLectures?.includes(selectedLecture._id) || courseProgress?.completedLectures?.some(cl => cl._id === selectedLecture._id || cl === selectedLecture._id)) && (
              <Badge color="green" className="flex items-center gap-1">
                <CheckCircle size={12} /> Completed
              </Badge>
            )}
            <Badge color="purple">{getModuleCompletionDetails().percentage}% Complete</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Video player/tabs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video screen wrapper */}
            {selectedLecture ? (
              <div className="space-y-4">
                <div className="aspect-video rounded-3xl overflow-hidden bg-black/60 border border-white/5 shadow-2xl relative flex items-center justify-center">
                  {selectedLecture.videoUrl.includes("youtube.com") || selectedLecture.videoUrl.includes("youtu.be") ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedLecture.videoUrl.split("v=")[1] || selectedLecture.videoUrl.split("/").pop()}`}
                      title="Lecture Video"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={selectedLecture._id}
                      className="w-full h-full"
                      controls
                      src={selectedLecture.videoUrl.startsWith("/uploads") ? `http://localhost:5000${selectedLecture.videoUrl}` : selectedLecture.videoUrl}
                      onEnded={() => handleVideoEnded(selectedLecture)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    />
                  )}
                </div>

                {/* Previous/Next Navigation Controls */}
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  <Button
                    disabled={lectures.findIndex(l => l._id === selectedLecture._id) === 0}
                    onClick={() => {
                      const idx = lectures.findIndex(l => l._id === selectedLecture._id);
                      if (idx > 0) {
                        setSelectedLecture(lectures[idx - 1]);
                        setResumed(true);
                      }
                    }}
                    className="py-1.5 px-4 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold"
                  >
                    ← Previous Lecture
                  </Button>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Lecture {lectures.findIndex(l => l._id === selectedLecture._id) + 1} of {lectures.length}
                  </span>
                  <Button
                    disabled={lectures.findIndex(l => l._id === selectedLecture._id) === lectures.length - 1}
                    onClick={() => {
                      const idx = lectures.findIndex(l => l._id === selectedLecture._id);
                      if (idx < lectures.length - 1) {
                        setSelectedLecture(lectures[idx + 1]);
                        setResumed(true);
                      }
                    }}
                    className="py-1.5 px-4 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold"
                  >
                    Next Lecture →
                  </Button>
                </div>

                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedLecture.title}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedLecture.description || "No description provided for this lecture."}</p>
                </div>
              </div>
            ) : (
              /* Fallback instruction screen when selectedLecture is null */
              <div className="aspect-video rounded-3xl overflow-hidden bg-black/60 border border-white/5 shadow-2xl relative flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center animate-pulse">
                  <Video size={32} />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">Ready to start learning?</h4>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Select a lecture from the **Course Content** playlist on the right side to load the video and begin.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tabs under player screen */}
            <div className="flex border-b border-white/5 pb-1 gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: "lecture", label: "Objectives" },
                { id: "resources", label: "Resources" },
                { id: "notes", label: "AI Notes" },
                { id: "questions", label: "Questions" },
                { id: "quiz", label: "Quiz" },
                { id: "coding", label: "Coding" },
                { id: "assignments", label: "Assignment" },
                { id: "flashcards", label: "AI Flashcards" },
                { id: "mindmaps", label: "AI Mind Maps" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePlayerTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider border transition-all ${
                    activePlayerTab === tab.id
                      ? "bg-purple-600/10 border-purple-500/30 text-white"
                      : "border-transparent text-gray-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-tab content renderer */}
            <AnimatePresence mode="wait">
              {activePlayerTab === "lecture" && (
                <motion.div key="tab-lecture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <GlassCard className="p-6 border-white/5 space-y-4">
                    <h4 className="font-extrabold text-sm text-white">Learning Objectives</h4>
                    {learningObjectives.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No learning objectives defined for this module.</p>
                    ) : (
                      <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
                        {learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    )}
                  </GlassCard>
                </motion.div>

                )}

                   {activePlayerTab === "resources" && (
                <motion.div key="tab-resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-white">Course Reference Materials</h4>
                  </div>
                  {resources.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No downloadable reference resources uploaded for this module.</p>
                  ) : (
                    <div className="grid gap-4">
                      {resources.map((res) => {
                        const isCompleted = courseProgress?.completedResources?.includes(res._id) || 
                                            courseProgress?.completedResources?.some(cr => cr._id === res._id || cr === res._id);
                        
                        const resourceUrl = res.resourceType === "link" ? res.fileUrl : `http://localhost:5000${res.fileUrl}`;

                        return (
                          <GlassCard key={res._id} className="p-5 border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01] hover:border-purple-500/20 transition-all">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 shrink-0">
                                {res.resourceType === "video" ? <Video size={20} /> : res.resourceType === "link" ? <Globe size={20} /> : <FileText size={20} />}
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className="font-bold text-sm text-white">{res.title || res.fileName}</h5>
                                  {res.isRequired && (
                                    <Badge color="red" className="text-[9px] uppercase tracking-wider py-0.5 px-2">Required</Badge>
                                  )}
                                  <Badge color="cyan" className="text-[9px] uppercase tracking-wider py-0.5 px-2">{res.category || "Study Material"}</Badge>
                                </div>
                                {res.description && (
                                  <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{res.description}</p>
                                )}
                                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                    <span>Type: {res.resourceType?.toUpperCase() || "FILE"}</span>
                                    {res.resourceType !== "link" && <span>• Size: {res.fileSize || "0 MB"}</span>}
                                    <span>• Downloads: {res.downloadCount || 0}</span>
                                    {isCompleted && <span className="text-green-400">• Completed</span>}
                                  </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0 flex-wrap">
                              <button
                                onClick={() => handleResourcePreview(res)}
                                className="py-2 px-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
                              >
                                Preview
                              </button>

                              <button
                                onClick={() => handleResourceDownload(res)}
                                className="py-2 px-3.5 bg-purple-600 hover:bg-purple-750 text-white font-bold text-xs rounded-xl transition-colors shadow-lg"
                              >
                                Download
                              </button>

                              {!isCompleted && (
                                <button
                                  onClick={() => handleMarkResourceComplete(res._id)}
                                  className="py-2 px-3.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activePlayerTab === "notes" && (
                <motion.div key="tab-notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {(() => {
                    const isNotesDone = courseProgress?.completedNotes?.includes(moduleId) || 
                                        courseProgress?.completedNotes?.some(n => n === moduleId || n._id === moduleId) ||
                                        courseProgress?.notesCompleted;
                    return (
                      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                          Module AI Notes (Weight: 20%)
                        </span>
                        {isNotesDone ? (
                          <Badge color="green" className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl">
                            <Check size={14} /> Completed
                          </Badge>
                        ) : (
                          <Button 
                            onClick={handleNotesComplete} 
                            className="py-1.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg"
                          >
                            Mark Notes Completed
                          </Button>
                        )}
                      </div>
                    );
                  })()}
                  {notes.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">AI Revision notes have not been published for this module yet.</p>
                  ) : (
                    notes.map((note, idx) => {
                      const isExpanded = expandedNoteId === note._id;
                      const hasStructuredFields = note.introduction && note.definition && note.explanation;

                      const noteSections = [
                        { id: "introduction", label: "1. Introduction", icon: BookOpen },
                        { id: "definition", label: "2. Definition", icon: Sparkles },
                        { id: "keyPoints", label: "3. Key Concepts", icon: List },
                        { id: "explanation", label: "4. Detailed Explanation", icon: FileText },
                        { id: "examples", label: "5. Real World Examples", icon: Globe },
                        { id: "codeExamples", label: "6. Code Examples", icon: FileText },
                        { id: "importantQuestions", label: "7. Important Questions (University/Exam)", icon: Award },
                        { id: "interviewQuestions", label: "8. Interview Questions", icon: HelpCircle },
                        { id: "mcqs", label: "9. Interactive Practice MCQs", icon: CheckCircle },
                        { id: "mistakes_tips", label: "10. Common Mistakes & Tips", icon: AlertOctagon },
                        { id: "cheatSheet", label: "11. Quick Revision Cheat Sheet", icon: RefreshCw },
                        { id: "summary", label: "12. Summary", icon: Award }
                      ];

                      return (
                        <GlassCard key={note._id || idx} className={`border-white/5 transition-all overflow-hidden ${isExpanded ? "ring-1 ring-purple-500/20 shadow-purple-500/5" : ""}`}>
                          <div 
                            onClick={() => setExpandedNoteId(isExpanded ? null : note._id)}
                            className="flex justify-between items-center cursor-pointer select-none p-5 bg-gradient-to-r from-purple-950/20 via-transparent to-transparent hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest">Chapter {note.chapterNumber || (idx + 1)}</span>
                              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                                <span className="text-[10px] text-purple-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                                  ▶
                                </span>
                                {note.title}
                              </h4>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-6 border-t border-white/5 bg-[#080c16]/50 space-y-4">
                              {hasStructuredFields ? (
                                /* NEW PREMIUM ACCORDION UI */
                                <div className="space-y-3">
                                  {noteSections.map((sec) => {
                                    const sectionKey = `${note._id}-${sec.id}`;
                                    const isSecExpanded = expandedNoteSections[sectionKey];
                                    const SecIcon = sec.icon;

                                    return (
                                      <div key={sec.id} className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/20 transition-all">
                                        <div 
                                          onClick={() => setExpandedNoteSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}
                                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                                        >
                                          <div className="flex items-center gap-2 text-xs font-extrabold text-gray-200">
                                            <SecIcon size={14} className="text-purple-400" />
                                            <span>{sec.label}</span>
                                          </div>
                                          <span className="text-[10px] text-purple-400 font-bold font-mono">
                                            {isSecExpanded ? "COLLAPSE -" : "EXPAND +"}
                                          </span>
                                        </div>

                                        {isSecExpanded && (
                                          <div className="p-5 border-t border-white/5 bg-slate-950/40 text-xs text-gray-300 space-y-4">
                                            {sec.id === "introduction" && (
                                              <p className="leading-relaxed text-sm bg-gradient-to-br from-purple-950/15 to-transparent p-4 rounded-xl border border-purple-500/10">{note.introduction}</p>
                                            )}

                                            {sec.id === "definition" && (
                                              <div className="p-4 bg-indigo-950/15 border-l-4 border-indigo-500 rounded-r-xl border-y border-r border-white/5 leading-relaxed text-sm text-white">
                                                {note.definition}
                                              </div>
                                            )}

                                            {sec.id === "keyPoints" && (
                                              <div className="grid gap-2">
                                                {note.keyPoints.map((pt, pIdx) => (
                                                  <div key={pIdx} className="flex items-start gap-2.5 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/5 transition-all">
                                                    <span className="text-purple-400 shrink-0 text-base">✓</span>
                                                    <span className="text-gray-300 font-medium">{pt.replace(/^✓\s*/, "")}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {sec.id === "explanation" && (
                                              <div className="leading-relaxed text-xs space-y-3">
                                                {note.explanation.split("\n").map((para, pIdx) => para.trim() && (
                                                  <p key={pIdx}>{para}</p>
                                                ))}
                                              </div>
                                            )}

                                            {sec.id === "examples" && (
                                              <div className="p-4 bg-cyan-950/15 border border-cyan-500/10 rounded-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 text-cyan-500/5"><Globe size={70} /></div>
                                                <p className="leading-relaxed relative z-10 text-gray-300">{note.examples}</p>
                                              </div>
                                            )}

                                            {sec.id === "codeExamples" && (
                                              <div className="space-y-4">
                                                {note.codeExamples && note.codeExamples.length > 0 ? (
                                                  note.codeExamples.map((ex, cIdx) => (
                                                    <div key={cIdx} className="border border-white/5 rounded-xl overflow-hidden bg-slate-950">
                                                      <div className="flex justify-between items-center px-4 py-2.5 bg-white/5 border-b border-white/5">
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Example #{cIdx + 1}</span>
                                                        <button 
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(ex.code);
                                                            toast.success("Code copied to clipboard!");
                                                          }}
                                                          className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest hover:underline"
                                                        >
                                                          Copy Code
                                                        </button>
                                                      </div>
                                                      <pre className="p-4 overflow-x-auto font-mono text-xs text-emerald-400 bg-slate-950/90 leading-relaxed">
                                                        <code>{ex.code}</code>
                                                      </pre>
                                                      {ex.explanation && (
                                                        <div className="p-4 border-t border-white/5 bg-slate-900/20 text-xs text-gray-400 leading-relaxed">
                                                          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block mb-1">Breakdown</span>
                                                          {ex.explanation}
                                                        </div>
                                                      )}
                                                    </div>
                                                  ))
                                                ) : (
                                                  <p className="italic text-gray-500">No code examples provided for this topic.</p>
                                                )}
                                              </div>
                                            )}

                                            {sec.id === "importantQuestions" && (
                                              <div className="grid gap-2">
                                                {note.importantQuestions.map((q, qIdx) => (
                                                  <div key={qIdx} className="p-3 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">{qIdx + 1}</span>
                                                    <span className="text-gray-300 font-semibold">{q.replace(/^\d+\.\s*/, "")}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {sec.id === "interviewQuestions" && (
                                              <div className="grid gap-2">
                                                {note.interviewQuestions.map((q, qIdx) => (
                                                  <div key={qIdx} className="p-3 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">Q</span>
                                                    <span className="text-gray-300 font-semibold">{q.replace(/^\d+\.\s*/, "")}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {sec.id === "mcqs" && (
                                              <div className="space-y-4">
                                                {note.mcqs.map((mcq, mIdx) => {
                                                  const ansKey = `${note._id}-${mIdx}`;
                                                  const selectedOption = mcqUserAnswers[ansKey];
                                                  const isCorrect = selectedOption === mcq.answer;
                                                  return (
                                                    <div key={mIdx} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                                                      <div className="flex items-start gap-2">
                                                        <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5">Q{mIdx + 1}</span>
                                                        <h5 className="font-extrabold text-xs text-white leading-relaxed">{mcq.question.replace(/^Q\d+\.\s*/i, "")}</h5>
                                                      </div>
                                                      <div className="grid gap-1.5">
                                                        {mcq.options.map((opt, oIdx) => {
                                                          const optLetter = String.fromCharCode(65 + oIdx);
                                                          const optClean = opt.replace(/^[A-D][\.\)]\s*/, "");
                                                          
                                                          let optStyle = "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10";
                                                          if (selectedOption) {
                                                            if (optLetter === mcq.answer) {
                                                              optStyle = "bg-emerald-950/30 border-emerald-500/30 text-emerald-400 font-bold";
                                                            } else if (selectedOption === optLetter) {
                                                              optStyle = "bg-rose-950/30 border-rose-500/30 text-rose-400 font-bold";
                                                            }
                                                          }

                                                          return (
                                                            <button
                                                              key={oIdx}
                                                              disabled={!!selectedOption}
                                                              onClick={() => setMcqUserAnswers(prev => ({ ...prev, [ansKey]: optLetter }))}
                                                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2.5 ${optStyle}`}
                                                            >
                                                              <span className="w-5.5 h-5.5 rounded bg-white/5 flex items-center justify-center text-[9px] font-bold border border-white/5 shrink-0">{optLetter}</span>
                                                              <span>{optClean}</span>
                                                            </button>
                                                          );
                                                        })}
                                                      </div>
                                                      {selectedOption && (
                                                        <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${
                                                          isCorrect ? "bg-emerald-950/15 border-emerald-500/10 text-emerald-300" : "bg-rose-950/15 border-rose-500/10 text-rose-300"
                                                        }`}>
                                                          <span className="font-extrabold block mb-0.5">{isCorrect ? "✓ Correct Answer!" : "❌ Incorrect"}</span>
                                                          <p className="font-bold text-gray-400">Answer: {mcq.answer}</p>
                                                          <p className="mt-0.5">{mcq.explanation}</p>
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            )}

                                            {sec.id === "mistakes_tips" && (
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-rose-950/10 border border-rose-500/10 rounded-xl space-y-2">
                                                  <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1"><ThumbsDown size={12} /> Common Mistakes</span>
                                                  <ul className="space-y-1.5">
                                                    {note.mistakes.map((mis, mIdx) => (
                                                      <li key={mIdx} className="flex items-start gap-1.5 text-xs text-gray-400">
                                                        <span className="text-rose-500 font-mono shrink-0">❌</span>
                                                        <span>{mis.replace(/^❌\s*/, "")}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                                <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-xl space-y-2">
                                                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1"><ThumbsUp size={12} /> Tips & Tricks</span>
                                                  <ul className="space-y-1.5">
                                                    {note.tips.map((tip, tIdx) => (
                                                      <li key={tIdx} className="flex items-start gap-1.5 text-xs text-gray-400">
                                                        <span className="text-emerald-500 font-mono shrink-0">✓</span>
                                                        <span>{tip.replace(/^✓\s*/, "")}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                              </div>
                                            )}

                                            {sec.id === "cheatSheet" && (
                                              <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-900/20">
                                                <table className="w-full text-left border-collapse text-xs">
                                                  <thead>
                                                    <tr className="bg-white/5 border-b border-white/5">
                                                      <th className="p-3 font-bold text-[9px] text-purple-400 uppercase tracking-wider w-1/3">Concept</th>
                                                      <th className="p-3 font-bold text-[9px] text-purple-400 uppercase tracking-wider">Revision Meaning</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {note.cheatSheet.map((item, csIdx) => (
                                                      <tr key={csIdx} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                                        <td className="p-3 font-bold text-white whitespace-nowrap">{item.term}</td>
                                                        <td className="p-3 text-gray-300 leading-relaxed">{item.definition}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}

                                            {sec.id === "summary" && (
                                              <p className="leading-relaxed text-xs bg-slate-900/40 p-4 rounded-xl border border-white/5">{note.summary}</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                /* LEGACY COMPATIBLE BACKWARD UI */
                                <div className="space-y-6 text-xs text-gray-300">
                                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/[0.03]">
                                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5"><BookOpen size={12} /> Definition</span>
                                    <p className="text-white leading-relaxed text-sm">{note.definition}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Array.isArray(note.keyPoints) && note.keyPoints.length > 0 && (
                                      <div className="space-y-2">
                                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block flex items-center gap-1.5"><List size={12} /> Key Points</span>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                          {note.keyPoints.map((pt, pIdx) => <li key={pIdx}>{pt}</li>)}
                                        </ul>
                                      </div>
                                    )}

                                    {note.detailedExplanation && (
                                      <div className="space-y-2">
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block flex items-center gap-1.5"><FileText size={12} /> Detailed Explanation</span>
                                        <p className="text-gray-400 leading-relaxed">{note.detailedExplanation}</p>
                                      </div>
                                    )}
                                  </div>

                                  {note.realWorldExample && (
                                    <div className="p-5 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-4 text-cyan-500/5"><Globe size={60} /></div>
                                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5"><Globe size={12} /> Real World Example</span>
                                      <p className="text-gray-300 leading-relaxed">{note.realWorldExample}</p>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Array.isArray(note.advantages) && note.advantages.length > 0 && (
                                      <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl">
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5"><ThumbsUp size={12} /> Advantages</span>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                          {note.advantages.map((adv, aIdx) => <li key={aIdx}>{adv}</li>)}
                                        </ul>
                                      </div>
                                    )}

                                    {Array.isArray(note.disadvantages) && note.disadvantages.length > 0 && (
                                      <div className="p-4 bg-rose-950/10 border border-rose-500/10 rounded-2xl">
                                        <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5"><ThumbsDown size={12} /> Disadvantages</span>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                          {note.disadvantages.map((dis, dIdx) => <li key={dIdx}>{dis}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                  </div>

                                  {Array.isArray(note.commonMistakes) && note.commonMistakes.length > 0 && (
                                    <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-2xl">
                                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5"><AlertOctagon size={12} /> Common Mistakes</span>
                                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                        {note.commonMistakes.map((mis, mIdx) => <li key={mIdx}>{mis}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                  {Array.isArray(note.interviewQuestions) && note.interviewQuestions.length > 0 && (
                                    <div className="space-y-3">
                                      <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider block flex items-center gap-1.5"><HelpCircle size={12} /> Interview Preparation</span>
                                      <div className="grid gap-3">
                                        {note.interviewQuestions.map((q, qIdx) => (
                                          <div key={qIdx} className="p-4 bg-slate-900/60 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed text-gray-300">
                                            {q}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {Array.isArray(note.revisionNotes) && note.revisionNotes.length > 0 && (
                                    <div>
                                      <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block mb-2.5 flex items-center gap-1.5"><RefreshCw size={12} /> Revision Cards</span>
                                      <div className="flex flex-wrap gap-2">
                                        {note.revisionNotes.map((rev, rIdx) => (
                                          <span key={rIdx} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-xl text-[10px] font-bold">
                                            {rev}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {Array.isArray(note.importantExamPoints) && note.importantExamPoints.length > 0 && (
                                    <div className="p-5 bg-yellow-950/20 border border-yellow-500/10 rounded-2xl">
                                      <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5"><Award size={12} /> Key Exam Blueprints</span>
                                      <ul className="list-disc pl-5 space-y-1.5 text-gray-300 leading-relaxed">
                                        {note.importantExamPoints.map((pt, pIdx) => <li key={pIdx}>{pt}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </GlassCard>
                      );
                    })
                  )}
                </motion.div>
              )}

              {activePlayerTab === "questions" && (
                <motion.div key="tab-questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <h4 className="font-bold text-sm text-white">Important Question blueprints</h4>
                  {questions.questions2Mark?.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No custom questions blueprints added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {questions.questions2Mark?.map((q, i) => (
                        <GlassCard key={i} className="p-4 border-white/5 text-xs">
                          <p className="font-bold text-white">Q: {q.question} (2 Marks)</p>
                          <p className="text-gray-400 mt-1">A: {q.answer}</p>
                        </GlassCard>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activePlayerTab === "quiz" && (
                <motion.div key="tab-quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {(courseProgress?.quizCompleted || quizFinished) && (
                    <GlassCard className="p-4 border-emerald-500/20 bg-emerald-950/10 flex justify-between items-center rounded-2xl mb-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Quiz Status</span>
                        <div className="text-xs text-gray-300 font-medium">
                          Quiz Score: <span className="text-white font-extrabold">{courseProgress?.quizScore ?? quizScore ?? 0}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 font-bold">Completed:</span>
                        <span className="text-emerald-400 font-black text-lg">✓</span>
                      </div>
                    </GlassCard>
                  )}
                  {quiz.questions?.length === 0 ? (
                    <p className="text-gray-500 text-xs italic">No quiz created for this module.</p>
                  ) : (
                    <GlassCard className="p-6 border-white/5 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                          Question {activeQuestionIdx + 1} of {quiz.questions.length}
                        </span>
                        {!quizFinished && (
                          <span className="text-xs text-cyan-400 font-bold">{formatTime(quizTimeLeft)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge color={
                          quiz.questions[activeQuestionIdx].type === "mcq" ? "purple" : 
                          quiz.questions[activeQuestionIdx].type === "truefalse" ? "green" : 
                          quiz.questions[activeQuestionIdx].type === "fillblank" ? "orange" : "cyan"
                        } className="uppercase text-[9px]">
                          {quiz.questions[activeQuestionIdx].type}
                        </Badge>
                        <Badge color="gray" className="uppercase text-[9px]">
                          {quiz.questions[activeQuestionIdx].difficulty || "medium"}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-white leading-relaxed">{quiz.questions[activeQuestionIdx].question}</p>
                      
                      {(quiz.questions[activeQuestionIdx].type === "mcq" || quiz.questions[activeQuestionIdx].type === "truefalse") ? (
                        <div className="grid gap-2.5">
                          {quiz.questions[activeQuestionIdx].options?.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[quiz.questions[activeQuestionIdx]._id] === opt;
                            const isCorrect = opt === quiz.questions[activeQuestionIdx].correctAnswer;
                            return (
                              <button
                                key={oIdx}
                                disabled={quizFinished}
                                onClick={() => setSelectedAnswers({
                                  ...selectedAnswers,
                                  [quiz.questions[activeQuestionIdx]._id]: opt
                                })}
                                className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                                  quizFinished
                                    ? isCorrect
                                      ? "border-green-500/50 bg-green-500/10 text-green-400 font-bold"
                                      : isSelected
                                        ? "border-red-500/50 bg-red-500/10 text-red-400 font-bold"
                                        : "border-white/5 text-gray-500"
                                    : isSelected
                                      ? "border-purple-500 bg-purple-500/10 text-white font-bold"
                                      : "border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            disabled={quizFinished}
                            placeholder={quiz.questions[activeQuestionIdx].type === "shortanswer" ? "Write your short answer here..." : "Write your fill-in-the-blank answer here..."}
                            value={selectedAnswers[quiz.questions[activeQuestionIdx]._id] || ""}
                            onChange={(e) => setSelectedAnswers({
                              ...selectedAnswers,
                              [quiz.questions[activeQuestionIdx]._id]: e.target.value
                            })}
                            rows={4}
                            className="w-full bg-[#0b0f19]/80 border border-white/5 focus:border-purple-500/30 rounded-xl p-3 text-xs text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                          />
                          {quizFinished && (
                            <div className="p-3.5 bg-purple-600/5 border border-purple-500/10 rounded-xl text-xs space-y-1.5">
                              <div className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Correct Model Answer / Output:</div>
                              <pre className="text-gray-300 font-mono text-[11px] whitespace-pre-wrap">{quiz.questions[activeQuestionIdx].correctAnswer}</pre>
                              {quiz.questions[activeQuestionIdx].type === "shortanswer" && quiz.questions[activeQuestionIdx].sampleAnswer && (
                                <>
                                  <div className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider pt-1">Sample Answer:</div>
                                  <p className="text-gray-300 leading-relaxed bg-[#0b0f19]/60 p-3 rounded-xl border border-white/5">{quiz.questions[activeQuestionIdx].sampleAnswer}</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between pt-4 border-t border-white/5">
                        <Button
                          disabled={activeQuestionIdx === 0}
                          onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                          className="py-1 px-3 bg-white/5 text-white text-xs rounded"
                        >
                          Previous
                        </Button>
                        {activeQuestionIdx === quiz.questions.length - 1 ? (
                          <Button onClick={submitQuiz} disabled={quizFinished} className="py-1 px-4 bg-purple-600 text-white text-xs rounded">
                            Submit
                          </Button>
                        ) : (
                          <Button onClick={() => setActiveQuestionIdx(prev => prev + 1)} className="py-1 px-3 bg-purple-600 text-white text-xs rounded">
                            Next
                          </Button>
                        )}
                      </div>
                    </GlassCard>
                  )}
                </motion.div>
              )}

              {activePlayerTab === "coding" && (
                <motion.div key="tab-coding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {coding.exercises?.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No coding tasks assigned to this module.</p>
                  ) : (
                    coding.exercises?.map((ex, i) => (
                      <GlassCard key={i} className="p-6 border-white/5 space-y-3 text-xs">
                        <h5 className="font-bold text-sm text-white">{ex.title}</h5>
                        <p className="text-gray-400">{ex.description}</p>
                        <p className="text-green-400 font-mono text-[11px]">Expected Output: {ex.expectedOutput}</p>
                      </GlassCard>
                    ))
                  )}
                </motion.div>
              )}

              {activePlayerTab === "assignments" && (
                <motion.div key="tab-assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {assignments.assignments?.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No assignments configured for this module.</p>
                  ) : (
                    assignments.assignments?.map((ass, i) => (
                      <GlassCard key={i} className="p-6 border-white/5 space-y-3 text-xs">
                        <h5 className="font-bold text-sm text-white">{ass.title}</h5>
                        <p className="text-gray-400">{ass.description}</p>
                        <p className="text-purple-400 font-bold">Expected deliverables: {ass.expectedOutput}</p>
                      </GlassCard>
                    ))
                  )}
                </motion.div>
              )}

              {activePlayerTab === "flashcards" && (
                <motion.div key="tab-flashcards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {selectedLecture && (
                    <FlashcardPlayer
                      courseId={courseId}
                      moduleId={moduleId}
                      lectureId={selectedLecture._id}
                    />
                  )}
                </motion.div>
              )}

              {activePlayerTab === "mindmaps" && (
                <motion.div key="tab-mindmaps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {selectedLecture && (
                    <MindMapViewer
                      courseId={courseId}
                      moduleId={moduleId}
                      lectureId={selectedLecture._id}
                    />
                  )}
                </motion.div>
              )}


            </AnimatePresence>
          </div>

          {/* Right Side: Playlist panel + AI Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Playlist Panel */}
            <GlassCard className="p-6 border-white/10 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Course Content</h4>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                    {getModuleCompletionDetails().count} Lectures • {getModuleCompletionDetails().percentage}% Completed
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-white">
                    <span>Auto Next</span>
                    <input 
                      type="checkbox" 
                      checked={autoNext} 
                      onChange={(e) => setAutoNext(e.target.checked)} 
                      className="rounded border-white/10 bg-black text-purple-600 focus:ring-0 focus:ring-offset-0 focus:outline-none w-3.5 h-3.5 cursor-pointer"
                    />
                  </label>
                  <Badge color="purple">{getModuleCompletionDetails().percentage}%</Badge>
                </div>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {lectures.length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-4">No lectures found.</p>
                ) : (
                  lectures.map((lec, idx) => {
                    const modProg = courseProgress?.moduleProgress?.find(m => m.moduleId === moduleId || m.moduleId?._id === moduleId);
                    const isCurrent = selectedLecture?._id === lec._id;
                    const isCompleted = modProg?.completedLectures?.includes(lec._id) || modProg?.completedLectures?.some(cl => cl === lec._id || cl?._id === lec._id);
                    const watchedPct = modProg?.watchedPercentage?.[lec._id] || modProg?.watchedPercentage?.[lec._id.toString()] || 0;

                    return (
                      <div
                        key={lec._id}
                        id={`playlist-item-${lec._id}`}
                        onClick={() => {
                          setSelectedLecture(lec);
                          setResumed(true);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isCurrent
                            ? "bg-purple-600/10 border-purple-500 text-white font-bold"
                            : "border-white/5 bg-black/20 hover:border-white/10 hover:bg-white/5 text-gray-300"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <Check className="text-green-400 w-4 h-4 font-black" />
                          ) : isCurrent ? (
                            <Play className="text-purple-400 w-4 h-4 fill-purple-400/20" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-gray-600 block flex items-center justify-center text-[8px] text-gray-500 font-semibold">
                              ○
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-relaxed truncate">
                            {idx + 1}. {lec.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 flex items-center justify-between gap-1 font-medium font-sans">
                            <span className="flex items-center gap-1"><Clock size={10} /> {lec.duration || "15:00"}</span>
                            {watchedPct > 0 && <span className="text-purple-400 font-bold">{watchedPct}% watched</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </GlassCard>

            {/* AI Assistant Sidebar */}
            <GlassCard className="p-6 border-purple-500/20 bg-gradient-to-br from-purple-950/15 via-transparent to-cyan-950/15 space-y-5 rounded-[2rem]">
              <h4 className="font-extrabold text-sm flex items-center gap-2 text-cyan-400">
                <Sparkles size={16} /> Interactive AI Sidebar
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleExplainAgain}
                  disabled={loadingExplanation}
                  className="py-2.5 px-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-center"
                >
                  ✨ Explain
                </button>
                <button
                  onClick={handleTestMe}
                  disabled={loadingTestMe}
                  className="py-2.5 px-2 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-center"
                >
                  🧠 Test Me
                </button>
                <button
                  onClick={handlePersonalNotes}
                  disabled={loadingPersonalNotes}
                  className="py-2.5 px-2 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-center"
                >
                  📘 Notes
                </button>
              </div>

              {/* AI Output Box */}
              <AnimatePresence mode="wait">
                {(loadingExplanation || loadingTestMe || loadingPersonalNotes) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-black/40 rounded-xl text-[11px] text-gray-500 text-center animate-pulse">
                    AI is brainstorming...
                  </motion.div>
                )}

                {aiExplanation && !loadingExplanation && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-purple-500/20 rounded-2xl text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                    {aiExplanation}
                  </motion.div>
                )}

                {personalNotes && !loadingPersonalNotes && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-orange-500/20 rounded-2xl text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                    {personalNotes}
                  </motion.div>
                )}

                {testMeQuiz && !loadingTestMe && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-cyan-500/20 rounded-2xl space-y-4 text-xs">
                    <h5 className="font-bold text-white">Quick test me Quiz</h5>
                    {testMeQuiz.map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="font-bold text-gray-300">{q.question}</p>
                        <div className="grid gap-1 pl-2">
                          {q.options?.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (opt === q.correctAnswer) {
                                  toast.success("Correct answer!");
                                } else {
                                  toast.error("Incorrect answer, try again.");
                                }
                              }}
                              className="text-left text-[11px] text-gray-400 hover:text-white"
                            >
                              - {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {selectedLecture && (
              <AITutorSidebar
                courseId={courseId}
                moduleId={moduleId}
                lectureId={selectedLecture._id}
                timestamp={currentTimestamp}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModuleLearning;
