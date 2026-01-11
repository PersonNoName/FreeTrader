import { create } from 'zustand';
import { SectorData, StockData } from '@/lib/types';
import { STOCK_DATA, SECTORS_DATA } from '@/lib/constants';

interface AppState {
    selectedSector: SectorData | null;
    setSelectedSector: (sector: SectorData | null) => void;
    isCommandPaletteOpen: boolean;
    setCommandPaletteOpen: (isOpen: boolean) => void;
    toggleCommandPalette: () => void;

    stocks: StockData[];
    sectors: SectorData[];
    toggleStockFavorite: (name: string) => void;
    toggleSectorFavorite: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
    selectedSector: null,
    setSelectedSector: (sector) => set({ selectedSector: sector }),
    isCommandPaletteOpen: false,
    setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
    toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

    // Initialize with data from constants
    stocks: STOCK_DATA,
    sectors: SECTORS_DATA,

    toggleStockFavorite: (name) => set((state) => ({
        stocks: state.stocks.map(stock =>
            stock.name === name ? { ...stock, isFavorite: !stock.isFavorite } : stock
        )
    })),

    toggleSectorFavorite: (id) => set((state) => {
        const newSectors = state.sectors.map(sector =>
            sector.id === id ? { ...sector, isFavorite: !sector.isFavorite } : sector
        );

        let newSelectedSector = state.selectedSector;
        if (state.selectedSector && state.selectedSector.id === id) {
            newSelectedSector = { ...state.selectedSector, isFavorite: !state.selectedSector.isFavorite };
        }

        return {
            sectors: newSectors,
            selectedSector: newSelectedSector
        };
    }),
}));
