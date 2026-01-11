import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';
import { TimeRange } from '../types';

const ChartSection: React.FC = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>(TimeRange.D1);

  return (
    <div className="md:col-span-2 xl:col-span-3 bg-surface-light rounded-2xl border border-border-light p-6 flex flex-col shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-medium bg-white text-gray-900 rounded shadow-sm">Price</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Market Cap</button>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <span className="material-icons-outlined text-lg">show_chart</span>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <span className="material-icons-outlined text-lg">candlestick_chart</span>
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          {Object.values(TimeRange).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative w-full h-full min-h-[300px]">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace' }}
              orientation="right"
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value1" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue1)" 
            />
            <Area 
              type="monotone" 
              dataKey="value2" 
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue2)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Simulated overlay data tags similar to screenshot */}
        <div className="absolute right-[20%] top-[35%] pointer-events-none hidden md:block">
           <div className="bg-primary text-white text-[10px] px-2 py-0.5 rounded shadow-sm">482.00B</div>
           <div className="w-2 h-2 bg-primary rounded-full mt-1 ml-6 border-2 border-white animate-pulse"></div>
        </div>
        <div className="absolute right-[15%] top-[55%] pointer-events-none hidden md:block">
           <div className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded shadow-sm">218.00B</div>
           <div className="w-2 h-2 bg-secondary rounded-full mt-1 ml-6 border-2 border-white"></div>
        </div>

      </div>
    </div>
  );
};

export default ChartSection;