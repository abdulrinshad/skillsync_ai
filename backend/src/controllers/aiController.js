import AIConversation from "../models/AIConversation.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import { groqService } from "../services/groq.service.js";

/**
 * Interactive chat with context-aware AI tutor.
 */
export const chatCurrentVideo = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, lectureId, timestamp, mode, question } = req.body;

    // 1. Verify student enrollment
    const enrollment = await CourseProgress.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course to consult the AI Tutor." });
    }

    // 2. Fetch or initialize conversation log
    let conversation = await AIConversation.findOne({ studentId, lectureId });
    if (!conversation) {
      // Gather contexts
      const course = await Course.findById(courseId).select("title description");
      const moduleObj = await Module.findById(moduleId).select("title description");
      const lecture = await Lecture.findById(lectureId).select("title description summary videoUrl");

      const systemPrompt = `
You are a professional, helpful, context-aware AI Study Tutor inside the SkillSync AI LMS.
The student is watching a video lecture. Here is the current context:
- Course: "${course?.title || 'Course'}" (${course?.description || ''})
- Module: "${moduleObj?.title || 'Module'}" (${moduleObj?.description || ''})
- Lecture: "${lecture?.title || 'Lecture'}" (${lecture?.description || ''})
- Summary: "${lecture?.summary || 'No transcript summary available.'}"

The student is currently paused/watching at timestamp: ${timestamp || 0} seconds.

You have two execution modes:
1. "lecture_only": You MUST strictly answer questions based ONLY on the current lecture summary and notes. If the information is not present or cannot be inferred from the lecture, respond with exactly:
"This topic is not covered in the current lecture. Would you like me to explain it using general knowledge?"
2. "general": You can explain topics using both the lecture context and your broader general AI knowledge.

The current mode requested is: "${mode === "lecture_only" ? "lecture_only" : "general"}".

Provide answers formatted in beautiful GitHub Markdown. Use code blocks with language identifiers if providing code. Keep answers concise, educational, and direct.
      `.trim();

      conversation = await AIConversation.create({
        studentId,
        courseId,
        moduleId,
        lectureId,
        messages: [{ role: "system", content: systemPrompt }]
      });
    }

    // 3. Append user's new question
    conversation.messages.push({
      role: "user",
      content: `[Timestamp: ${timestamp || 0}s] ${question}`
    });

    // 4. Limit conversation context to prevent token overflows (keep system prompt + last 8 messages)
    let activeMessages = [...conversation.messages];
    if (activeMessages.length > 10) {
      const systemMsg = activeMessages[0];
      const recentMsgs = activeMessages.slice(activeMessages.length - 8);
      activeMessages = [systemMsg, ...recentMsgs];
    }

    // 5. Generate completion
    const aiResult = await groqService.callGroqChat(activeMessages);

    // 6. Save response
    conversation.messages.push({
      role: "assistant",
      content: aiResult.content
    });
    await conversation.save();

    res.status(200).json(conversation.messages.filter(m => m.role !== "system"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch chat history for a lecture.
 */
export const getChatHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lectureId } = req.params;

    const conversation = await AIConversation.findOne({ studentId, lectureId });
    if (!conversation) {
      return res.status(200).json([]);
    }

    // Filter out the system prompt from the UI response
    res.status(200).json(conversation.messages.filter((m) => m.role !== "system"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Clear chat history for a lecture.
 */
export const clearChatHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lectureId } = req.params;

    await AIConversation.findOneAndDelete({ studentId, lectureId });
    res.status(200).json({ message: "Conversation history cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
