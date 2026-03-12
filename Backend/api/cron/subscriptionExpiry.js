// api/cron/subscriptionExpiry.js
import connectDB from "../../config/db.js";
import { startSubscriptionNotificationJob } from "../../cronJobs/subscriptionExpiryJob.js";

export default async function handler(req, res) {
  await connectDB();
  await startSubscriptionNotificationJob();
  res.status(200).json({ ok: true });
}
