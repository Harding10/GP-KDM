import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Sparkles, RefreshCcw } from 'lucide-react';
import { Badge } from './ui/badge';

interface AnalysisDisplayProps {
  result: {
    diseaseDetected: string;
    treatmentSuggestion: string;
  };
  imagePreview: string;
  onReset: () => void;
}

export default function AnalysisDisplay({ result, imagePreview, onReset }: AnalysisDisplayProps) {
  const isDiseaseFound = result.diseaseDetected && !result.diseaseDetected.toLowerCase().includes('aucune maladie');

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="flex flex-col gap-4">
         <Card>
            <CardContent className="p-4">
                <Image src={imagePreview} alt="Feuille de plante analysée" width={500} height={500} className="rounded-lg object-contain w-full max-h-[50vh]" />
            </CardContent>
         </Card>
         <Button onClick={onReset} variant="outline" size="lg">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Analyser une autre image
         </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
                {isDiseaseFound ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <CheckCircle2 className="h-6 w-6 text-primary" />}
                Résultat de l'analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">Condition détectée :</p>
              <Badge variant={isDiseaseFound ? "destructive" : "default"} className="text-base px-4 py-1">
                {result.diseaseDetected}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {isDiseaseFound && (
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Sparkles className="h-6 w-6 text-accent" />
                    Suggestion de traitement
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-none text-foreground">
                <p>{result.treatmentSuggestion}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
