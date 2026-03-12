import mongoose from "mongoose";

const patientHistorySchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    wardName: {
      type: String,
      required: true,
    },

    bedId: {
      type: Number,
      required: true,
    },

    patient: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      sex: {
        type: String,
        enum: ["male", "female"],
        required: true,
      },
      chiefComplaint: { type: String, required: true },
      prediction: {
        diagnosis: { type: String },
        riskLevel: { type: String, enum: ["low", "medium", "high"] },
      },
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PatientHistory", patientHistorySchema);
