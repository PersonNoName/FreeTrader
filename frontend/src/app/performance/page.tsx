"use client";
import React, { useState, useEffect } from 'react';
import { TimeRange } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, LayoutGrid, Download } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function SectorPerformance() {
    const [limit, setLimit] = useState(5);
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.D1);
    const setSelectedSector = useStore((state) => state.setSelectedSector);
    const sectors = useStore((state) => state.sectors);
    const fetchSectors = useStore((state) => state.fetchSectors);

    // Fetch sectors on mount
    useEffect(() => {
        fetchSectors();
    }, [fetchSectors]);

    // Filter and sort top sectors by change
    const sortedData = [...sectors].sort((a, b) => b.change - a.change);
    const chartData = sortedData.slice(0, limit);

    const bestSector = sortedData[0] || { name: '-', change: 0 };
    const worstSector = sortedData[sortedData.length - 1] || { name: '-', change: 0 };
    const totalFunds = sortedData.reduce((acc, curr) => acc + curr.fundsCount, 0);

    // Helper to render custom vertical bars
    const maxChange = Math.max(...chartData.map(d => Math.abs(d.change)));

    return (
        <div className="p-6 max-w-[1600px] mx-auto flex flex-col h-full gap-6 animate-in fade-in duration-500">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Sector Performance</h2>
                    <p className="text-muted-foreground mt-1">Deep dive into market segments and fund trends</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-card p-1.5 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Limit</span>
                        <div className="flex bg-muted rounded-lg p-1">
                            {[3, 5, 8].map((num) => (
                                <Button
                                    key={num}
                                    onClick={() => setLimit(num)}
                                    variant={limit === num ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn("h-7 w-8 text-xs bg-transparent", limit === num && "bg-background shadow-sm")}
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="w-px h-6 bg-border"></div>
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Period</span>
                        <div className="flex bg-muted rounded-lg p-1">
                            {Object.values(TimeRange).map((range) => (
                                <Button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    variant={timeRange === range ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn("h-7 px-3 text-xs bg-transparent", timeRange === range && "bg-background shadow-sm")}
                                >
                                    {range}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <Card className="hover:border-green-500/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Top Performer</p>
                            <p className="text-lg font-bold text-foreground">{bestSector.name}</p>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">+{bestSector.change}%</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-red-500/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Underperformer</p>
                            <p className="text-lg font-bold text-foreground">{worstSector.name}</p>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{worstSector.change}%</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <LayoutGrid className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Total Funds Tracked</p>
                            <p className="text-lg font-bold text-foreground">{totalFunds}</p>
                            <p className="text-xs text-muted-foreground"> across {sectors.length} sectors</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 pb-6">

                {/* Custom Bar Chart Section */}
                <Card className="flex flex-col min-h-[400px]">
                    <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                            <TrendingUp className="text-muted-foreground h-5 w-5" />
                            Relative Performance
                        </h3>

                        <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 h-64 border-b border-dashed border-border">
                            {chartData.map((item) => {
                                const heightPercent = (Math.abs(item.change) / maxChange) * 100;
                                const isPositive = item.change >= 0;
                                return (
                                    <div key={item.id} className="flex flex-col items-center gap-2 group cursor-pointer w-full" onClick={() => setSelectedSector(item)}>
                                        <span className={cn("text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity", isPositive ? "text-green-600" : "text-red-600")}>
                                            {isPositive ? '+' : ''}{item.change}%
                                        </span>
                                        <div
                                            className={cn(
                                                "w-full max-w-[40px] rounded-t-lg transition-all hover:opacity-80 relative",
                                                isPositive ? "bg-blue-500" : "bg-red-500"
                                            )}
                                            style={{ height: `${Math.max(heightPercent, 2)}%` }} // Minimum 2% height for visibility
                                        >
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-between gap-2 px-2 mt-2">
                            {chartData.map((item) => (
                                <div key={item.id} className="text-[10px] md:text-xs text-center w-full truncate font-medium text-muted-foreground">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Table Section */}
                <Card className="flex flex-col min-h-[400px] overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-bold text-foreground">Breakdown</h3>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 gap-2">
                            <Download className="h-3 w-3" /> Export CSV
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-background sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Sector</TableHead>
                                    <TableHead className="text-right">Funds</TableHead>
                                    <TableHead className="text-right">Return</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData.map((sector, index) => (
                                    <TableRow key={sector.id} className="cursor-pointer group" onClick={() => setSelectedSector(sector)}>
                                        <TableCell className="text-center text-muted-foreground font-mono text-xs">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-muted border flex items-center justify-center text-foreground mr-3 font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    {sector.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">{sector.name}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{sector.marketCap} Cap</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                                                <span className="text-sm font-medium">{sector.fundsCount}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={sector.change >= 0 ? "outline" : "destructive"} className={cn("w-16 justify-center", sector.change >= 0 ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20" : "")}>
                                                {sector.change > 0 ? '+' : ''}{sector.change}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
