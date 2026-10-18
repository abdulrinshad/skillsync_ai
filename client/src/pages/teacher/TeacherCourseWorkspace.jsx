import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  FileText,
  BrainCircuit,
  Eye,
  CheckCircle,
  XCircle,
  Copy,
  PlusCircle,
  AlertTriangle,
  Award,
  BookOpenCheck,
  Check,
  X,
  Code,
  Link as LinkIcon,
  Video,
  Download,
  Printer,
  ChevronDown,
  Upload,
  ArrowUp,
  ArrowDown,
  FileCode,
  Play,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  HelpCircle,
  List,
  Globe,
  ExternalLink
} from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";

const TeacherCourseWorkspace = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Core Workspace State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modules State
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("overview");
  
  // Modals state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  
  // Module Form Fields
  const [modTitle, setModTitle] = useState("");
  const [modDesc, setModDesc] = useState("");
  const [modDifficulty, setModDifficulty] = useState("Intermediate");
  const [modDuration, setModDuration] = useState("3 Hours");
  const [modOutcomes, setModOutcomes] = useState([]);
  const [newOutcome, setNewOutcome] = useState("");
  const [modTopics, setModTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  // Sub-tab: Lectures State
  const [lectures, setLectures] = useState([]);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [lecTitle, setLecTitle] = useState("");
  const [lecDesc, setLecDesc] = useState("");
  const [lecDuration, setLecDuration] = useState("10:00");
  const [lecYoutubeUrl, setLecYoutubeUrl] = useState("");
  const [lecVideoFile, setLecVideoFile] = useState(null);
  const [uploadingLecture, setUploadingLecture] = useState(false);

  // Sub-tab: Resources State
  const [resources, setResources] = useState([]);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [showUploadResourceModal, setShowUploadResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Upload Form Fields
  const [resTitle, setResTitle] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resCategory, setResCategory] = useState("Study Material");
  const [resType, setResType] = useState("pdf");
  const [resLink, setResLink] = useState("");
  const [resRequired, setResRequired] = useState(false);
  const [resFile, setResFile] = useState(null);

  // Edit Form Fields
  const [editResTitle, setEditResTitle] = useState("");
  const [editResDesc, setEditResDesc] = useState("");
  const [editResCategory, setEditResCategory] = useState("Study Material");
  const [editResType, setEditResType] = useState("pdf");
  const [editResLink, setEditResLink] = useState("");
  const [editResRequired, setEditResRequired] = useState(false);

  // Sub-tab: AI Notes State
  const [notes, setNotes] = useState([]);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteData, setEditingNoteData] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Sub-tab: AI Quiz State
  const [quiz, setQuiz] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState(null);
  const [editingQuestionData, setEditingQuestionData] = useState(null);

  // Students list state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/teacher/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseStudents = (res.data?.students || []).filter(
        (s) => s.courseId === courseId
      );
      setStudents(courseStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchModules();
    fetchStudents();
  }, [courseId]);

  // ==========================================
  // MODULE CRUD
  // ==========================================

  const handleSaveModule = async () => {
    if (!modTitle.trim()) {
      toast.error("Module Title is required");
      return;
    }
    if (!modDesc.trim()) {
      toast.error("Module Description is required");
      return;
    }
    if (!modOutcomes || modOutcomes.length === 0) {
      toast.error("At least one Learning Outcome is required");
      return;
    }
    if (!modTopics || modTopics.length === 0) {
      toast.error("At least one Topic is required");
      return;
    }

    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      
      const topicsPayload = modTopics.map((topic, i) => ({
        title: topic,
        order: i
      }));

      const payload = {
        courseId,
        title: modTitle,
        description: modDesc,
        difficulty: modDifficulty,
        duration: modDuration,
        learningOutcomes: modOutcomes,
        topics: topicsPayload
      };

      if (editingModule) {
        await axios.put(`http://localhost:5000/api/modules/${editingModule._id}`, payload, headers);
        toast.success("Module updated");
      } else {
        await axios.post(`http://localhost:5000/api/modules`, payload, headers);
        toast.success("Module created");
      }
      setShowModuleModal(false);
      resetForm();
      fetchModules();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save module");
    }
  };

  const resetForm = () => {
    setEditingModule(null);
    setModTitle("");
    setModDesc("");
    setModDifficulty("Intermediate");
    setModDuration("3 Hours");
    setModOutcomes([]);
    setModTopics([]);
    setNewTopic("");
    setNewOutcome("");
  };

  const handleEditModule = (mod) => {
    setEditingModule(mod);
    setModTitle(mod.title);
    setModDesc(mod.description);
    setModDifficulty(mod.difficulty);
    setModDuration(mod.duration);
    setModOutcomes(mod.learningOutcomes || []);
    setModTopics((mod.topics || []).sort((a, b) => a.order - b.order).map((t) => t.title));
    setShowModuleModal(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Permanently delete this module and all its associated elements?")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Module deleted");
      fetchModules();
    } catch (err) {
      toast.error("Failed to delete module");
    }
  };

  const handleDuplicateModule = async (moduleId) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/modules/${moduleId}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Module duplicated successfully!");
      fetchModules();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate module");
    }
  };

  const handleMoveModule = async (moduleId, direction) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const idx = modules.findIndex((m) => m._id === moduleId);
      if (idx === -1) return;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= modules.length) return;

      const reorderedModules = [...modules];
      const temp = reorderedModules[idx];
      reorderedModules[idx] = reorderedModules[targetIdx];
      reorderedModules[targetIdx] = temp;

      const moduleIds = reorderedModules.map((m) => m._id);

      await axios.put(`http://localhost:5000/api/modules/course/${courseId}/reorder`, {
        moduleIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Module order updated!");
      fetchModules();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reorder modules");
    }
  };

  // Reordering Topics list
  const moveTopic = (index, direction) => {
    const updated = [...modTopics];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setModTopics(updated);
  };

  // ==========================================
  // MODULE WORKSPACE LOADER
  // ==========================================

  const handleOpenModuleWorkspace = async (mod) => {
    setSelectedModule(mod);
    setActiveSubTab("overview");
    loadModuleContents(mod._id);
  };

  const loadModuleContents = async (moduleId) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const [lecturesRes, resourcesRes, notesRes, quizRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/modules/${moduleId}/lectures`, headers),
        axios.get(`http://localhost:5000/api/resources/module/${moduleId}`, headers),
        axios.get(`http://localhost:5000/api/modules/${moduleId}/notes`, headers),
        axios.get(`http://localhost:5000/api/modules/${moduleId}/quiz`, headers),
      ]);

      setLectures(lecturesRes.data || []);
      setResources(resourcesRes.data || []);
      setNotes(notesRes.data || []);
      setQuiz(quizRes.data || null);
    } catch (err) {
      console.error("Failed to load module contents:", err);
    }
  };

  // ==========================================
  // LECTURES ACTIONS
  // ==========================================

  const handleSaveLecture = async () => {
    if (!lecTitle.trim()) {
      toast.error("Lecture Title is required");
      return;
    }
    setUploadingLecture(true);
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("title", lecTitle);
      formData.append("description", lecDesc);
      formData.append("duration", lecDuration);
      formData.append("videoUrl", lecYoutubeUrl);
      formData.append("order", lectures.length);
      if (lecVideoFile) {
        formData.append("video", lecVideoFile);
      }

      await axios.post(`http://localhost:5000/api/modules/${selectedModule._id}/lectures`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Lecture created successfully");
      setShowLectureModal(false);
      setLecTitle("");
      setLecDesc("");
      setLecYoutubeUrl("");
      setLecVideoFile(null);
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to create lecture");
    } finally {
      setUploadingLecture(false);
    }
  };

  const handleDeleteLecture = async (lecId) => {
    if (!window.confirm("Remove this lecture?")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/modules/lectures/${lecId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Lecture deleted");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  // ==========================================
  // RESOURCES ACTIONS
  // ==========================================

  const handleOpenUploadResource = () => {
    setResTitle("");
    setResDesc("");
    setResCategory("Study Material");
    setResType("pdf");
    setResLink("");
    setResRequired(false);
    setResFile(null);
    setShowUploadResourceModal(true);
  };

  const handleSaveResource = async () => {
    if (!resTitle.trim()) {
      toast.error("Resource Title is required");
      return;
    }
    if (resType === "link" && !resLink.trim()) {
      toast.error("External Link is required for Link resource");
      return;
    }
    if (resType !== "link" && !resFile) {
      toast.error("Please choose a file to upload");
      return;
    }
    setUploadingResource(true);
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const formData = new FormData();
      formData.append("moduleId", selectedModule._id);
      formData.append("title", resTitle);
      formData.append("description", resDesc);
      formData.append("category", resCategory);
      formData.append("resourceType", resType);
      formData.append("externalLink", resLink);
      formData.append("isRequired", resRequired);
      if (resFile) {
        formData.append("file", resFile);
      }

      await axios.post("http://localhost:5000/api/resources/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Resource uploaded successfully");
      setShowUploadResourceModal(false);
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload resource");
    } finally {
      setUploadingResource(false);
    }
  };

  const handleOpenEditResource = (res) => {
    setEditingResource(res);
    setEditResTitle(res.title || res.fileName || "");
    setEditResDesc(res.description || "");
    setEditResCategory(res.category || "Study Material");
    setEditResType(res.resourceType || "other");
    setEditResLink(res.externalLink || "");
    setEditResRequired(res.isRequired || false);
    setShowEditResourceModal(true);
  };

  const handleUpdateResource = async () => {
    if (!editResTitle.trim()) {
      toast.error("Resource Title is required");
      return;
    }
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const payload = {
        title: editResTitle,
        description: editResDesc,
        category: editResCategory,
        resourceType: editResType,
        externalLink: editResLink,
        isRequired: editResRequired
      };
      await axios.put(`http://localhost:5000/api/resources/${editingResource._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Resource updated successfully");
      setShowEditResourceModal(false);
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update resource");
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/resources/${resId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Resource deleted successfully");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to delete resource");
    }
  };

  const handleReorderResource = async (index, direction) => {
    const updated = [...resources];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setResources(updated);

    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      const orderedIds = updated.map(r => r._id);
      await axios.post("http://localhost:5000/api/resources/reorder", { orderedIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Resources reordered");
    } catch (err) {
      toast.error("Failed to persist reordering");
    }
  };

  // ==========================================
  // AI GENERATOR TRIGGERS (ONLY read topics)
  // ==========================================

  const handleGenerateNotes = async () => {
  setGeneratingNotes(true);

  try {
    const token =
      localStorage.getItem("token_teacher") ||
      localStorage.getItem("token");

    console.log("Selected Module:", selectedModule);

    await axios.post(
      `http://localhost:5000/api/modules/${selectedModule._id}/notes/generate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("AI Notes generated successfully!");
    loadModuleContents(selectedModule._id);
    fetchModules();
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error(
      err.response?.data?.message || "AI notes generation failed"
    );
  } finally {
    setGeneratingNotes(false);
  }
};

  const handleUpdateNote = async (noteId, fields) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      
      const parsedFields = { ...fields };
      const arrayFields = ["keyPoints", "advantages", "disadvantages", "commonMistakes", "interviewQuestions", "revisionNotes", "importantExamPoints"];
      arrayFields.forEach(f => {
        if (parsedFields[f] && typeof parsedFields[f] === "string") {
          parsedFields[f] = parsedFields[f].split("\n").map(p => p.trim()).filter(Boolean);
        }
      });

      await axios.put(`http://localhost:5000/api/modules/notes/${noteId}`, parsedFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Topic notes saved");
      setEditingNoteId(null);
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to update notes");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete notes for this topic?")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/modules/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Notes deleted");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to delete notes");
    }
  };

  const handleTogglePublishNotes = async (publishedStatus) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/modules/${selectedModule._id}/notes/publish`, {
        published: publishedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(publishedStatus ? "Notes published successfully" : "Notes set to draft");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to toggle publish status");
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/modules/${selectedModule._id}/quiz/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("🧠 AI Quiz generated successfully from topics list!");
      loadModuleContents(selectedModule._id);
      fetchModules();
    } catch (err) {
      toast.error("AI quiz generation failed");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSaveQuestionChange = async () => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      if (!quiz || !Array.isArray(quiz.questions)) return;
      const updatedQuestions = [...quiz.questions];

      const parsedData = { ...editingQuestionData };
      if (typeof parsedData.options === "string") {
        parsedData.options = parsedData.options.split("\n").map(o => o.trim()).filter(Boolean);
      }

      updatedQuestions[editingQuestionIdx] = parsedData;

      await axios.put(`http://localhost:5000/api/modules/quiz/${quiz._id}`, {
        questions: updatedQuestions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Question updated successfully");
      setEditingQuestionIdx(null);
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleDeleteQuestion = async (index) => {
    if (!window.confirm("Remove this question?")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      if (!quiz || !Array.isArray(quiz.questions)) return;
      const updatedQuestions = quiz.questions.filter((_, qIdx) => qIdx !== index);

      await axios.put(`http://localhost:5000/api/modules/quiz/${quiz._id}`, {
        questions: updatedQuestions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Question deleted");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  const handleTogglePublishQuiz = async (publishedStatus) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/modules/${selectedModule._id}/quiz/publish`, {
        published: publishedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(publishedStatus ? "Quiz published successfully" : "Quiz set to draft");
      loadModuleContents(selectedModule._id);
    } catch (err) {
      toast.error("Failed to toggle publish status");
    }
  };

  const handleUpdateSettings = async (payload) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Course settings updated.");
      fetchCourse();
    } catch (err) {
      toast.error("Failed to update course.");
    }
  };

  const handlePublishCourse = async (statusValue) => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/courses/${courseId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(statusValue === "published" ? "Course published!" : "Course set to draft.");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish course.");
    }
  };

  const handleSubmitForReview = async () => {
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/courses/${courseId}/submit-review`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Course curriculum changes submitted for review successfully!");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit course for review.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Permanently delete this course? This action is irreversible.")) return;
    try {
      const token = localStorage.getItem("token_teacher") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Course deleted successfully.");
      navigate("/teacher/courses");
    } catch (err) {
      toast.error("Failed to delete course.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white gap-4">
        <h3 className="text-xl font-bold">Course not found</h3>
        <p className="text-gray-400">Unable to load this course.</p>
        <Link to="/teacher/courses" className="text-purple-400 hover:underline">Back to My Courses</Link>
      </div>
    );
  }

  const filteredStudents = Array.isArray(students) ? students.filter((s) =>
    (s?.studentName || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s?.studentEmail || "").toLowerCase().includes(studentSearch.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <Link to="/teacher/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to My Courses
        </Link>

        {/* Course Header */}
        <GlassCard className="p-6 border-white/10 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img 
              src={course?.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300"} 
              alt="thumbnail" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300";
              }}
            />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
              <Badge color="purple">{course?.category || "Category"}</Badge>
              <Badge color={course?.approvalStatus === "approved" ? "green" : course?.approvalStatus === "rejected" ? "red" : "orange"}>
                {(course?.approvalStatus || "pending").toUpperCase()}
              </Badge>
              <Badge color={course?.status === "published" ? "cyan" : "gray"}>
                {(course?.status || "draft").toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-3xl font-black">{course?.title || "Untitled Course"}</h1>
            <p className="text-xs text-gray-400 font-medium">
              Created: {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"} | Updated: {course?.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </GlassCard>

        {/* Tab Selector Links */}
        <div className="flex border-b border-white/5 pb-1 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "overview", label: "Overview", icon: BookOpenCheck },
            { id: "curriculum", label: "Curriculum", icon: BookOpen },
            { id: "notes", label: "AI Notes", icon: FileText },
            { id: "quiz", label: "AI Quiz", icon: BrainCircuit },
            { id: "students", label: "Students", icon: Users },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedModule(null); // return to syllabus module card list on general tab switch
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest border transition-all ${
                  active && !selectedModule
                    ? "bg-purple-600/10 border-purple-500/30 text-white"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tabs Render Panels */}
        <div className="pt-4">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                <GlassCard className="p-8 border-white/5 space-y-6">
                  <h3 className="text-xl font-bold">Course Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{course?.description || "No description provided."}</p>
                </GlassCard>
              </motion.div>
            )}

            {/* CURRICULUM GENERAL MODULE CARD LIST */}
            {activeTab === "curriculum" && !selectedModule && (
              <motion.div key="curriculum-list" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">Course Curriculum</h3>
                    <p className="text-xs text-gray-500 mt-1">Teachers first build syllabus modules. Then add lectures, resources, notes, and quizzes.</p>
                  </div>
                  <Button onClick={() => { resetForm(); setShowModuleModal(true); }} className="py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
                    <Plus size={16} /> Add Module
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!Array.isArray(modules) || modules.length === 0 ? (
                    <div className="col-span-2 text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                      <p className="text-gray-500 text-xs italic">No syllabus modules created yet. Click "Add Module" to start.</p>
                    </div>
                  ) : (
                    modules.map((mod, mIdx) => {
                      const setupProgress = Math.round(
                        (((mod?.notesGenerated ? 1 : 0) +
                          (mod?.quizGenerated ? 1 : 0) +
                          ((mod?.lecturesCount || 0) > 0 ? 1 : 0)) /
                          3) *
                          100
                      );

                      return (
                        <GlassCard key={mod?._id} className="p-6 border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/20 transition-all relative">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-2 items-center">
                                <Badge color="purple">{mod?.difficulty || "Intermediate"}</Badge>
                                <Badge color={mod?.published ? "cyan" : "gray"}>
                                  {mod?.published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              <div className="flex gap-1.5">
                                <button onClick={() => handleMoveModule(mod?._id, "up")} disabled={mIdx === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30" title="Move Up">
                                  <ArrowUp size={13} />
                                </button>
                                <button onClick={() => handleMoveModule(mod?._id, "down")} disabled={mIdx === modules.length - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30" title="Move Down">
                                  <ArrowDown size={13} />
                                </button>
                                <button onClick={() => handleDuplicateModule(mod?._id)} className="p-1 text-gray-400 hover:text-white" title="Duplicate Module">
                                  <Copy size={13} />
                                </button>
                                <button onClick={() => handleEditModule(mod)} className="p-1 text-gray-400 hover:text-white" title="Edit Syllabus">
                                  <Edit2 size={13} />
                                </button>
                                <button onClick={() => handleDeleteModule(mod?._id)} className="p-1 text-red-400 hover:text-red-300" title="Delete Module">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            
                            <h4 className="font-extrabold text-lg text-white leading-tight">{mod?.title || "Untitled Module"}</h4>
                            <p className="text-xs text-gray-400 line-clamp-2">{mod?.description || "No description."}</p>

                            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-gray-400 font-bold">
                              <div>Lectures: <span className="text-white">{mod?.lecturesCount || 0}</span></div>
                              <div>Resources: <span className="text-white">{mod?.resourcesCount || 0}</span></div>
                              <div>AI Notes: <span className={mod?.notesGenerated ? "text-green-400" : "text-gray-500"}>{mod?.notesGenerated ? "Generated" : "Draft"}</span></div>
                              <div>AI Quiz: <span className={mod?.quizGenerated ? "text-green-400" : "text-gray-500"}>{mod?.quizGenerated ? "Generated" : "Draft"}</span></div>
                            </div>

                            <div className="pt-2">
                              <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-1">
                                <span>Setup Progress</span>
                                <span>{setupProgress}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full" style={{ width: `${setupProgress}%` }} />
                              </div>
                            </div>

                            <div className="pt-2 text-[9px] text-gray-500 flex justify-between font-medium">
                              <span>Created: {mod?.createdAt ? new Date(mod.createdAt).toLocaleDateString() : "N/A"}</span>
                              <span>Updated: {mod?.updatedAt ? new Date(mod.updatedAt).toLocaleDateString() : "N/A"}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/5 flex justify-end">
                            <Button
                              onClick={() => handleOpenModuleWorkspace(mod)}
                              className="py-1.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold w-full"
                            >
                              Open Module
                            </Button>
                          </div>
                        </GlassCard>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* MODULE WORKSPACE SUBTABS */}
            {activeTab === "curriculum" && selectedModule && (
              <motion.div key="module-workspace" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                {/* Header Back navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-6 rounded-3xl border border-white/10 gap-4">
                  <div>
                    <button onClick={() => setSelectedModule(null)} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-1 font-bold uppercase tracking-wider">
                      <ArrowLeft size={12} /> Back to Curriculum modules
                    </button>
                    <h3 className="text-2xl font-black text-white">{selectedModule?.title || "Untitled Module"}</h3>
                    <p className="text-xs text-gray-400">{selectedModule?.description || "No description."}</p>
                  </div>
                  <Badge color="purple">{selectedModule?.difficulty || "Intermediate"}</Badge>
                </div>

                {/* Sub tabs list */}
                <div className="flex border-b border-white/5 pb-1 gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "lectures", label: "Lectures" },
                    { id: "resources", label: "Resources" },
                    { id: "notes", label: "AI Notes" },
                    { id: "quiz", label: "AI Quiz" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveSubTab(subTab.id)}
                      className={`px-5 py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider border transition-all ${
                        activeSubTab === subTab.id
                          ? "bg-purple-600/10 border-purple-500/30 text-white"
                          : "border-transparent text-gray-500 hover:text-white"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab contents */}
                <div className="pt-2">
                  {activeSubTab === "overview" && (
                    <div className="grid md:grid-cols-2 gap-8">
                      <GlassCard className="p-6 border-white/5 space-y-4">
                        <h4 className="font-bold text-sm text-white">Topics List</h4>
                        <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
                          {Array.isArray(selectedModule?.topics) ? selectedModule.topics.map((t, idx) => (
                            <li key={idx}>{t?.title || "Untitled Topic"}</li>
                          )) : (
                            <li className="text-gray-500 italic">No topics defined.</li>
                          )}
                        </ul>
                      </GlassCard>
                      <GlassCard className="p-6 border-white/5 space-y-4">
                        <h4 className="font-bold text-sm text-white">Learning Outcomes</h4>
                        <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
                          {Array.isArray(selectedModule?.learningOutcomes) ? selectedModule.learningOutcomes.map((out, idx) => (
                            <li key={idx}>{out}</li>
                          )) : (
                            <li className="text-gray-500 italic">No outcomes defined.</li>
                          )}
                        </ul>
                      </GlassCard>
                    </div>
                  )}

                  {activeSubTab === "lectures" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-base text-white">Module Lectures</h4>
                        <Button onClick={() => setShowLectureModal(true)} className="py-1.5 px-4 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                          <Plus size={14} /> Add Lecture
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!Array.isArray(lectures) || lectures.length === 0 ? (
                          <div className="col-span-2 text-center py-10 bg-white/[0.01] border border-white/5 rounded-2xl">
                            <p className="text-xs text-gray-500 italic">No lectures added yet. Click "+ Add Lecture" to compile videos.</p>
                          </div>
                        ) : (
                          lectures.map((lec) => (
                            <GlassCard key={lec?._id} className="p-5 border-white/5 flex flex-col justify-between space-y-4">
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                  <Play size={13} className="text-purple-400" /> {lec?.title || "Untitled Lecture"}
                                </h5>
                                <p className="text-xs text-gray-400 leading-relaxed">{lec?.description || "No description."}</p>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-500 pt-3 border-t border-white/5">
                                <span>Duration: {lec?.duration || "15:00"}</span>
                                <button onClick={() => handleDeleteLecture(lec?._id)} className="text-red-400 hover:text-red-300 font-bold">
                                  Delete
                                </button>
                              </div>
                            </GlassCard>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeSubTab === "resources" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-base text-white">Course Resources & Links</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Attach files, PDFs, links, or slides to supplement this module.</p>
                        </div>
                        <Button
                          onClick={handleOpenUploadResource}
                          className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg"
                        >
                          <Plus size={14} /> Upload Resource
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {uploadingResource && (
                          <div className="text-xs text-purple-400 animate-pulse">Processing resource upload...</div>
                        )}
                        {!Array.isArray(resources) || resources.length === 0 ? (
                          <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                            <p className="text-xs text-gray-500 italic">No downloadable resources or links attached.</p>
                          </div>
                        ) : (
                          resources.map((res, index) => (
                            <GlassCard key={res?._id} className="p-5 border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/20 transition-all bg-white/[0.02]">
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
                                    
                                    {/* Approval workflow status badge */}
                                    {(!res.status || res.status === "pending") && (
                                      <Badge color="yellow" className="text-[9px] uppercase tracking-wider py-0.5 px-2">Pending Review</Badge>
                                    )}
                                    {res.status === "approved" && (
                                      <Badge color="green" className="text-[9px] uppercase tracking-wider py-0.5 px-2">Approved</Badge>
                                    )}
                                    {res.status === "rejected" && (
                                      <Badge color="red" className="text-[9px] uppercase tracking-wider py-0.5 px-2">Rejected</Badge>
                                    )}
                                  </div>
                                  {res.description && (
                                    <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{res.description}</p>
                                  )}
                                  {res.status === "rejected" && res.rejectionReason && (
                                    <p className="text-[10px] text-red-400 font-medium bg-red-950/20 py-1.5 px-3 rounded-lg border border-red-500/10 max-w-xl mt-1">
                                      Reason: {res.rejectionReason}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">
                                    <span>Type: {res.resourceType?.toUpperCase() || "FILE"}</span>
                                    {res.resourceType !== "link" && <span>• Size: {res.fileSize || "0 MB"}</span>}
                                    <span>• Downloads: {res.downloadCount || 0}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                                <div className="flex items-center bg-white/5 border border-white/5 rounded-xl mr-2">
                                  <button onClick={() => handleReorderResource(index, "up")} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30">
                                    <ArrowUp size={14} />
                                  </button>
                                  <button onClick={() => handleReorderResource(index, "down")} disabled={index === resources.length - 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30">
                                    <ArrowDown size={14} />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => window.open(res.resourceType === "link" ? res.fileUrl : `http://localhost:5000${res.fileUrl}`, "_blank")}
                                  className="py-2 px-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
                                >
                                  Preview
                                </button>
                                
                                <button 
                                  onClick={() => handleOpenEditResource(res)}
                                  className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-white rounded-xl transition-colors"
                                  title="Edit Resource"
                                >
                                  <Edit2 size={13} />
                                </button>
                                
                                <button 
                                  onClick={() => handleDeleteResource(res._id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors"
                                  title="Delete Resource"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </GlassCard>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeSubTab === "notes" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-base text-white">Topic Chapters Notes</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Synthesize notes strictly from the syllabus topics defined in the module.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleGenerateNotes}
                            disabled={generatingNotes}
                            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
                          >
                            <Sparkles size={14} /> {generatingNotes ? "Compiling..." : "Generate AI Notes"}
                          </Button>
                          {Array.isArray(notes) && notes.length > 0 && (
                            <Button
                              onClick={() => handleTogglePublishNotes(!notes[0].published)}
                              className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                                notes[0].published ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              {notes[0].published ? "Unpublish Notes" : "Publish Notes"}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {!Array.isArray(notes) || notes.length === 0 ? (
                          <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                            <p className="text-xs text-gray-500 italic">No notes generated yet.</p>
                          </div>
                        ) : (
                          notes.map((note) => {
                            const isExpanded = expandedNoteId === note._id;
                            const isEditing = editingNoteId === note._id;
                            return (
                              <GlassCard key={note?._id} className={`border-white/5 transition-all overflow-hidden ${isExpanded ? "ring-1 ring-purple-500/20 shadow-purple-500/5" : ""}`}>
                                <div 
                                  onClick={() => !isEditing && setExpandedNoteId(isExpanded ? null : note._id)}
                                  className="flex justify-between items-center cursor-pointer select-none p-5 hover:bg-white/[0.02] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-purple-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                                      ▶
                                    </span>
                                    <div>
                                      <h5 className="text-sm font-extrabold text-white">
                                        {note?.title || "Untitled Topic"}
                                      </h5>
                                      {note?.aiModel && (
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">Model: {note.aiModel}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => {
                                        setEditingNoteId(note._id);
                                        setExpandedNoteId(note._id);
                                        setEditingNoteData({
                                          ...note,
                                          keyPoints: Array.isArray(note.keyPoints) ? note.keyPoints.join("\n") : "",
                                          advantages: Array.isArray(note.advantages) ? note.advantages.join("\n") : "",
                                          disadvantages: Array.isArray(note.disadvantages) ? note.disadvantages.join("\n") : "",
                                          commonMistakes: Array.isArray(note.commonMistakes) ? note.commonMistakes.join("\n") : "",
                                          interviewQuestions: Array.isArray(note.interviewQuestions) ? note.interviewQuestions.join("\n") : "",
                                          revisionNotes: Array.isArray(note.revisionNotes) ? note.revisionNotes.join("\n") : "",
                                          importantExamPoints: Array.isArray(note.importantExamPoints) ? note.importantExamPoints.join("\n") : (Array.isArray(note.importantPoints) ? note.importantPoints.join("\n") : ""),
                                        });
                                      }}
                                      className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-purple-400 hover:text-white transition-colors"
                                      title="Edit Note"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteNote(note._id)} 
                                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                                      title="Delete Note"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="p-6 border-t border-white/5 bg-[#080c16]/50">
                                    {isEditing ? (
                                      <div className="space-y-4 text-xs font-semibold">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Topic Name</label>
                                            <input
                                              type="text"
                                              value={editingNoteData.title}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, title: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Simple Definition</label>
                                            <textarea
                                              value={editingNoteData.definition}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, definition: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                              rows={2}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Detailed Explanation</label>
                                            <textarea
                                              value={editingNoteData.detailedExplanation}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, detailedExplanation: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                              rows={3}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Real World Example</label>
                                            <textarea
                                              value={editingNoteData.realWorldExample}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, realWorldExample: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                              rows={3}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Key Points (One per line)</label>
                                            <textarea
                                              value={editingNoteData.keyPoints}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, keyPoints: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Advantages (One per line)</label>
                                            <textarea
                                              value={editingNoteData.advantages}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, advantages: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Disadvantages (One per line)</label>
                                            <textarea
                                              value={editingNoteData.disadvantages}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, disadvantages: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Common Mistakes (One per line)</label>
                                            <textarea
                                              value={editingNoteData.commonMistakes}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, commonMistakes: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Interview Questions (One per line)</label>
                                            <textarea
                                              value={editingNoteData.interviewQuestions}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, interviewQuestions: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 uppercase block">Revision Notes (One per line)</label>
                                            <textarea
                                              value={editingNoteData.revisionNotes}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, revisionNotes: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                          <div className="space-y-1 md:col-span-2">
                                            <label className="text-[10px] text-gray-500 uppercase block">Important Exam Points (One per line)</label>
                                            <textarea
                                              value={editingNoteData.importantExamPoints}
                                              onChange={(e) => setEditingNoteData({ ...editingNoteData, importantExamPoints: e.target.value })}
                                              className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                              rows={4}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                          <Button onClick={() => handleUpdateNote(note._id, editingNoteData)} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl text-xs uppercase font-bold">Save Changes</Button>
                                          <button onClick={() => setEditingNoteId(null)} className="text-xs text-gray-400 hover:text-white px-4">Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-6 text-xs text-gray-300">
                                        {/* Simple Definition */}
                                        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/[0.03]">
                                          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5"><BookOpen size={12} /> Definition</span>
                                          <p className="text-white leading-relaxed text-sm">{note.definition}</p>
                                        </div>

                                        {/* Grid columns */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Key Points */}
                                          {Array.isArray(note.keyPoints) && note.keyPoints.length > 0 && (
                                            <div className="space-y-2">
                                              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block flex items-center gap-1.5"><List size={12} /> Key Points</span>
                                              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                                {note.keyPoints.map((pt, pIdx) => <li key={pIdx}>{pt}</li>)}
                                              </ul>
                                            </div>
                                          )}

                                          {/* Detailed Explanation */}
                                          {note.detailedExplanation && (
                                            <div className="space-y-2">
                                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block flex items-center gap-1.5"><FileText size={12} /> Detailed Explanation</span>
                                              <p className="text-gray-400 leading-relaxed">{note.detailedExplanation}</p>
                                            </div>
                                          )}
                                        </div>

                                        {/* Real World Example */}
                                        {note.realWorldExample && (
                                          <div className="p-5 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 text-cyan-500/5"><Globe size={60} /></div>
                                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5"><Globe size={12} /> Real World Example</span>
                                            <p className="text-gray-300 leading-relaxed">{note.realWorldExample}</p>
                                          </div>
                                        )}

                                        {/* Pros & Cons */}
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

                                        {/* Common Mistakes */}
                                        {Array.isArray(note.commonMistakes) && note.commonMistakes.length > 0 && (
                                          <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-2xl">
                                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5"><AlertOctagon size={12} /> Common Mistakes</span>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                              {note.commonMistakes.map((mis, mIdx) => <li key={mIdx}>{mis}</li>)}
                                            </ul>
                                          </div>
                                        )}

                                        {/* Interview Questions */}
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

                                        {/* Revision Notes */}
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

                                        {/* Important Exam Points */}
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
                      </div>
                    </div>
                  )}

                  {activeSubTab === "quiz" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-base text-white">Assess Quiz Generator</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Auto-generates MCQs, True/False, Fill blank, and Short Answer questions from topics only.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleGenerateQuiz}
                            disabled={generatingQuiz}
                            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
                          >
                            <Sparkles size={14} /> {generatingQuiz ? "Generating..." : "Generate AI Quiz"}
                          </Button>
                          {quiz && (
                            <Button
                              onClick={() => handleTogglePublishQuiz(!quiz.published)}
                              className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                                quiz.published ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              {quiz.published ? "Unpublish Quiz" : "Publish Quiz"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {quiz?.aiModel && (
                        <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <span>AI Provider: {quiz.aiProvider || "groq"}</span>
                          <span>Model: {quiz.aiModel}</span>
                          <span>Version: v{quiz.version || 1}</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {!quiz?.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0 ? (
                          <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                            <p className="text-xs text-gray-500 italic">No quiz questions generated yet.</p>
                          </div>
                        ) : (
                          quiz.questions.map((q, qIdx) => {
                            const isEditing = editingQuestionIdx === qIdx;
                            return (
                              <GlassCard key={qIdx} className={`p-6 border-white/5 transition-all ${isEditing ? "ring-1 ring-purple-500/20 shadow-purple-500/5" : ""}`}>
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-white bg-white/5 w-6 h-6 rounded-lg flex items-center justify-center">{qIdx + 1}</span>
                                    <div className="flex items-center gap-1.5">
                                      <Badge color={
                                        q.type === "mcq" ? "purple" : 
                                        q.type === "truefalse" ? "green" : 
                                        q.type === "fillblank" ? "orange" : "cyan"
                                      } className="uppercase text-[8px] font-bold tracking-wider">
                                        {q.type}
                                      </Badge>
                                      <Badge color={
                                        q.difficulty === "easy" ? "green" : 
                                        q.difficulty === "medium" ? "yellow" : "red"
                                      } className="uppercase text-[8px] font-bold tracking-wider">
                                        {q.difficulty || "medium"}
                                      </Badge>
                                      <Badge color="gray" className="text-[8px]">{q.marks || 1} {q.marks === 1 ? "Mark" : "Marks"}</Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingQuestionIdx(qIdx);
                                        setEditingQuestionData({
                                          ...q,
                                          options: Array.isArray(q.options) ? q.options.join("\n") : ""
                                        });
                                      }}
                                      className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-purple-400 hover:text-white transition-colors"
                                      title="Edit Question"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteQuestion(qIdx)} 
                                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                                      title="Delete Question"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                {isEditing ? (
                                  <div className="space-y-4 pt-2 text-xs font-semibold">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-gray-500 uppercase block">Question Text</label>
                                        <input
                                          type="text"
                                          value={editingQuestionData.question}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, question: e.target.value })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-gray-500 uppercase block">Type</label>
                                        <select
                                          value={editingQuestionData.type}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, type: e.target.value })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                        >
                                          <option value="mcq">MCQ</option>
                                          <option value="truefalse">True / False</option>
                                          <option value="fillblank">Fill Blank</option>
                                          <option value="shortanswer">Short Answer</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-gray-500 uppercase block">Difficulty</label>
                                        <select
                                          value={editingQuestionData.difficulty}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, difficulty: e.target.value })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                        >
                                          <option value="easy">Easy</option>
                                          <option value="medium">Medium</option>
                                          <option value="hard">Hard</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-gray-500 uppercase block">Marks</label>
                                        <input
                                          type="number"
                                          value={editingQuestionData.marks}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, marks: parseInt(e.target.value) || 1 })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                        />
                                      </div>
                                      {(editingQuestionData.type === "mcq" || editingQuestionData.type === "truefalse") && (
                                        <div className="space-y-1 md:col-span-2">
                                          <label className="text-[10px] text-gray-500 uppercase block">Options (One per line)</label>
                                          <textarea
                                            value={editingQuestionData.options}
                                            onChange={(e) => setEditingQuestionData({ ...editingQuestionData, options: e.target.value })}
                                            className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white font-mono"
                                            rows={4}
                                          />
                                        </div>
                                      )}
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-gray-500 uppercase block">Correct Answer</label>
                                        <input
                                          type="text"
                                          value={editingQuestionData.correctAnswer}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, correctAnswer: e.target.value })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                          placeholder="Correct answer value..."
                                        />
                                      </div>
                                      {editingQuestionData.type === "shortanswer" && (
                                        <div className="space-y-1">
                                          <label className="text-[10px] text-gray-500 uppercase block">Sample Answer</label>
                                          <textarea
                                            value={editingQuestionData.sampleAnswer}
                                            onChange={(e) => setEditingQuestionData({ ...editingQuestionData, sampleAnswer: e.target.value })}
                                            className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                            rows={2}
                                          />
                                        </div>
                                      )}
                                      <div className="space-y-1 md:col-span-2">
                                        <label className="text-[10px] text-gray-500 uppercase block">Explanation</label>
                                        <textarea
                                          value={editingQuestionData.explanation}
                                          onChange={(e) => setEditingQuestionData({ ...editingQuestionData, explanation: e.target.value })}
                                          className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl p-3 text-white"
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      <Button onClick={handleSaveQuestionChange} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl text-xs uppercase font-bold">Save Changes</Button>
                                      <button onClick={() => setEditingQuestionIdx(null)} className="text-xs text-gray-400 hover:text-white px-4">Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-400 space-y-4 pl-8">
                                    <p className="text-sm font-extrabold text-white leading-relaxed">{q.question}</p>
                                    
                                    {Array.isArray(q?.options) && q.options.length > 0 && (
                                      <div className="space-y-2">
                                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block">Choices</span>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {q.options.map((opt, oIdx) => (
                                            <li key={oIdx} className={`p-3 rounded-xl border border-white/5 bg-[#0a0e1a]/60 text-gray-300 ${opt === q.correctAnswer ? "border-green-500/20 text-green-400 bg-green-950/5 font-semibold" : ""}`}>
                                              {opt}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div>
                                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Correct Answer</span>
                                        <p className="text-white font-extrabold bg-slate-900/60 p-3 rounded-xl border border-white/5 inline-block min-w-[120px]">{q?.correctAnswer || "Not configured"}</p>
                                      </div>

                                      {q.type === "shortanswer" && q.sampleAnswer && (
                                        <div>
                                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Sample Answer</span>
                                          <p className="text-gray-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">{q.sampleAnswer}</p>
                                        </div>
                                      )}
                                    </div>

                                    {q.explanation && (
                                      <div className="p-3 bg-purple-950/10 border border-purple-500/10 rounded-xl">
                                        <p className="text-[10px] text-purple-300 leading-relaxed"><span className="font-extrabold uppercase text-[9px] text-purple-400 block mb-0.5">Explanation</span> {q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </GlassCard>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Direct AI Notes/Quiz Course tabs consolidated selector */}
            {["notes", "quiz"].includes(activeTab) && (
              <motion.div key="notes-general-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                <GlassCard className="p-6 border-white/5 space-y-4">
                  <h4 className="font-bold text-base text-white">Syllabus Chapters selector</h4>
                  <p className="text-xs text-gray-500">Please choose a module card from the **Curriculum** tab and click "Open Module" to generate and review AI Notes and AI Quizzes inside the workspace.</p>
                  <Button onClick={() => setActiveTab("curriculum")} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase">Go to Curriculum</Button>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "students" && (
              <motion.div key="students" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                <GlassCard className="p-8 border-white/5 space-y-6">
                  <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
                    <div>
                      <h3 className="text-xl font-bold">Enrolled Students</h3>
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none w-full sm:w-64"
                    />
                  </div>

                  {studentsLoading ? (
                    <div className="text-center text-gray-500 animate-pulse text-xs py-10">Loading cohorts...</div>
                  ) : filteredStudents.length === 0 ? (
                    <p className="text-gray-500 text-xs italic text-center py-10">No students enrolled yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-gray-500 uppercase tracking-widest text-[9px]">
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((stud) => (
                            <tr key={stud._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                              <td className="py-3 px-4 font-bold text-white">{stud.studentName}</td>
                              <td className="py-3 px-4 text-gray-400">{stud.studentEmail}</td>
                              <td className="py-3 px-4 text-gray-400">{stud.progress}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                <GlassCard className="p-8 border-white/5 space-y-6">
                  <h3 className="text-xl font-bold">Course Settings</h3>
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Course Title</label>
                      <input
                        type="text"
                        defaultValue={course?.title || ""}
                        onBlur={(e) => handleUpdateSettings({ title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4">
                      {course?.approvalStatus !== "approved" ? (
                        course?.approvalStatus === "pending_review" ? (
                          <Button disabled className="bg-purple-600/50 text-white/70 font-bold py-2.5 px-6 rounded-xl text-xs uppercase cursor-not-allowed">
                            Under Review
                          </Button>
                        ) : (
                          <Button onClick={handleSubmitForReview} className="bg-purple-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                            Submit For Review
                          </Button>
                        )
                      ) : (
                        course.status === "draft" ? (
                          <Button onClick={() => handlePublishCourse("published")} className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                            Publish Course
                          </Button>
                        ) : (
                          <Button onClick={() => handlePublishCourse("draft")} className="bg-yellow-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                            Revert to Draft
                          </Button>
                        )
                      )}
                      <Button onClick={handleDeleteCourse} className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                        Delete Course
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODULE SYLLABUS EDIT MODAL */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative">
            <button type="button" onClick={() => setShowModuleModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-white">{editingModule ? "Edit Module" : "Add Module"}</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveModule(); }} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Module Title *</label>
                <input
                  type="text"
                  placeholder="e.g. MongoDB Fundamentals"
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Module Description *</label>
                <textarea
                  placeholder="Module objectives details..."
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Difficulty</label>
                  <select
                    value={modDifficulty}
                    onChange={(e) => setModDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Hours"
                    value={modDuration}
                    onChange={(e) => setModDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Dynamic Outcomes tag inputs */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block">Learning Outcomes *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill gained..."
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newOutcome.trim()) {
                          if (modOutcomes.includes(newOutcome.trim())) {
                            toast.warn("Outcome already exists");
                            return;
                          }
                          setModOutcomes([...modOutcomes, newOutcome.trim()]);
                          setNewOutcome("");
                        }
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (newOutcome.trim()) {
                        if (modOutcomes.includes(newOutcome.trim())) {
                          toast.warn("Outcome already exists");
                          return;
                        }
                        setModOutcomes([...modOutcomes, newOutcome.trim()]);
                        setNewOutcome("");
                      }
                    }}
                    className="bg-purple-600 rounded-xl px-3 text-white"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {modOutcomes.map((out, oIdx) => (
                    <span key={oIdx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-gray-400 flex items-center gap-1">
                      {out} <button type="button" onClick={() => setModOutcomes(modOutcomes.filter((_, idx) => idx !== oIdx))}><X size={8} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Topics with Reordering support */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block">Topics (AI Generation Syllabus) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Press enter to add topic tag..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newTopic.trim()) {
                          if (modTopics.includes(newTopic.trim())) {
                            toast.warn("Topic already exists");
                            return;
                          }
                          setModTopics([...modTopics, newTopic.trim()]);
                          setNewTopic("");
                        }
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (newTopic.trim()) {
                        if (modTopics.includes(newTopic.trim())) {
                          toast.warn("Topic already exists");
                          return;
                        }
                        setModTopics([...modTopics, newTopic.trim()]);
                        setNewTopic("");
                      }
                    }}
                    className="bg-purple-600 rounded-xl px-3 text-white"
                  >
                    +
                  </button>
                </div>
                
                {/* List with reordering handles */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar pt-2">
                  {modTopics.map((topic, tIdx) => (
                    <div key={tIdx} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-xs text-white truncate max-w-[60%]">✓ {topic}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveTopic(tIdx, "up")} className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                          <ArrowUp size={11} />
                        </button>
                        <button type="button" onClick={() => moveTopic(tIdx, "down")} className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                          <ArrowDown size={11} />
                        </button>
                        <button type="button" onClick={() => setModTopics(modTopics.filter((_, idx) => idx !== tIdx))} className="p-1 hover:bg-white/5 rounded text-red-400 hover:text-red-300">
                          <X size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase">
                  Save Module
                </Button>
                <Button type="button" onClick={() => setShowModuleModal(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD LECTURE MODAL */}
      {showLectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 relative">
            <button onClick={() => setShowLectureModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-white">Add Lecture</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Lecture Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Intro to MongoDB"
                  value={lecTitle}
                  onChange={(e) => setLecTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Lecture Description</label>
                <input
                  type="text"
                  placeholder="Objective details..."
                  value={lecDesc}
                  onChange={(e) => setLecDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Estimated Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00"
                  value={lecDuration}
                  onChange={(e) => setLecDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">YouTube Link</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={lecYoutubeUrl}
                  onChange={(e) => setLecYoutubeUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase block">OR Video Upload</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setLecVideoFile(e.target.files[0])}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button onClick={handleSaveLecture} disabled={uploadingLecture} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase">
                {uploadingLecture ? "Saving..." : "Save Lecture"}
              </Button>
              <Button onClick={() => setShowLectureModal(false)} className="w-full py-2.5 bg-white/5 text-white font-bold rounded-xl text-xs uppercase">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* UPLOAD RESOURCE MODAL */}
      {showUploadResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 relative">
            <button onClick={() => setShowUploadResourceModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-white">Upload Module Resource</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Resource Title *</label>
                <input
                  type="text"
                  placeholder="e.g. HTML/CSS Cheat Sheet"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white animate-none outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Description</label>
                <textarea
                  placeholder="Details or learning objectives for this resource..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">Category</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer outline-none"
                  >
                    <option value="Study Material">Study Material</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Reference">Reference</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">Resource Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint (PPT)</option>
                    <option value="doc">Word Document</option>
                    <option value="excel">Excel Sheet</option>
                    <option value="zip">Zip Archive</option>
                    <option value="image">Image Asset</option>
                    <option value="video">Supplemental Video</option>
                    <option value="link">External Link</option>
                    <option value="other">Other File</option>
                  </select>
                </div>
              </div>

              {resType === "link" ? (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">External Link *</label>
                  <input
                    type="text"
                    placeholder="https://example.com/notes"
                    value={resLink}
                    onChange={(e) => setResLink(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase block">Choose File *</label>
                  <input
                    type="file"
                    onChange={(e) => setResFile(e.target.files[0])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="resRequired"
                  checked={resRequired}
                  onChange={(e) => setResRequired(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="resRequired" className="text-xs text-gray-400 font-bold uppercase tracking-wider cursor-pointer">
                  Mark as required
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button onClick={handleSaveResource} disabled={uploadingResource} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase">
                {uploadingResource ? "Uploading..." : "Upload"}
              </Button>
              <Button onClick={() => setShowUploadResourceModal(false)} className="w-full py-2.5 bg-white/5 text-white font-bold rounded-xl text-xs uppercase">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* EDIT RESOURCE MODAL */}
      {showEditResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 relative">
            <button onClick={() => setShowEditResourceModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-white">Edit Resource Metadata</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Resource Title *</label>
                <input
                  type="text"
                  value={editResTitle}
                  onChange={(e) => setEditResTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Description</label>
                <textarea
                  value={editResDesc}
                  onChange={(e) => setEditResDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">Category</label>
                  <select
                    value={editResCategory}
                    onChange={(e) => setEditResCategory(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer outline-none"
                  >
                    <option value="Study Material">Study Material</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Reference">Reference</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">Resource Type</label>
                  <select
                    value={editResType}
                    onChange={(e) => setEditResType(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint (PPT)</option>
                    <option value="doc">Word Document</option>
                    <option value="excel">Excel Sheet</option>
                    <option value="zip">Zip Archive</option>
                    <option value="image">Image Asset</option>
                    <option value="video">Supplemental Video</option>
                    <option value="link">External Link</option>
                    <option value="other">Other File</option>
                  </select>
                </div>
              </div>

              {editResType === "link" && (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">External Link *</label>
                  <input
                    type="text"
                    value={editResLink}
                    onChange={(e) => setEditResLink(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="editResRequired"
                  checked={editResRequired}
                  onChange={(e) => setEditResRequired(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="editResRequired" className="text-xs text-gray-400 font-bold uppercase tracking-wider cursor-pointer">
                  Mark as required
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button onClick={handleUpdateResource} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase">
                Save Changes
              </Button>
              <Button onClick={() => setShowEditResourceModal(false)} className="w-full py-2.5 bg-white/5 text-white font-bold rounded-xl text-xs uppercase">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseWorkspace;
