import React from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-50 animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-white rounded-xl shadow-2xl border border-border-light overflow-hidden">
          <div className="p-3 border-b border-border-light flex items-center gap-3">
            <span className="material-icons-outlined text-gray-400">search</span>
            <input 
              autoFocus 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400 p-0" 
              placeholder="Type a command or search..." 
              type="text"
            />
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400">
               <span className="text-xs">ESC</span>
            </button>
          </div>
          
          <div className="py-2">
            <div className="px-2">
              <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg text-sm text-gray-900 cursor-pointer group mb-1 border border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-primary text-lg">auto_awesome</span>
                  <span className="font-medium">Search stock or type / for commands</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] text-gray-500">⌥</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] text-gray-500">A</span>
                </div>
              </div>
              <div className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer gap-3 transition-colors">
                <span className="material-icons-outlined text-gray-400 text-lg">summarize</span>
                <span>Daily Market Summary</span>
              </div>
              <div className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer gap-3 mb-2 transition-colors">
                <span className="material-icons-outlined text-gray-400 text-lg">filter_alt</span>
                <span>Find Stocks by Criteria</span>
              </div>
            </div>

            <div className="border-t border-border-light my-1"></div>

            <div className="px-2 pt-1">
              <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg text-sm group cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-gray-400 text-lg">corporate_fare</span>
                  <span className="font-medium text-gray-900">NYSE</span>
                  <span className="text-gray-500">New York Stock Exchange</span>
                </div>
                <span className="text-xs text-gray-400">Opens at 9:30 PM</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg text-sm group cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-gray-400 text-lg">show_chart</span>
                  <span className="font-medium text-gray-900">Nasdaq</span>
                  <span className="text-gray-500">Nasdaq Stock Exchange</span>
                </div>
                <span className="text-xs text-gray-400">Opens at 9:30 PM</span>
              </div>
               <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg text-sm group cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-gray-400 text-lg">candlestick_chart</span>
                  <span className="font-medium text-gray-900">BATS</span>
                  <span className="text-gray-500">Better Alternative Trading System</span>
                </div>
                <span className="text-xs text-gray-400">Opens at 9:30 PM</span>
              </div>
            </div>

            <div className="border-t border-border-light my-1"></div>

            <div className="px-2 pb-1">
              <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg text-sm group cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-gray-400 text-lg">arrow_circle_right</span>
                  <span className="text-gray-700">Watchlist Management</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] text-gray-500">⌘</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] text-gray-500">M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;