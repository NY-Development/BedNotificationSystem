import React from 'react';
import { Search, Command } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onSearchClick, placeholder }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  return (
    <div className="relative group max-w-2xl w-full">
      {/* Background Glow Effect on Focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-slate-400 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
      
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 group-focus-within:border-indigo-400 transition-all duration-300 pr-2">
        {/* Leading Icon */}
        <div className="pl-4 text-slate-400">
          <Search size={18} strokeWidth={2.5} />
        </div>

        <input
          type="text"
          placeholder={placeholder || "SEARCH REGISTRY..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-4 bg-transparent text-sm font-bold uppercase tracking-tight text-slate-900 placeholder:text-slate-300 placeholder:font-black placeholder:tracking-[0.1em] focus:outline-none"
        />

        {/* Action Button & Shortcut Hint */}
        <div className="flex items-center gap-3">          
          <button
            onClick={onSearchClick}
            className="cp px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;