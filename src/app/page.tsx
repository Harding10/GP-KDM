'use client';

import { useState, useRef, useEffect } from 'react';
import ImageUploader from '@/components/image-uploader';
import AnalysisDisplay from '@/components/analysis-display';
import { Button } from '@/components/ui/button';
import { analyzePlantImageAndDetectDisease, AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';
import { LoaderCircle, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlantImageAndDetectDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès à la caméra refusé',
            description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
          });
          setIsCameraOpen(false);
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOpen, toast]);

  const handleImageSelect = (file: File) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzePlantImageAndDetectDisease({ plantImageDataUri: imagePreview });
      if (result) {
        setAnalysisResult(result);
        if (user && firestore) {
            const userAnalysesRef = collection(firestore, `users/${user.uid}/analyses`);
            const analysisData = {
              userId: user.uid,
              imageUri: imagePreview,
              diseaseDetected: result.diseaseDetected,
              isHealthy: result.isHealthy,
              probableCause: result.probableCause,
              preventionAdvice: result.preventionAdvice,
              biologicalTreatment: result.biologicalTreatment,
              chemicalTreatment: result.chemicalTreatment,
              analysisDate: new Date().toISOString(),
            };
            addDocumentNonBlocking(userAnalysesRef, analysisData);
            toast({
                title: "Analyse sauvegardée",
                description: "Votre analyse a été ajoutée à votre historique.",
            })
        }
      } else {
        throw new Error('L\'analyse n\'a pas renvoyé de résultat.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Une erreur inconnue est survenue.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'L\'analyse a échoué',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    setIsCameraOpen(false);
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        setIsCameraOpen(false);
      }
    }
  };

  const renderContent = () => {
     if (isCameraOpen) {
      return (
        <Card className="w-full max-w-lg overflow-hidden shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Accès à la caméra requis</AlertTitle>
                  <AlertDescription>
                    Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={() => setIsCameraOpen(false)} variant="outline">Annuler</Button>
              <Button onClick={handleCapture} disabled={hasCameraPermission !== true} size="lg">
                <Camera className="mr-2" />
                Capturer
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Analyse en cours...</h2>
          <p className="text-muted-foreground">Notre IA examine votre feuille de plante. Veuillez patienter un instant.</p>
          {imagePreview && (
            <Image src={imagePreview} alt="Feuille de plante pour analyse" width={200} height={200} className="mt-4 rounded-lg object-cover shadow-lg" />
          )}
        </div>
      );
    }

    if (analysisResult) {
      return <AnalysisDisplay result={analysisResult} imagePreview={imagePreview!} onReset={handleReset} />;
    }

    if (imagePreview) {
      return (
        <Card className="w-full max-w-lg overflow-hidden shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4 group">
              <Image src={imagePreview} alt="Feuille de plante sélectionnée" width={400} height={400} className="rounded-lg object-contain mx-auto max-h-[50vh]" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-70 group-hover:opacity-100" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-2 font-headline">Prêt pour l'analyse</h2>
            <p className="text-muted-foreground mb-4">Cliquez sur le bouton ci-dessous pour détecter les maladies potentielles.</p>
            <Button onClick={handleAnalyze} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Analyser la plante
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <ImageUploader onImageSelect={handleImageSelect} onCameraClick={() => setIsCameraOpen(true)} />;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-full">
      {renderContent()}
    </div>
  );
}
