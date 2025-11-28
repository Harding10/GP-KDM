
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, HeartPulse, Microscope, TestTube } from 'lucide-react';
import Image from 'next/image';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border-0 rounded-2xl bg-card">
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
            Santé des plantes, simplifiée.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Identifiez les maladies, obtenez des conseils de traitement et prenez soin de vos plantes avec notre assistant intelligent.
          </p>
          <Button asChild size="lg" className="font-bold text-lg">
            <Link href="/analyze">Commencer l'analyse <Microscope className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Obtenez un diagnostic complet en trois étapes simples.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TestTube className="h-8 w-8 text-primary" />}
              title="1. Identifier"
              description="Prenez une photo de la feuille de votre plante. Notre IA reconnaît l'espèce pour une analyse précise."
            />
            <FeatureCard 
              icon={<HeartPulse className="h-8 w-8 text-primary" />}
              title="2. Diagnostiquer"
              description="L'IA analyse l'image pour détecter maladies, carences ou parasites et évalue la santé de la plante."
            />
            <FeatureCard 
              icon={<History className="h-8 w-8 text-primary" />}
              title="3. Traiter & Suivre"
              description="Recevez des suggestions de traitements et conservez un historique de vos analyses pour un suivi facile."
            />
          </div>
        </div>
      </section>
    </>
  );
}
