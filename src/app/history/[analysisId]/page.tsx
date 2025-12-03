
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Loader, Trash2 } from 'lucide-react';
import Link from 'next/link';
import AnalysisDisplay from '@/components/analysis-display';
import { AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';
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

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const analysisId = params.analysisId as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Ensure window is defined (runs only on client)
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const analysisDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !analysisId) return null;
    return doc(firestore, `users/${user.uid}/analyses/${analysisId}`);
  }, [user, firestore, analysisId]);

  const { data: analysis, isLoading, error } = useDoc<AnalyzePlantImageAndDetectDiseaseOutput & { imageUri: string }>(analysisDocRef);

  const handleDeleteAnalysis = async () => {
    if (!analysisDocRef) return;

    setIsDeleting(true);
    try {
      await deleteDoc(analysisDocRef);
      toast({
        title: 'Analyse supprimée',
        description: "L'analyse a été retirée de votre historique.",
      });
      router.push('/history');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de supprimer l'analyse.",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold">Chargement de l'analyse...</h2>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-16 px-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-destructive">Analyse introuvable</h2>
        <p className="mt-2 text-muted-foreground">Impossible de charger cette analyse. Elle n'existe peut-être pas ou vous n'y avez pas accès.</p>
        <Button asChild className="mt-6" size="lg" variant="outline">
          <Link href="/history">
            <ArrowLeft className="mr-2" />
            Retour à l'historique
          </Link>
        </Button>
      </div>
    );
  }

  const handleReset = () => {
    router.push('/analyze');
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Détail de l'analyse</h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">Voici le rapport complet pour votre plante.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="flex-1 sm:flex-none">
              <Link href="/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting} className="flex-1 sm:flex-none">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
        <AnalysisDisplay result={analysis} imagePreview={analysis.imageUri} onReset={handleReset} shareUrl={currentUrl} />
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
