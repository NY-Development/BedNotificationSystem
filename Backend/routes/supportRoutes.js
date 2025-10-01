import express from "express";
import { sendSupportEmail, sendRefinedMessage } from "../controllers/supportController.js";

const router = express.Router();

// POST /api/support
router.post("/", sendSupportEmail);

// POST /api/support/refined-message
router.post("/refined-message", sendRefinedMessage);

export default router;
