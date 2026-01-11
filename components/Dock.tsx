import React from 'react';

interface DockProps {
  onSearchClick: () => void;
}

const Dock: React.FC<DockProps> = ({ onSearchClick }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 animate-[slideUp_0.4s_ease-out]">
      <div className="bg-gray-900 text-gray-400 px-4 py-2 rounded-full flex items-center gap-6 shadow-xl border border-gray-700 backdrop-blur-md bg-opacity-95">
        <button className="hover:text-white transition-colors relative group p-1">
          <span className="material-icons-outlined">home</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Home</span>
        </button>
        <button className="hover:text-white transition-colors p-1 relative group">
          <span className="material-icons-outlined">explore</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Explore</span>
        </button>
        <button className="hover:text-white transition-colors p-1 relative group">
          <span className="material-icons-outlined">calendar_today</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Calendar</span>
        </button>
        <button className="hover:text-white transition-colors p-1 relative group">
          <span className="material-icons-outlined">bookmark_border</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Saved</span>
        </button>
        
        <div className="h-6 w-px bg-gray-700"></div>
        
        <button className="bg-gray-700 text-white p-1 rounded-md hover:bg-gray-600 transition-colors shadow-inner">
          <span className="material-icons-outlined">bar_chart</span>
        </button>
        <button className="hover:text-white transition-colors p-1 relative group">
          <span className="material-icons-outlined">dashboard</span>
           <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dash</span>
        </button>
        <button className="hover:text-white transition-colors p-1 relative group">
          <span className="material-icons-outlined">settings</span>
           <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Settings</span>
        </button>
      </div>

      <button 
        onClick={onSearchClick}
        className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xl border border-gray-700 hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="material-icons-outlined group-hover:rotate-90 transition-transform duration-300">search</span>
      </button>
    </div>
  );
};

export default Dock;