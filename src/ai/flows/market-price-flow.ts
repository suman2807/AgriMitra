
'use server';
/**
 * @fileOverview An AI agent for providing market price insights for crops.
 *
 * - marketPrice - A function that handles the market price fetching process.
 * - MarketPriceInput - The input type for the marketPrice function.
 * - MarketPriceOutput - The return type for the marketPrice function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const MarketPriceInputSchema = z.object({
  cropName: z.string().describe('The name of the crop for which to fetch market prices (e.g., Wheat, Corn).'),
  location: z.string().describe('The geographical area or market location (e.g., Chicago, Midwest USA, Local Farmers Market).'),
});
export type MarketPriceInput = z.infer<typeof MarketPriceInputSchema>;

const MarketPriceOutputSchema = z.object({
  marketData: z.object({
      cropName: z.string().describe('The name of the crop.'),
      location: z.string().describe('The location for which the price is relevant.'),
      price: z.string().describe('The current market price (e.g., "$4.50", "€150"). Include currency symbol.'),
      unit: z.string().describe('The unit of measurement for the price (e.g., bushel, metric ton, kg).'),
      date: z.string().describe('The date for which the price is current (e.g., YYYY-MM-DD or Month DD, YYYY).'),
      trend: z.enum(['rising', 'falling', 'stable']).optional().describe('The current price trend (rising, falling, or stable).'),
      analysis: z.string().describe('A brief analysis or commentary on the market price and trend, considering factors like supply, demand, and recent events.'),
  }).describe('Detailed market price information for the specified crop and location.')
});
export type MarketPriceOutput = z.infer<typeof MarketPriceOutputSchema>;

export async function marketPrice(input: MarketPriceInput): Promise<MarketPriceOutput> {
  return marketPriceFlow(input);
}

// Note: This prompt relies on the LLM's general knowledge or access to up-to-date information.
// For production use, integrating a real-time market data API via a Genkit Tool would be more reliable.
const prompt = ai.definePrompt({
  name: 'marketPricePrompt',
  input: {
    schema: MarketPriceInputSchema,
  },
  output: {
    schema: MarketPriceOutputSchema,
  },
  prompt: `You are an agricultural market analyst AI.

Provide the current market price information for the following crop in the specified location. Use the most recent data you have access to.

Crop: {{cropName}}
Location: {{location}}

Respond with the current price, the unit (e.g., per bushel, per metric ton), the date of the price information, the recent price trend (rising, falling, or stable), and a brief analysis of the current market situation for this crop in the given location. Be concise but informative. If specific data for the exact location isn't available, provide data for the nearest relevant market or region and state that clearly.
`,
});

const marketPriceFlow = ai.defineFlow<
  typeof MarketPriceInputSchema,
  typeof MarketPriceOutputSchema
>(
  {
    name: 'marketPriceFlow',
    inputSchema: MarketPriceInputSchema,
    outputSchema: MarketPriceOutputSchema,
  },
  async input => {
    // In a real application, you might use a Tool here to call a market data API.
    // const marketApiTool = ai.defineTool(...)
    // const priceData = await marketApiTool({ crop: input.cropName, location: input.location });
    // Then, you could pass priceData into the prompt or format the output directly.

    const {output} = await prompt(input);

    // Basic validation or formatting could happen here
    if (output && !output.marketData.date) {
         output.marketData.date = new Date().toLocaleDateString(); // Add current date if missing
    }

    return output!;
  }
);
