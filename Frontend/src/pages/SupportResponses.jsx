import React, { useEffect, useState } from "react";
import { getMessages, updateMessageReadStatus } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import { 
    FaInbox, 
    FaEnvelopeOpen, 
    FaCheckCircle, 
    FaPaperPlane, 
    FaUserShield, 
    FaSpinner 
} from 'react-icons/fa';
import GoBack from "../components/GoBack";

const SupportResponses = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter messages to ensure they are relevant to the current user
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        // Sort by timestamp descending (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Filter messages related to this user (either sent by them or sent to them)
        const filtered = sortedData.filter(
          (m) => m.from === user.email || m.to === user.email
        );
        setMessages(filtered);
      } catch (err) {
        console.error("Error fetching messages", err);
        // Optionally, show a toast error
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMessages();
  }, [user]);

  // Handler to mark a specific message as read
  const handleMarkAsRead = async (id) => {
    try {
      await updateMessageReadStatus(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
      // Optionally, show a toast error
    }
  };

  // --- RENDERING STATES ---

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white rounded-xl shadow-lg mt-10">
        <FaSpinner className="animate-spin text-indigo-500 text-3xl mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Loading support history...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-xl shadow-lg mt-10 border-2 border-dashed border-gray-300">
        <FaInbox className="text-5xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Support History</h2>
        <p className="text-gray-500">You haven’t sent any requests or received any replies yet.</p>
      </div>
    );
  }

  // --- MAIN UI RENDER ---

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 lg:p-8 bg-white rounded-xl shadow-2xl">
      <GoBack />
      {/* Header */}
      <div className="flex items-center justify-center space-x-3 mb-8 border-b pb-4">
        <FaUserShield className="text-4xl text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-800">
          My Support Messages
        </h1>
      </div>
      
      {/* Messages List (Styled as chat bubbles) */}
      <ul className="space-y-6">
        {messages.map((msg) => {
          const isUserMessage = msg.from === user.email;
          const isUnread = !msg.read && !isUserMessage; // Only show unread status for received messages

          // Dynamic styling based on sender and read status
          const messageClasses = isUserMessage
            ? "bg-blue-50 border-blue-200 ml-auto shadow-md" // Sent by user
            : isUnread
            ? "bg-yellow-50 border-yellow-400 border-2 shadow-lg" // Unread Admin message
            : "bg-gray-100 border-gray-200 shadow-sm"; // Read Admin message
          
          const iconColor = isUserMessage ? "text-blue-600" : "text-green-600";
          
          return (
            <li
              key={msg._id}
              className={`p-5 rounded-xl border max-w-[90%] md:max-w-[80%] transition-all duration-300 ${messageClasses}`}
              style={{ width: 'fit-content' }} // Makes the bubble fit the content
            >
              <div className="flex justify-between items-start mb-3 border-b border-opacity-30 pb-2">
                
                {/* Sender Tag */}
                <div className="flex items-center space-x-2">
                  {isUserMessage ? (
                    <FaPaperPlane className="text-sm text-blue-500" />
                  ) : (
                    <FaUserShield className="text-sm text-green-600" />
                  )}
                  <span
                    className={`text-sm font-bold ${iconColor}`}
                  >
                    {isUserMessage ? "You" : "Admin Reply"}
                  </span>
                  
                  {/* Unread Dot Indicator */}
                  {isUnread && (
                    <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-red-300 shadow-md"></span>
                  )}
                </div>

                {/* Mark as Read Button */}
                {isUnread && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="cp flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 transition duration-150 p-1 rounded-full hover:bg-white ml-4"
                    aria-label="Mark message as read"
                  >
                    <FaEnvelopeOpen className="text-base" />
                  </button>
                )}
                {!isUnread ? (
                  <p className="cp">Read</p>
                ) : (
                  <p className="cp">Mark as read</p>
                )
                }
              </div>
              
              {/* Message Content */}
              <h3 className="font-extrabold text-lg text-gray-900 mb-1">{msg.subject}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              
              {/* Timestamp */}
              <p className={`mt-3 text-xs ${isUserMessage ? 'text-blue-500' : 'text-gray-500'} text-right`}>
                {new Date(msg.timestamp).toLocaleString()}
                {msg.read && !isUserMessage && (
                    <FaCheckCircle className="inline ml-1 text-green-500" title="Read" />
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SupportResponses;