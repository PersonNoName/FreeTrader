"use client";
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

// 图表颜色
const CHART_COLORS = [
    { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
    { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
    { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500' },
    { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500' },
];

export default function Sidebar() {
    const stocks = useStore((state) => state.stocks);
    const selectedFundsForChart = useStore((state) => state.selectedFundsForChart);
    const addFundToChart = useStore((state) => state.addFundToChart);
    const removeFundFromChart = useStore((state) => state.removeFundFromChart);

    // 未选中的基金作为建议
    const suggestions = stocks.filter(
        stock => !selectedFundsForChart.some(f => f.name === stock.name)
    );

    // 如果没有基金数据，显示空状态
    if (stocks.length === 0) {
        return (
            <Card className="h-full flex flex-col overflow-hidden shadow-sm items-center justify-center">
                <div className="text-center p-4">
                    <div className="text-muted-foreground text-sm mb-1">暂无基金</div>
                    <p className="text-xs text-muted-foreground/70">该板块没有可比较的基金</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden shadow-sm">
            {/* Graph Selection Header */}
            <div className="px-3 pt-2 pb-0 shrink-0">
                <h2 className="font-semibold text-foreground text-[11px] uppercase tracking-wider mb-1">Graph selection</h2>
                <Button variant="outline" className="w-full justify-between h-6 text-[10px] px-2">
                    <span className="flex items-center gap-1">
                        <Plus className="h-3 w-3" />
                        Compare
                    </span>
                    <span className="text-muted-foreground scale-90">{selectedFundsForChart.length}/5</span>
                </Button>
            </div>

            {/* Selected Funds */}
            <div className="px-3 py-0.5 space-y-1 shrink-0 border-b">
                {selectedFundsForChart.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground py-0.5">
                        Select funds below to compare
                    </p>
                ) : (
                    selectedFundsForChart.map((fund, index) => {
                        const color = CHART_COLORS[index % CHART_COLORS.length];
                        return (
                            <div 
                                key={fund.name}
                                className={`flex items-center justify-between px-2 py-1 ${color.bg} border ${color.border} rounded-md group cursor-pointer`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <div className={`w-1 h-2.5 ${color.dot} rounded-full shrink-0`}></div>
                                    <span className="text-[10px] font-medium text-foreground truncate">{fund.fullName}</span>
                                </div>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-3.5 w-3.5 shrink-0 opacity-50 hover:opacity-100"
                                    onClick={() => removeFundFromChart(fund.name)}
                                >
                                    <X className="h-2.5 w-2.5" />
                                </Button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Comparison Suggestions - Scrollable */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-3 py-1.5 shrink-0">
                    <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Comparison suggestions
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-2">
                    <div className="space-y-0">
                        {suggestions.map((stock) => (
                            <div 
                                key={stock.name} 
                                className="flex items-center justify-between py-1.5 hover:bg-muted/50 rounded px-2 -mx-2 cursor-pointer group transition-colors"
                                onClick={() => addFundToChart(stock)}
                            >
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-foreground truncate">{stock.name}</div>
                                    <div className="text-[10px] text-muted-foreground truncate">{stock.fullName}</div>
                                </div>
                                <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                            </div>
                        ))}
                        {suggestions.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">
                                没有更多基金
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
