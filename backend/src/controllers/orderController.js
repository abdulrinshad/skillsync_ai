import Order from "../models/Order.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const { courses, totalAmount, paymentStatus } = req.body;

    if (!courses || courses.length === 0) {
      return res.status(400).json({ message: "No courses provided for order" });
    }

    // Role check
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can purchase courses" });
    }

    // Verify all courses exist, are approved, and are published
    for (const courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: `Course not found: ${courseId}` });
      }
      if (course.approvalStatus !== "approved" || course.status !== "published") {
        return res.status(400).json({ message: `Course is not available: ${course.title}` });
      }
      // Check already enrolled
      const enrolled = await Enrollment.findOne({ studentId: req.user.id, courseId });
      if (enrolled) {
        return res.status(400).json({ message: `You are already enrolled in: ${course.title}` });
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      courses,
      totalAmount: totalAmount || 0,
      paymentMethod: "razorpay",
      paymentStatus: paymentStatus || "pending",
      orderStatus: paymentStatus === "paid" ? "completed" : "pending",
    });

    // If order was successfully paid, create enrollments and clear cart
    if (paymentStatus === "paid") {
      for (const courseId of courses) {
        await Enrollment.create({
          studentId: req.user.id,
          courseId,
          status: "active",
        });

        // Increment student count
        await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      }

      // Clear the student's cart
      const cart = await Cart.findOne({ userId: req.user.id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    }

    res.status(201).json({
      message: "Order processed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("courses", "title thumbnail price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("courses", "title thumbnail price")
      .populate("userId", "fullName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Access control
    if (order.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access to order details" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
