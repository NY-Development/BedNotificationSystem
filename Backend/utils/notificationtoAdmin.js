
import nodemailer from "nodemailer";

// Admin emails (comma-separated in .env)
const adminEmails = process.env.ADMIN_EMAILS.split(",");

// Create reusable transporter (no password needed if using a service with API key or OAuth2)
const transporter = nodemailer.createTransport({
  service: "gmail", // you can change to any email service
  auth: {
    user: adminEmails[0], // sender
    pass: process.env.ADMIN_EMAIL_PASSWORD || "", // optional if your service doesn't need
  },
});

/**
 * sendEmailToAdmins - Send email notification to all admins
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
export const sendEmailToAdmins = async (subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Notification" <${adminEmails[0]}>`,
      to: adminEmails, // sends to all admins
      subject,
      html,
    });
    console.log("Admin notification sent successfully.");
  } catch (err) {
    console.error("Error sending admin email:", err);
  }
};

export const sendEmailToUser = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Subscription Service" <${adminEmails[0]}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to user ${to} successfully.`);
  } catch (err) {
    console.error("Error sending email to user:", err);
  }
};
