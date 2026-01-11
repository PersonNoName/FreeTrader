import React from 'react';
import { STOCK_DATA } from '../constants';

const StockTable: React.FC = () => {
  return (
    <div className="md:col-span-3 xl:col-span-4 bg-surface-light rounded-2xl border border-border-light flex flex-col overflow-hidden shadow-sm h-fit mb-24">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light text-xs text-gray-500 uppercase sticky top-0 bg-surface-light z-10">
              <th className="py-3 px-4 font-medium w-12"></th>
              <th className="py-3 px-4 font-medium min-w-[200px]">Name</th>
              <th className="py-3 px-4 font-medium text-right">Price in USD</th>
              <th className="py-3 px-4 font-medium text-right">FCF/Share</th>
              <th className="py-3 px-4 font-medium text-right">Mkt Cap</th>
              <th className="py-3 px-4 font-medium text-right">1D Returns</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {STOCK_DATA.map((stock) => (
              <tr key={stock.name} className="hover:bg-gray-50 border-b border-border-light last:border-0 transition-colors cursor-pointer group">
                <td className="py-3 px-4 text-center">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${stock.iconBg} ${stock.iconColor}`}>
                    {stock.icon === 'apple' ? (
                       <span className="material-icons-outlined text-sm">apple</span>
                    ) : (
                      stock.icon
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{stock.name}</span>
                    {stock.name === 'AAPL' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">This stock</span>
                    ) : (
                        <span className="text-gray-500 truncate">{stock.fullName}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-medium">{stock.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-gray-900 font-medium">{stock.fcfShare.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-gray-900 font-medium">{stock.mktCap}</td>
                <td className={`py-3 px-4 text-right font-medium flex items-center justify-end gap-1 ${stock.returns >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                   <span className="material-icons-outlined text-sm">
                       {stock.returns >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
                   </span>
                   {stock.returns > 0 ? '+' : ''}{stock.returns} ({stock.returns > 0 ? '+' : ''}{stock.returnsPercent}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;