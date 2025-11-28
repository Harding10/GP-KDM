
'use client';

import Link from 'next/link';
import UserAuthButton from './user-auth-button';
import { useUser } from '@/firebase';
import { usePwaInstall } from '@/components/pwa-install-provider';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

const CustomLogo = () => (
    <svg
      className="h-10 w-10 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 16.5c-3.14 0-5-2.5-5-5.5s1.86-5.5 5-5.5c2.75 0 4.25.9 5.5 2.5" />
      <path d="M14 12c-1.25 1.6-2.75 2.5-5.5 2.5" />
      <path d="M14 12c1.25-1.6 2.75-2.5 5.5-2.5" />
      <path d="M19.5 16.5c3.14 0 5-2.5 5-5.5s-1.86-5.5-5-5.5c-2.75 0-4.25.9-5.5 2.5" />
    </svg>
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

    