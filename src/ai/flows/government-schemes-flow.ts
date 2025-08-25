
'use server';
/**
 * @fileOverview An AI agent for providing information on government schemes and subsidies for farmers in India.
 *
 * - governmentSchemes - A function that handles fetching relevant government schemes.
 * - GovernmentSchemesInput - The input type for the governmentSchemes function.
 * - GovernmentSchemesOutput - The return type for the governmentSchemes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Input Schema
const GovernmentSchemesInputSchema = z.object({
  location: z.string().describe('The state or region in India for which to find schemes (e.g., Maharashtra, Punjab, North India). This is a required field.'),
  cropType: z.string().optional().describe('Optional: Specific crop type to filter schemes (e.g., Rice, Cotton, Wheat).'),
  farmerCategory: z.string().optional().describe('Optional: Category of the farmer if relevant (e.g., Smallholder, Marginal, Organic, Female Farmer).'),
});
export type GovernmentSchemesInput = z.infer<typeof GovernmentSchemesInputSchema>;

// Output Schema
const GovernmentSchemesOutputSchema = z.object({
    schemes: z.array(
        z.object({
            schemeName: z.string().describe('The official name of the government scheme, subsidy, or insurance plan.'),
            description: z.string().describe('A brief summary of the scheme, its objectives, and key benefits offered to farmers.'),
            eligibility: z.string().describe('Key eligibility criteria for farmers to qualify for this scheme (e.g., landholding size, specific crops, location requirements).'),
            howToApply: z.string().describe('Information on the application process, relevant department to contact, or official website URL for more details.'),
            relevantFor: z.string().optional().describe('Briefly explains why this scheme is relevant based on the input (location, crop, category). E.g., "Specific to Maharashtra" or "Beneficial for Cotton growers".')
        })
    ).describe('A list of relevant, currently active government schemes, subsidies, insurance plans, and MSP-related information for farmers in the specified Indian location.'),
});
export type GovernmentSchemesOutput = z.infer<typeof GovernmentSchemesOutputSchema>;

// Exported wrapper function
export async function governmentSchemes(input: GovernmentSchemesInput): Promise<GovernmentSchemesOutput> {
  return governmentSchemesFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'governmentSchemesPrompt',
  input: {
    schema: GovernmentSchemesInputSchema,
  },
  output: {
    schema: GovernmentSchemesOutputSchema,
  },
  prompt: `You are an AI assistant specializing in Indian agricultural policies and government support programs for farmers.

A user needs information about government schemes, subsidies, crop insurance plans, and Minimum Support Price (MSP) details relevant to farmers in a specific location in India.

User Query Details:
- Location: {{location}}
{{#if cropType}}- Relevant Crop: {{cropType}}{{/if}}
{{#if farmerCategory}}- Farmer Category: {{farmerCategory}}{{/if}}

Based *primarily* on the provided location, and secondarily on the optional crop/category, identify and summarize relevant **current and active** government support initiatives for farmers. For each identified initiative (scheme, subsidy, insurance, MSP info), provide the following details:

1.  **Scheme Name:** The official name of the program or plan.
2.  **Description:** A concise summary covering its objectives and the benefits it provides to farmers.
3.  **Eligibility:** Key requirements farmers must meet to qualify (e.g., land size, crop type, farmer category, regional specifics).
4.  **How to Apply:** Details on the application procedure, the relevant government department, or an official website link. If a direct link isn't known, state how the user can find more information (e.g., "Contact the local Krishi Vigyan Kendra" or "Visit the website of the Ministry of Agriculture & Farmers Welfare").
5.  **Relevant For:** (Optional) Briefly state why this scheme is particularly relevant given the user's input (e.g., "State-specific scheme for {{location}}", "Targets smallholder farmers", "Related to {{cropType}} insurance").

Prioritize schemes that are most likely active and impactful for farmers in the specified **{{location}}**. Use the most up-to-date information available to you regarding Indian government agricultural programs. If information on a specific aspect (like MSP for a minor crop) is unavailable, state that clearly. Ensure the output is formatted as a JSON array according to the provided schema.
`,
});

// Genkit Flow
const governmentSchemesFlow = ai.defineFlow<
  typeof GovernmentSchemesInputSchema,
  typeof GovernmentSchemesOutputSchema
>(
  {
    name: 'governmentSchemesFlow',
    inputSchema: GovernmentSchemesInputSchema,
    outputSchema: GovernmentSchemesOutputSchema,
    // In a real-world application, a tool would be highly recommended here
    // to fetch real-time data from government APIs or reliable databases.
    // tools: [getGovernmentSchemesTool] // Example if a tool existed
  },
  async (input) => {
    console.log(`Government Schemes Flow triggered for location: ${input.location}, Crop: ${input.cropType}, Category: ${input.farmerCategory}`);

    // Input validation (basic)
    if (!input.location || input.location.trim() === '') {
        console.error("Location is missing in input for government schemes flow.");
        // Consider throwing an error or returning a specific error structure
        return { schemes: [] }; // Return empty for now
    }

    // The prompt handles the core logic of fetching and structuring the data based on the LLM's knowledge.
    const {output} = await prompt(input);

    console.log("Schemes data received from prompt:", JSON.stringify(output, null, 2)); // Log the structured output

     // Basic output validation
    if (!output || !Array.isArray(output.schemes)) {
        console.warn("No valid schemes array found in the output or error during generation.");
        return { schemes: [] }; // Return empty list if output is invalid
    }

    // Optional: Further filtering or sorting of schemes could happen here if needed.
    // e.g., filter out schemes with missing essential details, sort by relevance, etc.

    return output; // Return the validated/processed output
  }
);
    
    
