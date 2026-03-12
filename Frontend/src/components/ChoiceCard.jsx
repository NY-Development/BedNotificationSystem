import React from 'react';
import { Hospital, ArrowRight, Activity, ClipboardCheck } from 'lucide-react';
import gsap from 'gsap';

const ChoiceCard = ({ uni, onSelect }) => {
  const cardRef = React.useRef(null);

  const handleSelection = () => {
    const selectedCard = cardRef.current;
    gsap.to(selectedCard, {
      scale: 0.98,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        localStorage.setItem("university", uni.name);
        onSelect(uni);
      },
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleSelection}
      /* Removed high-contrast border for a clean white medical card look */
      className="group relative bg-white border border-slate-200 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-indigo-200"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
          <Hospital size={28} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Database Status</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-emerald-700 uppercase">Synchronized</span>
          </div>
        </div>
      </div>

      <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">
        {uni.name}
      </h3>

      {/* Image Container - Styled like a clinical facility preview */}
      <div className='relative h-48 overflow-hidden rounded-[1.5rem] mb-6 border border-slate-100'>
        <img
          src={uni.image}
          alt={uni.name}
          className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter saturate-[0.8]'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent' />
        <div className='absolute bottom-4 left-4 flex items-center gap-2 text-white'>
           <Activity size={16} className="animate-pulse" />
           <span className="text-[9px] font-bold uppercase tracking-widest">Active Registry</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium line-clamp-2">
        {uni.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700">Enter Institution</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-tighter group-hover:translate-x-2 transition-transform">
          Connect <ArrowRight size={16} />
        </div>
      </div>

      {/* Subtle Bottom Accent - Deep Blue instead of Neon */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-indigo-600 w-0 group-hover:w-1/3 transition-all duration-700 ease-in-out rounded-t-full" />
    </div>
  );
};

export default ChoiceCard;