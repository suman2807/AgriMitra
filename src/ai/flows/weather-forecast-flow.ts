
'use server';
/**
 * @fileOverview An AI agent for providing weather forecasts and alerts.
 *
 * - weatherForecast - A function that handles the weather forecasting process.
 * - WeatherForecastInput - The input type for the weatherForecast function.
 * - WeatherForecastOutput - The return type for the weatherForecast function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
// Removed direct import of defineTool, will use ai.defineTool instead.

// Input Schema
const WeatherForecastInputSchema = z.object({
  location: z.string().describe('The city or geographical area for the weather forecast (e.g., Mumbai, Maharashtra).'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

// Output Schema
const WeatherForecastOutputSchema = z.object({
    location: z.string().describe('The location for which the forecast is provided.'),
    currentWeather: z.object({
        temperatureCelsius: z.number().describe('Current temperature in Celsius.'),
        condition: z.string().describe('Current weather condition (e.g., Sunny, Cloudy, Light Rain).'),
        humidityPercent: z.number().describe('Current humidity percentage.'),
        windSpeedKph: z.number().describe('Current wind speed in kilometers per hour.'),
    }).describe('The current weather conditions.'),
    forecast: z.array(
        z.object({
            date: z.string().describe('Date of the forecast (YYYY-MM-DD).'),
            dayCondition: z.string().describe('Predicted weather condition for the day.'),
            maxTempCelsius: z.number().describe('Maximum predicted temperature in Celsius.'),
            minTempCelsius: z.number().describe('Minimum predicted temperature in Celsius.'),
            chanceOfRainPercent: z.number().describe('Chance of precipitation percentage.'),
        })
    ).length(3).describe('A 3-day weather forecast.'), // Limit to 3 days for simplicity
    alerts: z.array(
        z.object({
            type: z.enum(['Storm', 'Drought', 'Heavy Rain', 'Heatwave', 'Frost', 'None']).describe('Type of weather alert.'),
            severity: z.enum(['Low', 'Moderate', 'High', 'Severe']).optional().describe('Severity of the alert.'),
            description: z.string().describe('Description of the alert and potential impact.'),
        })
    ).describe('Any severe weather alerts for the location.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;

// Placeholder Tool to simulate fetching weather data
// In a real application, this would call a weather API (e.g., OpenWeatherMap, WeatherAPI)
const getWeatherDataTool = ai.defineTool( // Use ai.defineTool
  {
    name: 'getWeatherDataTool',
    description: 'Fetches current weather, forecast, and alerts for a given location.',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async (input) => {
    console.log(`Simulating weather API call for: ${input.location}`);
    // Simulate API response based on location (very basic example)
    const isMumbai = input.location.toLowerCase().includes('mumbai');
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return {
        location: input.location,
        currentWeather: {
            temperatureCelsius: isMumbai ? 29 : 25,
            condition: isMumbai ? 'Partly Cloudy' : 'Sunny',
            humidityPercent: isMumbai ? 75 : 60,
            windSpeedKph: isMumbai ? 15 : 10,
        },
        forecast: [
            {
                date: formatDate(new Date(new Date().setDate(today.getDate() + 1))), // Use new Date() to avoid mutation
                dayCondition: isMumbai ? 'Light Rain Possible' : 'Mostly Sunny',
                maxTempCelsius: isMumbai ? 31 : 28,
                minTempCelsius: isMumbai ? 26 : 22,
                chanceOfRainPercent: isMumbai ? 40 : 10,
            },
            {
                date: formatDate(new Date(new Date().setDate(today.getDate() + 2))), // Use new Date() to avoid mutation
                dayCondition: isMumbai ? 'Showers' : 'Sunny',
                maxTempCelsius: isMumbai ? 30 : 29,
                minTempCelsius: isMumbai ? 25 : 21,
                chanceOfRainPercent: isMumbai ? 60 : 5,
            },
            {
                date: formatDate(new Date(new Date().setDate(today.getDate() + 3))), // Use new Date() to avoid mutation
                dayCondition: isMumbai ? 'Cloudy' : 'Partly Cloudy',
                maxTempCelsius: isMumbai ? 31 : 29,
                minTempCelsius: isMumbai ? 26 : 22,
                chanceOfRainPercent: isMumbai ? 30 : 15,
            },
        ],
        alerts: isMumbai ? [{
            type: 'Heavy Rain',
            severity: 'Moderate',
            description: 'Possibility of heavy showers in the next 48 hours. Monitor local updates.',
        }] : [{type: 'None', description: 'No severe weather alerts currently.'}],
    };
  }
);


// Define the Genkit Flow
const weatherForecastFlow = ai.defineFlow<
  typeof WeatherForecastInputSchema,
  typeof WeatherForecastOutputSchema
>(
  {
    name: 'weatherForecastFlow',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
    // Include the tool for the LLM to potentially use (though we'll call it directly here for demo)
    tools: [getWeatherDataTool],
  },
  async (input) => {
    // Directly call the tool to get structured data
    // In a more complex scenario, you might have a prompt that decides *whether* to call the tool
    // or asks follow-up questions before calling it.
    console.log(`Flow triggered for location: ${input.location}`);
    const weatherData = await getWeatherDataTool(input);
    console.log("Weather data received from tool:", weatherData);
    return weatherData; // Return the structured data directly
  }
);

// Exported wrapper function
export async function weatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return weatherForecastFlow(input);
}

