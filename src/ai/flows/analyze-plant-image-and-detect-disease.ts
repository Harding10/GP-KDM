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
  diseaseDetected: z.string().describe('La maladie détectée dans la feuille de la plante, ou null si aucune maladie n\'est détectée.'),
  treatmentSuggestion: z.string().describe('Une suggestion pour traiter la maladie détectée.'),
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
  prompt: `Vous êtes un expert en maladies des plantes. Analysez l'image de la feuille de la plante et détectez toute maladie potentielle. Si aucune maladie n'est détectée, indiquez qu'aucune maladie n'est trouvée. Ensuite, suggérez des traitements ou des remèdes possibles pour la maladie végétale détectée.

Image de la feuille de plante : {{media url=plantImageDataUri}}

Répondez avec une chaîne de caractères pour la maladie détectée et une chaîne de caractères pour la suggestion de traitement.
Maladie détectée :
Suggestion de traitement :`,
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
