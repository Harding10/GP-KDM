import { Leaf } from 'lucide-react';
import Link from 'next/link';
import UserAuthButton from './user-auth-button';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
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
