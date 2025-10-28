import cron from "node-cron";
import User from "../models/User.js";
import { sendEmailToUser } from "../utils/notificationtoAdmin.js"; 

export const startSubscriptionExpiryJob = () => {
  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running subscription expiry job...");

    try {
      const now = new Date();

      // Find all users with expired but still active subscriptions
      const expiredUsers = await User.find({
        "subscription.isActive": true,
        "subscription.endDate": { $lte: now },
      });

      if (expiredUsers.length === 0) {
        console.log("✅ No expired subscriptions found.");
        return;
      }

      for (const user of expiredUsers) {
        user.subscription.isActive = false;
        await user.save();

        // Notify user
        await sendEmailToUser(
          user.email,
          "⚠️ Subscription Expired",
          `
          <p>Hi ${user.name || user.email},</p>
          <p>Your <strong>${user.subscription.plan}</strong> subscription has <strong>expired</strong> on ${user.subscription.endDate.toDateString()}.</p>
          <p>Please renew your subscription to continue enjoying premium features.</p>
          <p>
            👉 <a href="https://bednotify.vercel.app/pricing" target="_blank" style="color: #007BFF; text-decoration: none;">
            Renew your subscription here
            </a>
          </p>
          <p>— The BNS Team</p>
          `
        );

        console.log(`🔴 Subscription auto-deactivated for: ${user.email}`);
      }

      console.log(`✅ Auto-deactivated ${expiredUsers.length} expired subscriptions.`);
    } catch (err) {
      console.error("❌ Error in subscription expiry job:", err.message);
    }
  });
};
