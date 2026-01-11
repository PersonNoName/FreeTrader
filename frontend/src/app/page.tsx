"use client";
import { useEffect } from 'react';
// import { SECTORS_DATA } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Plus, ArrowRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const setSelectedSector = useStore((state) => state.setSelectedSector);
  const sectors = useStore((state) => state.sectors);
  const toggleSectorFavorite = useStore((state) => state.toggleSectorFavorite);
  const fetchSectors = useStore((state) => state.fetchSectors);

  // Fetch sectors on mount
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const favorites = sectors.filter(s => s.isFavorite);
  const topMovers = [...sectors].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

  // Calculate Market Pulse based on all sectors
  const marketAvg = sectors.length > 0 ? sectors.reduce((acc, curr) => acc + curr.change, 0) / sectors.length : 0;
  const upCount = sectors.filter(s => s.change > 0).length;
  const sentiment = upCount > sectors.length / 2 ? 'Bullish' : 'Bearish';

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
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Market Pulse Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 overflow-hidden relative border-none shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Market Pulse</h1>
              <p className="text-slate-300 max-w-lg">
                The market is currently <span className={cn("font-bold", marketAvg >= 0 ? "text-green-400" : "text-red-400")}>{sentiment}</span>.
                {upCount} out of {sectors.length} sectors are trading in the green today.
              </p>
            </div>

            <div className="mt-8 flex items-end gap-12">
              <div>
                <span className="block text-sm text-slate-400 mb-1 font-medium">Avg. Sector Return</span>
                <span className={cn("text-4xl font-bold tracking-tight", marketAvg >= 0 ? "text-green-400" : "text-red-400")}>
                  {marketAvg > 0 ? '+' : ''}{marketAvg.toFixed(2)}%
                </span>
              </div>
              <div className="h-12 w-px bg-slate-700/50"></div>
              <div>
                <span className="block text-sm text-slate-400 mb-1 font-medium">Total Volume</span>
                <span className="text-4xl font-bold text-white tracking-tight">42.8T</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stat Card */}
        <Card className="flex flex-col justify-center relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
          <CardContent className="p-6 relative z-10 flex flex-col h-full justify-center">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-muted-foreground font-medium uppercase tracking-wider text-xs mb-3">Portfolio Health</h3>
            <div className="text-5xl font-bold text-foreground mb-3 tracking-tighter">94<span className="text-lg text-muted-foreground font-normal">/100</span></div>
            <p className="text-sm text-muted-foreground">Your watchlist is outperforming the general market average by 1.4%.</p>
            <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[94%]"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Favorites (2/3 width on large screens) */}
        <Card className="xl:col-span-2 flex flex-col overflow-hidden">
          <CardContent className="p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Star className="text-primary h-5 w-5" />
                Watchlist
              </h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Customize</Button>
            </div>

            <div className="max-h-[380px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map(sector => (
                <Card
                  key={sector.id}
                  className="hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => setSelectedSector(sector)}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-sm shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {sector.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{sector.name}</h3>
                          <span className="text-xs text-muted-foreground">{sector.marketCap} Cap</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectorFavorite(sector.id);
                          }}
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                        <Badge variant={sector.change >= 0 ? "default" : "destructive"} className={cn("text-xs font-bold px-2 py-0.5", sector.change >= 0 ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200")}>
                          {sector.change > 0 ? '+' : ''}{sector.change}%
                        </Badge>
                      </div>
                    </div>

                    {/* Sparkline Area */}
                    <div className="h-12 mb-2 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      {renderSparkline(sector.trend, sector.change >= 0)}
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-muted/50">
                      <span>{sector.fundsCount} Funds</span>
                      <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Details <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Card - Show non-favorite sectors to add */}
              {sectors.filter(s => !s.isFavorite).length > 0 && (
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    className="h-[180px] w-full border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-muted/30 transition-all shadow-none peer"
                  >
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="font-medium text-sm">Add Sector</span>
                  </Button>
                  {/* Dropdown menu for adding sectors */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[200px] overflow-y-auto">
                    {sectors.filter(s => !s.isFavorite).map(sector => (
                      <button
                        key={sector.id}
                        className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between text-sm"
                        onClick={() => toggleSectorFavorite(sector.id)}
                      >
                        <span className="font-medium">{sector.name}</span>
                        <Badge variant={sector.change >= 0 ? "default" : "destructive"} className="text-xs">
                          {sector.change > 0 ? '+' : ''}{sector.change}%
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Right Column: Top Movers (1/3 width) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="text-muted-foreground h-5 w-5" />
              Top Movers
            </h2>
            <div className="flex bg-muted rounded-lg p-0.5">
              <Button variant="secondary" size="sm" className="h-6 text-[10px] px-2 shadow-sm">1D</Button>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground">1W</Button>
            </div>
          </div>

          <Card className="overflow-hidden flex-1 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Sector</th>
                    <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topMovers.map((sector, idx) => (
                    <tr key={sector.id} className="hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => setSelectedSector(sector)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground w-6">{idx + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectorFavorite(sector.id);
                            }}
                          >
                            <Star className={`h-4 w-4 ${sector.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400"}`} />
                          </Button>
                          <div>
                            <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{sector.name}</div>
                            <div className="text-[10px] text-muted-foreground">{sector.marketCap}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className={cn("text-sm font-bold", sector.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                          {sector.change > 0 ? '+' : ''}{sector.change}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">${sector.price.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t bg-muted/20 text-center">
              <Button variant="link" className="text-xs h-auto p-0 text-primary">
                View Full Market Report <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
