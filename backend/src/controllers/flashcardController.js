import Flashcard from "../models/Flashcard.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import { groqService } from "../services/groq.service.js";

/**
 * Generate AI Flashcards from lecture context.
 */
export const generateFlashcards = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, lectureId } = req.body;

    // 1. Verify enrollment
    const enrollment = await CourseProgress.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course to generate flashcards." });
    }

    // 2. Return existing cards if already generated to prevent duplication
    const existing = await Flashcard.find({ studentId, lectureId });
    if (existing.length > 0) {
      return res.status(200).json(existing);
    }

    // 3. Gather contexts
    const course = await Course.findById(courseId).select("title description");
    const moduleObj = await Module.findById(moduleId).select("title description");
    const lecture = await Lecture.findById(lectureId).select("title description summary");

    const prompt = `
You are an expert software developer and professional study assistant.
Generate exactly 6 premium flashcards based on this lecture context:
- Course: "${course?.title || ''}" (${course?.description || ''})
- Module: "${moduleObj?.title || ''}" (${moduleObj?.description || ''})
- Lecture: "${lecture?.title || ''}" (${lecture?.description || ''})
- Summary: "${lecture?.summary || ''}"

Return ONLY a valid JSON array of objects. Do NOT output any markdown backticks, explanations, or text outside the JSON array.
Each object in the array MUST contain exactly:
{
  "question": "A concise revision question (e.g. What is the complexity of X?)",
  "answer": "A precise, informative answer.",
  "difficulty": "Choose one: easy, medium, hard, expert"
}
    `.trim();

    // Call Groq API helper
    const result = await groqService.callGroqChat([
      { role: "system", content: "You are a professional study assistant. Only return valid JSON arrays." },
      { role: "user", content: prompt }
    ]);

    // Parse JSON
    let cardsData = [];
    try {
      const cleaned = result.content
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
      const first = cleaned.indexOf("[");
      const last = cleaned.lastIndexOf("]");
      cardsData = JSON.parse(cleaned.substring(first, last + 1));
    } catch {
      // Fallbacks if parse failed
      cardsData = [
        { question: `What is the primary topic of ${lecture?.title || "this lecture"}?`, answer: `${lecture?.description || "A core concept."}`, difficulty: "easy" },
        { question: `Summarize the main objective of ${lecture?.title || "this lecture"}?`, answer: `${lecture?.summary || "Concept implementation."}`, difficulty: "medium" }
      ];
    }

    // 4. Save to database
    const savedCards = await Promise.all(
      cardsData.map((card) =>
        Flashcard.create({
          studentId,
          courseId,
          moduleId,
          lectureId,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || "medium",
          status: "new"
        })
      )
    );

    res.status(201).json(savedCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch flashcards for a specific lecture.
 */
export const getLectureFlashcards = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lectureId } = req.params;

    const cards = await Flashcard.find({ studentId, lectureId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Spaced Repetition Algorithmic Progress Update (SM-2 Anki-style).
 */
export const updateProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { rating } = req.body; // Again = 1, Hard = 3, Easy = 5

    const card = await Flashcard.findOne({ _id: id, studentId });
    if (!card) {
      return res.status(404).json({ message: "Flashcard not found or unauthorized." });
    }

    let { repetitionCount, interval, easeFactor } = card;

    if (rating < 3) {
      // Again/forgotten
      repetitionCount = 0;
      interval = 1; // repeat tomorrow
    } else {
      // Success
      if (repetitionCount === 0) {
        interval = 1;
      } else if (repetitionCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitionCount += 1;
    }

    // Adjust ease factor
    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Determine status
    let status = "learning";
    if (repetitionCount >= 4) {
      status = "mastered";
    } else if (repetitionCount >= 1) {
      status = "review";
    }

    // Save fields
    card.repetitionCount = repetitionCount;
    card.interval = interval;
    card.easeFactor = easeFactor;
    card.status = status;
    card.nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

    await card.save();
    res.status(200).json({ message: "SM-2 parameters updated.", card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle bookmark state.
 */
export const toggleBookmark = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const card = await Flashcard.findOne({ _id: id, studentId });
    if (!card) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    card.isBookmarked = !card.isBookmarked;
    await card.save();

    res.status(200).json({ message: "Bookmark status updated", isBookmarked: card.isBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle favorite state.
 */
export const toggleFavorite = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const card = await Flashcard.findOne({ _id: id, studentId });
    if (!card) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    card.isFavorite = !card.isFavorite;
    await card.save();

    res.status(200).json({ message: "Favorite status updated", isFavorite: card.isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
