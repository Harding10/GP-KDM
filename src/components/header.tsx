'use client';

import Link from 'next/link';
import UserAuthButton from './user-auth-button';

const AppLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-primary"
  >
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
    <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);


const CustomLogo = () => (
    <svg 
        className="h-8 w-8 text-primary"
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M68.333,35.917A18.333,18.333,0,0,1,50,54.25h0a18.333,18.333,0,0,1-18.333-18.333A18.333,18.333,0,0,1,50,17.583h0A18.333,18.333,0,0,1,68.333,35.917Z" />
        <path d="M55.833,54.25H44.167a5.833,5.833,0,0,0-5.833,5.833V82.5h23.333V60.083A5.833,5.833,0,0,0,55.833,54.25Z" />
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