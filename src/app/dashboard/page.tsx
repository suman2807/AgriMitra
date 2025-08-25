'use client'; 

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CropRecommendationForm from '@/components/crop-recommendation-form';
import FertilizerSuggestionForm from '@/components/fertilizer-suggestion-form';
import CropDiseaseDetectionForm from '@/components/crop-disease-detection-form';
import MarketPriceForm from '@/components/market-price-form';
import WeatherForecastForm from '@/components/weather-forecast-form';
import GovernmentSchemesForm from '@/components/government-schemes-form';
import CropCalendarForm from '@/components/crop-calendar-form';
import ResultsDisplay from '@/components/results-display';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import type { FertilizerRecommendationOutput } from '@/ai/flows/fertilizer-recommendation-flow';
import type { DetectCropDiseaseOutput } from '@/ai/flows/crop-disease-detection';
import type { MarketPriceOutput } from '@/ai/flows/market-price-flow';
import type { WeatherForecastOutput } from '@/ai/flows/weather-forecast-flow';
import type { GovernmentSchemesOutput } from '@/ai/flows/government-schemes-flow';
import type { CropCalendarOutput } from '@/ai/flows/crop-calendar-flow';
import { Wheat, ScanEye, Tractor, Sprout, LineChart, CloudSun, Landmark, CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  const [recommendationResult, setRecommendationResult] = useState<CropRecommendationOutput | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<FertilizerRecommendationOutput | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectCropDiseaseOutput | null>(null);
  const [marketPriceResult, setMarketPriceResult] = useState<MarketPriceOutput | null>(null);
  const [weatherForecastResult, setWeatherForecastResult] = useState<WeatherForecastOutput | null>(null);
  const [governmentSchemesResult, setGovernmentSchemesResult] = useState<GovernmentSchemesOutput | null>(null);
  const [cropCalendarResult, setCropCalendarResult] = useState<CropCalendarOutput | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="min-h-full flex flex-col items-center p-0 sm:p-4 md:p-8">
          {/* Dashboard Header */}
          <header className="text-center mb-12 w-full relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div>
              {/* Logo */}
              <div className="mb-8 flex items-center justify-center">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl">
                  <Sprout className="h-20 w-20 text-primary" />
                </div>
              </div>
              
              {/* Welcome Text */}
              <h1 className="brand-text gradient-text font-bold mb-6 py-2">
                Welcome to AgriMitra
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your AI-powered smart farming assistant. Access intelligent tools to optimize your farming practices and make data-informed decisions.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in">
              <div className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="text-2xl font-bold text-primary">7+</div>
                <div className="text-sm text-muted-foreground">Smart Tools</div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Accurate Data</div>
              </div>
            </div>
          </header>

          <main className="w-full max-w-6xl">
            <Tabs defaultValue="recommendation" className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 bg-card/50 backdrop-blur-sm p-2 h-auto rounded-2xl mb-8 border border-border/50 shadow-lg">
                <TabsTrigger value="recommendation" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <Sprout className="size-4" /> 
                  <span className="hidden lg:inline">Crop Reco.</span>
                  <span className="lg:hidden text-center leading-tight">Crops</span>
                </TabsTrigger>
                <TabsTrigger value="suggestion" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <Wheat className="size-4" /> 
                  <span className="hidden lg:inline">Fertilizer</span>
                  <span className="lg:hidden text-center leading-tight">Fertilize</span>
                </TabsTrigger>
                <TabsTrigger value="detection" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <ScanEye className="size-4" /> 
                  <span className="hidden lg:inline">Disease</span>
                  <span className="lg:hidden text-center leading-tight">Disease</span>
                </TabsTrigger>
                <TabsTrigger value="market" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <LineChart className="size-4" /> 
                  <span className="hidden lg:inline">Market Prices</span>
                  <span className="lg:hidden text-center leading-tight">Prices</span>
                </TabsTrigger>
                 <TabsTrigger value="weather" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <CloudSun className="size-4" /> 
                  <span className="hidden lg:inline">Weather</span>
                  <span className="lg:hidden text-center leading-tight">Weather</span>
                </TabsTrigger>
                 <TabsTrigger value="schemes" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <Landmark className="size-4" /> 
                  <span className="hidden lg:inline">Govt Schemes</span>
                  <span className="lg:hidden text-center leading-tight">Schemes</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm h-auto hover:bg-primary/5">
                  <CalendarDays className="size-4" /> 
                  <span className="hidden lg:inline">Crop Calendar</span>
                  <span className="lg:hidden text-center leading-tight">Calendar</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendation" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <CropRecommendationForm onRecommendation={setRecommendationResult} />
                </div>
                {recommendationResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Crop Recommendations"
                      icon={Sprout}
                      results={recommendationResult}
                      type="recommendation"
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="suggestion" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <FertilizerSuggestionForm onSuggestion={setSuggestionResult} />
                </div>
                 {suggestionResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Fertilizer Suggestion"
                      icon={Wheat}
                      results={suggestionResult}
                      type="suggestion"
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="detection" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <CropDiseaseDetectionForm onDetection={setDetectionResult} />
                </div>
                 {detectionResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Disease Detection Result"
                      icon={ScanEye}
                      results={detectionResult}
                      type="detection"
                    />
                  </div>
                )}
              </TabsContent>
               <TabsContent value="market" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <MarketPriceForm onPriceUpdate={setMarketPriceResult} />
                </div>
                 {marketPriceResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Market Price Insights"
                      icon={LineChart}
                      results={marketPriceResult}
                      type="market"
                    />
                  </div>
                )}
              </TabsContent>
               <TabsContent value="weather" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <WeatherForecastForm onForecast={setWeatherForecastResult} />
                </div>
                 {weatherForecastResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Weather Forecast & Alerts"
                      icon={CloudSun}
                      results={weatherForecastResult}
                      type="weather"
                    />
                  </div>
                )}
              </TabsContent>
               <TabsContent value="schemes" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <GovernmentSchemesForm onSchemesInfo={setGovernmentSchemesResult} />
                </div>
                 {governmentSchemesResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Government Schemes & Subsidies"
                      icon={Landmark}
                      results={governmentSchemesResult}
                      type="schemes"
                    />
                  </div>
                )}
              </TabsContent>
               <TabsContent value="calendar" className="transition-all duration-500 animate-fade-in">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                  <CropCalendarForm onCalendar={setCropCalendarResult} />
                </div>
                 {cropCalendarResult && (
                  <div className="mt-6 animate-slide-up">
                    <ResultsDisplay
                      title="Crop Calendar & Tasks"
                      icon={CalendarDays}
                      results={cropCalendarResult}
                      type="calendar"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </main>
      <Footer />
    </div>
  );
}