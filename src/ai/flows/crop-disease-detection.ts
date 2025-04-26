'use server';
/**
 * @fileOverview An AI agent to detect crop diseases from an image.
 *
 * - detectCropDisease - A function that handles the crop disease detection process.
 * - DetectCropDiseaseInput - The input type for the detectCropDisease function.
 * - DetectCropDiseaseOutput - The return type for the detectCropDisease function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const DetectCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectCropDiseaseInput = z.infer<typeof DetectCropDiseaseInputSchema>;

const DetectCropDiseaseOutputSchema = z.object({
  diseaseIdentification: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diseaseName: z.string().describe('The name of the identified disease, if any.'),
    confidence: z.number().describe('The confidence level of the disease identification (0-1).'),
    suggestions: z.string().describe('Suggestions for treatment or prevention.'),
  }),
});
export type DetectCropDiseaseOutput = z.infer<typeof DetectCropDiseaseOutputSchema>;

export async function detectCropDisease(input: DetectCropDiseaseInput): Promise<DetectCropDiseaseOutput> {
  return detectCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCropDiseasePrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      diseaseIdentification: z.object({
        isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
        diseaseName: z.string().describe('The name of the identified disease, if any.'),
        confidence: z.number().describe('The confidence level of the disease identification (0-1).'),
        suggestions: z.string().describe('Suggestions for treatment or prevention.'),
      }),
    }),
  },
  prompt: `You are an expert in identifying crop diseases.

  Analyze the image of the crop and determine if it shows signs of any disease. Provide the disease name, a confidence level (0-1), and suggestions for treatment or prevention.

  If the plant appears healthy, indicate that it is healthy and provide a brief assessment.

  Use the following image to perform the analysis:
  {{media url=photoDataUri}}
  `,
});

const detectCropDiseaseFlow = ai.defineFlow<
  typeof DetectCropDiseaseInputSchema,
  typeof DetectCropDiseaseOutputSchema
>(
  {
    name: 'detectCropDiseaseFlow',
    inputSchema: DetectCropDiseaseInputSchema,
    outputSchema: DetectCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
