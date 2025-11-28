'use client';

import { useState } from 'react';
import Image from 'next/image';
import AuthDialog from '@/components/auth-dialog';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/firebase/auth';

const CustomLogo = () => (
    <svg
      className="h-16 w-16 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 16.5c-3.14 0-5-2.5-5-5.5s1.86-5.5 5-5.5c2.75 0 4.25.9 5.5 2.5" />
      <path d="M14 12c-1.25 1.6-2.75 2.5-5.5 2.5" />
      <path d="M14 12c1.25-1.6 2.75-2.5 5.5-2.5" />
      <path d="M19.5 16.5c3.14 0 5-2.5 5-5.5s-1.86-5.5-5-5.5c-2.75 0-4.25.9-5.5 2.5" />
    </svg>
  );

export default function GetStartedPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const { signInWithGoogle } = useFirebaseAuth();

  const openDialog = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The useUser hook will handle redirection or UI changes upon successful login
    } catch (err) {
      console.error(err); // Optionally, show a toast or error message
    }
  };


  return (
    <div className="flex flex-col h-full min-h-screen">
       <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} initialTab={authMode} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
            <div className="mb-8">
                <CustomLogo />
            </div>

            <h1 className="text-4xl font-bold mb-2">Let's Get Started!</h1>
            <p className="text-muted-foreground text-lg mb-10">Let's dive in into your account</p>

            <div className="w-full space-y-4 mb-10">
                <Button variant="outline" className="w-full h-12 text-base font-medium border-border" onClick={handleGoogleSignIn}>
                     <Image 
                        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                        width={20} 
                        height={20} 
                        alt="Google logo"
                        className="mr-3"
                      />
                    Continue with Google
                </Button>
                {/* Add other social logins here if needed */}
            </div>

            <div className="w-full space-y-4">
                 <Button className="w-full h-14 text-lg font-bold" onClick={() => openDialog('signup')}>
                    Sign up
                </Button>
                <Button variant="secondary" className="w-full h-14 text-lg font-bold" onClick={() => openDialog('signin')}>
                    Log in
                </Button>
            </div>
        </div>
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground">
        <p>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:underline">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
