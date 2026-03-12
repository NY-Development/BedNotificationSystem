import React from 'react';
import { Building2, ArrowUpRight, Activity } from 'lucide-react';

const SchoolCard = ({ school, onClick }) => {
  return (
    <div
      className='group relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer border border-slate-200 transition-all duration-500 hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.15)] hover:-translate-y-2'
      onClick={() => onClick(school)}
    >
      {/* Visual Identity Block */}
      <div className='relative h-60 overflow-hidden'>
        <img
          src={school.image}
          alt={school.name}
          className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        
        {/* Hover Protocol Badge */}
        <div className='absolute bottom-6 left-6 flex items-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500'>
            <Activity size={16} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Connect Node</span>
        </div>
      </div>

      {/* Content Block */}
      <div className='p-8'>
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
                <Building2 size={14} className="text-indigo-600" />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Facility</span>
        </div>
        
        <h3 className='text-2xl font-black text-slate-900 mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase italic'>
            {school.name}
        </h3>
        
        <p className='text-sm font-bold text-slate-500 leading-relaxed line-clamp-2 italic'>
            {school.description}
        </p>

        {/* Technical Footer of Card */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                Enter System <ArrowUpRight size={12} />
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all">
                <ArrowUpRight size={14} />
            </div>
        </div>
      </div>

      {/* Interactive Border Bottom */}
      <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-indigo-600 transition-all duration-700 group-hover:w-full" />
    </div>
  );
};

export default SchoolCard;