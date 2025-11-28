
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaHistory, FaHeartbeat } from 'react-icons/fa';
import { GiMicroscope, GiPlantSeed } from "react-icons/gi";
import Image from 'next/image';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border-0 rounded-2xl">
    <CardHeader className="items-center">
      <div className="bg-primary/10 p-4 rounded-full">
        {icon}
      </div>
      <CardTitle className="pt-4 font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function HomePage() {
  return (
    <>
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary/10 inline-block px-4 py-1 rounded-full text-primary font-semibold text-sm mb-4">
            Votre expert botaniste IA
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Prenez soin de vos plantes, <br/> plus simplement.
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Prenez une photo, et notre intelligence artificielle identifie la plante, détecte les maladies et vous propose des solutions de traitement. C'est simple, rapide et efficace.
          </p>
          <Button asChild size="lg" className="rounded-full font-bold text-lg">
            <Link href="/analyze">Commencer l'analyse <GiMicroscope className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">En trois étapes simples, obtenez un diagnostic complet pour votre plante.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<GiPlantSeed className="h-8 w-8 text-primary" />}
              title="1. Identifiez"
              description="Prenez ou téléchargez une photo de la feuille de votre plante. Notre IA identifie l'espèce pour une analyse précise."
            />
            <FeatureCard 
              icon={<FaHeartbeat className="h-8 w-8 text-primary" />}
              title="2. Diagnostiquez"
              description="L'IA analyse l'image pour détecter toute maladie, carence ou parasite, et évalue la santé globale de la plante."
            />
            <FeatureCard 
              icon={<FaHistory className="h-8 w-8 text-primary" />}
              title="3. Traitez & Suivez"
              description="Recevez des conseils de traitements biologiques et chimiques, et conservez un historique de vos analyses."
            />
          </div>
        </div>
      </section>
    </>
  );
}
