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
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePlantImageAndDetectDiseaseInput = z.infer<typeof AnalyzePlantImageAndDetectDiseaseInputSchema>;

const AnalyzePlantImageAndDetectDiseaseOutputSchema = z.object({
  diseaseDetected: z.string().describe('The disease detected in the plant leaf, or null if no disease is detected.'),
  treatmentSuggestion: z.string().describe('A suggestion for treating the detected disease.'),
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
  prompt: `You are an expert in plant diseases. Analyze the image of the plant leaf and detect any potential diseases. If no disease is detected, indicate that no disease is found. Then, suggest possible treatments or remedies for the detected plant disease.

Plant Leaf Image: {{media url=plantImageDataUri}}

Respond with a disease detected string, and a treatment suggestion string.
Disease Detected:
Treatment Suggestion: `,
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
