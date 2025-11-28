
'use client';

import Link from 'next/link';
import UserAuthButton from './user-auth-button';
import { useUser } from '@/firebase';
import { usePwaInstall } from '@/components/pwa-install-provider';
import { Button } from './ui/button';
import { Download, Leaf } from 'lucide-react';

const CustomLogo = () => (
    <Leaf className="h-8 w-8 text-primary" />
  );

export default function Header() {
  const { user } = useUser();
  const { canInstall, promptInstall } = usePwaInstall();


  // Don't show header on the main landing/auth page
  if (!user) {
    return null;
  }
  
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/analyze" className="flex items-center gap-2">
            <CustomLogo />
            <span className="text-xl font-bold text-foreground sm:text-2xl">
              AgriAide
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {canInstall && (
              <Button onClick={promptInstall} size="sm" variant="outline" className="hidden sm:inline-flex">
                <Download className="mr-2 h-4 w-4" />
                Installer
              </Button>
            )}
            <UserAuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

    