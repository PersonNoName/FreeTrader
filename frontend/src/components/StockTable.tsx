import { useStore } from '@/store/useStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Star } from 'lucide-react';

// 预定义的颜色数组
const AVATAR_COLORS = [
    '#2563eb', // blue-600
    '#dc2626', // red-600
    '#16a34a', // green-600
    '#9333ea', // purple-600
    '#ea580c', // orange-600
    '#0891b2', // cyan-600
    '#4f46e5', // indigo-600
    '#db2777', // pink-600
    '#ca8a04', // yellow-600
    '#0d9488', // teal-600
];

// 根据名称生成稳定的颜色
function getColorByName(name: string): string {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function StockTable() {
    const stocks = useStore((state) => state.stocks);
    const toggleStockFavorite = useStore((state) => state.toggleStockFavorite);

    if (stocks.length === 0) {
        return (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col items-center justify-center">
                <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">暂无基金数据</div>
                    <p className="text-sm text-muted-foreground/70">该板块目前没有关联的基金</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col">
            <div className="overflow-auto flex-1">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-12"></TableHead>
                            <TableHead>基金名称</TableHead>
                            <TableHead>代码</TableHead>
                            <TableHead className="text-right">净值</TableHead>
                            <TableHead className="text-right">市值</TableHead>
                            <TableHead className="text-right">涨跌幅</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stocks.map((stock, index) => (
                            <TableRow key={stock.name || `stock-${index}`} className="cursor-pointer group">
                                <TableCell className="text-center py-3">
                                    <div 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: getColorByName(stock.fullName || stock.name) }}
                                    >
                                        {stock.fullName?.charAt(0) || 'F'}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{stock.fullName}</span>
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
                                <TableCell className="text-muted-foreground text-sm font-mono">
                                    {stock.name}
                                </TableCell>
                                <TableCell className="text-right">{stock.price.toFixed(4)}</TableCell>
                                <TableCell className="text-right">{stock.mktCap}</TableCell>
                                <TableCell className="text-right">
                                    <div className={`flex items-center justify-end gap-1 ${stock.returns >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {stock.returns >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                        <span className="font-bold">{Math.abs(stock.returns).toFixed(2)}%</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
