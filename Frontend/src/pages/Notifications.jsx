import React, { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import GoBack from "../components/GoBack";
import { Bell, Activity, ShieldAlert, Timer, Lock } from "lucide-react";
import { getNotifications } from "../services/notification";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      // Sorting newest first if not already handled by backend
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = () => {
    fetchNotifications();
  };

if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full">
          <div className="relative mb-6">
            {/* Pulsing Timer Icon */}
            <Timer size={80} className="text-indigo-100 animate-pulse" />
            
            {/* Concentric Medical Spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-slate-50 border-t-indigo-600 animate-spin"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
              System Synchronization
            </h2>
            <p className="text-2xl font-black text-slate-900 italic uppercase">
              Initializing Ward Data...
            </p>
            <p className="text-sm font-medium text-slate-400">
              Fetching departmental bed assignments and patient files.
            </p>
          </div>

          {/* Minimalist Progress Bar placeholder */}
          <div className="w-full bg-slate-50 h-1.5 rounded-full mt-8 overflow-hidden">
            <div className="bg-indigo-600 h-full w-1/3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.subscription?.isActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[3rem] shadow-2xl text-center border-2 border-slate-100">
           <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 uppercase italic">Access Denied</h2>
           <p className="text-slate-500 text-sm mt-3 mb-8 font-bold">
             You need an active Platform Subscription to access the Notificatioin Live Feed.
           </p>
           <button 
             onClick={() => window.location.href = '/screenshot'} 
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
           >
             Upgrade Plan
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><GoBack /></div>

        {/* Clinical Feed Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Activity size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Real-Time Alert Feed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Notifications</h1>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unread Alerts</p>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-tight flex items-center gap-2">
              {notifications.filter(n => !n.read).length} Pending
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[3rem] p-16 text-center flex flex-col items-center shadow-sm">
            <div className="p-6 bg-slate-50 rounded-full mb-6 text-slate-200">
              <Bell size={48} strokeWidth={1} />
            </div>
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight uppercase mb-2">Feed Synchronized</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No new alerts detected in the clinical stream.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                className="transform transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <NotificationCard
                  notification={n}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Footer Info */}
        <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
              End of Clinical Feed • BNS Automated System
            </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;