import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SECTORS_DATA } from '../constants';
import { SectorData, TimeRange } from '../types';

interface SectorPerformanceProps {
  onSectorClick: (sector: SectorData) => void;
}

const SectorPerformance: React.FC<SectorPerformanceProps> = ({ onSectorClick }) => {
  const [limit, setLimit] = useState(5);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.D1);

  // Filter and sort top sectors by change
  const sortedData = [...SECTORS_DATA].sort((a, b) => b.change - a.change);
  const chartData = sortedData.slice(0, limit);

  // Computed Stats for "Key Insights"
  const bestSector = sortedData[0];
  const worstSector = sortedData[sortedData.length - 1];
  const totalFunds = sortedData.reduce((acc, curr) => acc + curr.fundsCount, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col h-full gap-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sector Performance</h2>
          <p className="text-gray-500 text-sm mt-1">Deep dive into market segments and fund trends</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white p-1.5 rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Limit</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[3, 5, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setLimit(num)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    limit === num ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Period</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.values(TimeRange).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Row - Fills the emptiness at top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-4 group hover:border-green-200 transition-colors">
             <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                <span className="material-icons-outlined">trending_up</span>
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Top Performer</p>
                <p className="text-lg font-bold text-gray-900">{bestSector.name}</p>
                <p className="text-sm font-semibold text-green-600">+{bestSector.change}%</p>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-4 group hover:border-red-200 transition-colors">
             <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                <span className="material-icons-outlined">trending_down</span>
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Underperformer</p>
                <p className="text-lg font-bold text-gray-900">{worstSector.name}</p>
                <p className="text-sm font-semibold text-red-600">{worstSector.change}%</p>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-colors">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                <span className="material-icons-outlined">functions</span>
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Funds Tracked</p>
                <p className="text-lg font-bold text-gray-900">{totalFunds}</p>
                <p className="text-xs text-gray-400"> across {SECTORS_DATA.length} sectors</p>
             </div>
          </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 pb-6">
        
        {/* Chart Section */}
        <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-gray-400">bar_chart</span>
            Relative Performance
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }} 
                  dy={10} 
                  interval={0}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  tickFormatter={(val) => `${val}%`} 
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar 
                  dataKey="change" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40} 
                  onClick={(data) => onSectorClick(data as unknown as SectorData)} 
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.change >= 0 ? 'url(#colorUp)' : 'url(#colorDown)'} 
                        className="transition-all hover:opacity-80"
                    />
                  ))}
                </Bar>
                <defs>
                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table Section */}
        <div className="bg-white rounded-2xl border border-border-light shadow-sm flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-border-light flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-gray-400">table_rows</span>
                <h3 className="font-bold text-gray-900">Breakdown</h3>
            </div>
            <button className="text-xs font-semibold text-primary hover:bg-blue-50 px-2 py-1 rounded transition-colors">Export CSV</button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Funds</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sortedData.map((sector, index) => (
                  <tr 
                    key={sector.id} 
                    onClick={() => onSectorClick(sector)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 text-center">
                      <span className="text-xs font-mono text-gray-400 font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 mr-3 font-bold text-xs group-hover:bg-white group-hover:border-primary/20 group-hover:text-primary transition-all shadow-sm">
                          {sector.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{sector.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{sector.marketCap} Cap</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <span className="text-sm text-gray-600 font-medium">{sector.fundsCount}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <span className={`inline-block w-16 text-center py-1 rounded text-xs font-bold ${sector.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {sector.change > 0 ? '+' : ''}{sector.change}%
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorPerformance;