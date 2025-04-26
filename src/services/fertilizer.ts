/**
 * Represents soil properties including type, pH, and temperature.
 */
export interface Soil {
  /**
   * The type of soil (e.g., sandy, loamy, clayey).
   */
  soilType: string;
  /**
   * The pH level of the soil.
   */
  pH: number;
  /**
   * The temperature of the soil in Celsius.
   */
  temperature: number;
}

/**
 * Represents fertilizer recommendations including type and quantity.
 */
export interface FertilizerRecommendation {
  /**
   * The type of fertilizer recommended (e.g., Nitrogen, Phosphorus, Potassium).
   */
  fertilizerType: string;
  /**
   * The recommended quantity of fertilizer in kg per hectare.
   */
  quantityKgPerHectare: number;
}

/**
 * Asynchronously retrieves fertilizer recommendations for a given soil and crop.
 * This is a mock implementation that returns random recommendations.
 * @param soil The soil properties.
 * @param crop The name of the crop.
 * @returns A promise that resolves to a FertilizerRecommendation object.
 */
export async function getFertilizerRecommendation(
  soil: Soil,
  crop: string
): Promise<FertilizerRecommendation> {
  // Mock implementation - Replace with actual API call or logic
  console.log('Getting fertilizer recommendation for:', soil, crop);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate a random recommendation based on inputs (simple example)
  const fertilizerTypes = ['Nitrogen-Rich (Urea)', 'Phosphorus-Rich (Superphosphate)', 'Potassium-Rich (Potash)', 'Balanced NPK (10-10-10)', 'Organic Compost'];
  const randomType = fertilizerTypes[Math.floor(Math.random() * fertilizerTypes.length)];
  let randomQuantity = 50 + Math.random() * 100; // Base quantity + random amount

  // Adjust quantity slightly based on inputs (very basic logic)
  if (soil.soilType === 'sandy') randomQuantity *= 1.1;
  if (soil.pH < 6) randomQuantity *= 0.9;
  if (crop.toLowerCase().includes('corn')) randomQuantity *= 1.2;

  return {
    fertilizerType: randomType,
    quantityKgPerHectare: parseFloat(randomQuantity.toFixed(1)), // Round to one decimal place
  };
}
