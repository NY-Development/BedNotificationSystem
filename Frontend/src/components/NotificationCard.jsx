import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Clock, MapPin, User } from "lucide-react";
import { markNotificationAsRead } from "../services/notification";

const NotificationCard = ({ notification, onMarkAsRead }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { _id, message, type, bedId, wardName, departmentName, createdAt, from, read } = notification;

  const handleMarkAsReadClick = async (e) => {
    e.stopPropagation(); // Prevent toggling details when clicking read
    try {
      await markNotificationAsRead(_id);
      onMarkAsRead(); 
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const isOldAndRead = read && (new Date() - new Date(new Date(createdAt).getTime() + 3 * 24 * 60 * 60 * 1000) > 0);
  if (isOldAndRead) return null;

  return (
    <div 
      className={`group relative bg-white rounded-[1.5rem] border-2 transition-all duration-300 ${
        read 
          ? 'border-slate-100 opacity-60 grayscale-[0.5]' 
          : 'border-white shadow-sm hover:shadow-md hover:border-indigo-100'
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {/* Header: Sender Info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {from?.image ? (
                  <img src={from.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={12} className="text-slate-400" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {from?.name || "System Auth"}
              </span>
              <span className="text-slate-300 text-[10px]">•</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock size={10} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Main Message */}
            <p className={`text-sm font-bold leading-snug tracking-tight mb-3 ${read ? 'text-slate-500' : 'text-slate-900'}`}>
              {message}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {read ? (
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg" title="Acknowledged">
                <CheckCircle size={18} />
              </div>
            ) : (
              <button
                onClick={handleMarkAsReadClick}
                className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-all shadow-sm"
                aria-label="Mark as read"
              >
                <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Context Bar */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={12} />
            <span className="text-[10px] font-black uppercase tracking-tight">{wardName}</span>
          </div>
          
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="ml-auto flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-slate-900 transition-colors"
          >
            {showDetails ? 'Minimize' : 'Inspect'} 
            {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Expanded Telemetry Details */}
        {showDetails && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</p>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                  type === "admit" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {type}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unit ID</p>
                <p className="text-[10px] font-bold text-slate-700 uppercase">BED: {bedId}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Department Assignment</p>
                <p className="text-[10px] font-bold text-slate-700 uppercase">{departmentName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;