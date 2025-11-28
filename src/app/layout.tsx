
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import AuthRedirect from "@/components/auth-redirect";
import { PwaInstallProvider } from "@/components/pwa-install-provider";
import InstallPwaToast from "@/components/InstallPwaToast";

export const metadata: Metadata = {
  title: "AgriAide",
  description: "Détection des maladies des plantes et suggestions de traitement basées sur l'IA.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" />
        <link rel="icon" href="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" sizes="any" />
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
            <PwaInstallProvider>
              <AuthRedirect>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Toaster />
                <InstallPwaToast />
              </AuthRedirect>
            </PwaInstallProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
