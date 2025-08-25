
'use server';
/**
 * @fileOverview An AI agent for generating personalized crop calendars and task schedules.
 *
 * - cropCalendar - A function that handles generating the crop calendar.
 * - CropCalendarInput - The input type for the cropCalendar function.
 * - CropCalendarOutput - The return type for the cropCalendar function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Input Schema
const CropCalendarInputSchema = z.object({
  cropType: z.string().describe('The specific crop being grown (e.g., Tomato, Wheat, Cotton).'),
  plantingDate: z.string().describe('The date the crop was planted or is planned to be planted (YYYY-MM-DD).'),
  location: z.string().describe('The general geographical location or climate zone to tailor the schedule (e.g., Punjab, India; Coastal California; Hardiness Zone 7b).'),
  growingSeasonLengthDays: z.number().optional().describe('Optional: Estimated number of days in the growing season for this crop in this location.'),
});
export type CropCalendarInput = z.infer<typeof CropCalendarInputSchema>;

// Output Schema
const CropCalendarOutputSchema = z.object({
    cropType: z.string().describe('The crop for which the calendar is generated.'),
    plantingDate: z.string().describe('The provided planting date (YYYY-MM-DD).'),
    location: z.string().describe('The location context used for the calendar.'),
    schedule: z.array(
        z.object({
            taskName: z.string().describe('The name of the agricultural task (e.g., Planting, First Fertilization, Pest Scouting, Irrigation Check, Harvesting Window).'),
            description: z.string().describe('A brief description of the task and why it is important.'),
            estimatedDateRange: z.string().describe('The estimated date or date range (e.g., "YYYY-MM-DD", "Late June", "Week of YYYY-MM-DD", "Approx. 45-60 days after planting") for performing the task.'),
            details: z.string().optional().describe('Optional: Specific details or considerations for the task (e.g., "Apply Nitrogen-rich fertilizer", "Look for aphids and whiteflies", "Ensure soil moisture reaches 6 inches deep").')
        })
    ).describe('A list of key tasks and their estimated timing throughout the growing season.'),
    notes: z.string().optional().describe('General notes or advice related to managing this crop in the specified location (e.g., common pests/diseases to watch for, specific watering advice).')
});
export type CropCalendarOutput = z.infer<typeof CropCalendarOutputSchema>;

// Exported wrapper function
export async function cropCalendar(input: CropCalendarInput): Promise<CropCalendarOutput> {
  return cropCalendarFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'cropCalendarPrompt',
  input: {
    schema: CropCalendarInputSchema,
  },
  output: {
    schema: CropCalendarOutputSchema,
  },
  prompt: `You are an expert agricultural planner AI.

Generate a personalized crop calendar and task schedule for a farmer based on the following information:

- Crop: {{cropType}}
- Planting Date: {{plantingDate}}
- Location/Climate Context: {{location}}
{{#if growingSeasonLengthDays}}- Estimated Growing Season Length: {{growingSeasonLengthDays}} days{{/if}}

Create a schedule outlining key agricultural tasks from planting to harvest. For each task, provide:
1.  **Task Name:** A clear name for the task (e.g., Soil Preparation, Planting, Germination Check, First Fertilization, Weed Management, Pest Scouting, Irrigation Management, Pruning (if applicable), Flowering Stage Check, Fruit Development, Ripening Check, Harvest Window, Post-Harvest Cleanup).
2.  **Description:** A brief explanation of the task's purpose.
3.  **Estimated Date Range:** When the task should typically occur relative to the planting date (e.g., "YYYY-MM-DD", "Mid-June", "Week of YYYY-MM-DD", "Approx. 30-45 days after planting", "Flowering period"). Be specific where possible, using the planting date as a reference.
4.  **Details (Optional):** Any specific instructions or things to look out for (e.g., type of fertilizer, specific pests, watering techniques).

Also include general notes relevant to growing {{cropType}} in {{location}}.

Base the schedule on typical growth cycles for {{cropType}}, adjusted for the general climate implied by {{location}}. If a growing season length is provided, use it to inform the harvest timing. Ensure the output is formatted as JSON according to the provided schema. Assume standard agricultural practices unless otherwise implied.
`,
});

// Genkit Flow
const cropCalendarFlow = ai.defineFlow<
  typeof CropCalendarInputSchema,
  typeof CropCalendarOutputSchema
>(
  {
    name: 'cropCalendarFlow',
    inputSchema: CropCalendarInputSchema,
    outputSchema: CropCalendarOutputSchema,
  },
  async (input) => {
    console.log(`Crop Calendar Flow triggered for crop: ${input.cropType}, planting: ${input.plantingDate}, location: ${input.location}`);

    // Basic validation (Zod handles most)
    if (!input.cropType || !input.plantingDate || !input.location) {
        throw new Error("Missing required input fields for crop calendar generation.");
    }
    // Validate date format roughly (more robust validation could be added)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.plantingDate)) {
        throw new Error("Invalid planting date format. Please use YYYY-MM-DD.");
    }


    const {output} = await prompt(input);

    // Ensure the output reflects the input, sometimes LLMs might hallucinate
    if (output) {
        output.cropType = input.cropType;
        output.plantingDate = input.plantingDate;
        output.location = input.location;
    } else {
        throw new Error("Failed to generate crop calendar from the AI model.");
    }

    console.log("Calendar data received from prompt:", JSON.stringify(output, null, 2));

    // You could add post-processing here, e.g., sorting tasks by estimated date if the LLM didn't.

    return output;
  }
);
    
    
    