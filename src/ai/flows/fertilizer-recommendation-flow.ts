'use server';
/**
 * @fileOverview An AI agent for fertilizer recommendations.
 *
 * - fertilizerRecommendation - A function that handles the fertilizer recommendation process.
 * - FertilizerRecommendationInput - The input type for the fertilizerRecommendation function.
 * - FertilizerRecommendationOutput - The return type for the fertilizerRecommendation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const FertilizerRecommendationInputSchema = z.object({
  soilType: z.string().describe('The type of soil (e.g., sandy, loamy, clayey, silt, peat).'),
  pH: z.number().describe('The pH level of the soil (0-14).'),
  temperature: z.number().describe('The temperature of the soil in Celsius.'),
  crop: z.string().describe('The name of the crop being grown.'),
});
export type FertilizerRecommendationInput = z.infer<typeof FertilizerRecommendationInputSchema>;

const FertilizerRecommendationOutputSchema = z.object({
  fertilizerType: z.string().describe('The specific type or blend of fertilizer recommended (e.g., Urea, 10-20-10 NPK, Superphosphate).'),
  quantityKgPerHectare: z.number().describe('The recommended application quantity in kilograms per hectare.'),
  justification: z.string().describe('Explanation for why this fertilizer and quantity are recommended based on the inputs.'),
});
export type FertilizerRecommendationOutput = z.infer<typeof FertilizerRecommendationOutputSchema>;

export async function fertilizerRecommendation(input: FertilizerRecommendationInput): Promise<FertilizerRecommendationOutput> {
  return fertilizerRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerRecommendationPrompt',
  input: {
    schema: FertilizerRecommendationInputSchema,
  },
  output: {
    schema: FertilizerRecommendationOutputSchema,
  },
  prompt: `You are an expert agricultural advisor specializing in soil health and crop nutrition.

A farmer needs a fertilizer recommendation based on the following information:
- Soil Type: {{soilType}}
- Soil pH: {{pH}}
- Soil Temperature: {{temperature}}°C
- Crop: {{crop}}

Based on these factors, recommend a specific type of fertilizer (e.g., Urea, Balanced NPK 10-10-10, Superphosphate, Potash, Organic Compost, custom blend) and the application quantity in kilograms per hectare (kg/ha).

Provide a justification explaining why this specific fertilizer type and quantity are suitable considering the soil conditions and the nutritional needs of the specified crop. Focus on the primary nutrient needs addressed by the recommendation.
`,
});

const fertilizerRecommendationFlow = ai.defineFlow<
  typeof FertilizerRecommendationInputSchema,
  typeof FertilizerRecommendationOutputSchema
>(
  {
    name: 'fertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async input => {
    // Basic validation or adjustments could happen here if needed
    // For example, ensuring pH is within a reasonable range, although Zod handles some of this.

    const {output} = await prompt(input);

    // Post-processing or refinement could happen here
    // For example, ensuring quantity is non-negative
    if (output && output.quantityKgPerHectare < 0) {
        output.quantityKgPerHectare = 0; // Ensure quantity is not negative
    }

    return output!;
  }
);
