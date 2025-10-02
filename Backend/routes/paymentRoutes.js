import express from "express";
import { initiatePayment, paymentCallback, uploadPaymentScreenshot, verifyPayment } from "../controllers/paymentController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// POST → initiate payment (after OTP verified)
router.post("/initiate", initiatePayment);

// POST → upload payment screenshot
router.post("/upload-screenshot", upload.single("screenshot"), uploadPaymentScreenshot);


// POST → Chapa callback (webhook)
router.post("/callback", paymentCallback);

router.get("/verify/:tx_ref", verifyPayment);

export default router;