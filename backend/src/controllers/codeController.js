import axios from "axios";
import CodingSubmission from "../models/CodingSubmission.js";
import CourseProgress from "../models/CourseProgress.js";
import { groqService } from "../services/groq.service.js";
import { awardStudentXP } from "../utils/xpHelper.js";

// Maps compiler slugs to Piston engine runtimes
const PISTON_LANGUAGES = {
  js: { language: "javascript", version: "18.15.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  py: { language: "python3", version: "3.10.0" },
  python: { language: "python3", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "cpp", version: "10.2.0" },
  ts: { language: "typescript", version: "5.0.3" },
  typescript: { language: "typescript", version: "5.0.3" },
  go: { language: "go", version: "1.16.2" },
  php: { language: "php", version: "8.2.3" },
  csharp: { language: "csharp", version: "6.12.0" }
};

/**
 * Execute code securely using EMKC Piston API.
 */
export const runCode = async (req, res) => {
  try {
    const { language, sourceCode } = req.body;
    const runtime = PISTON_LANGUAGES[language?.toLowerCase()] || PISTON_LANGUAGES.js;

    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: runtime.language,
      version: runtime.version,
      files: [
        {
          name: `main.${language === "python" ? "py" : language === "cpp" ? "cpp" : "js"}`,
          content: sourceCode
        }
      ]
    });

    const result = response.data?.run || {};
    res.status(200).json({
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      code: result.code ?? 0,
      signal: result.signal || null
    });
  } catch (error) {
    res.status(500).json({ message: "Code sandbox execution failed." });
  }
};

/**
 * Submit solution and log progress.
 */
export const submitCode = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, moduleId, language, sourceCode } = req.body;

    // Verify enrollment
    const enrollment = await CourseProgress.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course to submit solutions." });
    }

    const runtime = PISTON_LANGUAGES[language?.toLowerCase()] || PISTON_LANGUAGES.js;
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: runtime.language,
      version: runtime.version,
      files: [{ name: "main", content: sourceCode }]
    });

    const runResult = response.data?.run || {};
    const isPassed = (runResult.code === 0 && !runResult.stderr);

    // Save submission
    const submission = await CodingSubmission.create({
      studentId,
      courseId,
      moduleId,
      language,
      sourceCode,
      stdout: runResult.stdout || "",
      stderr: runResult.stderr || "",
      isPassed
    });

    // Award XP
    const xpAwarded = isPassed ? 75 : 20;
    await awardStudentXP(studentId, xpAwarded, `Submitted Coding Playground solution (${language})`);

    res.status(201).json({
      message: "Submission scored.",
      submission,
      isPassed,
      xpAwarded
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * AI Code review using Groq API.
 */
export const aiReviewCode = async (req, res) => {
  try {
    const { sourceCode, language } = req.body;

    const prompt = `
You are a senior staff engineer and professional code auditor.
Perform a thorough, expert review of this code:
- Language: "${language || 'javascript'}"
- Code:
\`\`\`${language || 'javascript'}
${sourceCode}
\`\`\`

You must structure your review in beautiful, clean markdown covering:
1. **Code Quality Rating** (Score out of 10)
2. **Complexity Analysis** (Identify Time and Space complexity)
3. **Bugs & Mistakes** (Highlight any syntax errors, logic flaws, or infinite loops)
4. **Optimizations** (Provide clean suggestions to make the code faster or use less memory)
5. **Best Practices** (Mention stylistic suggestions or security practices)

Return ONLY the markdown audit review. Keep explanations direct, concise, and helpful.
    `.trim();

    const result = await groqService.callGroqChat([
      { role: "system", content: "You are a professional code review auditor." },
      { role: "user", content: prompt }
    ]);

    res.status(200).json({ review: result.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
