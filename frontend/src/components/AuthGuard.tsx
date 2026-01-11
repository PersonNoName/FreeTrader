"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const initAuth = useStore((state) => state.initAuth);
    const [isLoading, setIsLoading] = useState(true);

    // Public routes that don't require authentication
    const publicRoutes = ['/auth'];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        // Initialize auth state from localStorage
        initAuth();
        setIsLoading(false);
    }, [initAuth]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated && !isPublicRoute) {
                // Not authenticated and trying to access protected route
                router.push('/auth');
            } else if (isAuthenticated && isPublicRoute) {
                // Already authenticated but on auth page, redirect to home
                router.push('/');
            }
        }
    }, [isAuthenticated, isPublicRoute, isLoading, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If not authenticated and not on public route, don't render children
    if (!isAuthenticated && !isPublicRoute) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
