"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, Time, AreaSeries } from 'lightweight-charts';
import { CHART_DATA } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartLine, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeRange } from '@/lib/types';

export default function ChartSection() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [activeRange, setActiveRange] = useState<TimeRange>(TimeRange.D1);

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
            height: chartContainerRef.current.clientHeight, // Use full available height
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                borderVisible: false,
            },
            crosshair: {
                vertLine: {
                    labelVisible: false,
                },
            },
        });

        // Map CHART_DATA to date series. Assuming daily data ending today.
        const today = new Date();
        const data1 = CHART_DATA.map((d, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (CHART_DATA.length - i));
            return {
                time: date.toISOString().split('T')[0] as Time,
                value: d.value1
            };
        });

        const data2 = CHART_DATA.map((d, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (CHART_DATA.length - i));
            return {
                time: date.toISOString().split('T')[0] as Time,
                value: d.value2
            };
        });

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: '#3b82f6', // primary blue
            topColor: 'rgba(59, 130, 246, 0.2)',
            bottomColor: 'rgba(59, 130, 246, 0.0)',
            lineWidth: 2,
        });
        areaSeries.setData(data1);

        const areaSeries2 = chart.addSeries(AreaSeries, {
            lineColor: '#ef4444', // red
            topColor: 'rgba(239, 68, 68, 0.2)',
            bottomColor: 'rgba(239, 68, 68, 0.0)',
            lineWidth: 2,
        });
        areaSeries2.setData(data2);

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
    }, []);

    return (
        <Card className="bg-card rounded-2xl border shadow-sm p-6 flex flex-col h-full min-h-[500px] xl:min-h-[600px]">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-lg p-1">
                        <Button variant="secondary" size="sm" className="h-7 text-xs bg-background shadow-sm">Price</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Market Cap</Button>
                    </div>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <ChartLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <BarChart2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex bg-muted rounded-lg p-1">
                    {Object.values(TimeRange).map((range) => (
                        <Button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            variant={activeRange === range ? 'secondary' : 'ghost'}
                            size="sm"
                            className={cn(
                                "h-7 text-xs px-3",
                                activeRange === range && "bg-background shadow-sm"
                            )}
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative w-full min-h-[300px]" ref={chartContainerRef}>
                {/* Chart mounts here */}
            </div>
        </Card>
    );
}
