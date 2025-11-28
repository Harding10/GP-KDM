
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
      <path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a7 7 0 0 1-7 7z" />
      <path d="M4 14a1 1 0 0 0-1 1v3" />
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
