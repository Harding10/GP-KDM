
'use client';

import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoAlertTriangle, IoArrowBack } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link';
import AnalysisDisplay from '@/components/analysis-display';
import { AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';

export default function AnalysisDetailPage() {
  const params = useParams();
  const analysisId = params.analysisId as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const analysisDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !analysisId) return null;
    return doc(firestore, `users/${user.uid}/analyses/${analysisId}`);
  }, [user, firestore, analysisId]);

  const { data: analysis, isLoading, error } = useDoc<AnalyzePlantImageAndDetectDiseaseOutput & { imageUri: string }>(analysisDocRef);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
        <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold">Chargement de l'analyse...</h2>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-16">
        <IoAlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-destructive">Analyse introuvable</h2>
        <p className="mt-2 text-muted-foreground">Impossible de charger cette analyse. Elle n'existe peut-être pas ou vous n'y avez pas accès.</p>
        <Button asChild className="mt-6" size="lg" variant="outline">
          <Link href="/history">
            <IoArrowBack className="mr-2" />
            Retour à l'historique
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleReset = () => {
    // This function is required by AnalysisDisplay but not used here.
    // A better implementation would be to separate the display logic from the reset logic.
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <Button asChild variant="outline" className="mb-4">
                <Link href="/history">
                    <IoArrowBack className="mr-2 h-4 w-4" />
                    Retour à l'historique
                </Link>
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">Détail de l'analyse</h1>
             <p className="text-muted-foreground text-lg mt-2">Voici le rapport complet pour votre plante.</p>
        </div>
      <AnalysisDisplay result={analysis} imagePreview={analysis.imageUri} onReset={handleReset} />
    </div>
  );
}
