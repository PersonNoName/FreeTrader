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
            <DialogContent className="max-w-[1400px] sm:max-w-[1400px] w-full h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl outline-none border-0 shadow-2xl">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b shrink-0 bg-background">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm">
                            {selectedSector.name.charAt(0)}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">{selectedSector.name} Sector Analysis</DialogTitle>
                            <p className="text-sm text-muted-foreground">Detailed breakdown and fund comparison</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSectorFavorite(selectedSector.id)}
                        className="h-10 w-10 rounded-full"
                    >
                        <Star className={`h-6 w-6 ${selectedSector.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </Button>
                </div>

                {/* Content - Flex layout with equal sections */}
                <div className="flex-1 flex flex-col overflow-hidden bg-muted/10 p-6 gap-4">
                    {/* Top Row: Sidebar & Chart - 65% height */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 shrink-0" style={{ height: '65%' }}>
                        <div className="hidden xl:block xl:col-span-1 h-full overflow-hidden">
                            <Sidebar />
                        </div>
                        <div className="xl:col-span-3 h-full overflow-hidden">
                            <ChartSection />
                        </div>
                    </div>

                    {/* Bottom Row: Table - 35% height */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <StockTable />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
