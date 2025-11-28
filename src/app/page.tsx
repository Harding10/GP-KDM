
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
    image: '/onboarding-1.avif',
    imageAlt: 'Personne prenant en photo une plante avec un téléphone',
    title: 'Identifiez le monde végétal qui vous entoure',
    description: 'Transformez votre smartphone en un expert des plantes. Scannez n\'importe quelle plante avec votre appareil photo et laissez AgriAide l\'identifier pour vous.',
  },
  {
    image: '/onboarding-2.avif',
    imageAlt: 'Personne tenant une plante',
    title: 'Obtenez des instructions d\'entretien',
    description: 'Apprenez à prendre soin de vos plantes grâce à nos guides détaillés et nos rappels pour l\'arrosage, la fertilisation, et plus encore.',
  },
  {
    image: '/onboarding-3.png',
    imageAlt: 'Smartphone affichant un diagnostic de plante',
    title: 'Diagnostiquez les problèmes des plantes',
    description: 'Votre plante est malade ? Prenez une photo et notre IA vous aidera à diagnostiquer le problème et à suggérer des solutions.',
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
            <div className="relative h-3/5 bg-primary/10 flex items-center justify-center">
              {/* Phone Mockup */}
              <div className="relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[14px] rounded-[2.5rem] h-[500px] w-64 shadow-xl">
                {/* Notch */}
                <div className="w-[100px] h-[22px] bg-zinc-800 dark:bg-zinc-800 top-0 rounded-b-xl left-1/2 -translate-x-1/2 absolute z-10"></div>
                {/* Screen */}
                <div className="h-full w-full bg-white dark:bg-zinc-800 rounded-[1.5rem] overflow-hidden relative">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      className="object-cover"
                      data-ai-hint="plant phone"
                    />
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
                    <Button variant="secondary" onClick={handleSkip} className="h-14 text-lg font-bold">
                        Passer
                    </Button>
                    <Button onClick={handleContinue} className="h-14 text-lg font-bold">
                        Continuer
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
