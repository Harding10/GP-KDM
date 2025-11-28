
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

// TypeScript interface for the event object
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Type for the context value
interface PwaInstallContextType {
  canInstall: boolean;
  promptInstall: () => void;
}

// Create the context with a default value
const PwaInstallContext = createContext<PwaInstallContextType>({
  canInstall: false,
  promptInstall: () => {},
});

// Custom hook to use the context
export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

// The provider component
export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      // Clear the deferred prompt, as it can't be used again
      setInstallPromptEvent(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPromptEvent) {
      return;
    }
    
    // Show the native install prompt
    await installPromptEvent.prompt();
    
    // The userChoice property is a Promise that resolves to an object with an outcome property.
    const { outcome } = await installPromptEvent.userChoice;

    if (outcome === 'accepted') {
      // User accepted the install prompt
    } else {
      // User dismissed the install prompt
    }
    // We can only use the prompt once. After that, we need to clear it.
    setInstallPromptEvent(null);
  }, [installPromptEvent]);

  const value = {
    canInstall: !!installPromptEvent,
    promptInstall,
  };

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}
