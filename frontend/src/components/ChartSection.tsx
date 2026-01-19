"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, Time, LineSeries, IChartApi } from 'lightweight-charts';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartLine, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeRange } from '@/lib/types';

// 图表线条颜色
const LINE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#a855f7', '#f97316'];

export default function ChartSection() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const [activeRange, setActiveRange] = useState<TimeRange>(TimeRange.M1);
    
    const selectedFundsForChart = useStore((state) => state.selectedFundsForChart);
    const selectedSector = useStore((state) => state.selectedSector);

    // 根据时间范围计算数据点数量
    const dataPoints = useMemo(() => {
        switch (activeRange) {
            case TimeRange.D1: return 24;
            case TimeRange.M1: return 30;
            case TimeRange.Y1: return 365;
            case TimeRange.Y3: return 365 * 3;
            case TimeRange.Y5: return 365 * 5;
            default: return 30;
        }
    }, [activeRange]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 清除旧图表
        if (chartRef.current) {
            chartRef.current.remove();
        }

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
                scaleMargins: { top: 0.2, bottom: 0.2 }, // 增加留白，避免线条顶天立地，看起来太陡峭
            },
            timeScale: {
                borderVisible: false,
                fixLeftEdge: true,
                fixRightEdge: true,
            },
            crosshair: {
                vertLine: {
                    color: 'rgba(229, 231, 235, 0.5)',
                    width: 1,
                    style: 3,
                    labelVisible: false,
                },
                horzLine: {
                    color: 'rgba(229, 231, 235, 0.5)',
                    width: 1,
                    style: 3,
                    labelVisible: true,
                },
            },
        });

        chartRef.current = chart;

        // 如果没有选中基金，显示板块整体趋势
        if (selectedFundsForChart.length === 0 && selectedSector?.trend) {
            const series = chart.addSeries(LineSeries, {
                color: LINE_COLORS[0],
                lineWidth: 2,
                crosshairMarkerVisible: true,
                title: selectedSector.name,
            });

            const today = new Date();
            const data = selectedSector.trend.map((value, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() - (selectedSector.trend.length - i));
                return {
                    time: date.toISOString().split('T')[0] as Time,
                    value: value,
                };
            });
            series.setData(data);
        } else {
            // 为每个选中的基金生成模拟数据并添加到图表
            selectedFundsForChart.forEach((fund, index) => {
                const series = chart.addSeries(LineSeries, {
                    color: LINE_COLORS[index % LINE_COLORS.length],
                    lineWidth: 2,
                    crosshairMarkerVisible: true,
                    title: fund.fullName,
                });

                // 使用随机游走模型 (Random Walk) 生成更真实的金融曲线
                const today = new Date();
                const basePrice = fund.price || 1;
                const totalReturn = (fund.returns || 0) / 100;
                
                // 每日波动率 (Vol) 和 漂移项 (Drift)
                // 减少波动率使曲线更平滑
                const volatility = 0.015; 
                
                // 从起始价格倒推历史数据，或者从过去推到现在
                // 这里我们生成过去 dataPoints 天的数据
                
                // 假设 basePrice 是今天的价格，我们需要反推过去的价格
                // 或者我们设定 startPrice，让它走 dataPoints 步到达现在的价格附近
                
                let currentPrice = basePrice / (1 + totalReturn); // 估算起始价格
                const trendStep = totalReturn / dataPoints; // 简单的平均每日趋势

                const data = [];
                for (let i = 0; i < dataPoints; i++) {
                     const date = new Date(today);
                    if (activeRange === TimeRange.D1) {
                        date.setHours(today.getHours() - (dataPoints - i));
                    } else {
                        date.setDate(today.getDate() - (dataPoints - i));
                    }
                    
                    // 随机游走: 下一步价格 = 当前价格 * (1 + 趋势 + 随机波动)
                    // 使用正态分布近似 (Box-Muller transform 或简单随机)
                    const randomShock = (Math.random() - 0.5) * volatility;
                    const change = trendStep + randomShock;
                    
                    currentPrice = currentPrice * (1 + change);
                    
                    // 确保价格为正数且保留合理精度
                    const finalValue = Math.max(0.01, currentPrice);

                    data.push({
                        time: (activeRange === TimeRange.D1 
                            ? Math.floor(date.getTime() / 1000) 
                            : date.toISOString().split('T')[0]) as Time,
                        value: finalValue,
                    });
                }
                
                series.setData(data);
            });
        }

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth, 
                    height: chartContainerRef.current.clientHeight 
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedFundsForChart, activeRange, dataPoints, selectedSector]);

    // 清理图表
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <Card className="bg-card rounded-2xl border shadow-sm p-4 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-lg p-1">
                        <Button variant="secondary" size="sm" className="h-7 text-xs bg-background shadow-sm">净值</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">市值</Button>
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

            {/* 图例 */}
            {selectedFundsForChart.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2 shrink-0">
                    {selectedFundsForChart.map((fund, index) => (
                        <div key={fund.name} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: LINE_COLORS[index % LINE_COLORS.length] }}
                            />
                            <span className="text-xs text-muted-foreground">{fund.fullName}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-1 relative w-full min-h-0" ref={chartContainerRef}>
                {selectedFundsForChart.length === 0 && !selectedSector?.trend && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p>请从左侧选择基金添加到图表</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
