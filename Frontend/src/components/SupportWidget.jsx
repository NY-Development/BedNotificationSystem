import React, { useState, useEffect } from "react";
import { HelpCircle, MessageCircleMore, PlayCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/axios";
import { useAuth } from "../context/AuthContext";

const SupportWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");

  const handleRewatch = () => {
    localStorage.removeItem('hasSeenBnsTour'); // Clear the flag
    window.location.href = '/'; // Hard redirect to Home to trigger the IntroPage
  };

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
      setIssue(""); 
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
        className="cp fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-[100] hover:scale-110 active:scale-95"
      >
        {open ? <X size={24} /> : <HelpCircle size={24} />}
      </button>

      {/* Support Box */}
      {open && (
        <div className="fixed bottom-24 right-6 bg-white p-5 rounded-2xl shadow-2xl w-80 border border-slate-100 z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Support Center</h2>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full border border-slate-400 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="How can we help?"
              className="w-full border border-slate-400 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows="3"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            ></textarea>

            <button
              onClick={handleSubmit}
              className="w-full cp py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Send Request
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {/* Telegram Link */}
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>Quick DM support:</span>
              <a 
                href="https://t.me/NYDev_Chat" 
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                target="_blank" 
                rel="noopener noreferrer"
              >
                NYDev <MessageCircleMore size={14}/>
              </a>
            </div>

            {/* Restart Tour Button */}
            <button 
              onClick={handleRewatch} 
              className="w-full flex items-center justify-center gap-2 border-2 border-indigo-50 p-2.5 rounded-xl hover:bg-indigo-50 text-indigo-600 font-bold text-xs transition-all cp"
            >
              <PlayCircle size={16} />
              REWATCH PRODUCT TOUR
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportWidget;