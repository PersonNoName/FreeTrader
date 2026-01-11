"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Monitor, TrendingUp, Star, Filter, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

export default function Header() {
    const pathname = usePathname();
    const toggleCommandPalette = useStore((state) => state.toggleCommandPalette);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Monitor },
        { name: 'Sector Performance', href: '/performance', icon: TrendingUp },
        { name: 'Sector Favorites', href: '/favorites', icon: Star },
    ];

    return (
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">F</div>
                    <h1 className="text-lg font-semibold text-foreground">FundTracker</h1>
                </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1 h-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "h-full flex items-center px-4 border-b-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            )}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex gap-2 text-muted-foreground"
                    onClick={toggleCommandPalette}
                >
                    <Search className="w-4 h-4" />
                    <span className="text-xs">Cmd+K</span>
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Filter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bookmark className="w-5 h-5" />
                </Button>

                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
