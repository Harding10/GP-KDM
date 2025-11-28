
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
        <path d="M2 22c1.25-.98 2.22-2.29 2.8-3.76 1.73-4.4 6.33-6.23 10.2-2.46.39.38.74.8.95 1.25" />
        <path d="M22 2c-1.25.98-2.22 2.29-2.8 3.76-1.73 4.4-6.33 6.23-10.2 2.46a8.85 8.85 0 0 0-.95-1.25" />
        <path d="M16 16s-2-2-4-4" />
        <path d="M8 8s2 2 4 4" />
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
