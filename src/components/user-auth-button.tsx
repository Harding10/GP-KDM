
'use client';

import { useUser } from '@/firebase';
import { useFirebaseAuth } from '@/firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { FaHistory } from 'react-icons/fa';
import { Skeleton } from './ui/skeleton';
import AuthDialog from './auth-dialog';
import { useState } from 'react';
import Link from 'next/link';

export default function UserAuthButton() {
  const { user, isUserLoading } = useUser();
  const { signOut } = useFirebaseAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  if (isUserLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setIsAuthDialogOpen(true)} variant="outline">
          <FiLogIn className="mr-2 h-4 w-4" />
          Connexion
        </Button>
        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      </>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'Utilisateur'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/history">
            <FaHistory className="mr-2 h-4 w-4" />
            <span>Mon historique</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <FiLogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
