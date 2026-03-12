import cron from "node-cron";
import User from "../models/User.js";
import { sendEmailToUser } from "../utils/notificationtoAdmin.js";

export const startSubscriptionNotificationJob = () => {
  // Run every day at 8AM
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running subscription notification job...");

    try {
      const now = new Date();
      const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      //  Notify users whose subscription expires in 2 days
      const usersToNotify = await User.find({
        "subscription.isActive": true,
        "subscription.endDate": {
          $gte: now,
          $lte: twoDaysLater,
        },
      });

      for (const user of usersToNotify) {
        await sendEmailToUser(
          user.email,
          "⚠️ Subscription Expiry Soon",
          `
          <p>Hi ${user.name || user.email},</p>
          <p>Your <strong>${user.subscription.plan}</strong> subscription will expire on <strong>${user.subscription.endDate.toDateString()}</strong>.</p>
          <p>Please renew to avoid interruption.</p>
          <p>👉 <a href="https://bednotify.vercel.app/pricing" target="_blank" style="color: #007BFF;">Renew now</a></p>
          <p>— The BNS Team</p>
          `
        );
        console.log(`📩 Notification sent to: ${user.email}`);
      }

      //  Deactivate expired subscriptions
      const expiredUsers = await User.find({
        "subscription.isActive": true,
        "subscription.endDate": { $lte: now },
      });

      for (const user of expiredUsers) {
        user.subscription.isActive = false;
        await user.save();

        await sendEmailToUser(
          user.email,
          "⚠️ Subscription Expired",
          `<p>Your subscription has expired. Please renew to continue using premium features.</p>`
        );
        console.log(`🔴 Subscription auto-deactivated for: ${user.email}`);
      }

    } catch (err) {
      console.error("❌ Error in subscription notification job:", err.message);
    }
  });
};
