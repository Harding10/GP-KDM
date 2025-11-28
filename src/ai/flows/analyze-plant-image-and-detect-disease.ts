'use server';
/**
 * @fileOverview Analyzes a plant image to detect potential diseases and suggests treatments.
 *
 * - analyzePlantImageAndDetectDisease - A function that handles the plant image analysis and disease detection process.
 * - AnalyzePlantImageAndDetectDiseaseInput - The input type for the analyzePlantImageAndDetectDisease function.
 * - AnalyzePlantImageAndDetectDiseaseOutput - The return type for the analyzePlantImageAndDetectDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlantImageAndDetectDiseaseInputSchema = z.object({
  plantImageDataUri: z
    .string()
    .describe(
      "Une photo d'une feuille de plante, sous forme d'URI de données qui doit inclure un type MIME et utiliser un encodage Base64. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePlantImageAndDetectDiseaseInput = z.infer<typeof AnalyzePlantImageAndDetectDiseaseInputSchema>;

const AnalyzePlantImageAndDetectDiseaseOutputSchema = z.object({
  plantType: z.string().describe("Le nom commun de la plante identifiée dans l'image."),
  diseaseDetected: z.string().describe('Le nom de la maladie détectée dans la feuille de la plante. Si la plante est saine, retourner "Aucune maladie détectée".'),
  isHealthy: z.boolean().describe('Indique si la plante est considérée comme saine.'),
  probableCause: z.string().describe('La cause la plus probable de la maladie détectée. Laissez vide si la plante est saine.'),
  preventionAdvice: z.string().describe("Conseils de prévention pour éviter que la maladie ne se reproduise. Laissez vide si la plante est saine."),
  biologicalTreatment: z.string().describe("Suggestion de traitement biologique pour la maladie. Laissez vide si la plante est saine."),
  chemicalTreatment: z.string().describe("Suggestion de traitement chimique pour la maladie. Laissez vide si la plante est saine."),
});
export type AnalyzePlantImageAndDetectDiseaseOutput = z.infer<typeof AnalyzePlantImageAndDetectDiseaseOutputSchema>;

export async function analyzePlantImageAndDetectDisease(
  input: AnalyzePlantImageAndDetectDiseaseInput
): Promise<AnalyzePlantImageAndDetectDiseaseOutput> {
  return analyzePlantImageAndDetectDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlantImageAndDetectDiseasePrompt',
  input: {schema: AnalyzePlantImageAndDetectDiseaseInputSchema},
  output: {schema: AnalyzePlantImageAndDetectDiseaseOutputSchema},
  prompt: `Vous êtes un botaniste expert de renommée mondiale, spécialisé dans l'identification des plantes et le diagnostic des maladies. Votre objectif est de fournir une analyse complète et exploitable.

Analysez l'image de la feuille de la plante fournie et suivez ces étapes :
1.  **Identifiez la plante.** Déterminez le nom commun de la plante.
2.  **Diagnostiquez la plante** en utilisant la connaissance du type de plante pour affiner votre analyse. Si la plante semble saine, indiquez "Aucune maladie détectée" et définissez isHealthy sur true.
3.  Si une maladie est détectée, définissez isHealthy sur false.
4.  Pour toute maladie détectée, décrivez la cause probable (par exemple, champignon, bactérie, carence nutritionnelle, ravageur).
5.  Fournissez des conseils de prévention clairs et concis pour éviter que ce problème ne se reproduise.
6.  Suggérez au moins un traitement biologique (par exemple, savon insecticide, huile de neem, introduction d'insectes bénéfiques).
7.  Suggérez au moins un traitement chimique (par exemple, un fongicide ou un pesticide spécifique).

Fournissez une réponse structurée en utilisant le schéma de sortie JSON.

Image de la feuille de plante : {{media url=plantImageDataUri}}`,
});

const analyzePlantImageAndDetectDiseaseFlow = ai.defineFlow(
  {
    name: 'analyzePlantImageAndDetectDiseaseFlow',
    inputSchema: AnalyzePlantImageAndDetectDiseaseInputSchema,
    outputSchema: AnalyzePlantImageAndDetectDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
