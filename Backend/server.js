import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { startExpiryJob } from "./cronJobs/expireAssignments.js";
import { startSubscriptionNotificationJob } from "./cronJobs/subscriptionExpiryJob.js";

import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* =========================
   Middleware
========================= */
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://bednotify.vercel.app",
  "https://bns-iota-three.vercel.app",
  "http://localhost:8081",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   Cron Jobs
========================= */
startExpiryJob();
startSubscriptionNotificationJob();

/* =========================
   Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/support", supportRoutes);

/* =========================
   Root Health Page
========================= */
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BNS API | Status</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 flex items-center justify-center min-h-screen font-sans">
      <div class="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
          <div class="relative bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2">
          BNS API System
        </h1>

        <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
          <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Operational</span>
        </div>

        <div class="space-y-3 text-left bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase">Environment</span>
            <span class="text-xs font-black text-slate-700 uppercase italic">
              ${process.env.NODE_ENV || "production"}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase">Server Time</span>
            <span class="text-xs font-black text-slate-700 tracking-tighter">
              ${new Date().toLocaleTimeString()}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase">Network Status</span>
            <span class="text-xs font-black text-indigo-600 tracking-tighter italic">
              Ready for Requests
            </span>
          </div>
        </div>

        <p class="mt-8 text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">
          &copy; ${new Date().getFullYear()} Hospital Management System
        </p>
      </div>
    </body>
    </html>
  `);
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});