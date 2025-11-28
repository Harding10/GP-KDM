import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "AgriAssist",
  description: "AI-powered plant disease detection and treatment suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased h-full flex flex-col")}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
