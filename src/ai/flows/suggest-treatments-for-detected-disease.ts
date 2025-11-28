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
  diseaseName: z.string().describe('The name of the detected plant disease.'),
  plantType: z.string().describe('The type of plant affected by the disease.'),
});
export type SuggestTreatmentsInput = z.infer<typeof SuggestTreatmentsInputSchema>;

const SuggestTreatmentsOutputSchema = z.object({
  treatments: z
    .array(z.string())
    .describe('A list of suggested treatments or remedies for the disease.'),
});
export type SuggestTreatmentsOutput = z.infer<typeof SuggestTreatmentsOutputSchema>;

export async function suggestTreatments(input: SuggestTreatmentsInput): Promise<SuggestTreatmentsOutput> {
  return suggestTreatmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTreatmentsPrompt',
  input: {schema: SuggestTreatmentsInputSchema},
  output: {schema: SuggestTreatmentsOutputSchema},
  prompt: `You are an expert in plant diseases and their treatments. Given the name of a plant disease and the type of plant affected, suggest possible treatments or remedies.

Disease Name: {{{diseaseName}}}
Plant Type: {{{plantType}}}

Suggest treatments:
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
