import React from 'react';
import { SUGGESTIONS } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function Sidebar() {
    return (
        <Card className="h-full flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-foreground mb-3">Graph selection</h2>
                <Button variant="outline" className="w-full justify-between mb-4 h-9">
                    <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Compare graphs
                    </span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        C
                    </kbd>
                </Button>

                <div className="space-y-2">
                    {/* Active Graph Selection 1 */}
                    <div className="flex items-center justify-between px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg group cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium text-foreground">AAPL</span>
                            <span className="text-xs text-muted-foreground">Market Cap</span>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Active Graph Selection 2 */}
                    <div className="flex items-center justify-between px-3 py-2 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg group cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-destructive rounded-full"></div>
                            <span className="text-sm font-medium text-foreground">AAPL</span>
                            <span className="text-xs text-muted-foreground">Price Target</span>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Comparison suggestions</h3>
                <div className="space-y-1">
                    {SUGGESTIONS.map((suggestion) => (
                        <div key={suggestion.symbol} className="flex flex-col px-3 py-2.5 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">{suggestion.symbol}</span>
                                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    <Plus className="h-3 w-3" /> Add
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">{suggestion.metric}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
