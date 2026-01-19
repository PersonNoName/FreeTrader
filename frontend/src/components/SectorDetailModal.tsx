"use client";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Sidebar from './Sidebar';
import ChartSection from './ChartSection';
import StockTable from './StockTable';
import { useStore } from '@/store/useStore';

export default function SectorDetailModal() {
    const selectedSector = useStore((state) => state.selectedSector);
    const setSelectedSector = useStore((state) => state.setSelectedSector);
    const toggleSectorFavorite = useStore((state) => state.toggleSectorFavorite);
    const isOpen = !!selectedSector;

    if (!selectedSector) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && setSelectedSector(null)}>
            <DialogContent className="w-[96vw] sm:max-w-[1400px] 2xl:max-w-[1600px] h-[92vh] p-0 gap-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl outline-none border border-border/50 shadow-2xl rounded-2xl md:rounded-3xl transition-all duration-300">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between px-6 py-4 2xl:px-8 2xl:py-5 border-b shrink-0 bg-background/50">
                    <div className="flex items-center gap-3 2xl:gap-5">
                        <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-primary rounded-lg 2xl:rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg 2xl:text-xl shadow-sm">
                            {selectedSector.name.charAt(0)}
                        </div>
                        <div>
                            <DialogTitle className="text-xl 2xl:text-2xl font-bold tracking-tight">{selectedSector.name} Sector Analysis</DialogTitle>
                            <p className="text-xs 2xl:text-sm text-muted-foreground">Detailed breakdown and fund comparison</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSectorFavorite(selectedSector.id)}
                        className="h-9 w-9 2xl:h-11 2xl:w-11 rounded-full"
                    >
                        <Star className={`h-5 w-5 2xl:h-6 2xl:w-6 ${selectedSector.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </Button>
                </div>

                {/* Content - Flex layout with equal sections */}
                <div className="flex-1 flex flex-col overflow-hidden bg-muted/10 p-4 2xl:p-8 gap-4 2xl:gap-8">
                    {/* Top Row: Sidebar & Chart - 60% height on large screens */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 2xl:gap-8 shrink-0" style={{ height: '60%' }}>
                        <div className="hidden xl:block xl:col-span-3 2xl:col-span-2 h-full overflow-hidden">
                            <Sidebar />
                        </div>
                        <div className="xl:col-span-9 2xl:col-span-10 h-full overflow-hidden">
                            <ChartSection />
                        </div>
                    </div>

                    {/* Bottom Row: Table - 40% height */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <StockTable />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
