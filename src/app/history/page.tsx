
'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LoaderCircle, AlertTriangle, Leaf, Sprout, CheckCircle2 } from 'lucide-react';
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
    return query(collection(firestore, `users/${user.uid}/analyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: analyses, isLoading, error } = useCollection<PlantAnalysis>(userAnalysesQuery);

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
                 <Button asChild className="mt-6" size="lg">
                    <Link href="/analyze">Analyser une plante</Link>
                </Button>
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
    
    if (analyses && analyses.length === 0) {
        return (
            <div className="text-center py-16">
                <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Aucune analyse trouvée</h2>
                <p className="mt-2 text-muted-foreground">Votre historique est vide. Commencez par analyser une plante !</p>
                <Button asChild className="mt-6" size="lg">
                    <Link href="/analyze">Analyser une plante</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {analyses?.map((analysis) => {
                return (
                    <Link key={analysis.id} href={`/history/${analysis.id}`} className="block">
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl group flex flex-col h-full">
                            <CardHeader className="p-0 relative">
                                <div className="relative overflow-hidden h-48">
                                    <Image src={analysis.imageUri} alt={`Analyse de ${analysis.plantType}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant={analysis.isHealthy ? "default" : "destructive"} className="font-bold rounded-full text-xs py-1 px-3 shadow-md">
                                        {analysis.isHealthy ? <CheckCircle2 className="h-4 w-4 mr-1.5"/> : <AlertTriangle className="h-4 w-4 mr-1.5"/>}
                                        {analysis.isHealthy ? 'Sain' : 'Malade'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col flex-grow">
                            <div className='flex-grow'>
                                    <p className="font-bold text-lg text-foreground truncate">{analysis.plantType}</p>
                                    <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                                        {analysis.diseaseDetected}
                                    </p>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium mt-3 pt-3 border-t">
                                    {format(new Date(analysis.analysisDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Mon historique</h1>
        <p className="text-muted-foreground text-lg mt-2">Retrouvez ici toutes vos analyses de plantes passées.</p>
      </div>
      {renderContent()}
    </div>
  );
}
