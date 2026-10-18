// backend/src/scripts/clean_duplicates.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Resource from "../models/Resource.js";
import AINote from "../models/AINote.js";
import AIQuiz from "../models/AIQuiz.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillsync";

async function run() {
  try {
    console.log("Connecting to MongoDB with URI:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses to check.`);

    for (const course of courses) {
      console.log(`Checking course: "${course.title}" (${course._id})`);
      
      const modules = await Module.find({ courseId: course._id });
      
      // Group modules by title
      const groups = {};
      for (const mod of modules) {
        const titleKey = mod.title.trim().toLowerCase();
        if (!groups[titleKey]) {
          groups[titleKey] = [];
        }
        groups[titleKey].push(mod);
      }

      const keptModuleIds = [];

      for (const titleKey of Object.keys(groups)) {
        const mods = groups[titleKey];
        if (mods.length <= 1) {
          keptModuleIds.push(mods[0]._id);
          continue;
        }

        console.log(`  Found ${mods.length} duplicates for module title: "${mods[0].title}"`);
        
        // Sort by version descending (if present), then by createdAt descending to keep the newest
        mods.sort((a, b) => {
          const valA = a.version || 1;
          const valB = b.version || 1;
          if (valB !== valA) return valB - valA;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const primary = mods[0];
        keptModuleIds.push(primary._id);

        const duplicates = mods.slice(1);
        console.log(`  Keeping primary module ID: ${primary._id}`);

        for (const duplicate of duplicates) {
          console.log(`    Processing duplicate module ID: ${duplicate._id}`);
          
          // Re-map Lectures
          const lecRes = await Lecture.updateMany(
            { moduleId: duplicate._id },
            { $set: { moduleId: primary._id } }
          );
          if (lecRes.modifiedCount > 0) {
            console.log(`      Updated ${lecRes.modifiedCount} lectures`);
          }

          // Re-map Resources
          const resRes = await Resource.updateMany(
            { moduleId: duplicate._id },
            { $set: { moduleId: primary._id } }
          );
          if (resRes.modifiedCount > 0) {
            console.log(`      Updated ${resRes.modifiedCount} resources`);
          }

          // Re-map AI Notes
          const notesRes = await AINote.updateMany(
            { $or: [{ moduleId: duplicate._id }, { module: duplicate._id }] },
            { $set: { moduleId: primary._id, module: primary._id } }
          );
          if (notesRes.modifiedCount > 0) {
            console.log(`      Updated ${notesRes.modifiedCount} AI notes`);
          }

          // Re-map AI Quizzes
          const quizRes = await AIQuiz.updateMany(
            { moduleId: duplicate._id },
            { $set: { moduleId: primary._id } }
          );
          if (quizRes.modifiedCount > 0) {
            console.log(`      Updated ${quizRes.modifiedCount} AI quizzes`);
          }

          // Delete the duplicate module
          await Module.deleteOne({ _id: duplicate._id });
          console.log(`      Deleted duplicate module ${duplicate._id}`);
        }
      }

      // Sync course modules list
      course.modules = keptModuleIds;
      await course.save();
      console.log(`  Synced modules list for course "${course.title}"`);
    }

    console.log("Consolidation migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
