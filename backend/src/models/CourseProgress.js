import mongoose from "mongoose";

const moduleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  completedLectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  watchedPercentage: {
    type: Map,
    of: Number,
    default: {},
  },
  completedResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  lectureCompleted: {
    type: Boolean,
    default: false,
  },
  resourceCompleted: {
    type: Boolean,
    default: false,
  },
  notesCompleted: {
    type: Boolean,
    default: false,
  },
  quizCompleted: {
    type: Boolean,
    default: false,
  },
  quizScore: {
    type: Number,
    default: 0,
  },
  progressPercentage: {
    type: Number,
    default: 0,
  },
  lastLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  },
  currentSecond: {
    type: Number,
    default: 0,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

const courseProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    moduleProgress: [moduleProgressSchema],
    totalProgress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    certificateEligible: {
      type: Boolean,
      default: false,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseProgressSchema.pre("save", async function () {
  try {
    const Module = mongoose.model("Module");
    const Lecture = mongoose.model("Lecture");
    const Resource = mongoose.model("Resource");

    // Fetch published modules for the course
    const modules = await Module.find({ courseId: this.courseId, published: true });
    if (modules.length === 0) {
      this.totalProgress = 0;
      return;
    }

    let totalModuleProgressSum = 0;

    // We make sure every published module is represented in moduleProgress
    for (const mod of modules) {
      let modProg = this.moduleProgress.find(m => m.moduleId.toString() === mod._id.toString());
      if (!modProg) {
        this.moduleProgress.push({
          moduleId: mod._id,
          completedLectures: [],
          watchedPercentage: {},
          completedResources: [],
          lectureCompleted: false,
          resourceCompleted: false,
          notesCompleted: false,
          quizCompleted: false,
          quizScore: 0,
          progressPercentage: 0,
        });
        modProg = this.moduleProgress[this.moduleProgress.length - 1];
      }

      // Calculate Lecture progress (40%)
      const lectures = await Lecture.find({ moduleId: mod._id });
      const totalLecs = lectures.length;
      const completedLecs = modProg.completedLectures.length;
      let lectureProgress = totalLecs > 0 ? (completedLecs / totalLecs) * 40 : 40;
      if (modProg.lectureCompleted) {
        lectureProgress = 40;
      }

      // Calculate Resource progress (20%)
      const resources = await Resource.find({ moduleId: mod._id });
      const totalRes = resources.length;
      const completedRes = (modProg.completedResources || []).length;
      let resourceProgress = totalRes > 0 ? (completedRes / totalRes) * 20 : 20;
      if (modProg.resourceCompleted) {
        resourceProgress = 20;
      }

      // Notes (20%)
      const notesProgress = modProg.notesCompleted ? 20 : 0;

      // Quiz (20%)
      const quizProgress = modProg.quizCompleted ? 20 : 0;

      const modPercentage = Math.min(100, Math.round(lectureProgress + resourceProgress + notesProgress + quizProgress));
      modProg.progressPercentage = modPercentage;

      if (modPercentage === 100 && !modProg.completedAt) {
        modProg.completedAt = new Date();
      }

      totalModuleProgressSum += modPercentage;
    }

    // Course progress
    this.totalProgress = Math.min(100, Math.round(totalModuleProgressSum / modules.length));

    if (this.totalProgress === 100) {
      this.certificateEligible = true;
      if (!this.completed) {
        this.completed = true;
      }
    } else {
      this.certificateEligible = false;
      this.completed = false;
    }

    // Sync with Enrollment record
    try {
      const Enrollment = mongoose.model("Enrollment");
      const enrollment = await Enrollment.findOne({ studentId: this.studentId, courseId: this.courseId });
      if (enrollment) {
        enrollment.progress = this.totalProgress;
        if (this.totalProgress === 100) {
          enrollment.completed = true;
          enrollment.status = "completed";
          enrollment.completedAt = new Date();
        } else {
          enrollment.completed = false;
          enrollment.status = "enrolled";
        }
        await enrollment.save();
      }
    } catch (err) {
      console.error("Failed to sync enrollment progress:", err);
    }
  } catch (err) {
    throw err;
  }
});

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
