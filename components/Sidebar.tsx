import React from 'react';
import { SUGGESTIONS } from '../constants';

const Sidebar: React.FC = () => {
  return (
    <div className="md:col-span-1 bg-surface-light rounded-2xl border border-border-light flex flex-col shrink-0 overflow-hidden shadow-sm h-full max-h-[calc(100vh-8rem)]">
      <div className="p-4 border-b border-border-light">
        <h2 className="font-semibold text-gray-900 mb-3">Graph selection</h2>
        <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-border-light rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors mb-4 group">
          <span className="flex items-center gap-2">
            <span className="material-icons-outlined text-base">add</span>
            Compare graphs
          </span>
          <span className="px-1.5 py-0.5 text-xs bg-white border border-border-light rounded text-gray-400 group-hover:border-gray-300">C</span>
        </button>

        <div className="space-y-2">
          {/* Active Graph Selection 1 */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg group cursor-pointer hover:bg-blue-100/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">AAPL</span>
              <span className="text-xs text-gray-500">Market Cap</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-icons-outlined text-sm">close</span>
            </button>
          </div>

          {/* Active Graph Selection 2 */}
          <div className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-100 rounded-lg group cursor-pointer hover:bg-red-100/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-secondary rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">AAPL</span>
              <span className="text-xs text-gray-500">Price Target</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-icons-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Comparison suggestions</h3>
        <div className="space-y-1">
          {SUGGESTIONS.map((suggestion) => (
            <div key={suggestion.symbol} className="flex flex-col px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{suggestion.symbol}</span>
                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
              </div>
              <span className="text-xs text-gray-500">{suggestion.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;