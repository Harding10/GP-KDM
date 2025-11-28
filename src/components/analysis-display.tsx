import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, RefreshCcw, Info, Bug, ShieldCheck, TestTube2, Sprout } from 'lucide-react';
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

  const AccordionCard = ({ value, title, icon, content }: { value: string, title: string, icon: React.ReactNode, content: string | undefined }) => (
    content ? (
        <Card className="rounded-xl bg-background/50">
            <AccordionItem value={value} className="border-b-0">
                <AccordionTrigger className="p-4 md:p-6 font-bold text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                        {icon} {title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-base">
                    <p>{content}</p>
                </AccordionContent>
            </AccordionItem>
        </Card>
    ) : null
  );

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
      <div className="flex flex-col gap-6">
         <Card className="overflow-hidden rounded-2xl shadow-lg">
            <CardContent className="p-0">
                <Image src={imagePreview} alt="Feuille de plante analysée" width={600} height={600} className="object-contain w-full max-h-[60vh] lg:max-h-[70vh]" />
            </CardContent>
         </Card>
         <Button onClick={onReset} variant="outline" size="lg" className="rounded-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Analyser une autre plante
         </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-bold text-2xl">
                {isHealthy ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <AlertTriangle className="h-8 w-8 text-destructive" />}
                Résultat de l'analyse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-lg">
                    <Sprout className="h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold">Plante :</p>
                    <span className="font-bold text-primary">{plantType}</span>
                </div>
                 <div className="flex items-center gap-3 text-lg">
                    {isHealthy ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <AlertTriangle className="h-6 w-6 text-destructive" />}
                    <p className="font-semibold">Diagnostic :</p>
                    <Badge variant={isHealthy ? "default" : "destructive"} className="text-base font-bold px-4 py-1.5 rounded-full">
                        {diseaseDetected}
                    </Badge>
                </div>
          </CardContent>
        </Card>

        {!isHealthy && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
            <AccordionCard value="item-1" title="Cause Probable" icon={<Info className="h-6 w-6 text-primary"/>} content={probableCause} />
            <AccordionCard value="item-2" title="Conseils de Prévention" icon={<ShieldCheck className="h-6 w-6 text-primary"/>} content={preventionAdvice} />
            <AccordionCard value="item-3" title="Traitement Biologique" icon={<Bug className="h-6 w-6 text-primary"/>} content={biologicalTreatment} />
            <AccordionCard value="item-4" title="Traitement Chimique" icon={<TestTube2 className="h-6 w-6 text-primary"/>} content={chemicalTreatment} />
          </Accordion>
        )}
      </div>
    </div>
  );
}
