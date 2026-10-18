import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    // Check completion
    if (!enrollment.completed) {
      return res.status(400).json({
        message: "Course not completed yet",
      });
    }

    // Check existing certificate
    const existingCertificate =
      await Certificate.findOne({
        studentId: req.user.id,
        courseId,
      });

    if (existingCertificate) {
      return res.status(400).json({
        message: "Certificate already generated",
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      studentId: req.user.id,
      courseId,
      certificateId: `CERT-${Date.now()}`,
    });

    // Award XP
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          xp: 100,
        },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyCertificates = async (
  req,
  res
) => {
  try {
    const certificates =
      await Certificate.find({
        studentId: req.user.id,
      })
        .populate(
          "courseId",
          "title category level"
        )
        .populate(
          "studentId",
          "fullName email"
        );

    res.status(200).json({
      count: certificates.length,
      certificates,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId })
      .populate("studentId", "fullName email")
      .populate({
        path: "courseId",
        populate: {
          path: "teacherId",
          select: "fullName email",
        },
      });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: "Certificate not found or invalid",
      });
    }

    res.status(200).json({
      valid: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};