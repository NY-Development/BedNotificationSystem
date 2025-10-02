import { sendEmail } from "../utils/email.js";
import Message from '../models/Message.js'; // Import the Message model

// Send a support email and store the message in the database
export const sendSupportEmail = async (req, res) => {
  try {
    console.log("📩 Incoming body:", req.body);

    const { email, issue } = req.body;

    if (!email || !issue) {
      return res.status(400).json({ message: "Email and issue are required" });
    }

    // Create a new message instance
    const newMessage = new Message({
      from: email,
      subject: "New Support Request",
      message: issue,
      to: process.env.SENDER_EMAIL,
    });

    // Save the message to the database
    await newMessage.save();

    // Send the email
    await sendEmail(
      "yamlaknegash96@gmail.com",
      "New Support Request",
      `From: ${email}\n\nIssue:\n${issue}`
    );
    return res.json({ email, message: "Support request sent successfully!" });
  } catch (err) {
    console.error("sendSupportEmail error:", err);
    return res.status(500).json({ message: "Failed to send support request" });
  }
};

// Send a refined message to a specific email
export const sendRefinedMessage = async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Recipient, subject, and message are required." });
    }

    // Create a new refined message instance
    const refinedMessage = new Message({
      from: process.env.SENDER_EMAIL,
      subject: subject,
      message: message,
      to: recipient,
    });

    // Save the refined message to the database
    await refinedMessage.save();

    // Send the email
    await sendEmail(recipient, subject, message);

    return res.json({ message: "Refined message sent successfully!" });
  } catch (error) {
    console.error("Error sending refined message:", error);
    return res.status(500).json({ message: "Failed to send refined message." });
  }
};

// New endpoint to get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }); // Sort by timestamp
    return res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).json({ message: "Failed to retrieve messages." });
  }
};

export const updateMessageReadStatus = async (req, res) => {
  const { id } = req.params; // Get the message ID from the request parameters

  try {
    // Find the message by ID and update the read status
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { read: true }, // Set the read status to true
      { new: true } // Return the updated document
    );

    // Check if the message was found and updated
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Return the updated message
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message read status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};