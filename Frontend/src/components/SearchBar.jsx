import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onSearchClick, placeholder }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
      />
      <button
        onClick={onSearchClick}
        className="cp p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;