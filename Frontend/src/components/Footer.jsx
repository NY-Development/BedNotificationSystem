import { FaYoutube, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import { ShieldCheck, Activity, LifeBuoy, Info } from 'lucide-react';
import PrivacyModal from "../components/PrivacyModal";
import { useState } from 'react';
import bedIcon from '../assets/medical-bed.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Copyright & Institutional Info */}
          <div className="flex items-center gap-5">
            <div className="bg-indigo-500/20 p-2 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
              <img src={bedIcon} alt="Medical Bed Icon" className="h-8 w-auto" />
            </div>
            <div className="text-left">
              <p className="text-white font-black tracking-tighter text-xl leading-none mb-1 italic">BNS</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  &copy; {new Date().getFullYear()} Clinical Registry System
                </p>
                <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Social Media / Dev Connections */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center sm:items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Developer Network</span>
                <Link to={'https://nydevofficial.vercel.app'} className="text-[10px] font-bold text-slate-500">NYDev Official Connectivity</Link>
            </div>
            
            <div className="flex items-center gap-5">
              <a
                href="https://www.youtube.com/@NYDev-t6p"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-red-600 transition-all duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </a>
              
              <a
                href="https://instagram.com/nydevofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              
              <a
                href="https://t.me/+a4391kX-fU9hYjA0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-sky-600 transition-all duration-300"
                aria-label="Telegram"
              >
                <FaTelegramPlane size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Navigation & Compliance Links */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-10">
            <button 
              onClick={() => setShowModal(true)} 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-300 transition-colors"
            >
              <ShieldCheck size={14} className="text-slate-600 group-hover:text-indigo-400" />
              Privacy Protocol
            </button>
            
            <Link 
              to="/support" 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-300 transition-colors"
            >
              <LifeBuoy size={14} className="text-slate-600 group-hover:text-indigo-400" />
              Support Registry
            </Link>

            <Link 
              to="/about" 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-300 transition-colors"
            >
              <Info size={14} className="text-slate-600 group-hover:text-indigo-400" />
              System Details
            </Link>
        </div>

        {/* Clinical Footer Badge */}
        <div className="mt-10 text-center">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-black/20 rounded-full border border-white/5">
             <Activity size={12} className="text-indigo-500 animate-pulse" />
             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">
               Precision Managed • HIPAA Aligned • Real-time Monitoring
             </p>
           </div>
        </div>
      </div>

      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </footer>
  );
};

export default Footer;