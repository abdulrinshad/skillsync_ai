import Cart from "../models/Cart.js";
import Course from "../models/course.js"; // note: lower-case course.js matches lowercase file in models
import Enrollment from "../models/Enrollment.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items.courseId",
      populate: {
        path: "teacherId",
        select: "fullName email",
      },
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  console.log("================================");
  console.log("ADD TO CART");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);
  console.log("TOKEN ID:", req.user?.id);
  console.log("TOKEN ROLE:", req.user?.role);

  try {
    const { courseId } = req.body;
    console.log("COURSE ID:", courseId);

    if (!courseId) {
      return res.status(400).json({
        message: "courseId missing"
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    console.log("COURSE:", course);

    if (!course) {
      return res.status(400).json({
        message: "Course not found"
      });
    }

    // Verify role
    console.log("ROLE:", req.user?.role);
    if (req.user?.role !== "student") {
      return res.status(400).json({
        message: "Only students can add to cart"
      });
    }

    // Get user's cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Verify duplicate check
    const exists = cart.items.find(item => item.courseId.toString() === courseId);
    console.log("EXISTING:", exists);
    if (exists) {
      return res.status(400).json({
        message: "Course already in cart"
      });
    }

    cart.items.push({
      courseId,
      price: course.price || 0,
    });

    // Wrap save operation
    try {
      await cart.save();
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }

    // Populate and return updated cart
    await cart.populate({
      path: "items.courseId",
      populate: {
        path: "teacherId",
        select: "fullName email",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course added to cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.courseId.toString() !== courseId);
    await cart.save();

    await cart.populate({
      path: "items.courseId",
      populate: {
        path: "teacherId",
        select: "fullName email",
      },
    });

    res.status(200).json({ message: "Removed from cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
