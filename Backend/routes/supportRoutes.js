import express from "express";
import { sendSupportEmail, sendRefinedMessage, getMessages } from "../controllers/supportController.js";

const router = express.Router();

// POST /api/support
router.post("/", sendSupportEmail);

// POST /api/support/refined-message
router.post("/refined-message", sendRefinedMessage);

// GET /api/support/messages
router.get("/messages", getMessages);

export default router;
