import express from "express";
import { Notification } from "../models/notification.model.js";
import { verifyToken } from "../middleware/verifyToken.js"; // adjust path if needed

const router = express.Router();

// GET /api/notifications — fetch all for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    // Shape to match frontend structure
    const shaped = notifications.map((n) => ({
      id:           n._id.toString(),
      type:         n.type,
      read:         n.read,
      time:         n.timestamp,

      // chat
      userId:       n.senderId?.toString(),
      senderName:   n.senderName,
      unreadCount:  n.unreadCount,
      message:      n.message,

      // booking
      rentalId:     n.rentalId?.toString(),
      userName:     n.userName,
      userEmail:    n.userEmail,
      carBrand:     n.carBrand,
      carModel:     n.carModel,
      licensePlate: n.licensePlate,
      totalPrice:   n.totalPrice,
      status:       n.status,
    }));

    res.json({ success: true, notifications: shaped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read — mark one as read
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/read-all — mark all as read
router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/notifications — clear all for current user
router.delete("/", verifyToken, async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;