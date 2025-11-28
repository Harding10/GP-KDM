
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AnalyzePlantImageAndDetectDiseaseOutput } from '@/ai/flows/analyze-plant-image-and-detect-disease';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, Info, Shield, RefreshCcw, Bug, FlaskConical, Leaf, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisDisplayProps {
  result: AnalyzePlantImageAndDetectDiseaseOutput;
  imagePreview: string;
  onReset: () => void;
  shareUrl?: string;
}

export default function AnalysisDisplay({ result, imagePreview, onReset, shareUrl }: AnalysisDisplayProps) {
  const { toast } = useToast();
  const { plantType, isHealthy, diseaseDetected, probableCause, preventionAdvice, biologicalTreatment, chemicalTreatment } = result;

  const handleShare = async () => {
    const shareData = {
      title: 'Résultat d\'analyse AgriAide',
      text: `Mon diagnostic pour un(e) ${plantType}: ${diseaseDetected}. Découvrez AgriAide !`,
      url: shareUrl || window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        toast({
          variant: 'destructive',
          title: 'Partage annulé',
          description: 'Le partage a été annulé ou a échoué.',
        });
      }
    } else {
      // Fallback for desktop/browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({
          title: 'Copié dans le presse-papiers!',
          description: 'Le lien et le diagnostic ont été copiés.',
        });
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
        toast({
          variant: 'destructive',
          title: 'Échec de la copie',
          description: 'Impossible de copier le lien dans le presse-papiers.',
        });
      }
    }
  };


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
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="flex flex-col gap-6">
         <Card className="overflow-hidden rounded-2xl shadow-lg">
            <CardContent className="p-0">
                <Image src={imagePreview} alt="Feuille de plante analysée" width={600} height={600} className="object-contain w-full max-h-[60vh]" />
            </CardContent>
         </Card>
         
        <div className="flex flex-col sm:flex-row gap-4">
             <Button onClick={onReset} variant="outline" size="lg" className="rounded-full flex-1">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Nouvelle analyse
             </Button>
             <Button asChild size="lg" className="rounded-full flex-1">
                 <Link href="/history">
                    Voir l'historique
                 </Link>
             </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 font-bold text-xl sm:text-2xl">
                {isHealthy ? <CheckCircle className="h-8 w-8 text-primary" /> : <AlertTriangle className="h-8 w-8 text-destructive" />}
                Résultat
            </CardTitle>
            {shareUrl && (
              <Button onClick={handleShare} variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Partager</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex items-center gap-3 text-lg">
                    <Leaf className="h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold">Plante :</p>
                    <span className="font-bold text-primary">{plantType}</span>
                </div>
                 <div className="flex items-center gap-3 text-lg">
                    {isHealthy ? <CheckCircle className="h-6 w-6 text-primary" /> : <AlertTriangle className="h-6 w-6 text-destructive" />}
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
            <AccordionCard value="item-2" title="Conseils de Prévention" icon={<Shield className="h-6 w-6 text-primary"/>} content={preventionAdvice} />
            <AccordionCard value="item-3" title="Traitement Biologique" icon={<Bug className="h-6 w-6 text-primary"/>} content={biologicalTreatment} />
            <AccordionCard value="item-4" title="Traitement Chimique" icon={<FlaskConical className="h-6 w-6 text-primary"/>} content={chemicalTreatment} />
          </Accordion>
        )}
      </div>
    </div>
  );
}
