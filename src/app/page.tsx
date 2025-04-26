'use client'; // Required for state and client-side interactions

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CropRecommendationForm from '@/components/crop-recommendation-form';
import FertilizerSuggestionForm from '@/components/fertilizer-suggestion-form';
import CropDiseaseDetectionForm from '@/components/crop-disease-detection-form';
import ResultsDisplay from '@/components/results-display'; // Import the results display component
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import type { FertilizerRecommendation } from '@/services/fertilizer';
import type { DetectCropDiseaseOutput } from '@/ai/flows/crop-disease-detection';
import { Leaf, Wheat, ScanEye } from 'lucide-react'; // Import icons

export default function Home() {
  // State to hold the results for each feature
  const [recommendationResult, setRecommendationResult] = useState<CropRecommendationOutput | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<FertilizerRecommendation | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectCropDiseaseOutput | null>(null);

  const handleTabChange = (value: string) => {
    // Optionally clear results when switching tabs, or keep them
    // Uncomment below to clear results on tab switch
    // setRecommendationResult(null);
    // setSuggestionResult(null);
    // setDetectionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z"></path><path d="M12 12a3 3 0 0 0 3-3V4a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"></path></svg>
          FarmLink
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-Powered Smart Farming Assistant
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <Tabs defaultValue="recommendation" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 bg-primary/10 p-1 h-auto rounded-lg mb-6">
            <TabsTrigger value="recommendation" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <Leaf className="size-4" /> Crop Recommendation
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <Wheat className="size-4" /> Fertilizer Suggestion
            </TabsTrigger>
            <TabsTrigger value="detection" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex items-center gap-2 transition-all duration-200">
              <ScanEye className="size-4" /> Disease Detection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendation" className="transition-opacity duration-300">
            <CropRecommendationForm onRecommendation={setRecommendationResult} />
            {recommendationResult && (
              <ResultsDisplay
                title="Crop Recommendations"
                icon={Leaf}
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
        </Tabs>
      </main>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
            Powered by Firebase & Genkit | FarmLink &copy; {new Date().getFullYear()}
        </footer>
    </div>
  );
}
