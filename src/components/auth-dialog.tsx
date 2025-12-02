
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Mail, Key, Loader } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'signin' | 'signup';
}

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function AuthDialog({ open, onOpenChange, initialTab = 'signin' }: AuthDialogProps) {
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, sendPasswordResetEmail } = useFirebaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  useEffect(() => {
    if (!open) {
      setError(null);
      form.reset();
    }
  }, [open, form]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (err) {
      setError('Impossible de se connecter avec Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password);
      onOpenChange(false);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cette adresse e-mail est déjà utilisée.');
      } else {
        setError('Erreur lors de la création du compte.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      onOpenChange(false);
    } catch (err: any) {
      setError('Adresse e-mail ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    setError(null);
    const email = form.getValues('email');
    if (!email) {
        form.setError('email', { type: 'manual', message: 'Veuillez entrer votre e-mail pour réinitialiser le mot de passe.' });
        return;
    }
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
        form.setError('email', { type: 'manual', message: 'Veuillez entrer une adresse e-mail valide.' });
        return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      toast({
        title: 'E-mail envoyé',
        description: 'Si un compte existe, un e-mail de réinitialisation a été envoyé.',
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: 'E-mail envoyé',
        description: 'Si un compte existe, un e-mail de réinitialisation a été envoyé.',
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
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
                   <Input
                     {...field}
                     autoFocus={open}
                     placeholder="nom@exemple.com"
                     className="pl-9"
                     disabled={isLoading}
                   />
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
                  <Input
                    {...field}
                    type="password"
                    placeholder="Votre mot de passe"
                    className="pl-9"
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isSignUp && (
          <div className="text-right">
            <Button type="button" variant="link" className="p-0 h-auto text-xs" onClick={handlePasswordReset} disabled={isLoading}>
              Mot de passe oublié ?
            </Button>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </Button>
      </form>
    </Form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold sm:text-2xl">
            {activeTab === 'signup' ? 'Créer un compte' : 'Se connecter'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" disabled={isLoading}>Se connecter</TabsTrigger>
              <TabsTrigger value="signup" disabled={isLoading}>S'inscrire</TabsTrigger>
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

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            <Image
              src="/google_icon.png"
              width={18}
              height={18}
              alt="Google logo"
              className="mr-2"
            />
            Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
