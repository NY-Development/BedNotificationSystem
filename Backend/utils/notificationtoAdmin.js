
import nodemailer from "nodemailer";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   
  port: process.env.SMTP_PORT,   
  secure: false,                 
  auth: {
    user: process.env.SMTP_USER,  
    pass: process.env.SMTP_PASS, 
  },
});

// Generic HTML wrapper (used for all email types)
const generateTemplate = (subject, bodyText) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;color:#111827;">
      <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <div style="background:#4f46e5;padding:16px;text-align:center;color:white;font-size:20px;">
          Bed Notification System | BNS
        </div>
        <div style="padding:24px;">
          <h2>${subject}</h2>
          <p style="line-height:1.6;">${bodyText}</p>
        </div>
        <div style="background:#f3f4f6;padding:12px;text-align:center;font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} Bed Notification System. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;

// ========== EMAIL HELPERS ==========

// Send to admins (array)
export const sendEmailToAdmins = async (subject, text) => {
  if (adminEmails.length === 0) return console.error("❌ No admin emails configured.");
  try {
    const html = generateTemplate(subject, text);
    await transporter.sendMail({
      from: `"BNS Notification" <${process.env.SENDER_EMAIL || process.env.SMTP_USER}>`,
      to: adminEmails,
      subject,
      html,
    });
    console.log("✅ Notification sent to admins.");
  } catch (err) {
    console.error("❌ Error sending email to admins:", err);
  }
};

// Send to a single user
export const sendEmailToUser = async (to, subject, text) => {
  try {
    const html = generateTemplate(subject, text);
    await transporter.sendMail({
      from: `"BNS Subscription Service" <${process.env.SENDER_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to user: ${to}`);
  } catch (err) {
    console.error("❌ Error sending email to user:", err);
  }
};
