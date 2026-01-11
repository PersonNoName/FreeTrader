import { create } from 'zustand';
import { toast } from 'sonner';
import { SectorData, StockData } from '@/lib/types';
import { STOCK_DATA, SECTORS_DATA } from '@/lib/constants';
import { sectorApi, favoritesApi, authApi } from '@/lib/api';

// User interface
interface UserInfo {
    id: number;
    username: string;
    email: string;
}

// Sector detail with funds
interface SectorDetail {
    id: number;
    name: string;
    description: string;
    fundsCount: number;
    isFavorite: boolean;
    funds: StockData[];
}

interface AppState {
    // Auth state
    isAuthenticated: boolean;
    user: UserInfo | null;
    token: string | null;

    // Auth actions
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    initAuth: () => void;

    // UI state
    selectedSector: SectorData | null;
    setSelectedSector: (sector: SectorData | null) => void;
    isCommandPaletteOpen: boolean;
    setCommandPaletteOpen: (isOpen: boolean) => void;
    toggleCommandPalette: () => void;

    // Chart selection state
    selectedFundsForChart: StockData[];
    addFundToChart: (fund: StockData) => void;
    removeFundFromChart: (fundName: string) => void;
    clearChartSelection: () => void;

    // Data state
    stocks: StockData[];
    sectors: SectorData[];
    sectorDetail: SectorDetail | null;
    isLoading: boolean;

    // Data actions
    fetchSectors: () => Promise<void>;
    fetchSectorDetail: (id: number) => Promise<void>;
    toggleStockFavorite: (name: string) => void;
    toggleSectorFavorite: (id: string | number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    // Auth state
    isAuthenticated: false,
    user: null,
    token: null,

    // Auth actions
    login: async (username: string, password: string) => {
        const response = await authApi.login(username, password);
        if (response.code === 200) {
            const { token, userId, username: name, email } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id: userId, username: name, email }));
            set({
                isAuthenticated: true,
                user: { id: userId, username: name, email },
                token,
            });
            // Fetch sectors after login
            get().fetchSectors();
        } else {
            throw new Error(response.message || '登录失败');
        }
    },

    register: async (username: string, email: string, password: string) => {
        const response = await authApi.register(username, email, password);
        if (response.code === 200) {
            const { token, userId, username: name, email: userEmail } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id: userId, username: name, email: userEmail }));
            set({
                isAuthenticated: true,
                user: { id: userId, username: name, email: userEmail },
                token,
            });
            // Fetch sectors after registration
            get().fetchSectors();
        } else {
            throw new Error(response.message || '注册失败');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
            isAuthenticated: false,
            user: null,
            token: null,
        });
    },

    initAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({
                    isAuthenticated: true,
                    user,
                    token,
                });
                // Fetch sectors on init
                get().fetchSectors();
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    },

    // UI state
    selectedSector: null,
    setSelectedSector: (sector) => {
        set({ selectedSector: sector, selectedFundsForChart: [] });
        // Fetch sector detail when selecting a sector
        if (sector) {
            get().fetchSectorDetail(Number(sector.id));
        } else {
            set({ sectorDetail: null });
        }
    },
    isCommandPaletteOpen: false,
    setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
    toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

    // Chart selection state
    selectedFundsForChart: [],
    addFundToChart: (fund) => set((state) => {
        // 最多选择5个基金
        if (state.selectedFundsForChart.length >= 5) return state;
        // 避免重复添加
        if (state.selectedFundsForChart.some(f => f.name === fund.name)) return state;
        return { selectedFundsForChart: [...state.selectedFundsForChart, fund] };
    }),
    removeFundFromChart: (fundName) => set((state) => ({
        selectedFundsForChart: state.selectedFundsForChart.filter(f => f.name !== fundName)
    })),
    clearChartSelection: () => set({ selectedFundsForChart: [] }),

    // Data state - initialize with local data as fallback
    stocks: STOCK_DATA,
    sectors: SECTORS_DATA,
    sectorDetail: null,
    isLoading: false,

    // Data actions
    fetchSectors: async () => {
        set({ isLoading: true });
        try {
            const response = await sectorApi.getAll();
            if (response.code === 200 && response.data) {
                const sectorsData: SectorData[] = response.data.map((s: {
                    id: number;
                    name: string;
                    change: number;
                    price: number;
                    marketCap: string;
                    isFavorite: boolean;
                    fundsCount: number;
                    description: string;
                    trend: number[];
                    avgChange: number;
                }) => ({
                    id: s.id,
                    name: s.name || '',
                    change: s.change ?? s.avgChange ?? 0,
                    price: s.price || 0,
                    marketCap: s.marketCap || 'N/A',
                    isFavorite: s.isFavorite || false,
                    fundsCount: s.fundsCount || 0,
                    description: s.description || '',
                    trend: s.trend || [],
                }));
                set({ sectors: sectorsData });
            }
        } catch (error) {
            console.error('Failed to fetch sectors:', error);
            // Keep local data as fallback
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSectorDetail: async (id: number) => {
        try {
            const response = await sectorApi.getDetail(id);
            if (response.code === 200 && response.data) {
                const detail = response.data;
                const funds: StockData[] = (detail.funds || []).map((f: {
                    name: string;        // ths_code from backend
                    fullName: string;    // chinese_name from backend
                    price: number;
                    fcfShare: number;
                    mktCap: string;
                    returns: number;
                    returnsPercent: number;
                    icon: string;
                    iconBg: string;
                    iconColor: string;
                    isFavorite: boolean;
                }) => ({
                    name: f.name || '',           // ths_code as code
                    fullName: f.fullName || '',   // chinese_name as name
                    price: f.price || 0,
                    fcfShare: f.fcfShare || 0,
                    mktCap: f.mktCap || 'N/A',
                    returns: f.returnsPercent || 0,
                    returnsPercent: f.returnsPercent || 0,
                    icon: f.icon || '',
                    iconBg: f.iconBg || 'bg-blue-600',
                    iconColor: f.iconColor || 'text-white',
                    isFavorite: f.isFavorite || false,
                }));
                set({
                    sectorDetail: {
                        id: detail.id,
                        name: detail.name,
                        description: detail.description || '',
                        fundsCount: detail.fundsCount || 0,
                        isFavorite: detail.isFavorite || false,
                        funds,
                    },
                    stocks: funds,
                });
            }
        } catch (error) {
            console.error('Failed to fetch sector detail:', error);
        }
    },

    toggleStockFavorite: (name) => set((state) => ({
        stocks: state.stocks.map(stock =>
            stock.name === name ? { ...stock, isFavorite: !stock.isFavorite } : stock
        )
    })),

    toggleSectorFavorite: async (id) => {
        const state = get();
        const numId = Number(id);
        
        // 找到当前要操作的 sector
        const targetSector = state.sectors.find(s => Number(s.id) === numId);
        if (!targetSector) return;
        
        // 如果是要添加收藏，检查是否已达到上限（10个）
        if (!targetSector.isFavorite) {
            const currentFavoritesCount = state.sectors.filter(s => s.isFavorite).length;
            if (currentFavoritesCount >= 10) {
                toast.warning('最多只能收藏10个板块');
                return;
            }
        }

        // Optimistic update - always update local state first
        const newSectors = state.sectors.map(sector =>
            Number(sector.id) === numId ? { ...sector, isFavorite: !sector.isFavorite } : sector
        );

        let newSelectedSector = state.selectedSector;
        if (state.selectedSector && Number(state.selectedSector.id) === numId) {
            newSelectedSector = { ...state.selectedSector, isFavorite: !state.selectedSector.isFavorite };
        }

        set({
            sectors: newSectors,
            selectedSector: newSelectedSector,
        });

        // Only sync with backend if authenticated
        if (state.isAuthenticated && state.token) {
            try {
                await favoritesApi.toggle(numId);
            } catch (error) {
                console.error('Failed to sync favorite with server:', error);
                // Don't revert - keep local state, user can still use the app
            }
        }
    },
}));
