import express from "express";
import { 
  initiatePayment, 
  paymentCallback, 
  uploadPaymentScreenshot, 
  verifyPayment 
} from "../controllers/paymentController.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ import protect

const router = express.Router();

// POST → initiate payment (after OTP verified)
router.post("/initiate", protect, initiatePayment); // ✅ protected

// POST → upload payment screenshot
router.post("/upload-screenshot", upload.single("screenshot"), uploadPaymentScreenshot); // ✅ protected

// POST → Chapa callback (webhook)
router.post("/callback", paymentCallback);

// GET → verify payment by tx_ref
router.get("/verify/:tx_ref", verifyPayment);

export default router;
