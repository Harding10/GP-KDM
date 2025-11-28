import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Sparkles, RefreshCcw, Info, Bug, ShieldCheck, TestTube2, Sprout } from 'lucide-react';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';

interface AnalysisDisplayProps {
  result: AnalyzePlantImageAndDetectDiseaseOutput;
  imagePreview: string;
  onReset: () => void;
}

export default function AnalysisDisplay({ result, imagePreview, onReset }: AnalysisDisplayProps) {
  const { plantType, isHealthy, diseaseDetected, probableCause, preventionAdvice, biologicalTreatment, chemicalTreatment } = result;

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="flex flex-col gap-4">
         <Card className="overflow-hidden rounded-xl">
            <CardContent className="p-0">
                <Image src={imagePreview} alt="Feuille de plante analysée" width={600} height={600} className="rounded-lg object-contain w-full max-h-[60vh]" />
            </CardContent>
         </Card>
         <Button onClick={onReset} variant="outline" size="lg">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Analyser une autre plante
         </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-bold text-2xl">
                {isHealthy ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <AlertTriangle className="h-8 w-8 text-destructive" />}
                Résultat de l'analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-lg">
                    <Sprout className="h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold">Plante identifiée :</p>
                    <span className="font-bold">{plantType}</span>
                </div>
                 <div className="flex items-center gap-3 text-lg">
                    {isHealthy ? <CheckCircle2 className="h-6 w-6 text-muted-foreground" /> : <AlertTriangle className="h-6 w-6 text-muted-foreground" />}
                    <p className="font-semibold">Condition :</p>
                    <Badge variant={isHealthy ? "default" : "destructive"} className="text-base font-bold px-4 py-1.5 rounded-full">
                        {diseaseDetected}
                    </Badge>
                </div>
            </div>
            {!isHealthy && (
                <p className="mt-6 text-muted-foreground">Voici une analyse détaillée et des suggestions pour aider votre plante.</p>
            )}
          </CardContent>
        </Card>

        {!isHealthy && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
            <Card className="rounded-xl">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 font-bold text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Info className="h-6 w-6 text-primary"/> Cause Probable
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base">
                        <p>{probableCause}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card className="rounded-xl">
                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="p-6 font-bold text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-primary"/> Conseils de Prévention
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base">
                        <p>{preventionAdvice}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card className="rounded-xl">
                <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="p-6 font-bold text-lg hover:no-underline">
                         <div className="flex items-center gap-3">
                            <Bug className="h-6 w-6 text-primary"/> Traitement Biologique
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base">
                        <p>{biologicalTreatment}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
             <Card className="rounded-xl">
                <AccordionItem value="item-4" className="border-b-0">
                    <AccordionTrigger className="p-6 font-bold text-lg hover:no-underline">
                         <div className="flex items-center gap-3">
                            <TestTube2 className="h-6 w-6 text-primary"/> Traitement Chimique
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base">
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
