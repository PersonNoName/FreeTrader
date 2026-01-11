import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "登录 | FundTracker",
    description: "登录或注册 FundTracker 账户",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-2/5" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-chart-2/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-chart-4/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

            {/* Floating shapes */}
            <div className="absolute top-20 right-20 w-20 h-20 border border-primary/20 rounded-xl rotate-12 animate-pulse" />
            <div className="absolute bottom-32 left-32 w-16 h-16 border border-chart-2/20 rounded-full animate-pulse delay-500" />
            <div className="absolute top-1/3 left-20 w-12 h-12 bg-chart-4/10 rounded-lg rotate-45" />

            {/* Content */}
            <div className="relative z-10 w-full max-h-screen overflow-hidden">
                {children}
            </div>
        </div>
    );
}
