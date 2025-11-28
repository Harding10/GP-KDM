'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast, dismiss } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      
      // Show a toast notification to the user
      showInstallToast(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []); // Empty dependency array ensures this runs only once

  const showInstallToast = (promptEvent: BeforeInstallPromptEvent) => {
    toast({
      title: "Installer l'application AgriAide",
      description: "Ajoutez AgriAide à votre écran d'accueil pour un accès rapide et une meilleure expérience.",
      duration: 30000, // Keep it open for 30 seconds
      action: (
        <Button 
          onClick={() => handleInstallClick(promptEvent)}
        >
          <Download className="mr-2 h-4 w-4" />
          Installer
        </Button>
      ),
    });
  };

  const handleInstallClick = async (promptEvent: BeforeInstallPromptEvent | null) => {
    dismiss(); // Dismiss the toast
    if (!promptEvent) {
      return;
    }
    // Show the native install prompt
    promptEvent.prompt();
    // Wait for the user to respond to the prompt
    await promptEvent.userChoice;
    // Clear the saved prompt event
    setInstallPromptEvent(null);
  };
  
  // This component doesn't render anything itself
  return null;
}
