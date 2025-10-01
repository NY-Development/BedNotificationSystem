import { sendEmail } from "../utils/email.js";

export const sendSupportEmail = async (req, res) => {
  try {
    console.log("📩 Incoming body:", req.body);

    const { email, issue } = req.body;

    if (!email || !issue) {
      return res.status(400).json({ message: "Email and issue are required" });
    }

    await sendEmail(
      "yamlaknegash96@gmail.com",
      "New Support Request",
      `From: ${email}\n\nIssue:\n${issue}`
    );

    return res.json({ message: "Support request sent successfully!" });
  } catch (err) {
    console.error("sendSupportEmail error:", err);
    return res.status(500).json({ message: "Failed to send support request" });
  }
};

// New endpoint to send a refined message to a specific email
export const sendRefinedMessage = async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Recipient, subject, and message are required." });
    }

    await sendEmail(recipient, subject, message);

    return res.json({ message: "Refined message sent successfully!" });
  } catch (error) {
    console.error("Error sending refined message:", error);
    return res.status(500).json({ message: "Failed to send refined message." });
  }
};
