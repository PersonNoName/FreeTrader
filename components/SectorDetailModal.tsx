import React from 'react';
import Sidebar from './Sidebar';
import ChartSection from './ChartSection';
import StockTable from './StockTable';
import { SectorData } from '../types';

interface SectorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: SectorData | null;
}

const SectorDetailModal: React.FC<SectorDetailModalProps> = ({ isOpen, onClose, sector }) => {
  if (!isOpen || !sector) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-background-light w-[95vw] h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-[scaleUp_0.3s_ease-out]">
        
        {/* Modal Header */}
        <div className="bg-surface-light border-b border-border-light px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {sector.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{sector.name} Sector Analysis</h2>
              <p className="text-xs text-gray-500">Detailed breakdown and fund comparison</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <span className="material-icons-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Original App Layout Content */}
        <div className="flex-1 overflow-auto p-6 bg-background-light">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 h-full min-h-min">
            {/* We reuse the components from the original App.tsx here */}
            <Sidebar />
            <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-6">
              <ChartSection />
              <StockTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorDetailModal;