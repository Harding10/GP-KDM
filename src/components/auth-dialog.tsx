
'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Mail, Key } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useFirebaseAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (err) {
      setError('Impossible de se connecter avec Google.');
    }
  };

  const handleEmailSignUp = async (data: FormData) => {
    setError(null);
    try {
      await signUpWithEmail(data.email, data.password);
      onOpenChange(false);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cette adresse e-mail est déjà utilisée.');
      } else {
        setError('Erreur lors de la création du compte.');
      }
    }
  };

  const handleEmailSignIn = async (data: FormData) => {
    setError(null);
    try {
      await signInWithEmail(data.email, data.password);
      onOpenChange(false);
    } catch (err: any) {
      setError('Adresse e-mail ou mot de passe incorrect.');
    }
  };

  const EmailPasswordForm = ({
    isSignUp,
  }: {
    isSignUp: boolean;
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(isSignUp ? handleEmailSignUp : handleEmailSignIn)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="nom@exemple.com" {...field} className="pl-9" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
               <FormControl>
                <div className="relative">
                   <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="********" {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </Button>
      </form>
    </Form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Bienvenue</DialogTitle>
          <DialogDescription className="text-center">
            Connectez-vous pour sauvegarder vos analyses
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Se connecter</TabsTrigger>
              <TabsTrigger value="signup">S'inscrire</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-4">
              <EmailPasswordForm isSignUp={false} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <EmailPasswordForm isSignUp={true} />
            </TabsContent>
          </Tabs>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuez avec
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.85 1.62-3.31 0-6.03-2.71-6.03-6.03s2.72-6.03 6.03-6.03c1.9 0 3.16.79 3.89 1.48l2.64-2.58C18.04 2.15 15.49 1 12.48 1 7.03 1 3 5.03 3 10.5s4.03 9.5 9.48 9.5c2.73 0 4.93-.91 6.57-2.54 1.7-1.68 2.2-4.21 2.2-6.38 0-.48-.05-.96-.12-1.42Z"
              ></path>
            </svg>
            Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
