'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

const AUTH_PAGES = ['/']; // Pages accessible without auth
const APP_PAGES = ['/analyze', '/history', '/account']; // Pages requiring auth

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

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
