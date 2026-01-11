import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const getLinkClass = (view: ViewState) => {
    const isActive = currentView === view;
    return `h-full flex items-center border-b-2 transition-colors cursor-pointer ${
      isActive 
        ? 'text-primary border-primary font-semibold' 
        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }`;
  };

  return (
    <header className="bg-surface-light border-b border-border-light h-16 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
          <h1 className="text-lg font-semibold text-gray-900">FundTracker</h1>
        </div>
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-500 h-full">
        <a onClick={() => onNavigate('dashboard')} className={getLinkClass('dashboard')}>Dashboard</a>
        <a onClick={() => onNavigate('performance')} className={getLinkClass('performance')}>Sector Performance</a>
        <a onClick={() => onNavigate('favorites')} className={getLinkClass('favorites')}>Sector Favorites</a>
      </nav>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 border border-border-light rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">
          <span className="material-icons-outlined text-lg">filter_center_focus</span>
          Analyze
        </button>
        <button className="p-2 border border-border-light rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
          <span className="material-icons-outlined text-lg">bookmark_border</span>
        </button>
        <button className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-pointer">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi_Ogv2zX8aMdig05_knblWv1pktOvmWjqjPtdTUfTsRclNPplctlJ3iVIlFhIhj0q0DXf6q2cscRlpBh8RyH4DLbLRiVk9PZSKfNeFwmstLycjiqr3rL1WmpTd2r5MYg3TQzkZ4x9kk6A8CNaf78Lj3JJLxWjr5ekL3Kx2r-h7Sh-yUA7lOQVdhSoZR2cr8AdIe8ocFwkVFQuHNyeXNOqXay6IS2wgAuxxHZYKk6rNYAeMSHmnHDz3LDbEE9pHz45knTkSzqD5w" 
            alt="User" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/40/40';
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;