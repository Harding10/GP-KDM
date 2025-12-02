'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  // Ne rien afficher si online ou non chargé
  if (isOnline === null || isOnline === true) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert variant="destructive" className="border-2 rounded-lg shadow-lg">
        <WifiOff className="h-4 w-4" />
        <AlertTitle className="ml-2">Pas de connexion Internet</AlertTitle>
        <AlertDescription className="ml-6">
          Vous êtes actuellement hors ligne. Les données en cache sont disponibles, mais vous ne pourrez pas télécharger de nouvelles images ou synchroniser vos données.
        </AlertDescription>
      </Alert>
    </div>
  );
}
