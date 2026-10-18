import multer from "multer";
import path from "path";
import fs from "fs";

// Create required upload directories locally
const dirs = [
  "uploads",
  "uploads/videos",
  "uploads/resources",
  "uploads/thumbnails"
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Disk Storage
const storage = path.resolve("uploads");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = "uploads/resources";
    
    // Choose destination folder based on input fieldname
    if (file.fieldname === "video") {
      dest = "uploads/videos";
    } else if (file.fieldname === "thumbnail") {
      dest = "uploads/thumbnails";
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional safety validation)
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});
