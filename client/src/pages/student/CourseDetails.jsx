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
  DollarSign,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Play,
  FileText,
  BrainCircuit,
  Code,
  Link as LinkIcon,
  Video,
  ChevronLeft,
  Download,
  Printer,
  Copy,
  Hourglass,
  Trophy,
  Flame,
  Check,
  ChevronDown,
  Layers,
  HelpCircle,
  Compass,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  RefreshCw,
  List
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import CourseReviews from "../../components/student/CourseReviews";

const CourseDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  
  // Course State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [cartCourseIds, setCartCourseIds] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);

  // Modules List
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  
  // Selected Module Contents
  const [lecture, setLecture] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [cheatSheet, setCheatSheet] = useState("");
  const [learningObjectives, setLearningObjectives] = useState([]);
  const [quiz, setQuiz] = useState({ questions: [] });
  const [assignments, setAssignments] = useState({ assignments: [] });
  const [coding, setCoding] = useState({ exercises: [] });
  const [flashcards, setFlashcards] = useState({ cards: [] });
  const [questions, setQuestions] = useState({ questions2Mark: [], questions5Mark: [], questions10Mark: [], interviewQuestions: [], companyQuestions: [] });

  // Tab controls under the video
  const [activePlayerTab, setActivePlayerTab] = useState("lecture");

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

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartAndEnrollments = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) return;

      const cartRes = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartItems = cartRes.data?.items || [];
      setCartCourseIds(cartItems.map((item) => item.courseId?._id || item.courseId));

      const enrollmentsRes = await axios.get("http://localhost:5000/api/enrollments/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eIds = enrollmentsRes.data.map((enrollment) => enrollment.courseId?._id || enrollment.courseId);
      setEnrolledCourseIds(eIds);

      if (eIds.includes(id)) {
        // Fetch modules
        const modulesRes = await axios.get(`http://localhost:5000/api/modules/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModules(modulesRes.data || []);
        
        // Fetch progress
        const progressRes = await axios.get(`http://localhost:5000/api/progress/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseProgress(progressRes.data);
      }
    } catch (err) {
      console.error("Error fetching enrollments/modules:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCartAndEnrollments();
  }, [id]);

  // Load Module Content Bundle
  const loadModuleBundle = async (moduleId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/modules/${moduleId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;
      
      // Fetch all lectures for the module
      const lecturesRes = await axios.get(`http://localhost:5000/api/modules/${moduleId}/lectures`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const moduleLectures = lecturesRes.data || [];
      setLectures(moduleLectures);
      if (moduleLectures.length > 0) {
        setSelectedLecture(moduleLectures[0]);
        setLecture(moduleLectures[0]);
      } else {
        setSelectedLecture(null);
        setLecture(null);
      }

      setResources(data.resources || []);
      setNotes(data.notes || []);
      setCheatSheet(data.cheatSheet || "");
      setLearningObjectives(data.learningObjectives || []);
      setQuiz(data.quiz || { questions: [] });
      setAssignments(data.assignments || { assignments: [] });
      setCoding(data.coding || { exercises: [] });
      setFlashcards(data.flashcards || { cards: [] });
      setQuestions(data.questions || { questions2Mark: [], questions5Mark: [], questions10Mark: [], interviewQuestions: [], companyQuestions: [] });

      // Reset states
      setActiveQuestionIdx(0);
      setSelectedAnswers({});
      setQuizFinished(false);
      setQuizScore(null);
      setQuizTimeLeft(600);
      setAiExplanation("");
      setTestMeQuiz(null);
      setPersonalNotes("");
    } catch (err) {
      console.error("Failed to load module study bundle:", err);
    }
  };

  useEffect(() => {
    if (selectedModule) {
      loadModuleBundle(selectedModule._id);
    }
  }, [selectedModule]);

  // Live MCQ Quiz timer
  useEffect(() => {
    if (activePlayerTab === "quiz" && selectedModule && !quizFinished) {
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
  }, [activePlayerTab, selectedModule, quizFinished]);

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

      const res = await axios.post(`http://localhost:5000/api/modules/${selectedModule._id}/quiz/attempt`, {
        answers: answersPayload,
        completionTime: duration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      const res = await axios.get(`http://localhost:5000/api/modules/${selectedModule._id}/explain-again`, {
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
      const res = await axios.get(`http://localhost:5000/api/modules/${selectedModule._id}/test-me`, {
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
      // Simulate/call personalized prompt
      await new Promise(r => setTimeout(r, 1200));
      setPersonalNotes(`📘 Personalized Notes for: ${course.title} -> ${selectedModule.title}\n\n1. You have completed 1 video lecture and reviewed reference documents.\n2. Keep in mind: ${learningObjectives[0] || "core module paradigms"}.\n3. Practice recommendation: Focus on implementing coding exercises locally to seal parameters configurations.`);
      toast.success("Personalized progress review prepared!");
    } catch (err) {
      toast.error("AI notes not available.");
    } finally {
      setLoadingPersonalNotes(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (!token) {
        toast.error("Please login as student.");
        setEnrolling(false);
        return;
      }
      await axios.post(`http://localhost:5000/api/cart/add`, { courseId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Added to cart!");
      setCartCourseIds([...cartCourseIds, id]);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error("Enrolling failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkComplete = async (customLec) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const targetLec = customLec || selectedLecture || lecture;
      if (!targetLec) return;
      const res = await axios.post(`http://localhost:5000/api/progress/module/${selectedModule._id}/lecture`, {
        lectureId: targetLec._id,
        courseId: course._id
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

  const getModuleCompletionDetails = () => {
    if (!lectures || lectures.length === 0) return { count: 0, completedCount: 0, percentage: 0 };
    const total = lectures.length;
    const completed = lectures.filter(lec => 
      courseProgress?.completedLectures?.includes(lec._id) || 
      courseProgress?.completedLectures?.some(cl => cl._id === lec._id || cl === lec._id)
    ).length;
    const percentage = Math.round((completed / total) * 100);
    return { count: total, completedCount: completed, percentage };
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
        <Link to="/dashboard/learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Badge color="purple">{course.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              <span>Instructor:</span>
              <Link to={`/dashboard/instructor/${course.teacherId?._id || course.teacherId}`} className="text-purple-400 hover:text-purple-300 font-black uppercase transition-colors">
                {course.teacherId?.name || "View Profile"}
              </Link>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">{course.description}</p>
          </div>

          <div className="lg:col-span-4 w-full">
            <GlassCard className="p-6 border-white/10 space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-video bg-black/40">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"}
                  className="w-full h-full object-cover"
                  alt={course.title}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Course Price</span>
                <span className="text-3xl font-black text-cyan-400">₹{course.price || "Free"}</span>
              </div>

              {enrolledCourseIds.includes(id) ? (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold text-center">
                  ✓ Enrolled in this Course
                </div>
              ) : cartCourseIds.includes(id) ? (
                <Link to="/dashboard/cart" className="w-full block">
                  <Button variant="outline" className="w-full py-4 border-cyan-500/50 text-cyan-400 font-bold tracking-wider hover:bg-cyan-500/10 text-center">
                    Go to Cart
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleEnroll} disabled={enrolling} className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 font-bold tracking-wider text-white">
                  Add to Cart
                </Button>
              )}
            </GlassCard>
            {courseProgress?.completed && (
              <GlassCard className="p-6 border-green-500/30 bg-green-900/10 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white">Course Completed!</h3>
                  <p className="text-sm text-green-400 mt-2">100% Progress</p>
                  <Link to="/dashboard/certificates" className="w-full block">
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold">
                      View Certificate
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            )}
            </div> {/* CLOSES: grid lg:grid-cols-12 gap-8 items-start */} 
            {courseProgress && !courseProgress.completed && (
              <GlassCard className="p-6 border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Your Progress</span>
                  <span className="text-purple-400">{courseProgress.progressPercentage || 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${courseProgress.progressPercentage || 0}%` }}
                  />
                </div>
              </GlassCard>
            )}
          </div>
           {/* Student Content Area */}
        {enrolledCourseIds.includes(id) && (
          <div className="space-y-8 pt-6 border-t border-white/5">
            {/* MODULE SYLLABUS LIST VIEW */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <BookOpen className="text-purple-400" /> Syllabus Modules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.length === 0 ? (
                  <div className="col-span-2 text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <p className="text-gray-500 text-sm italic">The teacher is currently configuring course modules.</p>
                  </div>
                ) : (
                  modules.map((mod) => {
                    const isModuleComplete = courseProgress?.completedModules?.includes(mod._id);
                    return (
                      <GlassCard key={mod._id} className="p-6 border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/20 transition-all relative overflow-hidden">
                        {isModuleComplete && (
                          <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-500/20 rotate-45" />
                        )}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Badge color={isModuleComplete ? "green" : "purple"}>
                              {isModuleComplete ? "Completed" : mod.difficulty}
                            </Badge>
                            <span className="text-[10px] text-gray-500 font-bold">{mod.duration}</span>
                          </div>
                          <h4 className="font-extrabold text-lg text-white leading-tight">{mod.title}</h4>
                          <p className="text-xs text-gray-400 line-clamp-2">{mod.description}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-gray-500">{mod.topics?.length || 0} Topics</span>
                          <Button
                            onClick={() => navigate(`/courses/${id}/modules/${mod._id}`)}
                            className="py-1.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                          >
                            Study Module
                          </Button>
                        </div>
                      </GlassCard>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Reviews & Star Ratings Grid */}
        <CourseReviews 
          courseId={id} 
          enrolled={enrolledCourseIds.includes(id)} 
          progress={courseProgress?.progressPercentage || 0} 
        />
      </div>
    </div>

    
  );
};


export default CourseDetails;
