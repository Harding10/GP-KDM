
'use client';

import Link from 'next/link';
import UserAuthButton from './user-auth-button';

const CustomLogo = () => (
    <svg
      className="h-8 w-8 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.866 8.169 6.837 9.488" />
      <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.866 8.169-6.837 9.488" />
    </svg>
)

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CustomLogo />
            <span className="text-2xl font-bold text-foreground">
              AgriAide
            </span>
          </Link>
          <UserAuthButton />
        </div>
      </div>
    </header>
  );
}
