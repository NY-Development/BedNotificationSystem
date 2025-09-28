import Notification from "../models/Notification.js";

export const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("from", "name email image") // bring sender info
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    res.json({ count: unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Get the notification ID from the URL
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Ensure the user is authorized to read this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to read this notification" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};