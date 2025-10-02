import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    default: 'Support Request',
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false, // Default to false for new messages
  },
});

// Create the model
const Message = mongoose.model('Message', messageSchema);

export default Message;