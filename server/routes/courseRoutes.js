const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createCourse,
    getAllCourses
} = require("../controllers/courseController");


// CREATE COURSE
router.post("/create", protect, createCourse);


// GET ALL COURSES
router.get("/", getAllCourses);


module.exports = router;