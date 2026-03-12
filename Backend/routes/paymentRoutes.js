import express from "express";
import { 
  aiPaymentCallback,
  initiateAIPayment,
  initiatePayment, 
  paymentCallback, 
  uploadAIScreenshot, 
  uploadPaymentScreenshot, 
  verifyPayment 
} from "../controllers/paymentController.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ import protect

const router = express.Router();

// POST → initiate payment (after OTP verified)
router.post("/initiate", initiatePayment); // ✅ Removed protected cause won't work if not.

// POST → upload payment screenshot
router.post("/upload-screenshot", upload.single("screenshot"), uploadPaymentScreenshot); // ✅ protected

// POST → Chapa callback (webhook)
router.post("/callback", paymentCallback);

// GET → verify payment by tx_ref
router.get("/verify/:tx_ref", verifyPayment);


// AI Specific Payment Routes
router.post("/ai/initiate", initiateAIPayment);
// Example backend route
router.post(
  "/ai/upload-screenshot", 
  protect, 
  upload.single("screenshot"), // <--- Ensure this matches 'screenshot'
  uploadAIScreenshot
);
router.post("/ai-callback", aiPaymentCallback);

export default router;
