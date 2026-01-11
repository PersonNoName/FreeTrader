import React from 'react';
// import { STOCK_DATA } from '@/lib/constants'; // No longer used directly
import { useStore } from '@/store/useStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Apple, Car, Fuel, Zap, Truck, Star } from 'lucide-react'; // Mapping icons roughly

export default function StockTable() {
    const stocks = useStore((state) => state.stocks);
    const toggleStockFavorite = useStore((state) => state.toggleStockFavorite);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'apple': return <Apple className="w-4 h-4" />;
            case 'F': return <Car className="w-4 h-4" />; // Ford -> Car
            case 'S': return <Fuel className="w-4 h-4" />; // Shell -> Fuel
            case 'T': return <Zap className="w-4 h-4" />; // Tesla -> Zap
            case 'R': return <Truck className="w-4 h-4" />; // Rivian -> Truck
            default: return <span>{iconName}</span>;
        }
    };

    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-8">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price in USD</TableHead>
                        <TableHead className="text-right">FCF/Share</TableHead>
                        <TableHead className="text-right">Mkt Cap</TableHead>
                        <TableHead className="text-right">1D Returns</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => (
                        <TableRow key={stock.name} className="cursor-pointer group">
                            <TableCell className="text-center py-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${stock.iconBg} ${stock.iconColor}`}>
                                    {getIcon(stock.icon || '')}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{stock.name}</span>
                                    <span className="text-muted-foreground text-xs font-normal truncate hidden sm:inline-block">
                                        {stock.fullName}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-1 hover:bg-transparent"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStockFavorite(stock.name);
                                        }}
                                    >
                                        <Star className={`h-4 w-4 ${stock.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400"}`} />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{stock.fcfShare.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{stock.mktCap}</TableCell>
                            <TableCell className="text-right">
                                <div className={`flex items-center justify-end gap-1 ${stock.returns >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {stock.returns >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    <span className="font-bold">{Math.abs(stock.returns).toFixed(2)}</span>
                                    <span className="text-xs font-normal opacity-80">
                                        ({stock.returns > 0 ? '+' : ''}{stock.returnsPercent}%)
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
