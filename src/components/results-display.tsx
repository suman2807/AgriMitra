// components/results-display.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, AlertTriangle, Leaf, Wheat, ScanEye, Thermometer, Droplets, CloudRain, Beaker, Sprout, BrainCircuit, HelpCircle, Lightbulb } from 'lucide-react'; // Added more icons

// No longer need FertilizerRecommendation type from the mock service
import type { FertilizerRecommendationOutput } from '@/ai/flows/fertilizer-recommendation-flow';
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import type { DetectCropDiseaseOutput } from '@/ai/flows/crop-disease-detection';


type ResultsDisplayProps = {
  title: string;
  icon: React.ElementType;
  // Update the type to accept any of the possible result structures
  results: CropRecommendationOutput | FertilizerRecommendationOutput | DetectCropDiseaseOutput | null;
  type: 'recommendation' | 'suggestion' | 'detection';
};

// Helper to format values
const formatValue = (value: any): string => {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
        // Handle potential floating point inaccuracies and format
        return Number(value.toFixed(2)).toString();
    }
    return String(value);
};

export default function ResultsDisplay({ title, icon: TitleIcon, results, type }: ResultsDisplayProps) {
  if (!results) {
    return null; // Don't render anything if there are no results
  }

  const renderRecommendationResults = (data: CropRecommendationOutput) => {
      if (!data.crops || data.crops.length === 0) {
          return <p className="text-muted-foreground">No suitable crops found based on the provided data.</p>;
      }
      return (
        <div className="space-y-4">
          {data.crops.map((crop, index) => (
            <Card key={index} className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="text-primary" /> {crop.cropName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="flex items-center gap-1"><CheckCircle className="size-4 text-green-600" /> Suitability Score: <span className="font-semibold">{formatValue(crop.suitabilityScore)}/100</span></p>
                <p className="text-muted-foreground flex items-start gap-1"><Lightbulb className="size-4 text-yellow-500 mt-0.5 shrink-0" /> Justification: {crop.justification}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
  };

  // Update to handle FertilizerRecommendationOutput structure
  const renderSuggestionResults = (data: FertilizerRecommendationOutput) => {
      return (
        <Alert>
            <Wheat className="h-4 w-4 text-primary" />
            <AlertTitle>Fertilizer Recommendation</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
                <p>Type: <span className="font-semibold">{data.fertilizerType}</span></p>
                <p>Quantity: <span className="font-semibold">{formatValue(data.quantityKgPerHectare)} kg/hectare</span></p>
                <p className="text-muted-foreground flex items-start gap-1"><Lightbulb className="size-4 text-yellow-500 mt-0.5 shrink-0" /> Justification: {data.justification}</p>
            </AlertDescription>
        </Alert>
      );
  };

 const renderDetectionResults = (data: DetectCropDiseaseOutput) => {
    const { diseaseIdentification } = data;
    const isHealthy = diseaseIdentification.isHealthy;

    return (
        <Alert variant={isHealthy ? 'default' : 'destructive'} className={isHealthy ? 'border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700' : 'border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700'}>
            {isHealthy ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> : <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
            <AlertTitle className={isHealthy ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
                {isHealthy ? 'Plant Appears Healthy' : `Disease Detected: ${diseaseIdentification.diseaseName || 'Unknown Disease'}`}
            </AlertTitle>
            <AlertDescription className={`mt-2 space-y-1 ${isHealthy ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {!isHealthy && diseaseIdentification.diseaseName && (
                    <p>Confidence: <span className="font-semibold">{formatValue(diseaseIdentification.confidence * 100)}%</span></p>
                )}
                 <p>Suggestions: <span className={isHealthy ? "" : "font-semibold"}>{diseaseIdentification.suggestions || 'No specific suggestions.'}</span></p>
            </AlertDescription>
        </Alert>
    );
};


  return (
    <Card className="w-full shadow-lg mt-8 animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TitleIcon className="text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Use type guards to ensure correct rendering */}
        {type === 'recommendation' && renderRecommendationResults(results as CropRecommendationOutput)}
        {type === 'suggestion' && renderSuggestionResults(results as FertilizerRecommendationOutput)}
        {type === 'detection' && renderDetectionResults(results as DetectCropDiseaseOutput)}
      </CardContent>
    </Card>
  );
}
