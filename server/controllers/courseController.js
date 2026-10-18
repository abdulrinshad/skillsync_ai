const Course = require("../models/courseModel");


// CREATE COURSE
exports.createCourse = async (req, res) => {

    try {

        const { title, description, thumbnail } = req.body;

        const course = await Course.create({

            title,
            description,
            thumbnail,
            instructor: req.user._id

        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getAllCourses = async (req, res) => {

    try {

        const courses = await Course.find()
        .populate("instructor","name email");

        res.status(200).json(courses);

    } catch (error) {

        res.status(500).json({
            message:error.message
        });

    }

};