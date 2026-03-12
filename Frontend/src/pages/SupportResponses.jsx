import React, { useEffect, useState } from "react";
import { getMessages, updateMessageReadStatus } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import { 
    FaInbox, 
    FaEnvelopeOpen, 
    FaCheckCircle, 
    FaPaperPlane, 
    FaUserShield, 
    FaSpinner,
    FaHistory
} from 'react-icons/fa';
import GoBack from "../components/GoBack";

const SupportResponses = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filtered = sortedData.filter(
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
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
        <div className="text-center p-12 bg-white rounded-[2rem] border border-slate-200 shadow-sm max-w-sm w-full">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Communications...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <FaInbox className="text-5xl text-slate-200 mx-auto mb-6" />
          <h2 className="text-xl font-black text-slate-900 italic tracking-tight uppercase mb-2">Archive Empty</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No support logs detected in your terminal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><GoBack /></div>

        {/* Clinical Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <FaHistory size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Logs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Support Desk</h1>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Terminal Connected
            </p>
          </div>
        </div>
        
        {/* Messages List */}
        <ul className="space-y-8">
          {messages.map((msg) => {
            const isUserMessage = msg.from === user.email;
            const isUnread = !msg.read && !isUserMessage;

            return (
              <li
                key={msg._id}
                className={`group relative flex flex-col transition-all duration-300 ${
                  isUserMessage ? "items-end" : "items-start"
                }`}
              >
                {/* Meta Info Bar */}
                <div className={`flex items-center gap-3 mb-2 px-2 ${isUserMessage ? "flex-row-reverse" : ""}`}>
                  <div className={`p-2 rounded-lg ${isUserMessage ? "bg-slate-100 text-slate-500" : "bg-indigo-50 text-indigo-600"}`}>
                    {isUserMessage ? <FaPaperPlane size={10} /> : <FaUserShield size={10} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {isUserMessage ? "Outbound Query" : "Inbound Resolution"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div 
                  className={`relative p-6 rounded-[2rem] border-2 transition-all shadow-sm max-w-[90%] md:max-w-[80%] ${
                    isUserMessage 
                      ? "bg-white border-slate-100 rounded-tr-none text-right" 
                      : isUnread 
                      ? "bg-indigo-50 border-indigo-200 rounded-tl-none shadow-md" 
                      : "bg-white border-slate-100 rounded-tl-none"
                  }`}
                >
                  <div className={`flex flex-col ${isUserMessage ? "items-end" : "items-start"}`}>
                    <h3 className="font-black text-slate-900 italic tracking-tight text-lg mb-2 uppercase">
                      {msg.subject}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  {/* Message Status Actions */}
                  {!isUserMessage && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      {isUnread ? (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          className="cp flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-all"
                        >
                          <FaEnvelopeOpen /> Mark as Acknowledged
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <FaCheckCircle /> Resolution Viewed
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isUserMessage && msg.read && (
                    <div className="mt-2 flex items-center justify-end gap-1 text-[9px] font-black uppercase text-slate-300">
                      <FaCheckCircle /> Seen by Admin
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SupportResponses;