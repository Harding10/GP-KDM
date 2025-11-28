'use server';

/**
 * @fileOverview Suggests treatments for a detected plant disease.
 *
 * - suggestTreatments - A function that suggests treatments for a detected plant disease.
 * - SuggestTreatmentsInput - The input type for the suggestTreatments function.
 * - SuggestTreatmentsOutput - The return type for the suggestTreatments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTreatmentsInputSchema = z.object({
  diseaseName: z.string().describe('Le nom de la maladie de la plante détectée.'),
  plantType: z.string().describe('Le type de plante affectée par la maladie.'),
});
export type SuggestTreatmentsInput = z.infer<typeof SuggestTreatmentsInputSchema>;

const SuggestTreatmentsOutputSchema = z.object({
  treatments: z
    .array(z.string())
    .describe('Une liste de traitements ou de remèdes suggérés pour la maladie.'),
});
export type SuggestTreatmentsOutput = z.infer<typeof SuggestTreatmentsOutputSchema>;

export async function suggestTreatments(input: SuggestTreatmentsInput): Promise<SuggestTreatmentsOutput> {
  return suggestTreatmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTreatmentsPrompt',
  input: {schema: SuggestTreatmentsInputSchema},
  output: {schema: SuggestTreatmentsOutputSchema},
  prompt: `Vous êtes un expert en maladies des plantes et leurs traitements. Compte tenu du nom d'une maladie végétale et du type de plante affectée, suggérez des traitements ou des remèdes possibles.

Nom de la maladie : {{{diseaseName}}}
Type de plante : {{{plantType}}}

Suggérer des traitements:
`,
});

const suggestTreatmentsFlow = ai.defineFlow(
  {
    name: 'suggestTreatmentsFlow',
    inputSchema: SuggestTreatmentsInputSchema,
    outputSchema: SuggestTreatmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
