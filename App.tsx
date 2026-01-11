import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import Dashboard from './components/Dashboard';
import SectorPerformance from './components/SectorPerformance';
import SectorFavorites from './components/SectorFavorites';
import SectorDetailModal from './components/SectorDetailModal';
import { SectorData, ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        if (selectedSector) {
           setSelectedSector(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSector]);

  const handleSectorClick = (sector: SectorData) => {
    setSelectedSector(sector);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSectorClick={handleSectorClick} />;
      case 'performance':
        return <SectorPerformance onSectorClick={handleSectorClick} />;
      case 'favorites':
        return <SectorFavorites onSectorClick={handleSectorClick} />;
      default:
        return <Dashboard onSectorClick={handleSectorClick} />;
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-background-light">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 overflow-auto custom-scrollbar relative">
        {renderContent()}
      </main>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      <SectorDetailModal 
        isOpen={!!selectedSector} 
        sector={selectedSector} 
        onClose={() => setSelectedSector(null)} 
      />
    </div>
  );
};

export default App;