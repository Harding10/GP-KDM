
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import AuthDialog from '@/components/auth-dialog';
import { useFirebaseAuth } from '@/firebase/auth';

const onboardingSteps = [
  {
    image: '/onboarding-1.png',
    imageAlt: 'Succulents in a pot',
    title: 'Identify the Green World Around You',
    description: 'Turn your smartphone into a plant expert. Scan any plant using your camera and let AgriAide identify it for you.',
  },
  {
    image: '/onboarding-2.png',
    imageAlt: 'Person holding a plant',
    title: 'Get Care Instructions',
    description: 'Learn how to care for your plants with our detailed guides and reminders for watering, fertilizing, and more.',
  },
  {
    image: '/onboarding-3.png',
    imageAlt: 'Smartphone showing plant diagnosis',
    title: 'Diagnose Plant Problems',
    description: 'Is your plant sick? Take a photo and our AI will help you diagnose the problem and suggest solutions.',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const openDialog = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };
  

  const handleContinue = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        openDialog('signup');
    }
  };

  const handleSkip = () => {
    openDialog('signin');
  };

  const step = onboardingSteps[currentStep];

  return (
     <div className="flex flex-col h-full min-h-screen bg-background text-foreground">
       <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} initialTab={authMode} />
        <div className="flex-1 flex flex-col">
            <div className="relative h-3/5 bg-primary/10">
                {/* This is a placeholder for the top part of the screen from Figma */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[280px] h-[560px] rounded-3xl bg-white shadow-2xl p-4 border overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                           <svg
                                className="h-6 w-6 text-primary"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path d="M10.4,1.4c-3.1,0-5.7,2.5-5.7,5.7s2.5,5.7,5.7,5.7s5.7-2.5,5.7-5.7S13.5,1.4,10.4,1.4z M10.4,11.3c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2s4.2,1.9,4.2,4.2S12.7,11.3,10.4,11.3z" />
                                <path d="M15.8,9.6c-0.6-1.1-1.5-2-2.6-2.6C12.7,6.8,12.2,6,12.2,5c0-1.1-0.9-2-2-2S8.2,3.9,8.2,5c0,1,0.5,1.8,1.1,2.2c1.1,0.6,2,1.5,2.6,2.6c0.6,1.1,0.6,2.4,0,3.5c-0.6,1.1-1.5,2-2.6,2.6c-0.6,0.4-1.1,1.2-1.1,2.2c0,1.1,0.9,2,2,2s2-0.9,2-2c0-1-0.5-1.8-1.1-2.2c-1.1-0.6-2-1.5-2.6-2.6C7.9,12,7.9,10.7,8.5,9.6z" />
                                <path d="M20.6,1.4c-3.1,0-5.7,2.5-5.7,5.7s2.5,5.7,5.7,5.7s5.7-2.5,5.7-5.7S23.7,1.4,20.6,1.4z M20.6,11.3c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2s4.2,1.9,4.2,4.2S22.9,11.3,20.6,11.3z" />
                            </svg>
                            <p className="font-bold text-lg">Plantify</p>
                            <div className="flex gap-2">
                                <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                                <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                        <div className="h-8 w-full rounded-full bg-gray-100 mb-4"></div>
                        <div className="h-4 w-1/2 rounded-full bg-gray-200 mb-2"></div>
                        <div className="flex gap-4">
                            <div className="w-1/2 h-32 rounded-lg bg-gray-200"></div>
                            <div className="w-1/2 h-32 rounded-lg bg-gray-200"></div>
                        </div>
                    </div>
                </div>
                 <div className="absolute bottom-0 left-0 w-full h-16 bg-background rounded-t-[100%]"></div>
            </div>

            <div className="flex-1 flex flex-col justify-between p-8 pt-4 bg-background">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{step.title}</h1>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </div>

                <div className="flex justify-center items-center gap-2 my-8">
                    {onboardingSteps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={cn(
                        'h-2 w-2 rounded-full transition-all duration-300',
                        currentStep === index ? 'w-6 bg-primary' : 'bg-gray-300'
                        )}
                    />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" onClick={handleSkip} className="h-14 text-lg font-bold rounded-full">
                        Skip
                    </Button>
                    <Button onClick={handleContinue} className="h-14 text-lg font-bold rounded-full">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}

