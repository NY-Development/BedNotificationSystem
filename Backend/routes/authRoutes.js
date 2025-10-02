import express from "express";
import { registerUser, loginUser, getProfile, verifyUserOtp, resendOtp, forgotPassword, resetPassword, uploadProfileImage, requestRoleChange } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/verify-otp", verifyUserOtp);
router.get("/profile", protect, getProfile);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/request-role-change", protect, requestRoleChange);

router.post("/upload-image", protect, upload.single("image"), uploadProfileImage);


// Example RBAC: only admins can list all users
import User from "../models/User.js";
router.get("/all", protect, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
