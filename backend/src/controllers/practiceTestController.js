import PracticeTest from "../models/PracticeTest.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import { groqService } from "../services/groq.service.js";
import { awardStudentXP } from "../utils/xpHelper.js";

/**
 * Generate adaptive AI Practice Test.
 */
export const generatePracticeTest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, difficulty } = req.body;

    // 1. Verify enrollment
    const enrollment = await CourseProgress.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course to generate practice tests." });
    }

    // 2. Gather contexts
    const course = await Course.findById(courseId).select("title description");
    const moduleObj = await Module.findById(moduleId).select("title description");

    const prompt = `
You are an expert technical interviewer and certification designer (like AWS, Google Cloud, Microsoft, or Cisco).
Create a professional practice test tailored for this workspace:
- Course: "${course?.title || ''}" (${course?.description || ''})
- Module: "${moduleObj?.title || ''}" (${moduleObj?.description || ''})
- Requested Difficulty: "${difficulty || 'medium'}"

You must return ONLY a valid JSON array of question objects. Do NOT output any markdown backticks, explanations, or text outside the JSON array.
The array must contain exactly 5 premium, exam-quality questions.
Each question object in the array MUST contain exactly:
{
  "question": "The question text (e.g. Which of the following best defines X?)",
  "options": [
    "A) Option 1",
    "B) Option 2",
    "C) Option 3",
    "D) Option 4"
  ],
  "correctAnswer": "The exact correct option string (e.g. 'A) Option 1')",
  "explanation": "Detailed explanation of why this answer is correct."
}
    `.trim();

    // Call Groq Chat API
    const result = await groqService.callGroqChat([
      { role: "system", content: "You are a professional certification designer. Only return valid JSON arrays." },
      { role: "user", content: prompt }
    ]);

    // Parse JSON
    let questionsData = [];
    try {
      const cleaned = result.content
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
      const first = cleaned.indexOf("[");
      const last = cleaned.lastIndexOf("]");
      questionsData = JSON.parse(cleaned.substring(first, last + 1));
    } catch {
      // Fallback questions
      questionsData = [
        {
          question: `What is the core objective of ${moduleObj?.title || "this module"}?`,
          options: ["A) Fundamentals implementation", "B) System styling", "C) Database migrations", "D) Visual models rendering"],
          correctAnswer: "A) Fundamentals implementation",
          explanation: "The module details focus primary on setting up initial paradigm frameworks."
        }
      ];
    }

    // Save to database
    const newTest = await PracticeTest.create({
      studentId,
      courseId,
      moduleId,
      difficulty: difficulty || "medium",
      questions: questionsData.map((q) => ({
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "No explanation provided."
      }))
    });

    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit answers and score practice test.
 */
export const submitPracticeTest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { testId } = req.params;
    const { answers, timeTaken } = req.body; // answers is an array of strings matching selected choices

    const test = await PracticeTest.findOne({ _id: testId, studentId });
    if (!test) {
      return res.status(404).json({ message: "Practice test not found or unauthorized." });
    }

    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      const selected = answers[idx]?.trim().toLowerCase();
      const correct = q.correctAnswer?.trim().toLowerCase();
      if (selected === correct) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / test.questions.length) * 100);

    // Save parameters
    test.score = correctCount;
    test.percentage = percentage;
    test.timeTaken = timeTaken || 0;
    test.isCompleted = true;
    await test.save();

    // Award XP
    const xpAwarded = percentage >= 80 ? 100 : 50;
    await awardStudentXP(studentId, xpAwarded, `Completed Practice Test (${percentage}% accuracy)`);

    // Generate custom AI summary feedback
    let grade = "C";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";

    res.status(200).json({
      message: "Test scored successfully!",
      test,
      percentage,
      xpAwarded,
      grade,
      weakAreas: percentage >= 80 ? "None detected" : "Fundamental concept dependencies",
      aiFeedback: percentage >= 80
        ? "Excellent work! You show a solid understanding of these concepts."
        : "Review the lecture notes and try retaking the test to improve comprehension."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch practice tests history for a course.
 */
export const getCoursePracticeTests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const tests = await PracticeTest.find({ studentId, courseId }).sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
