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

    firstLoginDone: { type: Boolean, default: false },
    subscription: {
      plan: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      amountPaid: { type: Number }, // amount paid in ETB   
      paidAt: { type: Date },       // payment timestamp
      paymentScreenshot: {
        type: String,   // will hold URL (ImageKit / Cloudinary / S3)
        default: "",
      },
    },
    image: {
        type: String,
        default: "", // will store the ImageKit URL
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
    },
    roleChangeRequest: {
        role: { type: String, enum: ["admin", "supervisor", "c1", "c2", "intern"] },
        requestedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
