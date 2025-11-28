
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useFirebaseAuth } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader, User, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile, updatePassword } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserProfile {
    name?: string;
    photoURL?: string;
}

export default function AccountPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { auth } = useFirebaseAuth();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name || user?.displayName || '');
      setPhotoPreview(userProfile.photoURL || user?.photoURL || null);
    } else if (user) {
        setDisplayName(user.displayName || '');
        setPhotoPreview(user.photoURL || null);
    }
  }, [userProfile, user]);

  const isLoading = isAuthLoading || isProfileLoading;

  const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    const storage = getStorage();
    const filePath = `profile-photos/${userId}/${file.name}`;
    const fileRef = storageRef(storage, filePath);
    
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !userDocRef) return;
    setIsSavingProfile(true);

    try {
      const authUpdates: { displayName?: string, photoURL?: string } = {};
      const firestoreUpdates: { name?: string, photoURL?: string } = {};
      
      // Update display name if changed
      if (displayName && displayName !== (userProfile?.name || user.displayName)) {
        authUpdates.displayName = displayName;
        firestoreUpdates.name = displayName;
      }
      
      // Upload new photo if selected
      if (photoFile) {
        const newPhotoURL = await uploadProfilePhoto(user.uid, photoFile);
        firestoreUpdates.photoURL = newPhotoURL;
      }
      
      // Update Firebase Auth profile
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates);
      }

      // Save changes to Firestore
      if (Object.keys(firestoreUpdates).length > 0) {
        await setDoc(userDocRef, firestoreUpdates, { merge: true });
      }

      toast({
        title: 'Profil mis à jour',
        description: 'Votre nom et votre photo de profil ont été mis à jour.',
      });
      setPhotoFile(null); // Reset file input after save
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil. Veuillez réessayer.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }
    if (password.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Le mot de passe doit contenir au moins 6 caractères.',
        });
        return;
    }

    setIsSavingPassword(true);
    try {
      await updatePassword(user, password);
      toast({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été modifié avec succès.',
      });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de mise à jour',
        description: "Une erreur est survenue lors de la modification du mot de passe. Veuillez vous reconnecter et réessayer.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>Vous devez être connecté pour accéder à cette page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/analyze">Analyser une plante</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPhoto = photoPreview || userProfile?.photoURL || user.photoURL;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Mon Compte</h1>
        <p className="text-muted-foreground text-lg mt-2">Gérez les informations de votre profil et votre mot de passe.</p>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>Mettez à jour votre nom et votre photo de profil.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentPhoto || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Photo de profil</Label>
                  <Input id="picture" type="file" accept="image/*" onChange={handlePhotoChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Nom d'utilisateur</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-9"
                    />
                </div>
              </div>
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer le profil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
            <CardDescription>
              Pour votre sécurité, nous vous recommandons de choisir un mot de passe fort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                 <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        placeholder="Nouveau mot de passe"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9"
                        placeholder="Confirmer le nouveau mot de passe"
                    />
                </div>
              </div>
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Changer le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
