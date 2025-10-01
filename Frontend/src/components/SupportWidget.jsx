import React, { useState, useEffect } from "react";
import { HelpCircle, MessageCircleMore } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/axios";
import { useAuth } from "../context/AuthContext";

const SupportWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");

  // Initialize email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      if (!email || !issue) {
        toast.error("Please fill in both fields");
        return;
      }

      await API.post("/support", { email, issue });
      toast.success("Support request sent successfully!");
      setIssue(""); // clear only issue, keep email
      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send support request"
      );
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(!open)}
        className="cp fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
      >
        <HelpCircle size={24} />
      </button>

      {/* Support Box */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-white p-4 rounded-lg shadow-lg w-80 border z-50">
          <h2 className="font-semibold text-gray-800 mb-2">Support</h2>
          <input
            type="email"
            placeholder="Your email"
            className="w-full border p-2 rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your issue..."
            className="w-full border p-2 rounded mb-2"
            rows="3"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          ></textarea>

          {/* Telegram Username Section */}
          <div className="text-gray-600 mb-2">
            {`For quicker support, you can DM us on Telegram: `} 
            <a 
              href="https://t.me/Bns_support1" 
              className="text-blue-500 underline font-bold italic " 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {`Support`} <MessageCircleMore className="inline text-center ml-1 h-auto"/>
            </a>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="cp px-3 py-1 text-gray-600 hover:bg-gray-800 hover:text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="cp px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportWidget;