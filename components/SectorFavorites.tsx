import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SECTORS_DATA } from '../constants';
import { SectorData, TimeRange } from '../types';

interface SectorFavoritesProps {
  onSectorClick: (sector: SectorData) => void;
}

const SectorFavorites: React.FC<SectorFavoritesProps> = ({ onSectorClick }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.D1);
  const favorites = SECTORS_DATA.filter(s => s.isFavorite);

  // Mock data generation for line chart based on favorites
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const point: any = { name: `T${i + 1}` };
    favorites.forEach(fav => {
      // Simulate some trend based on the sector's base change
      point[fav.name] = fav.price * (1 + (fav.change / 100) * (Math.random() * 0.5)); 
    });
    return point;
  });

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  // Computed Avg Return for Summary Card
  const avgReturn = favorites.reduce((acc, curr) => acc + curr.change, 0) / (favorites.length || 1);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Watchlist</h2>
          <p className="text-gray-500 mt-1">Real-time tracking of your {favorites.length} favorite sectors</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-border-light flex shadow-sm">
           {Object.values(TimeRange).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  timeRange === range ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Summary + List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* Watchlist Summary Card (Dark Theme for Contrast) */}
          <div className="bg-gray-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
             <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Watchlist Performance</p>
             <h3 className="text-2xl font-bold mb-4">{avgReturn > 0 ? '+' : ''}{avgReturn.toFixed(2)}% <span className="text-sm font-normal text-gray-400">Avg Return</span></h3>
             <div className="flex gap-4 border-t border-gray-700 pt-4">
                 <div>
                    <span className="block text-xs text-gray-400">Top Gainer</span>
                    <span className="text-green-400 font-semibold text-sm">Tech (+12.5%)</span>
                 </div>
                 <div>
                    <span className="block text-xs text-gray-400">Items</span>
                    <span className="text-white font-semibold text-sm">{favorites.length} Sectors</span>
                 </div>
             </div>
          </div>

          <div className="flex-1 space-y-3">
            {favorites.map((sector) => (
              <div 
                key={sector.id}
                onClick={() => onSectorClick(sector)}
                className="bg-white p-4 rounded-xl border border-border-light hover:border-primary hover:shadow-md transition-all cursor-pointer group flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-700 border border-gray-100 flex items-center justify-center font-bold shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {sector.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{sector.name}</h3>
                      <p className="text-xs text-gray-500">{sector.description}</p>
                    </div>
                  </div>
                  <button className="text-yellow-400 hover:scale-110 transition-transform">
                    <span className="material-icons-outlined">star</span>
                  </button>
                </div>
                
                <div className="w-full h-px bg-gray-100"></div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-400">Current Price</span>
                     <span className="text-lg font-bold text-gray-900">${sector.price.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-xs text-gray-400">24h Change</span>
                     <span className={`text-sm font-bold px-2 py-0.5 rounded ${sector.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {sector.change > 0 ? '+' : ''}{sector.change}%
                     </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                 <span className="material-icons-outlined text-sm">add</span>
              </div>
              <span className="text-sm font-medium">Add to Watchlist</span>
            </button>
          </div>
        </div>

        {/* Right Side: Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-light p-6 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="material-icons-outlined text-gray-400">show_chart</span>
                Performance Comparison
             </h3>
             <div className="flex gap-2">
                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                    <span className="material-icons-outlined text-lg">download</span>
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                    <span className="material-icons-outlined text-lg">more_horiz</span>
                </button>
             </div>
          </div>
          
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  dy={10} 
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 12, fill: '#9ca3af' }} 
                   domain={['auto', 'auto']} 
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {favorites.map((fav, index) => (
                  <Line 
                    key={fav.id}
                    type="monotone" 
                    dataKey={fav.name} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    className="hover:opacity-100 transition-opacity"
                    style={{ opacity: 0.8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorFavorites;