import AIQuiz from "../models/AIQuiz.js";
import AIQuestion from "../models/AIQuestion.js";
import Course from "../models/course.js";
import Enrollment from "../models/Enrollment.js";
import { openaiService } from "../services/openai.service.js";

// POST /api/ai-quiz/generate
export const generateAIQuiz = async (req, res) => {
  try {
    const { courseId, difficulty, count, title } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "teacher" && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Create the Quiz container
    const quiz = await AIQuiz.create({
      courseId,
      title: title || `AI Generated Quiz - ${difficulty}`,
      difficulty: difficulty || "Intermediate",
      isPublished: false,
      createdBy: req.user.id,
    });

    const topicsList = [{ title: course.title }];
    const generatedNotesAndQuizResult = await openaiService.generateNotesAndQuiz(
      { title: course.title, description: course.description || "", learningOutcomes: [] },
      topicsList
    );

    const quizData = generatedNotesAndQuizResult?.quiz || {};
    const generatedQs = [];

    if (Array.isArray(quizData.mcq)) {
      quizData.mcq.slice(0, count || 10).forEach((q) => {
        generatedQs.push({
          question: q.question,
          type: "mcq",
          options: q.options || [],
          correctAnswer: q.answer,
          explanation: q.explanation || "",
          difficulty: difficulty || "Intermediate",
        });
      });
    }

    const questionsToSave = generatedQs.map((q) => ({
      courseId,
      quizId: quiz._id,
      question: q.question,
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      marks: q.marks || 1,
      createdBy: req.user.id,
    }));

    const savedQuestions = await AIQuestion.insertMany(questionsToSave);

    res.status(201).json({
      success: true,
      message: "AI Quiz and questions generated successfully",
      quiz,
      questions: savedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ai-quiz/:courseId
export const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Access control
    if (req.user.role === "student") {
      const isEnrolled = await Enrollment.findOne({ studentId: req.user.id, courseId });
      if (!isEnrolled) {
        return res.status(403).json({ message: "Enrollment required to access quizzes" });
      }

      // Students only see published quizzes
      const quizzes = await AIQuiz.find({ courseId, isPublished: true }).sort({ createdAt: -1 });
      const quizzesWithQuestions = [];
      for (const q of quizzes) {
        const questions = await AIQuestion.find({ quizId: q._id });
        quizzesWithQuestions.push({ quiz: q, questions });
      }

      return res.status(200).json(quizzesWithQuestions);
    }

    // Teachers see all quizzes and questions
    const quizzes = await AIQuiz.find({ courseId }).sort({ createdAt: -1 });
    const quizzesWithQuestions = [];
    for (const q of quizzes) {
      const questions = await AIQuestion.find({ quizId: q._id });
      quizzesWithQuestions.push({ quiz: q, questions });
    }

    res.status(200).json(quizzesWithQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/ai-quiz/:id
export const updateAIQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, difficulty, isPublished } = req.body;

    const quiz = await AIQuiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.courseId);
    if (req.user.role === "teacher" && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedQuiz = await AIQuiz.findByIdAndUpdate(
      id,
      { title, difficulty, isPublished },
      { new: true }
    );

    res.status(200).json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/ai-quiz/:id
export const deleteAIQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await AIQuiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.courseId);
    if (req.user.role === "teacher" && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await AIQuiz.findByIdAndDelete(id);
    await AIQuestion.deleteMany({ quizId: id });

    res.status(200).json({ success: true, message: "Quiz and its questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/ai-quiz/question/:id
export const updateAIQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await AIQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const course = await Course.findById(question.courseId);
    if (req.user.role === "teacher" && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedQuestion = await AIQuestion.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, question: updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/ai-quiz/question/:id
export const deleteAIQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await AIQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const course = await Course.findById(question.courseId);
    if (req.user.role === "teacher" && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await AIQuestion.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
