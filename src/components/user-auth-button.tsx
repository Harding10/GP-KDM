
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
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
import { Skeleton } from './ui/skeleton';
import AuthDialog from './auth-dialog';
import { useState } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, History, User as UserIcon, Download } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { usePwaInstall } from './pwa-install-provider';

interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}

export default function UserAuthButton() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { signOut } = useFirebaseAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const firestore = useFirestore();
  const { canInstall, promptInstall } = usePwaInstall();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const isLoading = isAuthLoading || (user && isProfileLoading);

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setIsAuthDialogOpen(true)} variant="outline">
          <LogIn className="mr-2 h-4 w-4" />
          Connexion
        </Button>
        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      </>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  };
  
  const displayName = userProfile?.name || user.displayName;
  const displayEmail = userProfile?.email || user.email;
  const displayPhotoURL = userProfile?.photoURL || user.photoURL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={displayPhotoURL ?? undefined} alt={displayName ?? 'Utilisateur'} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Mon Compte</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/history">
            <History className="mr-2 h-4 w-4" />
            <span>Mon historique</span>
          </Link>
        </DropdownMenuItem>
        {canInstall && (
          <DropdownMenuItem onClick={promptInstall}>
            <Download className="mr-2 h-4 w-4" />
            <span>Installer l'application</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
