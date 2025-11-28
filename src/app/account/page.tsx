
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader, User, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { updatePassword, updateProfile } from 'firebase/auth';
import { useFirebaseAuth } from '@/firebase/auth';
import { ThemeToggle } from '@/components/theme-toggle';

interface UserProfile {
    id?: string;
    email?: string;
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
    if (user) {
        const currentName = userProfile?.name ?? user.displayName ?? '';
        const currentPhoto = userProfile?.photoURL ?? user.photoURL ?? null;
        setDisplayName(currentName);
        setPhotoPreview(currentPhoto);
    }
  }, [userProfile, user]);

  const isLoading = isAuthLoading || isProfileLoading;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName || uploadPreset === 'your_upload_preset') {
        throw new Error("Les variables d'environnement Cloudinary ne sont pas configurées. Veuillez les ajouter dans le fichier .env");
    }
    
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error.message || "Échec du téléversement sur Cloudinary.");
    }
    return data.secure_url;
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !userDocRef) return;
    setIsSavingProfile(true);
  
    try {
      let newPhotoURL = userProfile?.photoURL || user.photoURL;
  
      // Only upload if a new file is selected
      if (photoFile) {
        newPhotoURL = await uploadToCloudinary(photoFile);
      }
  
      const firestoreUpdates: Partial<UserProfile> = {};

      const currentName = userProfile?.name ?? user.displayName ?? '';
      if(displayName !== currentName){
        firestoreUpdates.name = displayName;
      }
      
      const currentPhoto = userProfile?.photoURL ?? user.photoURL ?? null;
      if (newPhotoURL && newPhotoURL !== currentPhoto) {
        firestoreUpdates.photoURL = newPhotoURL;
      }

      if (Object.keys(firestoreUpdates).length > 0) {
          // Also update the auth user profile for consistency
          await updateProfile(user, {
            displayName: firestoreUpdates.name || displayName,
            photoURL: firestoreUpdates.photoURL || newPhotoURL,
          });

          // And update firestore document
          const fullProfileData: UserProfile = {
            id: user.uid,
            email: user.email!,
            name: firestoreUpdates.name || displayName,
            photoURL: firestoreUpdates.photoURL || newPhotoURL || undefined,
          };
      
          await setDoc(userDocRef, fullProfileData);
      
          toast({
            title: 'Profil mis à jour',
            description: 'Vos informations de profil ont été mises à jour.',
          });
          setPhotoFile(null); // Clear the file input state
      } else {
        toast({
            title: 'Aucun changement',
            description: 'Aucune modification détectée.',
        });
      }
  
    } catch (error: any) {
      console.error("Error during profile save:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le profil.',
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mon Compte</h1>
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
              <div className="flex items-center flex-wrap gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={photoPreview || undefined} />
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
            <CardTitle>Apparence</CardTitle>
            <CardDescription>
              Choisissez comment l'application s'affiche.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
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
