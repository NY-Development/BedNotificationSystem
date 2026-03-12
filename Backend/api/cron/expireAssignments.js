// api/cron/expireAssignments.js
import connectDB from "../../config/db.js";
import { expireAssignments } from "../../cronJobs/expireAssignments.js";

export default async function handler(req, res) {
  await connectDB();
  await expireAssignments();
  res.status(200).json({ ok: true });
}
