// backend/src/scripts/migrate_resources.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "../models/Resource.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillsync";

const getResourceTypeFromExtension = (filename) => {
  if (!filename) return "other";
  const ext = filename.split('.').pop().toLowerCase();
  
  const mapping = {
    pdf: ["pdf"],
    ppt: ["ppt", "pptx"],
    doc: ["doc", "docx", "rtf", "txt"],
    excel: ["xls", "xlsx", "csv"],
    zip: ["zip", "rar", "7z", "tar", "gz"],
    image: ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"],
    video: ["mp4", "mkv", "avi", "mov", "webm", "flv", "3gp"],
  };

  for (const [type, extensions] of Object.entries(mapping)) {
    if (extensions.includes(ext)) {
      return type;
    }
  }
  return "other";
};

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const resources = await Resource.find();
    console.log(`Found ${resources.length} resources to migrate.`);

    let migratedCount = 0;

    for (const res of resources) {
      let needsMigration = false;
      const updates = {};

      if (!res.title) {
        updates.title = res.fileName || "Resource Item";
        needsMigration = true;
      }
      
      if (res.description === undefined) {
        updates.description = "";
        needsMigration = true;
      }

      if (!res.resourceType || res.resourceType === "other") {
        const detectedType = getResourceTypeFromExtension(res.fileName);
        updates.resourceType = detectedType;
        needsMigration = true;
      }

      if (!res.category) {
        updates.category = "Study Material";
        needsMigration = true;
      }

      if (res.isRequired === undefined) {
        updates.isRequired = false;
        needsMigration = true;
      }

      if (res.isPublished === undefined) {
        updates.isPublished = true;
        needsMigration = true;
      }

      if (res.downloadCount === undefined) {
        updates.downloadCount = 0;
        needsMigration = true;
      }

      if (res.sortOrder === undefined) {
        updates.sortOrder = 0;
        needsMigration = true;
      }

      if (needsMigration) {
        await Resource.findByIdAndUpdate(res._id, updates);
        migratedCount++;
        console.log(`Migrated resource "${res.fileName || res.title || res._id}"`);
      }
    }

    console.log(`Migration completed successfully! Total migrated resources: ${migratedCount}`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
