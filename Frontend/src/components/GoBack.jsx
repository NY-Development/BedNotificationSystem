import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const GoBack = ({ to = '/dashboard', label = "Go back" }) => {
  return (
    <Link
      to={to}
      className="group flex items-center w-max gap-2 px-3 py-2 -ml-3 text-slate-400 hover:text-indigo-600 transition-all duration-300 rounded-xl hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <div className="flex items-center justify-center p-1 rounded-lg bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        <ChevronLeft size={16} strokeWidth={3} />
      </div>
      
      <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
        {label}
      </span>
    </Link>
  );
};

export default GoBack;