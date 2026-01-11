export interface StockData {
  name: string;
  fullName: string;
  price: number;
  fcfShare: number;
  mktCap: string;
  returns: number;
  returnsPercent: number;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
  isFavorite?: boolean;
}

export interface ChartDataPoint {
  date: string;
  value1: number; // Market Cap (Blue)
  value2: number; // Price Target (Red)
}

export interface Suggestion {
  symbol: string;
  metric: string;
}

export enum TimeRange {
  D1 = '1D',
  M1 = '1M',
  Y1 = '1Y',
  Y3 = '3Y',
  Y5 = '5Y',
}

export interface SectorData {
  id: string;
  name: string;
  change: number; // Percentage
  price: number;
  marketCap: string;
  isFavorite: boolean;
  fundsCount: number;
  description: string;
  trend: number[]; // Simple array for sparklines
}

export type ViewState = 'dashboard' | 'performance' | 'favorites';