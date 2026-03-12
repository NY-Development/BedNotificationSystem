import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';

const UniversityCard = ({ university, onClick }) => {
  return (
    <div
      className='group relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer border border-slate-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2'
      onClick={() => onClick(university)}
    >
      {/* Image Container */}
      <div className='relative h-56 overflow-hidden'>
        <img
          src={university.image}
          alt={university.name}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        
        {/* Hover Icon */}
        <div className='absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full text-white scale-0 group-hover:scale-100 transition-transform duration-500'>
            <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Content */}
      <div className='p-8'>
        <div className="flex items-center gap-2 mb-3">
            <MapPin size={12} className="text-indigo-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Campus</span>
        </div>
        <h3 className='text-2xl font-black text-slate-900 mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors'>
            {university.name}
        </h3>
        <p className='text-sm font-bold text-slate-500 leading-relaxed line-clamp-2 italic'>
            {university.description}
        </p>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
};

export default UniversityCard;