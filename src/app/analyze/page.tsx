
'use client';

import { useState, useRef, useEffect } from 'react';
import ImageUploader from '@/components/image-uploader';
import AnalysisDisplay from '@/components/analysis-display';
import { Button } from '@/components/ui/button';
import { analyzePlantImageAndDetectDisease, AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';
import { Loader, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AnalyzePage() {
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
    let stream: MediaStream | null = null;
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    }
  
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
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

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName || uploadPreset === 'your_upload_preset') {
        throw new Error("Les variables d'environnement Cloudinary ne sont pas configurées. Veuillez les ajouter dans le fichier .env");
    }
    
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error.message || "Échec du téléversement sur Cloudinary.");
    }
    return data.secure_url;
  }
  
  const saveAnalysis = async (result: AnalyzePlantImageAndDetectDiseaseOutput, imageUrl: string) => {
      if (user && firestore) {
          try {
            const userAnalysesRef = collection(firestore, `users/${user.uid}/analyses`);
            await addDoc(userAnalysesRef, {
              userId: user.uid,
              imageUri: imageUrl, // Storing the Cloudinary URL
              plantType: result.plantType,
              diseaseDetected: result.diseaseDetected,
              isHealthy: result.isHealthy,
              probableCause: result.probableCause,
              preventionAdvice: result.preventionAdvice,
              biologicalTreatment: result.biologicalTreatment,
              chemicalTreatment: result.chemicalTreatment,
              analysisDate: new Date().toISOString(),
            });
            toast({
                title: "Analyse sauvegardée",
                description: "Votre analyse a été ajoutée à votre historique.",
            })
          } catch (error) {
              console.error("Error saving analysis: ", error);
              toast({
                  variant: "destructive",
                  title: "Sauvegarde échouée",
                  description: "Impossible de sauvegarder l'analyse dans votre historique.",
              })
          }
      }
  }

  const handleAnalyze = async () => {
    if (!imagePreview || !imageFile) return;
    setIsLoading(true);
    setError(null);
    try {
      // First, upload the image to Cloudinary to get a URL
      const imageUrl = await uploadToCloudinary(imageFile);

      // Then, run the analysis using the original image data (as data URI)
      const result = await analyzePlantImageAndDetectDisease({ plantImageDataUri: imagePreview });
      
      if (result) {
        setAnalysisResult(result);
        // After analysis, save the result along with the Cloudinary URL to Firestore
        if (user) {
            await saveAnalysis(result, imageUrl);
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
        canvas.toBlob((blob) => {
            if (blob) {
                const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
                handleImageSelect(capturedFile);
            }
        }, 'image/jpeg', 0.95);
        setIsCameraOpen(false);
      }
    }
  };

  const renderContent = () => {
     if (isCameraOpen) {
      return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 flex justify-center items-center gap-4">
              <Button onClick={() => setIsCameraOpen(false)} variant="outline" className="rounded-full !px-8 !py-6 text-base">Annuler</Button>
              <Button onClick={handleCapture} disabled={hasCameraPermission !== true} size="lg" className="rounded-full w-20 h-20 !p-0 border-4 border-white bg-white/30 hover:bg-white/50">
                <div className="w-16 h-16 rounded-full bg-white"></div>
              </Button>
              <div className="w-24"></div>
            </div>
            {hasCameraPermission === false && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Alert variant="destructive" className="mt-4">
                      <AlertTitle>Accès à la caméra requis</AlertTitle>
                      <AlertDescription>
                        Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            {imagePreview && (
              <Image src={imagePreview} alt="Feuille de plante pour analyse" width={250} height={250} className="object-cover w-full rounded-2xl shadow-lg opacity-30 aspect-square" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl">
              <Loader className="h-16 w-16 animate-spin text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-6">Analyse en cours...</h2>
          <p className="text-muted-foreground max-w-sm">Notre IA examine votre feuille de plante. Veuillez patienter un instant, cela peut prendre quelques secondes.</p>
        </div>
      );
    }

    if (analysisResult) {
      // The imagePreview for the display is now the Cloudinary URL if available, otherwise fallback.
      return <AnalysisDisplay result={analysisResult} imagePreview={imagePreview!} onReset={handleReset} />;
    }

    if (imagePreview) {
      return (
        <Card className="w-full max-w-lg overflow-hidden shadow-lg rounded-xl animate-fade-in">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="relative mb-4 group">
              <Image src={imagePreview} alt="Feuille de plante sélectionnée" width={400} height={400} className="rounded-lg object-contain mx-auto max-h-[50vh]" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 rounded-full h-8 w-8" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-2">Prêt pour l'analyse</h2>
            <p className="text-muted-foreground mb-4">Cliquez sur le bouton ci-dessous pour détecter les maladies potentielles.</p>
            <Button onClick={handleAnalyze} size="lg">
              Analyser la plante
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <ImageUploader onImageSelect={handleImageSelect} onCameraClick={() => setIsCameraOpen(true)} />;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      {renderContent()}
    </div>
  );
}
