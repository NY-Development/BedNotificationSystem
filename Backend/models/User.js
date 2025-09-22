import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "c1", "c2", "intern"],
      default: "c1",
    },
    firstLoginDone: { type: Boolean, default: false },
    subscription: {
      plan: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
      isActive: { type: Boolean, default: true },
      startDate: { type: Date },
      endDate: { type: Date },
      amountPaid: { type: Number }, // amount paid in ETB
      tx_ref: { type: String },     // transaction reference from Chapa
      paidAt: { type: Date },       // payment timestamp
    },
    verifyOtp: {
        type: String,
        default:''
    },
    verifyOtpExpireAt:{
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp:{
        type: String,
        default: ''
    },
    resetOtpExpireAt:{
        type: Number,
        default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
