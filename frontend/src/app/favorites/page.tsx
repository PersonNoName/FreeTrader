"use client";
import { useState, useEffect, useRef } from 'react';
// import { SECTORS_DATA } from '@/lib/constants';
import { TimeRange } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MoreHorizontal, Download, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createChart, ColorType, Time, LineSeries } from 'lightweight-charts';

export default function SectorFavorites() {
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.D1);
    const setSelectedSector = useStore((state) => state.setSelectedSector);
    const sectors = useStore((state) => state.sectors);
    const toggleSectorFavorite = useStore((state) => state.toggleSectorFavorite);
    const fetchSectors = useStore((state) => state.fetchSectors);

    // Fetch sectors on mount
    useEffect(() => {
        fetchSectors();
    }, [fetchSectors]);

    const favorites = sectors.filter(s => s.isFavorite);
    const avgReturn = favorites.reduce((acc, curr) => acc + curr.change, 0) / (favorites.length || 1);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Chart Effect
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: 'rgba(229, 231, 235, 0.2)' },
                horzLines: { color: 'rgba(229, 231, 235, 0.2)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            rightPriceScale: {
                borderVisible: false,
            },
            timeScale: {
                borderVisible: false,
            },
        });

        // Generate Mock Data for each favorite
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        const today = new Date();

        favorites.forEach((fav, index) => {
            const series = chart.addSeries(LineSeries, {
                color: colors[index % colors.length],
                lineWidth: 2,
                title: fav.name,
            });

            const data = Array.from({ length: 50 }, (_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() - (50 - i));
                // Random walk logic
                const base = fav.price;
                const randomChange = (Math.random() - 0.5) * (fav.change / 10); // volatility
                const value = base * (1 + (i * (fav.change / 1000)) + randomChange);

                return {
                    time: date.toISOString().split('T')[0] as Time,
                    value: value
                };
            });

            series.setData(data);
        });

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [favorites]); // Re-render when favorites change

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Your Watchlist</h2>
                    <p className="text-muted-foreground mt-1">Real-time tracking of your {favorites.length} favorite sectors</p>
                </div>
                <div className="bg-card p-1 rounded-lg border shadow-sm flex">
                    {Object.values(TimeRange).map((range) => (
                        <Button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            variant={timeRange === range ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 text-xs font-bold"
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Side: Summary + List */}
                <div className="lg:col-span-1 flex flex-col gap-4">

                    {/* Watchlist Summary Card */}
                    <Card className="bg-slate-950 text-white border-slate-800 shadow-xl overflow-hidden relative">
                        <CardContent className="p-6 relative z-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Watchlist Performance</p>
                            <h3 className="text-3xl font-bold mb-4">{avgReturn > 0 ? '+' : ''}{avgReturn.toFixed(2)}% <span className="text-sm font-normal text-slate-400">Avg Return</span></h3>
                            <div className="flex gap-4 border-t border-slate-800 pt-4 mt-2">
                                <div>
                                    <span className="block text-xs text-slate-400">Top Gainer</span>
                                    <span className="text-green-400 font-semibold text-sm">Tech (+12.5%)</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400">Items</span>
                                    <span className="text-white font-semibold text-sm">{favorites.length} Sectors</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex-1 max-h-[400px] overflow-y-auto space-y-3 pr-1">
                        {favorites.map((sector) => (
                            <Card
                                key={sector.id}
                                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                                onClick={() => setSelectedSector(sector)}
                            >
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                                                {sector.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground leading-tight">{sector.name}</h3>
                                                <p className="text-xs text-muted-foreground">{sector.description}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-yellow-400 hover:text-yellow-500 rounded-full h-8 w-8 hover:bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSectorFavorite(sector.id);
                                            }}
                                        >
                                            <Star className="fill-current w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="w-full h-px bg-border"></div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Current Price</span>
                                            <span className="text-lg font-bold text-foreground">${sector.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-muted-foreground">24h Change</span>
                                            <Badge variant={sector.change >= 0 ? "default" : "destructive"} className={cn("px-2 py-0.5 mt-1", sector.change >= 0 ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300")}>
                                                {sector.change > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                                {Math.abs(sector.change)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add to Watchlist - Show non-favorite sectors */}
                        {sectors.filter(s => !s.isFavorite).length > 0 && (
                            <div className="relative group">
                                <Button variant="outline" className="w-full py-6 border-dashed border-2 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-muted/50 gap-2 h-auto">
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    Add to Watchlist
                                </Button>
                                {/* Dropdown menu for adding sectors */}
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[200px] overflow-y-auto">
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

                {/* Right Side: Comparison Chart */}
                <Card className="lg:col-span-3 flex flex-col min-h-[500px]">
                    <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <Star className="text-muted-foreground h-5 w-5" />
                                Performance Comparison
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-[400px] relative" ref={chartContainerRef}>
                            {/* Chart mounts here */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
