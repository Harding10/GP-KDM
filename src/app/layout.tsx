
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
        <link rel="icon" href="https://res.cloudinary.com/dlhbpswom/image/upload/v1717769586/favicon_a2k3k2.ico" sizes="any" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dlhbpswom/image/upload/v1717769586/apple-touch-icon_b1b2c3.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://res.cloudinary.com/dlhbpswom/image/upload/v1717769586/icon-192x192_m1vj3t.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://res.cloudinary.com/dlhbpswom/image/upload/v1717769586/icon-512x512_q6z8ab.png" />
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
