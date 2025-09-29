import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  ward: { type: String, required: true },
  beds: [{ type: Number, required: true }], // bed ids inside the ward
  deptExpiry: { type: Date, required: true },
  wardExpiry: { type: Date, required: true },
  note: { type: String }, // optional note
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who created the assignment (may be same as user)
  isActive: { type: Boolean, default: true }, 
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
