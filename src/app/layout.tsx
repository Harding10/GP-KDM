
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import PwaInstallPrompt from "@/components/pwa-install-prompt";
import { ThemeProvider } from "@/components/theme-provider";
import { useUser } from "@/firebase";
import AuthRedirect from "@/components/auth-redirect";

export const metadata: Metadata = {
  title: "AgriAide",
  description: "Détection des maladies des plantes et suggestions de traitement basées sur l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" sizes="any" />
        <link rel="apple-touch-icon" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className={cn("font-body antialiased h-full flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AuthRedirect>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Toaster />
              <PwaInstallPrompt />
            </AuthRedirect>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
