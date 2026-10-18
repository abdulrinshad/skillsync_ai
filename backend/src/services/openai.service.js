import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const openaiService = {
  generateNotesAndQuiz: async (moduleData, topicsList) => {
    const { title, description, learningOutcomes } = moduleData;
    const topicsString = topicsList.map((t) => t.title).join(", ");
    const outcomesString = (learningOutcomes || []).join(", ");

    const systemPrompt = `You are a university computer science professor, a senior software engineer, a technical interviewer, and a curriculum designer.
Your job is to teach software engineering concepts. You must generate factual educational content.
Do not generate generic explanations or placeholder definitions.

For EACH topic, you must generate exactly this structure:
- Definition: A precise, professional computer science definition of the topic in 2-4 lines.
- Key Points: Generate 5-7 important bullet points about the topic.
- Detailed Explanation: A concise explanation (100-150 words) explaining: What it is, Why it exists, How it works, and Where it is used.
- Example: Provide syntax, architecture diagram explanation, comparison table, or code examples illustrating the topic.
- Real World Example: Provide one actual industry/company example (e.g. MongoDB -> Netflix, Redis -> Twitter/X, React -> Facebook, Node.js -> PayPal).
- Advantages: Generate 3-5 practical advantages.
- Disadvantages: Generate 2-4 practical disadvantages.
- Interview Questions: Generate exactly 3 interview questions with detailed answers.
- Revision Notes: Generate 5 short revision points.
- Important Points: Generate 5 important exam/interview points.

HARD RESTRICTIONS:
You must NEVER use the following generic filler phrases:
- "This is a core software engineering concept"
- "fundamental enterprise construct"
- "core architecture pattern"
- "high throughput"
- "enterprise reliability"
- "decoupled execution"
- "modular dependency path"
- "critical runtime condition"
- "event driven listeners"
- "system cohesion"
- "Enterprise standard"
- "Fundamental architecture"
- "Industry best practice"
- "Improves scalability"
- "Architectural pattern"

You must return ONLY a valid JSON object matching the JSON schema below. Do not wrap the JSON output in markdown code blocks like \`\`\`json. Output ONLY valid JSON.

JSON SCHEMA:
{
  "chapters": [
    {
      "topic": "Exact Topic Title from the list: [${topicsString}]",
      "definition": "A precise definition.",
      "keyPoints": [
        "Key point 1",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5",
        "Key point 6"
      ],
      "detailedExplanation": "Concise detailed explanation of 100-150 words.",
      "example": "Practical syntax, table, or code snippet.",
      "realWorldExample": "Actual company use case at scale.",
      "advantages": [
        "Advantage 1",
        "Advantage 2",
        "Advantage 3"
      ],
      "disadvantages": [
        "Disadvantage 1",
        "Disadvantage 2"
      ],
      "interviewQuestions": [
        "Q1. Question text?\\nAnswer: Detailed answer...",
        "Q2. Question text?\\nAnswer: Detailed answer...",
        "Q3. Question text?\\nAnswer: Detailed answer..."
      ],
      "revisionNotes": [
        "Short point 1",
        "Short point 2",
        "Short point 3",
        "Short point 4",
        "Short point 5"
      ],
      "importantPoints": [
        "Important exam point 1",
        "Important exam point 2",
        "Important exam point 3",
        "Important exam point 4",
        "Important exam point 5"
      ]
    }
  ],
  "quiz": {
    "mcq": [
      {
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Exact matching string of the correct option",
        "explanation": "Detailed explanation of why this answer is correct."
      }
    ],
    "trueFalse": [
      {
        "question": "Question text?",
        "answer": "True or False",
        "explanation": "Detailed explanation."
      }
    ],
    "fillBlank": [
      {
        "question": "Question text?",
        "answer": "Expected fill-in-the-blank word or phrase",
        "explanation": "Detailed explanation."
      }
    ],
    "shortAnswer": [
      {
        "question": "Question text?",
        "answer": "Model short answer explaining the concept.",
        "explanation": "Detailed explanation."
      }
    ],
    "scenario": [
      {
        "question": "Scenario description and question?",
        "answer": "Detailed solution or analysis for the scenario.",
        "explanation": "Detailed explanation."
      }
    ],
    "coding": [
      {
        "question": "Coding problem description?",
        "expectedOutput": "Expected stdout or return value",
        "solution": "Clean, functional code solution"
      }
    ]
  }
}

Generate exactly:
- 10 MCQ questions
- 5 True/False questions
- 5 Fill in the Blank questions
- 5 Short Answer questions
- 5 Scenario questions
- 3 Coding questions`;

    if (!openai) {
      console.warn("OPENAI_API_KEY is not defined. Falling back to simulated fallback.");
      return simulateOpenAIFallback(topicsList);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: systemPrompt }],
        response_format: { type: "json_object" },
      });

      const rawText = response.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("Empty OpenAI response");

      return JSON.parse(rawText.trim());
    } catch (error) {
      console.error("OpenAI notes & quiz generation failed, using fallback:", error);
      return simulateOpenAIFallback(topicsList);
    }
  }
};

/**
 * Simulates high-quality notes and quiz fallback.
 */
function simulateOpenAIFallback(topicsList) {
  const catalog = {
    "What is MongoDB": {
      definition: "MongoDB is a source-available, cross-platform, document-oriented NoSQL database program developed by MongoDB Inc. It uses JSON-like documents with optional schemas for data representation.",
      keyPoints: [
        "NoSQL document-oriented architecture",
        "BSON (Binary JSON) storage format",
        "Dynamic, flexible schema design",
        "Horizontal scaling via automatic sharding",
        "Built-in replica sets for high availability",
        "Secondary indexing capabilities on any field"
      ],
      detailedExplanation: "MongoDB is a document-oriented database designed to store large volumes of structured and unstructured data. Instead of utilizing relational tables and rows, MongoDB groups data records into BSON documents inside collections. It exists to address the rigid schema limitations of SQL databases. It works by converting JSON payloads from application code into serialized BSON bytes on disk. This document model maps naturally to objects in modern object-oriented programming languages. It is heavily used in content management systems, real-time web analytics platforms, and user profile repositories.",
      example: `// Insert document with embedded array
db.users.insertOne({
  name: "Alice Smith",
  email: "alice@example.com",
  skills: ["JavaScript", "MongoDB"],
  status: "active"
})`,
      realWorldExample: "Netflix uses MongoDB to store and manage user account metadata, catalog configuration, and personalized viewing histories globally.",
      advantages: [
        "Flexible document structure handles unstructured data easily",
        "Horizontal scaling is simple to configure via sharding keys",
        "Native BSON storage supports nesting and arrays natively"
      ],
      disadvantages: [
        "Higher memory consumption due to active document caching",
        "No support for complex SQL-style multi-document join operations"
      ],
      interviewQuestions: [
        "Q1. What type of database is MongoDB?\nAnswer: MongoDB is a NoSQL document database that stores data in BSON format.",
        "Q2. Why is MongoDB called schema-less?\nAnswer: Because collections do not enforce a fixed structure, allowing documents within the same collection to have different fields.",
        "Q3. What is BSON?\nAnswer: BSON is the binary representation of JSON used internally by MongoDB to store documents and build indexes."
      ],
      revisionNotes: [
        "NoSQL Document Store",
        "BSON Storage Format",
        "Dynamic Schema",
        "Sharding for Scaling",
        "Replica Sets Availability"
      ],
      importantPoints: [
        "Documents are grouped inside collections, resembling RDBMS tables.",
        "The _id field is the default primary key, usually a 12-byte ObjectId.",
        "Sharding distributes data across shards using a partition key.",
        "Replica sets consist of primary and secondary nodes for automatic failover.",
        "MongoDB supports ACID transactions across multiple documents since version 4.0."
      ]
    },
    "SQL vs NoSQL": {
      definition: "SQL vs NoSQL compares Relational Database Management Systems (RDBMS) that use structured query language and tables, against Non-Relational databases that store unstructured or semi-structured data.",
      keyPoints: [
        "SQL uses tabular tables with fixed columns and rows",
        "NoSQL uses key-value, document, wide-column, or graph models",
        "SQL scales vertically by adding hardware power to one server",
        "NoSQL scales horizontally by adding more servers to a cluster",
        "SQL enforces strict ACID compliance",
        "NoSQL databases favor eventual consistency and high availability"
      ],
      detailedExplanation: "SQL vs NoSQL highlights the technical choice between relational and non-relational database architectures. SQL databases use schema-defined tables where every row must follow a strict layout. They exist to guarantee ACID compliance for transactions. NoSQL databases exist to handle massive data volumes and rapid schema changes. NoSQL works by eliminating relation constraints, using denormalized data formats. They are typically used in financial ledgers (SQL) versus social networking feeds and high-speed telemetry collection (NoSQL).",
      example: `| SQL (Relational Table) | NoSQL (Document)       |
|------------------------|-------------------------|
| Fixed columns/schema   | Flexible BSON/JSON      |
| Joins link tables      | Embedded documents      |
| Vertically scaled      | Horizontally sharded    |`,
      realWorldExample: "Uber uses PostgreSQL (SQL) for managing core trip transaction records, but utilizes Cassandra (NoSQL) for high-throughput vehicle location tracking.",
      advantages: [
        "SQL ensures absolute transactional consistency (ACID)",
        "NoSQL databases scale horizontally to handle massive traffic spikes",
        "NoSQL allows rapid iterations due to schema-less structures"
      ],
      disadvantages: [
        "SQL horizontal scaling requires complex database replication setups",
        "NoSQL queries lack standard support for multi-table relationships"
      ],
      interviewQuestions: [
        "Q1. Difference between SQL and NoSQL?\nAnswer: SQL is relational and table-based with rigid schemas. NoSQL is non-relational, schema-less, and document or key-value based.",
        "Q2. What is vertical scaling vs horizontal scaling?\nAnswer: Vertical scaling adds more CPU/RAM to a single machine. Horizontal scaling adds more machines to a cluster.",
        "Q3. When should you choose SQL over NoSQL?\nAnswer: Choose SQL when transactional consistency is critical and the data schema is highly relational and stable."
      ],
      revisionNotes: [
        "Relational vs Non-Relational",
        "Tables vs Documents",
        "Vertical vs Horizontal Scale",
        "ACID vs BASE consistency",
        "Fixed vs Dynamic Schema"
      ],
      importantPoints: [
        "SQL databases require migrations to change table definitions.",
        "NoSQL databases partition data using hash algorithms for horizontal scaling.",
        "ACID ensures Atomicity, Consistency, Isolation, and Durability.",
        "BASE stands for Basically Available, Soft state, and Eventual consistency.",
        "Document, Key-Value, Graph, and Wide-Column are the 4 main NoSQL types."
      ]
    }
  };

  const chapters = topicsList.map((t, index) => {
    const key = Object.keys(catalog).find(k => t.title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(t.title.toLowerCase()));
    const data = catalog[key] || {
      definition: `${t.title} represents a technical mechanism and operational routine implemented in software applications.`,
      keyPoints: [
        `Defines the technical behavior of ${t.title}`,
        `Establishes the communication layer for execution`,
        `Ensures predictable inputs and outputs`,
        `Structures data to match runtime environments`,
        `Enforces parameters during code compiling`,
        `Facilitates integration testing routines`
      ],
      detailedExplanation: `${t.title} is a software technique. It exists to solve data management and transfer tasks in application layers. It works by establishing standard endpoints and function parameters, processing data records sequentially. It is typically used in backend services, cloud deployment stacks, and server orchestration contexts to ensure operational correctness.`,
      example: `// Example structure for ${t.title}
function initModule() {
  console.log("${t.title} successfully configured");
}`,
      realWorldExample: `A web application uses ${t.title} to manage internal telemetry data processing.`,
      advantages: [
        "Provides predictable data structures",
        "Minimizes manual configuration steps",
        "Supports validation during execution"
      ],
      disadvantages: [
        "Adds initial development configuration time",
        "Increases logging overhead under high transaction rates"
      ],
      interviewQuestions: [
        `Q1. What is the purpose of ${t.title}?\nAnswer: It defines the schema and execution behavior of the component.`,
        `Q2. Explain one design benefit of ${t.title}.\nAnswer: It separates business routines from storage operations.`,
        `Q3. How is error handling handled in ${t.title}?\nAnswer: Through standardized exception blocks catching unexpected inputs.`
      ],
      revisionNotes: [
        `${t.title} Setup`,
        "Factual Definition",
        "Component Logic",
        "Integration Flow",
        "Test Validation"
      ],
      importantPoints: [
        "Point 1: Handles data representation in memory.",
        "Point 2: Requires explicit declaration of parameters.",
        "Point 3: Validation steps verify input arguments.",
        "Point 4: Logging blocks trace execution execution.",
        "Point 5: Clears variables after memory lifecycle completion."
      ]
    };

    return {
      topic: t.title,
      chapterNo: index + 1,
      definition: data.definition,
      keyPoints: data.keyPoints,
      detailedExplanation: data.detailedExplanation,
      example: data.example,
      realWorldExample: data.realWorldExample,
      advantages: data.advantages,
      disadvantages: data.disadvantages,
      interviewQuestions: data.interviewQuestions,
      revisionNotes: data.revisionNotes,
      importantPoints: data.importantPoints
    };
  });

  // Simulated Quiz containing 10 MCQs, 5 TF, 5 FillBlank, 5 ShortAnswer, 5 Scenario, and 3 Coding
  const mcq = Array.from({ length: 10 }).map((_, i) => ({
    question: `MCQ Question ${i + 1} on MongoDB: What is the primary format used by MongoDB to store data?`,
    options: ["JSON", "XML", "BSON", "YAML"],
    answer: "BSON",
    explanation: "MongoDB stores data internally as binary JSON (BSON) documents."
  }));

  const trueFalse = Array.from({ length: 5 }).map((_, i) => ({
    question: `True/False Question ${i + 1}: MongoDB does not support secondary indexes.`,
    answer: "False",
    explanation: "MongoDB supports a rich set of secondary indexes on any field in a document."
  }));

  const fillBlank = Array.from({ length: 5 }).map((_, i) => ({
    question: `Fill in the Blank Question ${i + 1}: In MongoDB, documents are grouped together inside ___________.`,
    answer: "collections",
    explanation: "Documents are stored in collections, which are analogous to tables in SQL databases."
  }));

  const shortAnswer = Array.from({ length: 5 }).map((_, i) => ({
    question: `Short Answer Question ${i + 1}: What is the purpose of the ObjectID field?`,
    answer: "ObjectID is a unique 12-byte identifier automatically generated for every document.",
    explanation: "It serves as the default primary key (_id) of documents."
  }));

  const scenario = Array.from({ length: 5 }).map((_, i) => ({
    question: `Scenario Question ${i + 1}: An application has heavily read-skewed data that needs to be distributed across servers. Suggest the sharding key strategy.`,
    answer: "Use hashed sharding on a high-cardinality read key to distribute read traffic evenly.",
    explanation: "Hashed sharding ensures even distribution, preventing hotspots."
  }));

  const coding = Array.from({ length: 3 }).map((_, i) => ({
    question: `Coding Question ${i + 1}: Write a query to find all users where status is 'active' and sort by age descending.`,
    expectedOutput: "[ { name: 'Alice', age: 30, status: 'active' }, ... ]",
    solution: "db.users.find({ status: 'active' }).sort({ age: -1 })"
  }));

  return {
    chapters,
    quiz: {
      mcq,
      trueFalse,
      fillBlank,
      shortAnswer,
      scenario,
      coding
    }
  };
}
