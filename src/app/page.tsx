'use client';

import { useState } from 'react';
import ImageUploader from '@/components/image-uploader';
import AnalysisDisplay from '@/components/analysis-display';
import { Button } from '@/components/ui/button';
import { analyzePlantImageAndDetectDisease } from '@/ai/flows/analyze-plant-image-and-detect-disease';
import { LoaderCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type AnalysisResult = {
  diseaseDetected: string;
  treatmentSuggestion: string;
};

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      } else {
        throw new Error('Analysis failed to return a result.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
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
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Analyzing...</h2>
          <p className="text-muted-foreground">Our AI is examining your plant leaf. Please wait a moment.</p>
          {imagePreview && (
            <Image src={imagePreview} alt="Plant leaf for analysis" width={200} height={200} className="mt-4 rounded-lg object-cover shadow-lg" />
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
              <Image src={imagePreview} alt="Selected plant leaf" width={400} height={400} className="rounded-lg object-contain mx-auto max-h-[50vh]" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-70 group-hover:opacity-100" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-2 font-headline">Ready for Analysis</h2>
            <p className="text-muted-foreground mb-4">Click the button below to detect potential diseases.</p>
            <Button onClick={handleAnalyze} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Analyze Plant
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <ImageUploader onImageSelect={handleImageSelect} />;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-full">
      {renderContent()}
    </div>
  );
}
