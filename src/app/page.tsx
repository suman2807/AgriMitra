
'use client'; // Required for state and client-side interactions

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CropRecommendationForm from '@/components/crop-recommendation-form';
import FertilizerSuggestionForm from '@/components/fertilizer-suggestion-form';
import CropDiseaseDetectionForm from '@/components/crop-disease-detection-form';
import MarketPriceForm from '@/components/market-price-form'; // Import the new form
import ResultsDisplay from '@/components/results-display'; // Import the results display component
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import type { FertilizerRecommendationOutput } from '@/ai/flows/fertilizer-recommendation-flow';
import type { DetectCropDiseaseOutput } from '@/ai/flows/crop-disease-detection';
import type { MarketPriceOutput } from '@/ai/flows/market-price-flow'; // Import the new flow type
// Import Sprout, Tractor, LineChart icons and replace Seedling with Sprout
import { Wheat, ScanEye, Tractor, Sprout, LineChart } from 'lucide-react'; // Added LineChart

export default function Home() {
  // State to hold the results for each feature
  const [recommendationResult, setRecommendationResult] = useState<CropRecommendationOutput | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<FertilizerRecommendationOutput | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectCropDiseaseOutput | null>(null);
  const [marketPriceResult, setMarketPriceResult] = useState<MarketPriceOutput | null>(null); // Add state for market price

  const handleTabChange = (value: string) => {
    // Optionally clear results when switching tabs, or keep them
    // Uncomment below to clear results on tab switch
    // setRecommendationResult(null);
    // setSuggestionResult(null);
    // setDetectionResult(null);
    // setMarketPriceResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <Sprout className="size-10 sm:size-12 text-primary" /> {/* Use Sprout for main logo */}
          AgriMitra
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-Powered Smart Farming Assistant
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <Tabs defaultValue="recommendation" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 bg-primary/10 p-1 h-auto rounded-lg mb-6"> {/* Updated grid-cols-4 */}
            <TabsTrigger value="recommendation" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <Sprout className="size-4" /> Crop Recommendation
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <Wheat className="size-4" /> Fertilizer Suggestion
            </TabsTrigger>
            <TabsTrigger value="detection" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <ScanEye className="size-4" /> Disease Detection
            </TabsTrigger>
            <TabsTrigger value="market" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200"> {/* New Trigger */}
              <LineChart className="size-4" /> Market Prices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendation" className="transition-opacity duration-300">
            <CropRecommendationForm onRecommendation={setRecommendationResult} />
            {recommendationResult && (
              <ResultsDisplay
                title="Crop Recommendations"
                icon={Sprout} // Use Sprout icon
                results={recommendationResult}
                type="recommendation"
              />
            )}
          </TabsContent>
          <TabsContent value="suggestion" className="transition-opacity duration-300">
            <FertilizerSuggestionForm onSuggestion={setSuggestionResult} />
             {suggestionResult && (
              <ResultsDisplay
                title="Fertilizer Suggestion"
                icon={Wheat}
                results={suggestionResult}
                type="suggestion"
              />
            )}
          </TabsContent>
          <TabsContent value="detection" className="transition-opacity duration-300">
            <CropDiseaseDetectionForm onDetection={setDetectionResult} />
             {detectionResult && (
              <ResultsDisplay
                title="Disease Detection Result"
                icon={ScanEye}
                results={detectionResult}
                type="detection"
              />
            )}
          </TabsContent>
           <TabsContent value="market" className="transition-opacity duration-300"> {/* New Content */}
            <MarketPriceForm onPriceUpdate={setMarketPriceResult} />
             {marketPriceResult && (
              <ResultsDisplay
                title="Market Price Insights"
                icon={LineChart}
                results={marketPriceResult}
                type="market"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
            Made with 💚 by ss | AgriMitra &copy; 2025
        </footer>
    </div>
  );
}
