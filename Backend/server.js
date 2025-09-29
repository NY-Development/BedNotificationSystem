import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { startExpiryJob } from "./cronJobs/expireAssignments.js";


import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import assignmentRoutes from './routes/assignmentRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import supportRoutes from './routes/supportRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//  Start the cron job
startExpiryJob();

const allowedOrigins = [
  "http://localhost:5173",          // local dev
  "https://bnst-beta.vercel.app",   // your deployed frontend
  "https://bnst-ao5j.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes)

app.use("/api/support", supportRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process?.env?.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
