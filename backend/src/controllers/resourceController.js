import Resource from "../models/Resource.js";
import Module from "../models/Module.js";
import Course from "../models/course.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";

// Helper check to verify ownership
const verifyOwnership = async (user, courseId) => {
  if (user.role === "admin") return true;
  const course = await Course.findById(courseId);
  if (!course) return false;
  return course.teacherId.toString() === user.id;
};

// Checks if the course is locked and updates status to draft on edits
const checkCourseLock = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  
  if (course.approvalStatus === "pending_review") {
    throw new Error("Course curriculum is locked pending review. You cannot make modifications at this time.");
  }

  if (course.approvalStatus === "published") {
    course.approvalStatus = "draft";
    await course.save();
  } else if (course.approvalStatus !== "draft") {
    course.approvalStatus = "draft";
    await course.save();
  }
  return course;
};

// Triggers admin notification and audit logging
const triggerNotificationAndLog = async ({
  userId,
  userRole,
  courseId,
  moduleId,
  type,
  title,
  message,
}) => {
  await Notification.create({
    recipientRole: "admin",
    sender: userId,
    senderRole: userRole,
    course: courseId,
    module: moduleId,
    type,
    title,
    message,
    status: "unread",
  });

  await AuditLog.create({
    userId,
    userRole,
    courseId,
    moduleId,
    action: type,
    details: message,
  });
};

const flagPendingChanges = async (moduleId, teacherId) => {
  try {
    const moduleItem = await Module.findById(moduleId);
    if (moduleItem) {
      const course = await Course.findById(moduleItem.courseId);
      if (course) {
        course.submittedForReview = true;
        await course.save();

        await Notification.create({
          recipientRole: "admin",
          sender: teacherId,
          senderRole: "teacher",
          course: course._id,
          courseId: course._id,
          module: moduleItem._id,
          moduleId: moduleItem._id,
          teacherId: teacherId,
          type: "module_update",
          title: "Curriculum Updated",
          message: "Teacher updated course curriculum",
          priority: "medium",
          status: "unread",
          read: false,
        });
      }
    }
  } catch (err) {
    console.error("flagPendingChanges failed:", err);
  }
};

// Map file extension to resourceType
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

// ==========================================
// CONTROLLER EXPORTS
// ==========================================

export const uploadResource = async (req, res) => {
  try {
    const { moduleId, title, description, category, resourceType, externalLink, isRequired } = req.body;
    
    if (!moduleId) {
      return res.status(400).json({ message: "moduleId is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Resource Title is required" });
    }

    const moduleItem = await Module.findById(moduleId);
    if (!moduleItem) return res.status(404).json({ message: "Module not found" });

    const course = await Course.findById(moduleItem.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, moduleItem.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(moduleItem.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    let fileData = {
      fileName: "",
      fileUrl: "",
      fileSize: "0 Bytes",
      fileExtension: "",
      resourceType: resourceType || "other",
    };

    if (req.file) {
      fileData.fileName = req.file.originalname;
      fileData.fileUrl = `/uploads/resources/${req.file.filename}`;
      fileData.fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      fileData.fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      
      if (!resourceType || resourceType === "other" || resourceType === "link") {
        fileData.resourceType = getResourceTypeFromExtension(req.file.originalname);
      }
    } else if (externalLink) {
      fileData.resourceType = "link";
      fileData.fileUrl = externalLink;
    } else {
      return res.status(400).json({ message: "Either a file upload or an external link is required" });
    }

    // Determine sortOrder by counting existing resources in this module
    const currentCount = await Resource.countDocuments({ moduleId });

    const resource = await Resource.create({
      courseId: moduleItem.courseId,
      moduleId,
      teacherId: req.user.id,
      title,
      description: description || "",
      resourceType: fileData.resourceType,
      category: category || "Study Material",
      fileName: fileData.fileName,
      fileUrl: fileData.fileUrl,
      fileSize: fileData.fileSize,
      fileExtension: fileData.fileExtension,
      isRequired: isRequired === "true" || isRequired === true,
      sortOrder: currentCount,
      approvalStatus: "pending_review",
      status: "pending",
    });

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: moduleId,
      type: "RESOURCE_UPLOADED",
      title: "Study Material Uploaded",
      message: `Teacher uploaded a resource "${title}" in module "${moduleItem.title}" of course "${course.title}"`,
    });

    await flagPendingChanges(moduleId, req.user.id);

    res.status(201).json({ success: true, message: "Resource uploaded successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { title, description, category, resourceType, externalLink, isRequired, sortOrder } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const isOwner = await verifyOwnership(req.user, resource.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(resource.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (resourceType !== undefined) updates.resourceType = resourceType;
    if (externalLink !== undefined) {
      updates.externalLink = externalLink;
      if (resource.resourceType === "link" || resourceType === "link") {
        updates.fileUrl = externalLink;
      }
    }
    if (isRequired !== undefined) updates.isRequired = isRequired;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    updates.status = "pending";
    updates.approvalStatus = "pending_review";

    const updatedResource = await Resource.findByIdAndUpdate(resourceId, updates, { new: true });

    await flagPendingChanges(resource.moduleId, req.user.id);

    res.status(200).json({ success: true, message: "Resource updated successfully", resource: updatedResource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const course = await Course.findById(resource.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = await verifyOwnership(req.user, resource.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(resource.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    await Resource.findByIdAndDelete(resourceId);

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: course._id,
      moduleId: resource.moduleId,
      type: "RESOURCE_DELETED",
      title: "Resource Deleted",
      message: `Teacher deleted resource "${resource.title}" from course "${course.title}"`,
    });

    await flagPendingChanges(resource.moduleId, req.user.id);

    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleResources = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const resources = await Resource.find({ moduleId }).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderResources = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds array is required" });
    }

    if (orderedIds.length === 0) {
      return res.status(200).json({ success: true, message: "No resources to reorder" });
    }

    const firstResource = await Resource.findById(orderedIds[0]);
    if (!firstResource) return res.status(404).json({ message: "Resource not found" });

    const isOwner = await verifyOwnership(req.user, firstResource.courseId);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized access" });

    try {
      await checkCourseLock(firstResource.courseId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    await Promise.all(
      orderedIds.map((id, index) => Resource.findByIdAndUpdate(id, { sortOrder: index }))
    );

    await flagPendingChanges(firstResource.moduleId, req.user.id);

    res.status(200).json({ success: true, message: "Resources reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackDownload = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findByIdAndUpdate(resourceId, { $inc: { downloadCount: 1 } }, { new: true });
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    res.status(200).json({ success: true, downloadCount: resource.downloadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentModuleResources = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const resources = await Resource.find({ moduleId, status: "approved" }).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "pending" })
      .populate("moduleId", "title")
      .populate("courseId", "title")
      .populate("teacherId", "name email");
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    console.log("Before:", resource);
    resource.status = "approved";
    resource.approvalStatus = "published"; // Keep backward compatibility & visibility
    resource.approvedBy = req.user.id;
    resource.approvedAt = new Date();
    resource.rejectionReason = "";
    console.log("After:", resource);
    await resource.save();
    console.log("Saved:", await Resource.findById(resource._id));

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: resource.courseId,
      moduleId: resource.moduleId,
      type: "RESOURCE_APPROVED",
      title: "Resource Approved",
      message: `Admin approved resource "${resource.title}"`,
    });

    res.status(200).json({ success: true, message: "Resource approved successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { rejectionReason } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    console.log("Before reject:", resource);
    resource.status = "rejected";
    resource.approvalStatus = "rejected"; // Keep backward compatibility
    resource.rejectionReason = rejectionReason || "";
    console.log("After reject:", resource);
    await resource.save();
    console.log("Saved reject:", await Resource.findById(resource._id));

    await triggerNotificationAndLog({
      userId: req.user.id,
      userRole: req.user.role,
      courseId: resource.courseId,
      moduleId: resource.moduleId,
      type: "RESOURCE_REJECTED",
      title: "Resource Rejected",
      message: `Admin rejected resource "${resource.title}". Reason: ${rejectionReason || "None"}`,
    });

    res.status(200).json({ success: true, message: "Resource rejected successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
