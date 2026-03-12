import React from "react";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDestructive = true }) => {
  if (!isOpen) return null;

  const confirmStyles = isDestructive 
    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100" 
    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100";
    
  const accentColor = isDestructive ? "text-rose-500" : "text-indigo-500";
  const borderColor = isDestructive ? "border-rose-100" : "border-indigo-100";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Progress Accent */}
        <div className={`h-1.5 w-full ${isDestructive ? 'bg-rose-500' : 'bg-indigo-500'}`} />

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-slate-50 border ${borderColor} ${accentColor}`}>
              {isDestructive ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
            </div>
            <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2">
            {title}
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Protocol Authorization Required
          </p>

          <div className="text-sm font-bold text-slate-500 leading-relaxed mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {message}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCancel}
              className="py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`py-4 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 ${confirmStyles}`}
            >
              {isDestructive ? "Confirm Delete" : "Confirm Choice"}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 flex justify-center">
            <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em]">
              Security Hash: {Math.random().toString(36).substring(7).toUpperCase()}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;