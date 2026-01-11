import React from 'react';
import { SECTORS_DATA } from '../constants';
import { SectorData } from '../types';

interface DashboardProps {
  onSectorClick: (sector: SectorData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSectorClick }) => {
  const favorites = SECTORS_DATA.filter(s => s.isFavorite);
  const topMovers = [...SECTORS_DATA].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);
  
  // Calculate Market Pulse based on all sectors
  const marketAvg = SECTORS_DATA.reduce((acc, curr) => acc + curr.change, 0) / SECTORS_DATA.length;
  const upCount = SECTORS_DATA.filter(s => s.change > 0).length;
  const sentiment = upCount > SECTORS_DATA.length / 2 ? 'Bullish' : 'Bearish';

  // Helper for simple SVG sparkline
  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length === 0) return null;
    const width = 100;
    const height = 30;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Create points for polyline
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <polyline 
          points={points} 
          fill="none" 
          stroke={isPositive ? '#10b981' : '#ef4444'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 w-full">
      {/* Market Pulse Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl font-bold mb-2">Market Pulse</h1>
              <p className="text-gray-400 max-w-lg">
                The market is currently <span className={marketAvg >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{sentiment}</span>. 
                {upCount} out of {SECTORS_DATA.length} sectors are trading in the green today.
              </p>
            </div>
            <div className="mt-8 flex items-end gap-8">
              <div>
                <span className="block text-sm text-gray-400 mb-1">Avg. Sector Return</span>
                <span className={`text-3xl font-bold ${marketAvg >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {marketAvg > 0 ? '+' : ''}{marketAvg.toFixed(2)}%
                </span>
              </div>
              <div className="h-10 w-px bg-gray-700"></div>
              <div>
                <span className="block text-sm text-gray-400 mb-1">Total Volume</span>
                <span className="text-3xl font-bold text-white">42.8T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stat Card */}
        <div className="bg-white rounded-2xl p-6 border border-border-light shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-icons-outlined text-6xl text-primary">analytics</span>
           </div>
           <h3 className="text-gray-500 font-medium uppercase tracking-wider text-xs mb-2">Portfolio Health</h3>
           <div className="text-4xl font-bold text-gray-900 mb-2">94<span className="text-lg text-gray-400 font-normal">/100</span></div>
           <p className="text-sm text-gray-500">Your watchlist is outperforming the general market average by 1.4%.</p>
           <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
             <div className="bg-primary h-full rounded-full" style={{ width: '94%' }}></div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Favorites (2/3 width on large screens) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-icons-outlined text-primary">star_border</span>
              Watchlist
            </h2>
            <button className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Customize</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map(sector => (
              <div 
                key={sector.id} 
                onClick={() => onSectorClick(sector)}
                className="bg-white p-5 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-sm shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {sector.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{sector.name}</h3>
                      <span className="text-xs text-gray-500">{sector.marketCap} Cap</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sector.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {sector.change > 0 ? '+' : ''}{sector.change}%
                  </div>
                </div>
                
                {/* Sparkline Area */}
                <div className="h-12 mb-2 w-full">
                  {renderSparkline(sector.trend, sector.change >= 0)}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-50">
                   <span>{sector.fundsCount} Funds</span>
                   <span className="group-hover:translate-x-1 transition-transform">Details &rarr;</span>
                </div>
              </div>
            ))}
            
            {/* Add New Card */}
            <button className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-blue-50/20 transition-all min-h-[160px]">
               <span className="material-icons-outlined text-3xl mb-2">add_circle_outline</span>
               <span className="font-medium text-sm">Add Sector</span>
            </button>
          </div>
        </div>

        {/* Right Column: Top Movers (1/3 width) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-icons-outlined text-gray-400">trending_up</span>
              Top Movers
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
               <button className="px-2 py-0.5 text-[10px] font-bold bg-white shadow-sm rounded text-gray-900">1D</button>
               <button className="px-2 py-0.5 text-[10px] font-medium text-gray-500 hover:text-gray-900">1W</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-border-light">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sector</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topMovers.map((sector, idx) => (
                    <tr key={sector.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onSectorClick(sector)}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="text-xs font-mono text-gray-400 w-6">{idx + 1}</span>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{sector.name}</div>
                            <div className="text-[10px] text-gray-500">{sector.marketCap}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className={`text-sm font-bold ${sector.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sector.change > 0 ? '+' : ''}{sector.change}%
                        </div>
                        <div className="text-[10px] text-gray-400">${sector.price.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-border-light bg-gray-50/30 text-center">
               <button className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1">
                 View Full Market Report <span className="material-icons-outlined text-[10px]">arrow_forward</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;