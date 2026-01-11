import { ChartDataPoint, StockData, Suggestion, SectorData } from './types';

export const STOCK_DATA: StockData[] = [
  {
    name: 'AAPL',
    fullName: 'This stock',
    price: 189.23,
    fcfShare: 1.12,
    mktCap: '1.12T',
    returns: -1.72,
    returnsPercent: -0.98,
    icon: 'apple',
    iconBg: 'bg-black',
    iconColor: 'text-white',
    isFavorite: true
  },
  {
    name: 'F',
    fullName: 'Ford Motors Company',
    price: 12.04,
    fcfShare: 1.70,
    mktCap: '15.70B',
    returns: 0.02,
    returnsPercent: 0.27,
    icon: 'F',
    iconBg: 'bg-blue-900',
    iconColor: 'text-white'
  },
  {
    name: 'SHEL',
    fullName: 'Shell plc',
    price: 65.23,
    fcfShare: 9.35,
    mktCap: '49.35B',
    returns: 0.13,
    returnsPercent: 0.28,
    icon: 'S',
    iconBg: 'bg-yellow-400',
    iconColor: 'text-white'
  },
  {
    name: 'TSLA',
    fullName: 'Tesla Inc.',
    price: 210.33,
    fcfShare: -2.51,
    mktCap: '2.51B',
    returns: -0.02,
    returnsPercent: -1.54,
    icon: 'T',
    iconBg: 'bg-red-600',
    iconColor: 'text-white'
  },
  {
    name: 'RIVN',
    fullName: 'Rivian Automotive, Inc.',
    price: 15.42,
    fcfShare: 2.18,
    mktCap: '21.18B',
    returns: 3.36,
    returnsPercent: 12.71,
    icon: 'R',
    iconBg: 'bg-yellow-600',
    iconColor: 'text-white'
  }
];

export const SUGGESTIONS: Suggestion[] = [
  { symbol: 'GM', metric: 'Net Income Actual' },
  { symbol: 'LI', metric: 'Net Income Actual' },
  { symbol: 'MBGYY', metric: 'Net Income Actual' },
  { symbol: 'HMC', metric: 'Net Income Actual' },
  { symbol: 'LCID', metric: 'Net Income Actual' },
];

// Generate smooth looking random walk data for chart
export const CHART_DATA: ChartDataPoint[] = Array.from({ length: 20 }, (_, i) => {
  const baseValue1 = 200 + Math.random() * 100 + (i * 15);
  const baseValue2 = 180 + Math.random() * 80 + (i * 5);
  return {
    date: `Day ${i + 1}`,
    value1: baseValue1, // Blue line (Market Cap mock)
    value2: baseValue2  // Red line (Price Target mock)
  };
});

export const SECTORS_DATA: SectorData[] = [
  { id: 'tech', name: 'Technology', change: 12.5, price: 1450.20, marketCap: '12.4T', isFavorite: true, fundsCount: 45, description: 'Software, Hardware, and AI', trend: [10, 12, 11, 13, 15, 14, 16] },
  { id: 'energy', name: 'Energy', change: -2.3, price: 890.50, marketCap: '4.2T', isFavorite: false, fundsCount: 22, description: 'Oil, Gas, and Renewables', trend: [10, 9, 8, 9, 8, 7, 8] },
  { id: 'health', name: 'Healthcare', change: 5.1, price: 1200.80, marketCap: '6.1T', isFavorite: true, fundsCount: 30, description: 'Pharma and Biotech', trend: [10, 11, 11, 12, 12, 13, 14] },
  { id: 'finance', name: 'Financials', change: 1.2, price: 950.30, marketCap: '8.5T', isFavorite: false, fundsCount: 50, description: 'Banks and Insurance', trend: [10, 10, 11, 10, 11, 11, 11] },
  { id: 'consumer', name: 'Consumer Discretionary', change: 8.4, price: 1100.40, marketCap: '5.8T', isFavorite: true, fundsCount: 35, description: 'Retail and Automotive', trend: [10, 11, 12, 13, 14, 15, 16] },
  { id: 'utils', name: 'Utilities', change: -0.5, price: 780.10, marketCap: '2.1T', isFavorite: false, fundsCount: 15, description: 'Electric and Water', trend: [10, 10, 9, 9, 9, 10, 9] },
  { id: 'realestate', name: 'Real Estate', change: -4.2, price: 650.00, marketCap: '1.8T', isFavorite: false, fundsCount: 18, description: 'REITs and Development', trend: [10, 9, 8, 7, 6, 7, 6] },
  { id: 'industrial', name: 'Industrials', change: 3.8, price: 920.60, marketCap: '3.4T', isFavorite: false, fundsCount: 28, description: 'Manufacturing and Defense', trend: [10, 10, 11, 11, 12, 12, 13] },
];