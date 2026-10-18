import Notification from "../models/Notification.js";

// GET /api/admin/notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientRole: "admin", status: "unread" })
      .populate("sender", "fullName email avatar")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/notifications/:id/read
export const readAdminNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: "read", readAt: new Date() },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/notifications/read-all
export const readAllAdminNotifications = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientRole: "admin", status: "unread" },
      { status: "read", readAt: new Date() }
    );
    res.status(200).json({ message: "All admin notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teacher/notifications
export const getTeacherNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientUser: req.user.id })
      .populate("sender", "fullName email avatar")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/teacher/notifications/:id/read
export const readTeacherNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: "read", readAt: new Date() },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
