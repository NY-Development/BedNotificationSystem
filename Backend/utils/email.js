import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f9fafb; color:#111827;">
        <div style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color:#4f46e5; padding:20px; text-align:center;">
            <h1 style="margin:0; font-size:24px; color:#ffffff;">Bed Notification System | BNS</h1>
          </div>

          <!-- Body -->
          <div style="padding:24px;">
            <h2 style="font-size:20px; margin-bottom:12px; color:#111827;">${subject}</h2>
            <p style="font-size:16px; line-height:1.6; margin:0 0 16px 0; color:#374151;">
              ${text}
            </p>
            <p style="font-size:14px; color:#6b7280;">If you did not request this, please ignore this email.</p>
          </div>

          <!-- Footer -->
          <div style="background-color:#f3f4f6; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
            <p style="margin:0;">&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Bed Notification System | BNS" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text, // plain fallback
      html: htmlTemplate,
    });

    console.log("📧 Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
