import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
import { generateOtp } from "../utils/generateOtp.js"; 
import imagekit from "../config/imageKit.js"; 

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role,phone, plan } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Special case: constant admin (no OTP verification)
    if (email === "Selamawitilahun07@gmail.com") {
      const user = await User.create({
        name: name || "Admin", // default name if not provided
        email,
        password: hashedPassword,
        role: "supervisor", // force supervisor role
        subscription: {
          plan: plan || "yearly", // give default or passed plan
          isActive: true, // directly active
        },
        isAccountVerified: true, 
        verifyOtp: null,
        verifyOtpExpireAt: null,
      });

      return res.status(201).json({
        email: user.email,
        role: user.role,
        message: "Supervisor account created successfully (no verification required).",
      });
    }

    // Special case: constant admin (no OTP verification)
    if (email === "yamlaknegash96@gmail.com") {
      const user = await User.create({
        name: name || "Admin", // default name if not provided
        email,
        password: hashedPassword,
        role: "admin", // force admin role
        subscription: {
          plan: plan || "yearly", // give default or passed plan
          isActive: true, // directly active
        },
        isAccountVerified: true, 
        verifyOtp: null,
        verifyOtpExpireAt: null,
      });

      return res.status(201).json({
        email: user.email,
        role: user.role,
        message: "Admin account created successfully (no verification required).",
      });
    }

    // Normal user registration (with OTP)
    const otp = generateOtp();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      subscription: {
        plan,          // store plan but inactive
        isActive: false,
      },
      verifyOtp: otp,
      verifyOtpExpireAt: otpExpire,
    });

    await sendEmail(email, "Verify Your Account", `Your OTP is: ${otp}`);

    res.status(201).json({
      email,
      message: "User registered. Please check your email for OTP.",
    });
  } catch (err) {
    console.error("Registration error: ", err);
    res.status(500).json({ message: err.message });
  }
};



// Verify OTP
export const verifyUserOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAccountVerified)
      return res.status(400).json({ message: "Account already verified" });

    if (user.verifyOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.verifyOtpExpireAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAccountVerified)
      return res.status(400).json({ message: "Account already verified" });

    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendEmail(email, "Resend OTP", `Your new OTP is: ${otp}`);

    res.json({ message: "OTP resent. Please check your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Request password reset OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpireAt = otpExpire;
    await user.save();

    await sendEmail(email, "Reset Your Password", `Your password reset OTP is: ${otp}`);

    res.json({ email, message: "OTP sent to your email for password reset." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.resetOtpExpireAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.json({ message: "Password reset successfully. You can now login with your new password." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isAccountVerified)
      return res.status(401).json({ message: "Please verify your email first" });

    // if (!user.subscription.isActive)
    //   return res.status(401).json({ message: "Please pay your due amount first" });    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      susbscription: user.subscription,
      token: generateToken(user.id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const { file } = req;
    const userId = req.user._id;
    const { name, email } = req.body; // optional fields

    if (!file && !name && !email) {
      return res.status(400).json({ message: "No data provided" });
    }

    let updateData = {};

    // Upload image if file exists
    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${userId}-${Date.now()}`,
        folder: "/users",
      });
      updateData.image = uploadResponse.url;
    }

    // Add name/email if provided
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Update user
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


// Profile (protected)
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // populated by `protect` middleware
    res.json({
      name: user.name,
      email: user.email,
      phone:user.phone,
      role: user.role,
      firstLoginDone: user.firstLoginDone,
      subscription: user.subscription,
      id: user._id,
      isAccountVerified: user.isAccountVerified,
      image:user.image,
      
    });
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  User requests role change
export const requestRoleChange = async (req, res) => {
  try {
    const { requestedRole } = req.body;

    if (!requestedRole || !["admin", "supervisor", "c1", "c2", "intern"].includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role requested" });
    }

    const user = await User.findById(req.user._id); // assume req.user is set by auth middleware
    if (!user) return res.status(404).json({ message: "User not found" });

    // Save request in DB (could be another collection, but here we’ll store in user doc)
    user.roleChangeRequest = {
      role: requestedRole,
      requestedAt: new Date(),
    };

    await user.save();

    res.status(200).json({ message: "Role change request sent to admin", request: user.roleChangeRequest });
  } catch (err) {
    res.status(500).json({ message: "Error requesting role change", error: err.message });
  }
};