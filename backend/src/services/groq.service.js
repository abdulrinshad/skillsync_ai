// backend/src/services/groq.service.js

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const cleanResponse = (text = "") => {
    return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
};

const parseJsonResponse = (text) => {
    const cleaned = cleanResponse(text);

    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first === -1 || last === -1) {
        throw new Error("No JSON found in AI response");
    }

    const json = cleaned.substring(first, last + 1);

    try {
        return JSON.parse(json);
    } catch (err) {
        console.error("JSON PARSE FAILED:");
        console.error(json);
        throw err;
    }
};

const callGroq = async (prompt) => {
    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`Using Groq model: ${model}`);

            const response =
                await groq.chat.completions.create({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                });

            const content =
                response?.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error("Empty Groq response");
            }

            return {
                model,
                content,
            };
        } catch (error) {
            console.error(
                `Groq model failed: ${model}`
            );

            console.error(error.message);

            lastError = error;
        }
    }

    throw lastError || new Error("Groq failed");
};

/*
|--------------------------------------------------------------------------
| AI NOTES
|--------------------------------------------------------------------------
*/

const generateModuleNotesGroq = async (topics = []) => {
    try {
        console.log("========== AI NOTES ==========");
        console.log("Topics:", topics.length);

        const notes = [];

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];

            const topicTitle =
                typeof topic === "string"
                    ? topic
                    : topic.title;

            console.log(
                `Generating topic ${i + 1}/${topics.length}`
            );

            console.log("Topic:", topicTitle);

            const prompt = `
You are an expert university professor and professional content curator.
Create detailed, high-fidelity educational notes of professional LMS quality (like Udemy, Coursera, Unacademy, and Byju's) for the following topic.

TOPIC:
${topicTitle}

You must return a valid JSON object ONLY. Do NOT write any markdown formatting, backticks (other than within the JSON string), or conversational text outside the JSON object.

The JSON structure MUST be exactly:
{
  "title": "${topicTitle}",
  "chapterNumber": ${i + 1},
  "introduction": "A simple, engaging introduction to the concept.",
  "definition": "A precise, professional definition of the concept.",
  "keyPoints": [
    "✓ Bullet point 1 detailing a key concept",
    "✓ Bullet point 2 detailing a key concept"
  ],
  "explanation": "A highly detailed academic explanation of how the concept works.",
  "examples": "Real-world examples detailing how tech giants (like Facebook, Instagram, Amazon, Netflix, Google) use this concept to solve real-world problems.",
  "codeExamples": [
    {
      "code": "Provide practical code implementation or mock setup here.",
      "explanation": "Detailed line-by-line explanation of the code."
    }
  ],
  "importantQuestions": [
    "1. Question 1?",
    "2. Question 2?"
  ],
  "interviewQuestions": [
    "1. Question 1?",
    "2. Question 2?"
  ],
  "mcqs": [
    {
      "question": "Question 1?",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct answer letter (A, B, C, or D)",
      "explanation": "Detailed explanation of why this answer is correct."
    }
  ],
  "mistakes": [
    "❌ Common mistake 1",
    "❌ Common mistake 2"
  ],
  "tips": [
    "✓ Best practice/Tip 1",
    "✓ Best practice/Tip 2"
  ],
  "cheatSheet": [
    {
      "term": "Term/Concept Name",
      "definition": "Quick revision definition/meaning."
    }
  ],
  "summary": "A concise summary of the chapter."
}

Generate rich, premium educational content. You must generate exactly 10 importantQuestions, at least 5 interviewQuestions, and exactly 10 mcqs. Add multiple common mistakes, tips, and cheatSheet items. Ensure the output is strictly valid JSON.
`;

            const result = await callGroq(prompt);

            console.log(
                "Groq returned:",
                result.content.length,
                "characters"
            );

            let parsed;

            try {
                parsed = parseJsonResponse(
                    result.content
                );
            } catch {
                console.log("Failed to parse JSON directly, constructing fallback content structure");
                parsed = {
                    title: topicTitle,
                    chapterNumber: i + 1,
                    introduction: "Introduction to " + topicTitle,
                    definition: "Definition of " + topicTitle,
                    keyPoints: ["✓ Concept overview"],
                    explanation: cleanResponse(result.content),
                    examples: "Real world application of " + topicTitle,
                    codeExamples: [],
                    importantQuestions: [],
                    interviewQuestions: [],
                    mcqs: [],
                    mistakes: [],
                    tips: [],
                    cheatSheet: [],
                    summary: "Summary of " + topicTitle
                };
            }

            notes.push({
                title: parsed.title || topicTitle,
                chapterNumber: parsed.chapterNumber || (i + 1),
                introduction: parsed.introduction || "",
                definition: parsed.definition || "",
                keyPoints: parsed.keyPoints || [],
                explanation: parsed.explanation || "",
                examples: parsed.examples || "",
                codeExamples: parsed.codeExamples || [],
                importantQuestions: parsed.importantQuestions || [],
                interviewQuestions: parsed.interviewQuestions || [],
                mcqs: parsed.mcqs || [],
                mistakes: parsed.mistakes || [],
                tips: parsed.tips || [],
                cheatSheet: parsed.cheatSheet || [],
                summary: parsed.summary || "",
                content: parsed.explanation || "",
                order: topic.order ?? i,
                aiProvider: "groq",
                aiModel: result.model,
            });

            console.log(
                `Completed topic ${i + 1}`
            );
        }

        console.log(
            "Generated notes:",
            notes.length
        );

        return notes;
    } catch (error) {
        console.error(
            "generateModuleNotesGroq failed"
        );

        console.error(error);

        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| AI TOPIC NOTES
|--------------------------------------------------------------------------
*/

const generateNotesForTopic = async (
    topic
) => {
    const prompt = `
You are an expert software engineering professor.

Generate educational notes.

TOPIC:
${topic}

Return ONLY JSON:

{
    "definition":"",
    "keyPoints":[],
    "detailedExplanation":"",
    "realWorldExample":"",
    "advantages":[],
    "disadvantages":[],
    "commonMistakes":[],
    "interviewQuestions":[],
    "revisionNotes":[],
    "importantExamPoints":[]
}
`;

    const result =
        await callGroq(prompt);

    const parsed =
        parseJsonResponse(
            result.content
        );

    return {
        ...parsed,
        aiProvider: "groq",
        aiModel: result.model,
    };
};

/*
|--------------------------------------------------------------------------
| AI QUIZ
|--------------------------------------------------------------------------
*/

const generateQuizForTopic =
    async (topic) => {
        const prompt = `
You are an expert software engineering professor.

Generate quiz questions.

TOPIC:
${topic}

Generate:

5 MCQ
3 TRUE/FALSE
2 FILL BLANK
2 SHORT ANSWER

Return ONLY JSON:

{
    "questions":[]
}
`;

        const result =
            await callGroq(
                prompt
            );

        const parsed =
            parseJsonResponse(
                result.content
            );

        if (
            !parsed.questions
        ) {
            throw new Error(
                "Questions missing"
            );
        }

        return {
            questions:
                parsed.questions,
            aiProvider:
                "groq",
            aiModel:
                result.model,
        };
    };

/**
 * Chat conversation session completions using user history logs.
 */
const callGroqChat = async (messages) => {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Using Groq Chat model: ${model}`);

      const response = await groq.chat.completions.create({
        model,
        messages,
        temperature: 0.5,
      });

      const content = response?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty Groq response");
      }

      return {
        model,
        content,
      };
    } catch (error) {
      console.error(`Groq Chat model failed: ${model}`);
      console.error(error.message);
      lastError = error;
    }
  }

  throw lastError || new Error("Groq Chat failed");
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export const groqService = {
    generateModuleNotesGroq,
    generateNotesForTopic,
    generateQuizForTopic,
    callGroqChat,
};

export default groqService;