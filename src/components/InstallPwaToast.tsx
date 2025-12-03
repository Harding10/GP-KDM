
'use client';

import { usePwaInstall } from '@/components/pwa-install-provider';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';


export default function InstallPwaToast() {
  const { canInstall, promptInstall } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    // Afficher la bannière à chaque visite sur mobile si installable
    if (canInstall && isMobile) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [canInstall, isMobile]);

  const handleInstallClick = () => {
    promptInstall();
    setIsVisible(false); // Cacher la bannière après avoir lancé l'invite
    // La bannière réapparaîtra à la prochaine navigation/rafraîchissement
  };

  // Afficher un message de débogage en développement
  useEffect(() => {
    if (isDev) {
      console.log('PWA Debug (Dev Mode):', {
        canInstall,
        isMobile,
        isVisible,
        userAgent: navigator.userAgent,
      });
    }
  }, [canInstall, isMobile, isVisible, isDev]);

  // Toujours afficher la bannière si installable et mobile
  if (!isVisible || !canInstall || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[101] w-full max-w-sm animate-fade-in">
      <div className="bg-background border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img src="/icon192x192.png" alt="App Logo" className="h-10 w-10 rounded-md" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Installer AgriAide</p>
            <p className="text-sm text-muted-foreground">
              Pour une expérience optimale, ajoutez AgriAide à votre écran d'accueil !
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleInstallClick} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Installer
              </Button>
              <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost">
                Fermer
              </Button>
            </div>
          </div>
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
