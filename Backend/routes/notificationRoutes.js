import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotificationsForUser, getUnreadNotificationCount } from "../controllers/notifyController.js";

const router = express.Router();

router.get("/", protect, getNotificationsForUser);
router.get("/unread/count", protect, getUnreadNotificationCount);

export default router;
