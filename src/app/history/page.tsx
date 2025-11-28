
'use client';

import { useState } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader, AlertTriangle, CheckCircle, Leaf, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantAnalysis {
  id: string;
  imageUri: string;
  plantType: string;
  diseaseDetected: string;
  isHealthy: boolean;
  analysisDate: string;
}

const AnalysisCardSkeleton = () => (
  <Card className="overflow-hidden rounded-2xl flex flex-col h-full">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4 flex flex-col flex-grow">
      <div className="flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-3 pt-3 border-t">
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userAnalysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/analyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: analyses, isLoading, error } = useCollection<PlantAnalysis>(userAnalysesQuery);

  const openDeleteDialog = (analysisId: string) => {
    setAnalysisToDelete(analysisId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAnalysis = async () => {
    if (!user || !firestore || !analysisToDelete) return;

    setIsDeleting(true);
    try {
      const docRef = doc(firestore, `users/${user.uid}/analyses/${analysisToDelete}`);
      await deleteDoc(docRef);
      toast({
        title: 'Analyse supprimée',
        description: "L'analyse a été retirée de votre historique.",
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de supprimer l'analyse.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <AnalysisCardSkeleton key={index} />
          ))}
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
                    <Card key={analysis.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl group flex flex-col h-full">
                        <Link href={`/history/${analysis.id}`} className="block h-full flex flex-col">
                            <CardHeader className="p-0 relative">
                                <div className="relative overflow-hidden h-48">
                                    <Image src={analysis.imageUri} alt={`Analyse de ${analysis.plantType}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant={analysis.isHealthy ? "default" : "destructive"} className="font-bold rounded-full text-xs py-1 px-3 shadow-md flex items-center">
                                        {analysis.isHealthy ? <CheckCircle className="h-4 w-4 mr-1.5"/> : <AlertTriangle className="h-4 w-4 mr-1.5"/>}
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
                                <div className="text-xs text-muted-foreground font-medium mt-3 pt-3 border-t flex justify-between items-center">
                                  <span>
                                      {format(new Date(analysis.analysisDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                                  </span>
                                </div>
                            </CardContent>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                openDeleteDialog(analysis.id);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </Card>
                )
            })}
        </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Mon historique</h1>
          <p className="text-muted-foreground text-lg mt-2">Retrouvez ici toutes vos analyses de plantes passées.</p>
        </div>
        {renderContent()}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette analyse ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'analyse sera définitivement supprimée de votre historique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnalysis} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
