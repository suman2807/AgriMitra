// Implemented the crop recommendation flow, prompt and schema.
'use server';
/**
 * @fileOverview A crop recommendation AI agent.
 *
 * - cropRecommendation - A function that handles the crop recommendation process.
 * - CropRecommendationInput - The input type for the cropRecommendation function.
 * - CropRecommendationOutput - The return type for the cropRecommendation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  nitrogenLevel: z.number().describe('Nitrogen level in the soil.'),
  phosphorusLevel: z.number().describe('Phosphorus level in the soil.'),
  potassiumLevel: z.number().describe('Potassium level in the soil.'),
  moistureLevel: z.number().describe('Moisture level in the soil.'),
  temperature: z.number().describe('Temperature of the soil in Celsius.'),
  rainfall: z.number().describe('Rainfall in mm.'),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  crops: z
    .array(
      z.object({
        cropName: z.string().describe('The name of the recommended crop.'),
        suitabilityScore: z
          .number()
          .describe('A score indicating the suitability of the crop (0-100).'),
        justification: z.string().describe('Why the crop is recommended for the given soil properties.'),
      })
    )
    .describe('A list of recommended crops and their suitability scores.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function cropRecommendation(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return cropRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {
    schema: z.object({
      nitrogenLevel: z.number().describe('Nitrogen level in the soil.'),
      phosphorusLevel: z.number().describe('Phosphorus level in the soil.'),
      potassiumLevel: z.number().describe('Potassium level in the soil.'),
      moistureLevel: z.number().describe('Moisture level in the soil.'),
      temperature: z.number().describe('Temperature of the soil in Celsius.'),
      rainfall: z.number().describe('Rainfall in mm.'),
    }),
  },
  output: {
    schema: z.object({
      crops: z
        .array(
          z.object({
            cropName: z.string().describe('The name of the recommended crop.'),
            suitabilityScore: z
              .number()
              .describe('A score indicating the suitability of the crop (0-100).'),
            justification: z.string().describe('Why the crop is recommended for the given soil properties.'),
          })
        )
        .describe('A list of recommended crops and their suitability scores.'),
    }),
  },
  prompt: `You are an expert agricultural advisor. A farmer will provide you with soil properties, and you will recommend the best crops to plant, and a suitability score.

Soil Properties:
Nitrogen Level: {{nitrogenLevel}}
Phosphorus Level: {{phosphorusLevel}}
Potassium Level: {{potassiumLevel}}
Moisture Level: {{moistureLevel}}
Temperature: {{temperature}} Celsius
Rainfall: {{rainfall}} mm

Recommend suitable crops and provide a suitability score (0-100) and justification for each recommendation. Return a JSON array of crops.`,
});

const cropRecommendationFlow = ai.defineFlow<
  typeof CropRecommendationInputSchema,
  typeof CropRecommendationOutputSchema
>(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
