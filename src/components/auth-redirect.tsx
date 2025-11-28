
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader, Leaf } from 'lucide-react';

const AUTH_PAGES = ['/']; // Pages accessible without auth
const APP_PAGES = ['/analyze', '/history', '/account']; // Pages requiring auth

export const SplashLogo = ({className}: {className?: string}) => (
    <Leaf className={className} />
);


export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return; // Wait until user status is known

    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isAppPage = APP_PAGES.some(page => pathname.startsWith(page));

    if (user && isAuthPage) {
      // User is logged in but on an auth page, redirect to app
      router.push('/analyze');
    } else if (!user && isAppPage) {
      // User is not logged in but on an app page, redirect to auth
      router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading || (!user && APP_PAGES.some(page => pathname.startsWith(page)))) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-primary text-primary-foreground">
        <div className="flex flex-col items-center justify-center flex-grow">
          <SplashLogo className="h-24 w-24 text-white" />
          <h1 className="text-4xl font-bold mt-4 text-white">AgriAide</h1>
        </div>
        <div className="mb-12">
          <Loader className="h-12 w-12 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
