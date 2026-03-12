import React from "react";
import { X, MessageCircleMore, ShieldCheck, FileText } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with heavy blur */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative bg-slate-900 border border-white/10 max-w-2xl w-full rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl">
              <ShieldCheck className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-none">Legal & Privacy</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Hospital Bed Notification System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cp p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
             <p className="text-indigo-300 text-sm font-bold italic leading-relaxed">
              Welcome to the BNS. This policy ensures your data is handled with medical-grade transparency and security.
            </p>
          </div>

          <div className="space-y-6 text-slate-400 font-medium text-sm leading-relaxed">
            <section>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-indigo-500 text-xs">01</span> Information We Collect
              </h3>
              <p>
                We collect essential credentials (name, email, encrypted password) to manage your professional profile. 
                Subscription data, including verification screenshots, are processed exclusively for account activation.
              </p>
            </section>

            <section>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-indigo-500 text-xs">02</span> Payment Screenshot Security
              </h3>
              <p>
                Uploaded verification images are used solely for manual payment confirmation. They are stored in 
                private cloud buckets and are never accessible to unauthorized staff or public parties.
              </p>
            </section>

            <section>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-indigo-500 text-xs">03</span> Data Encryption & Safety
              </h3>
              <p>
                All transitions are secured via HTTPS. We employ restricted administrative access, ensuring 
                only top-level system controllers can review sensitive verification documents.
              </p>
            </section>

            <section>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-indigo-500 text-xs">04</span> Account Responsibilities
              </h3>
              <p>
                Maintaining credential confidentiality is the user's duty. Unauthorized access resulting from 
                credential sharing is not the platform's liability. Notify support immediately of any breaches.
              </p>
            </section>

            <section>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-indigo-500 text-xs">05</span> Data Retention Policy
              </h3>
              <p>
                Verification screenshots are purged after verification is complete or within 30 days of subscription 
                expiry to protect your financial privacy.
              </p>
            </section>

            <section className="pt-4 border-t border-white/5">
              <p className="text-white/80 font-bold mb-3">Questions or Data Removal Requests?</p>
              <a 
                href="https://t.me/NYDev_Chat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cp inline-flex items-center gap-2 bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white px-5 py-2.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest border border-white/5"
              >
                Connect with NYDev <MessageCircleMore size={16} />
              </a>
            </section>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 font-bold italic text-center sm:text-left">
            By registering, you acknowledge and agree to these medical operational terms.
          </p>
          <button
            onClick={onClose}
            className="cp w-full sm:w-auto bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
          >
            I Acknowledge
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PrivacyModal;