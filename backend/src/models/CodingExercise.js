import mongoose from "mongoose";

const codingExerciseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercises: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
        requirements: [{ type: String }],
        expectedOutput: { type: String, default: "" },
      }
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CodingExercise = mongoose.models.CodingExercise || mongoose.model("CodingExercise", codingExerciseSchema);
export default CodingExercise;
