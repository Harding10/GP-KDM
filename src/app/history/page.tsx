
'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader, AlertTriangle, CheckCircle, Leaf, Trash2, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <Skeleton className="h-40 sm:h-48 w-full" />
    <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
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

  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userAnalysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/analyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: analyses, isLoading, error } = useCollection<PlantAnalysis>(userAnalysesQuery);

  const filteredAnalyses = useMemo(() => {
    if (!analyses) return [];
    if (!searchQuery) return analyses;

    return analyses.filter(analysis =>
      analysis.plantType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.diseaseDetected.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [analyses, searchQuery]);

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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

    if (filteredAnalyses.length === 0) {
        return (
            <div className="text-center py-16">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Aucun résultat</h2>
                <p className="mt-2 text-muted-foreground">Votre recherche n'a retourné aucun résultat. Essayez d'autres mots-clés.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAnalyses.map((analysis, index) => {
                return (
                    <Card
                      key={analysis.id}
                      className={cn(
                          "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl group flex flex-col h-full animate-fade-in",
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                  >
                        <Link href={`/history/${analysis.id}`} className="block h-full flex flex-col">
                            <CardHeader className="p-0 relative">
                                <div className="relative overflow-hidden h-40 sm:h-48">
                                    <Image src={analysis.imageUri} alt={`Analyse de ${analysis.plantType}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant={analysis.isHealthy ? "default" : "destructive"} className="font-bold rounded-full text-xs py-1 px-2.5 shadow-md flex items-center">
                                        {analysis.isHealthy ? <CheckCircle className="h-3 w-3 mr-1"/> : <AlertTriangle className="h-3 w-3 mr-1"/>}
                                        {analysis.isHealthy ? 'Sain' : 'Malade'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
                                <div className='flex-grow'>
                                    <p className="font-bold text-base text-foreground truncate">{analysis.plantType}</p>
                                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                                        {analysis.diseaseDetected}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground font-medium mt-2 pt-2 border-t flex justify-between items-center">
                                  <span className="truncate">
                                      {format(new Date(analysis.analysisDate), "d MMM yy HH:mm", { locale: fr })}
                                  </span>
                                </div>
                            </CardContent>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-1 right-1 h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive z-10 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mon historique</h1>
          <p className="mt-2 text-lg text-muted-foreground">Retrouvez ici toutes vos analyses de plantes passées.</p>
        </div>

        {analyses && analyses.length > 0 && (
          <div className="mb-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par plante ou maladie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
          </div>
        )}

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

    