
'use client';

import { usePwaInstall } from '@/components/pwa-install-provider';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallPwaToast() {
  const { canInstall, promptInstall } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (canInstall) {
      // Use a timeout to delay the appearance of the toast,
      // making it less intrusive on page load.
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // 3-second delay
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [canInstall]);
  
  const handleInstallClick = () => {
    promptInstall();
    setIsVisible(false); // Hide toast after prompting
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[101] w-full max-w-sm animate-fade-in">
        <div className="bg-background border rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <img src="https://play-lh.googleusercontent.com/OocMG8bjiq6hNmg2LMNrdcSlZgBfqc6b-0erv4IE8wlR88MgCWPZS_Te42iR5UV7sA" alt="App Logo" className="h-10 w-10 rounded-md" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold">Installer AgriAide</p>
                    <p className="text-sm text-muted-foreground">
                        Accédez rapidement à l'application depuis votre écran d'accueil.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Button onClick={handleInstallClick} size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Installer
                        </Button>
                         <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost">
                            Plus tard
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
