import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { GlobalClientComponents } from "@/components/GlobalClientComponents";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FundTracker",
  description: "Advanced Financial Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background flex flex-col text-foreground antialiased selection:bg-primary/20`}>
        <Header />
        <main className="flex-1 overflow-auto custom-scrollbar relative flex flex-col">
          {children}
        </main>
        <GlobalClientComponents />
      </body>
    </html>
  );
}
