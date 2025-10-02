import express from "express";
import { sendSupportEmail, sendRefinedMessage, getMessages, updateMessageReadStatus } from "../controllers/supportController.js";

const router = express.Router();

// POST /api/support
router.post("/", sendSupportEmail);

// POST /api/support/refined-message
router.post("/refined-message", sendRefinedMessage);

// GET /api/support/messages
router.get("/messages", getMessages);

router.patch('/messages/:id/read', updateMessageReadStatus);

export default router;
