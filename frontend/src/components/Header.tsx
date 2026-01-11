"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Monitor, TrendingUp, Star, Filter, Bookmark, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const toggleCommandPalette = useStore((state) => state.toggleCommandPalette);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const user = useStore((state) => state.user);
    const logout = useStore((state) => state.logout);
    const initAuth = useStore((state) => state.initAuth);

    // Initialize auth state on mount
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const handleLogout = () => {
        logout();
        router.push('/auth');
    };

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Monitor },
        { name: 'Sector Performance', href: '/performance', icon: TrendingUp },
        { name: 'Sector Favorites', href: '/favorites', icon: Star },
    ];

    // Don't show full header on auth page
    const isAuthPage = pathname === '/auth';

    return (
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Link href={isAuthenticated ? "/" : "/auth"} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">F</div>
                    <h1 className="text-lg font-semibold text-foreground">FundTracker</h1>
                </Link>
            </div>

            {/* Only show navigation when authenticated */}
            {isAuthenticated && !isAuthPage && (
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
            )}

            <div className="flex items-center gap-3">
                {/* Only show these buttons when authenticated */}
                {isAuthenticated && !isAuthPage && (
                    <>
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
                    </>
                )}

                {isAuthenticated && user ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden lg:inline">
                            {user.username}
                        </span>
                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-500"
                            onClick={handleLogout}
                            title="登出"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    !isAuthPage && (
                        <Link href="/auth">
                            <Button variant="outline" size="sm" className="gap-2">
                                <User className="w-4 h-4" />
                                登录
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </header>
    );
}

