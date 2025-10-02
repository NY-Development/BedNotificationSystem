import React, { useEffect, useState } from "react";
import { getMessages, updateMessageReadStatus } from "../services/adminService"; // or support service
import { useAuth } from "../context/AuthContext";

const SupportResponses = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        // only show messages related to this user (either sent by them or sent to them)
        const filtered = data.filter(
          (m) => m.from === user.email || m.to === user.email
        );
        setMessages(filtered);
      } catch (err) {
        console.error("Error fetching messages", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMessages();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await updateMessageReadStatus(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">No Support Messages</h2>
        <p>You don’t have any support requests or replies yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Support Messages</h1>
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li
            key={msg._id}
            className={`p-4 border rounded-lg shadow-sm ${
              msg.read ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  msg.from === user.email
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {msg.from === user.email ? "You" : "Admin"}
              </span>
              {!msg.read && msg.to === user.email && (
                <button
                  onClick={() => handleMarkAsRead(msg._id)}
                  className="cp text-sm text-indigo-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
            <h3 className="font-semibold">{msg.subject}</h3>
            <p className="text-gray-700 mt-1">{msg.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportResponses;
