import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "supervisor", "c1", "c2", "intern"],
      default: "c1",
    },
    phone: { type: String, required: true },
    firstLoginDone: { type: Boolean, default: false },

    // --- PLATFORM SUBSCRIPTION (Entry Access) ---
    subscription: {
      plan: { type: String, enum: ["weekly", "monthly", "yearly"], default: "weekly" },
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      amountPaid: { type: Number }, 
      paidAt: { type: Date },
      paymentScreenshot: { type: String, default: "" },
    },

    // --- AI & PRIVACY ADD-ON (Diagnostic Features) ---
    aiAccess: {
      plan: { 
        type: String, 
        enum: ["none", "weekly", "monthly", "yearly"], 
        default: "none" 
      },
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      expiryDate: { type: Date },
      amountPaid: { type: Number },
      paymentScreenshot: { type: String, default: "" },
      status: { 
        type: String, 
        enum: ["none", "pending", "approved", "rejected"], 
        default: "none" 
      }
    },

    // --- AI USAGE TRACKER ---
    usage: {
      aiRequestsUsed: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now }
    },

    // --- EXISTING AUTH FIELDS ---
    image: { type: String, default: "" },
    verifyOtp: { type: String, default:'' },
    verifyOtpExpireAt:{ type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp:{ type: String, default: '' },
    resetOtpExpireAt:{ type: Number, default: 0 },
    roleChangeRequest: {
        role: { type: String, enum: ["admin", "supervisor", "c1", "c2", "intern"] },
        requestedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);