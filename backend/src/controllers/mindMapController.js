import MindMap from "../models/MindMap.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import { groqService } from "../services/groq.service.js";

/**
 * Generate AI Mind Map tree nodes.
 */
export const generateMindMap = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, lectureId } = req.body;

    // 1. Verify enrollment
    const enrollment = await CourseProgress.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course to build mind maps." });
    }

    // 2. Return existing mind map if already generated
    const existing = await MindMap.findOne({ studentId, lectureId });
    if (existing) {
      return res.status(200).json(existing);
    }

    // 3. Gather contexts
    const course = await Course.findById(courseId).select("title description");
    const moduleObj = await Module.findById(moduleId).select("title description");
    const lecture = await Lecture.findById(lectureId).select("title description summary");

    const prompt = `
You are an expert academic illustrator and senior software engineer.
Generate an educational hierarchical mind map detailing concept dependencies for this lecture:
- Course: "${course?.title || ''}" (${course?.description || ''})
- Module: "${moduleObj?.title || ''}" (${moduleObj?.description || ''})
- Lecture: "${lecture?.title || ''}" (${lecture?.description || ''})
- Summary: "${lecture?.summary || ''}"

You must return ONLY a valid JSON array of node objects. Do NOT output any markdown backticks, explanations, or text outside the JSON array.
The array must contain exactly 5-8 nodes that build a conceptual hierarchy.
Each node object in the array MUST contain exactly:
{
  "id": "A unique slug string (e.g. 'root', 'sub-concept1', 'sub-concept2')",
  "label": "A concise title label for the concept node",
  "parentId": "The id of the parent node. The first node (root concept) should NOT have a parentId property.",
  "description": "A detailed 1-2 sentence explanation of the concept."
}
    `.trim();

    // Call Groq chat
    const result = await groqService.callGroqChat([
      { role: "system", content: "You are a professional mind map assistant. Only return valid JSON arrays." },
      { role: "user", content: prompt }
    ]);

    // Parse JSON
    let nodesData = [];
    try {
      const cleaned = result.content
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
      const first = cleaned.indexOf("[");
      const last = cleaned.lastIndexOf("]");
      nodesData = JSON.parse(cleaned.substring(first, last + 1));
    } catch {
      // Fallback hierarchy
      nodesData = [
        { id: "root", label: lecture?.title || "Core Lecture Paradigm", description: "Main concept." },
        { id: "sub1", label: "Fundamental Principles", parentId: "root", description: "Core fundamentals." },
        { id: "sub2", label: "Real-world Practices", parentId: "root", description: "Practical applications." }
      ];
    }

    // Save to database
    const map = await MindMap.create({
      studentId,
      courseId,
      moduleId,
      lectureId,
      nodes: nodesData.map((node) => ({
        id: node.id,
        label: node.label,
        parentId: node.parentId,
        description: node.description,
        isCompleted: false
      }))
    });

    res.status(201).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch mind map for a specific lecture.
 */
export const getLectureMindMap = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lectureId } = req.params;

    const map = await MindMap.findOne({ studentId, lectureId });
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle node completion status.
 */
export const toggleNodeComplete = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mapId, nodeId } = req.params;

    const map = await MindMap.findOne({ _id: mapId, studentId });
    if (!map) {
      return res.status(404).json({ message: "Mind map not found or unauthorized." });
    }

    const node = map.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return res.status(404).json({ message: "Node not found inside mind map." });
    }

    node.isCompleted = !node.isCompleted;
    await map.save();

    res.status(200).json({ message: "Node completion toggled successfully.", map });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
