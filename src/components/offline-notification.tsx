'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineNotification() {
  const isOnline = useOnlineStatus();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOnline === false) {
      setIsVisible(true);
    } else if (isOnline === true) {
      // Afficher un message de reconnexion pendant 3 secondes
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (isOnline === null) {
    return null;
  }

  return (
    <Alert 
      variant={isOnline ? "default" : "destructive"} 
      className={`fixed top-20 left-4 right-4 z-40 max-w-md shadow-lg transition-all duration-300 ${
        !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertTitle className="ml-2">Reconnecté !</AlertTitle>
          <AlertDescription className="ml-6">
            Vous êtes de nouveau en ligne.
          </AlertDescription>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <AlertTitle className="ml-2">Pas de connexion Internet</AlertTitle>
          <AlertDescription className="ml-6">
            Vous êtes hors ligne. Les données en cache sont disponibles.
          </AlertDescription>
        </>
      )}
    </Alert>
  );
}
