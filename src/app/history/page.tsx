'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LoaderCircle, AlertTriangle, Leaf, Sprout } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PlantAnalysis {
  id: string;
  imageUri: string;
  plantType: string;
  diseaseDetected: string;
  isHealthy: boolean;
  analysisDate: string;
}

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userAnalysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/analyses`);
  }, [user, firestore]);

  const { data: analyses, isLoading, error } = useCollection<PlantAnalysis>(userAnalysesQuery);

  const sortedAnalyses = analyses?.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Chargement de votre historique...</h2>
        </div>
      );
    }
    
    if (!user) {
        return (
            <div className="text-center py-16">
                <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Connectez-vous pour voir votre historique</h2>
                <p className="mt-2 text-muted-foreground">Votre historique d'analyses apparaîtra ici une fois que vous serez connecté.</p>
            </div>
        )
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-destructive/10 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-destructive">Une erreur est survenue</h2>
          <p className="mt-2 text-muted-foreground">Impossible de charger votre historique pour le moment.</p>
        </div>
      );
    }
    
    if (sortedAnalyses && sortedAnalyses.length === 0) {
        return (
            <div className="text-center py-16">
                <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Aucune analyse trouvée</h2>
                <p className="mt-2 text-muted-foreground">Votre historique est vide. Commencez par analyser une plante !</p>
                <Button asChild className="mt-6">
                    <Link href="/">Analyser une plante</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAnalyses?.map((analysis) => {
                return (
                    <Card key={analysis.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="p-0">
                             <Image src={analysis.imageUri} alt="Analyse de plante" width={400} height={300} className="object-cover w-full h-48" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className='flex justify-between items-start'>
                                <Badge variant={!analysis.isHealthy ? "destructive" : "default"} className="mb-2">
                                    {analysis.diseaseDetected}
                                </Badge>
                                {analysis.plantType && (
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Sprout className="h-4 w-4" />
                                        <span>{analysis.plantType}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {format(new Date(analysis.analysisDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                            </p>
                            <CardDescription className="mt-2 line-clamp-3">
                                {!analysis.isHealthy ? `Une analyse détaillée est disponible.` : 'Votre plante semble être en bonne santé.'}
                            </CardDescription>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Mon historique d'analyses</h1>
      {renderContent()}
    </div>
  );
}
