import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Sparkles, RefreshCcw, Info, Bug, ShieldCheck, TestTube2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';

interface AnalysisDisplayProps {
  result: AnalyzePlantImageAndDetectDiseaseOutput;
  imagePreview: string;
  onReset: () => void;
}

export default function AnalysisDisplay({ result, imagePreview, onReset }: AnalysisDisplayProps) {
  const { isHealthy, diseaseDetected, probableCause, preventionAdvice, biologicalTreatment, chemicalTreatment } = result;

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

      <div className="flex flex-col gap-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline">
                {isHealthy ? <CheckCircle2 className="h-7 w-7 text-primary" /> : <AlertTriangle className="h-7 w-7 text-destructive" />}
                Résultat de l'analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">Condition détectée :</p>
              <Badge variant={isHealthy ? "default" : "destructive"} className="text-base px-4 py-1">
                {diseaseDetected}
              </Badge>
            </div>
            {!isHealthy && (
                <p className="mt-4 text-muted-foreground">Voici une analyse détaillée et des suggestions pour aider votre plante.</p>
            )}
          </CardContent>
        </Card>

        {!isHealthy && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
            <Card>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 font-headline text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Info className="h-6 w-6 text-accent"/> Cause Probable
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <p>{probableCause}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card>
                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="p-6 font-headline text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-accent"/> Conseils de Prévention
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <p>{preventionAdvice}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card>
                <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="p-6 font-headline text-lg hover:no-underline">
                         <div className="flex items-center gap-3">
                            <Bug className="h-6 w-6 text-accent"/> Traitement Biologique
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <p>{biologicalTreatment}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
             <Card>
                <AccordionItem value="item-4" className="border-b-0">
                    <AccordionTrigger className="p-6 font-headline text-lg hover:no-underline">
                         <div className="flex items-center gap-3">
                            <TestTube2 className="h-6 w-6 text-accent"/> Traitement Chimique
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <p>{chemicalTreatment}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
          </Accordion>
        )}
      </div>
    </div>
  );
}
