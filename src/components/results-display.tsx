
// components/results-display.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    CheckCircle, Info, AlertTriangle, Wheat, ScanEye, Thermometer, Droplets, CloudRain, Beaker, Sprout,
    BrainCircuit, HelpCircle, Lightbulb, LineChart, TrendingUp, TrendingDown, Minus, MapPin, CalendarClock,
    DollarSign, CloudSun, Wind, Sunrise, Sunset, Waves, Snowflake, Sun, Tag, Percent, Target, CalendarDays, Scale,
    Landmark, Users, ExternalLink, Link as LinkIcon, CircleHelp, // Added CircleHelp
    ListChecks, Clock // Added ListChecks, Clock for Calendar
} from 'lucide-react';

// Import flow types
import type { FertilizerRecommendationOutput } from '@/ai/flows/fertilizer-recommendation-flow';
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import type { DetectCropDiseaseOutput } from '@/ai/flows/crop-disease-detection';
import type { MarketPriceOutput } from '@/ai/flows/market-price-flow';
import type { WeatherForecastOutput } from '@/ai/flows/weather-forecast-flow';
import type { GovernmentSchemesOutput } from '@/ai/flows/government-schemes-flow';
import type { CropCalendarOutput } from '@/ai/flows/crop-calendar-flow'; // Import calendar type

type ResultsDisplayProps = {
  title: string;
  icon: React.ElementType;
  results: CropRecommendationOutput | FertilizerRecommendationOutput | DetectCropDiseaseOutput | MarketPriceOutput | WeatherForecastOutput | GovernmentSchemesOutput | CropCalendarOutput | null; // Added CropCalendarOutput
  type: 'recommendation' | 'suggestion' | 'detection' | 'market' | 'weather' | 'schemes' | 'calendar'; // Added 'calendar' type
};

// Helper to format values and detect URLs
const formatValue = (value: any, precision = 1): string | React.ReactNode => {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
        return Number(value.toFixed(precision)).toString();
    }
     if (typeof value === 'string') {
         // Date formatting (more robust)
         if (/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)?$/.test(value)) { // Handles date and datetime
             try {
                 const date = new Date(value);
                 if (!isNaN(date.getTime())) {
                     // Check if it's just a date (no time component or midnight UTC)
                     if (value.length === 10 || date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
                         return date.toLocaleDateString(undefined, {
                             weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
                         });
                     } else {
                         // Format as datetime if time is present
                         return date.toLocaleString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
                         });
                     }
                 }
             } catch (e) { /* ignore parsing errors */ }
         }
         // URL detection and rendering (basic)
         const urlRegex = /(https?:\/\/[^\s"'>]+)/g; // Improved regex
         if (urlRegex.test(value)) {
            // Basic check to avoid turning simple sentences with http into links
            const parts = value.split(urlRegex);
            return parts.map((part, index) => {
                 if (urlRegex.test(part)) {
                     // Only link if it looks like a standalone URL
                     if ((index === 0 || /\s$/.test(parts[index-1])) && (index === parts.length - 1 || /^\s/.test(parts[index+1]))) {
                         return (
                             <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-words">
                                 {part} <ExternalLink className="inline-block size-3 ml-1" />
                             </a>
                         );
                     }
                 }
                 return part;
            });
         }
         // Default string return
         return value;
     }
    // Handle null/undefined
    if (value === null || value === undefined) {
        return <span className="text-muted-foreground/70 italic">N/A</span>;
    }
    // Fallback for other types
    return String(value);
};


// Helper to get trend icon
const getTrendIcon = (trend: string | undefined) => {
    switch (trend?.toLowerCase()) {
        case 'rising':
            return <TrendingUp className="size-5 text-green-600" />;
        case 'falling':
            return <TrendingDown className="size-5 text-red-600" />;
        case 'stable':
            return <Minus className="size-5 text-gray-500" />;
        default:
            return <HelpCircle className="size-5 text-muted-foreground" />;
    }
};

// Helper to get alert variant based on severity
const getAlertVariant = (alertType: string | undefined, severity?: string | undefined): "default" | "destructive" => {
    if (!alertType || alertType.toLowerCase() === 'none') return 'default';
    switch (severity?.toLowerCase()) {
        case 'high':
        case 'severe':
            return 'destructive';
        default:
            return 'default'; // Treat moderate/low/unspecified as default visually
    }
};

// Helper to get alert icon based on type and severity
const getAlertIcon = (alertType: string | undefined, severity?: string | undefined) => {
    const isDestructive = getAlertVariant(alertType, severity) === 'destructive';
    const iconColorClass = isDestructive ? 'text-destructive-foreground' : 'text-yellow-600 dark:text-yellow-400'; // Adjusted default alert color
    const defaultIcon = <AlertTriangle className={`size-4 ${iconColorClass}`} />;

    if (!alertType || alertType.toLowerCase() === 'none') {
        return <CheckCircle className="size-4 text-green-600 dark:text-green-400" />;
    }

    switch (alertType.toLowerCase()) {
        case 'storm': return <CloudRain className={`size-4 ${iconColorClass}`} />;
        case 'drought': return <Sun className={`size-4 ${iconColorClass}`} />;
        case 'heavy rain': return <CloudRain className={`size-4 ${iconColorClass}`} />;
        case 'heatwave': return <Thermometer className={`size-4 ${iconColorClass}`} />;
        case 'frost': return <Snowflake className={`size-4 ${iconColorClass}`} />;
        default: return defaultIcon;
    }
};

export default function ResultsDisplay({ title, icon: TitleIcon, results, type }: ResultsDisplayProps) {
  if (!results) {
    return null;
  }

  const renderRecommendationResults = (data: CropRecommendationOutput) => {
      if (!data.crops || data.crops.length === 0) {
          return <p className="text-muted-foreground text-center py-4">No suitable crops found based on the provided data.</p>;
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.crops.map((crop, index) => (
            <Card key={index} className="bg-card/70 border border-border/50 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sprout className="text-primary size-5" /> {crop.cropName}
                </CardTitle>
                 <CardDescription className="flex items-center gap-2 pt-1">
                    <Target className="size-4 text-muted-foreground" /> Suitability Score
                 </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                 <div className="flex items-center gap-2">
                    <Progress value={crop.suitabilityScore} className="w-full h-2.5" />
                    <span className="font-semibold text-lg text-primary">{formatValue(crop.suitabilityScore, 0)}%</span>
                 </div>
                 <Separator />
                <div className="flex items-start gap-2 text-muted-foreground">
                    <Lightbulb className="size-4 text-yellow-500 mt-1 shrink-0" />
                    <p><span className="font-medium text-card-foreground">Justification:</span> {crop.justification}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
  };

  const renderSuggestionResults = (data: FertilizerRecommendationOutput) => {
      return (
        <Card className="bg-card/70 border border-border/50">
            <CardHeader>
                 <CardTitle className="text-xl flex items-center gap-2">
                    <Wheat className="size-5 text-primary" /> Fertilizer Recommendation
                 </CardTitle>
            </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                     <p className="flex items-center gap-2"><Tag className="size-4 text-muted-foreground" /> Type: <span className="font-semibold text-primary">{data.fertilizerType}</span></p>
                     <p className="flex items-center gap-2"><Scale className="size-4 text-muted-foreground" /> Quantity: <span className="font-semibold text-primary">{formatValue(data.quantityKgPerHectare)} kg/ha</span></p>
                </div>
                 <Separator />
                 <div className="flex items-start gap-2 text-muted-foreground text-sm">
                     <Lightbulb className="size-4 text-yellow-500 mt-1 shrink-0" />
                     <p><span className="font-medium text-card-foreground">Justification:</span> {data.justification}</p>
                 </div>
            </CardContent>
        </Card>
      );
  };

 const renderDetectionResults = (data: DetectCropDiseaseOutput) => {
    const { diseaseIdentification } = data;
    const isHealthy = diseaseIdentification.isHealthy;
    const confidenceScore = diseaseIdentification.confidence * 100;

    return (
        <Card className={`border-2 ${isHealthy ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20'}`}>
            <CardHeader className="pb-3">
                <CardTitle className={`flex items-center gap-2 text-xl ${isHealthy ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {isHealthy ? <CheckCircle className="size-5" /> : <AlertTriangle className="size-5" />}
                    {isHealthy ? 'Plant Appears Healthy' : `Disease Detected: ${diseaseIdentification.diseaseName || 'Unknown Disease'}`}
                </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-3 ${isHealthy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {!isHealthy && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                             <Percent className="size-4" /> Confidence:
                             <Progress value={confidenceScore} className="w-full h-2 flex-1 bg-muted" indicatorClassName={isHealthy ? 'bg-green-500' : 'bg-red-500'} />
                             <span className="font-semibold">{formatValue(confidenceScore, 0)}%</span>
                        </div>
                        <Separator className={isHealthy ? 'bg-green-300' : 'bg-red-300'}/>
                    </div>
                )}
                 <div className="flex items-start gap-2 text-sm">
                     <Lightbulb className="size-4 text-yellow-500 mt-1 shrink-0" />
                     <p><span className="font-medium ">Suggestions:</span> {diseaseIdentification.suggestions || 'No specific suggestions.'}</p>
                 </div>
            </CardContent>
        </Card>
    );
};

 const renderMarketPriceResults = (data: MarketPriceOutput) => {
     const { marketData } = data;
     if (!marketData) {
         return <p className="text-muted-foreground text-center py-4">Could not retrieve market price data.</p>;
     }

     return (
        <Card className="border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 border-2">
            <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                    <LineChart className="size-5" /> Market Price for {marketData.cropName}
                 </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-blue-600 dark:text-blue-400">
                    <p className="flex items-center gap-2"><MapPin className="size-4 text-blue-500" /> Location: <span className="font-semibold">{marketData.location}</span></p>
                    <p className="flex items-center gap-2"><CalendarClock className="size-4 text-blue-500" /> Date: <span className="font-semibold">{formatValue(marketData.date)}</span></p>
                    <p className="flex items-center gap-2"><DollarSign className="size-4 text-blue-500" /> Price: <span className="font-semibold">{marketData.price} per {marketData.unit}</span></p>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1"><HelpCircle className="size-4 text-blue-500" /> Trend:</span>
                        {getTrendIcon(marketData.trend)}
                        <Badge
                            variant={marketData.trend === 'rising' ? 'default' : marketData.trend === 'falling' ? 'destructive' : 'secondary'}
                            className={`capitalize ${marketData.trend === 'rising' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' : marketData.trend === 'falling' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500'}`}
                         >
                            {marketData.trend || 'N/A'}
                        </Badge>
                    </div>
                </div>
                 <Separator className="bg-blue-300 dark:bg-blue-700"/>
                 <div className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
                     <Lightbulb className="size-4 text-yellow-500 mt-1 shrink-0" />
                     <p><span className="font-medium">Analysis:</span> {marketData.analysis}</p>
                 </div>
            </CardContent>
        </Card>
     );
 };

 const renderWeatherForecastResults = (data: WeatherForecastOutput) => {
     const { currentWeather, forecast, alerts, location } = data;

     return (
         <div className="space-y-6">
             {/* Current Weather Section */}
             <Card className="bg-card/70 border border-border/50">
                 <CardHeader className="pb-3">
                     <CardTitle className="text-xl flex items-center gap-2">
                         <CloudSun className="text-primary size-5" /> Current Weather
                     </CardTitle>
                      <CardDescription className="flex items-center gap-2 pt-1">
                        <MapPin className="size-4 text-muted-foreground" /> {location}
                     </CardDescription>
                 </CardHeader>
                 {/* Adjusted grid columns for better mobile layout */}
                 <CardContent className="text-sm grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                     <div className="flex items-center gap-2"><Thermometer className="size-5 text-red-500" /> Temp: <span className="font-semibold">{formatValue(currentWeather.temperatureCelsius)}°C</span></div>
                     <div className="flex items-center gap-2"><Info className="size-5 text-blue-500" /> Condition: <span className="font-semibold">{currentWeather.condition}</span></div>
                     <div className="flex items-center gap-2"><Waves className="size-5 text-cyan-500" /> Humidity: <span className="font-semibold">{formatValue(currentWeather.humidityPercent, 0)}%</span></div>
                     <div className="flex items-center gap-2"><Wind className="size-5 text-gray-500" /> Wind: <span className="font-semibold">{formatValue(currentWeather.windSpeedKph, 0)} kph</span></div>
                 </CardContent>
             </Card>

             {/* 3-Day Forecast Section */}
             <Card className="bg-card/70 border border-border/50">
                 <CardHeader className="pb-3">
                     <CardTitle className="text-xl flex items-center gap-2">
                         <CalendarDays className="text-primary size-5" /> 3-Day Forecast
                     </CardTitle>
                 </CardHeader>
                  {/* Adjusted grid columns for better mobile layout */}
                 <CardContent className="text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {forecast.map((day, index) => (
                         <div key={index} className="p-4 border rounded-lg bg-background shadow-sm space-y-2">
                             <p className="font-semibold text-base text-center">{formatValue(day.date)}</p>
                             <Separator />
                             <p className="flex items-center justify-center gap-1 text-muted-foreground text-center"><Info className="size-4 shrink-0" /> {day.dayCondition}</p>
                              <div className="flex justify-around items-center text-muted-foreground pt-1">
                                <p className="flex items-center gap-1"><Thermometer className="size-4 text-red-400" /> <span className="text-red-600 dark:text-red-400 font-medium">{formatValue(day.maxTempCelsius)}°</span></p>
                                <Separator orientation="vertical" className="h-4" />
                                <p className="flex items-center gap-1"><Thermometer className="size-4 text-blue-400" /> <span className="text-blue-600 dark:text-blue-400 font-medium">{formatValue(day.minTempCelsius)}°</span></p>
                             </div>
                             <p className="flex items-center justify-center gap-1 text-muted-foreground"><CloudRain className="size-4 text-cyan-500" /> Rain: <span className="font-medium">{formatValue(day.chanceOfRainPercent, 0)}%</span></p>
                         </div>
                     ))}
                 </CardContent>
             </Card>

              {/* Alerts Section */}
                {alerts && alerts.length > 0 && alerts.some(a => a.type.toLowerCase() !== 'none') && ( // Check if there are actual alerts
                 <Card className="border border-border/50">
                     <CardHeader className="pb-3">
                         <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                             <AlertTriangle className="size-5" /> Weather Alerts
                         </CardTitle>
                     </CardHeader>
                     <CardContent className="text-sm space-y-3">
                         {alerts.filter(a => a.type.toLowerCase() !== 'none').map((alert, index) => (
                             <Alert key={index} variant={getAlertVariant(alert.type, alert.severity)} className="flex items-start gap-3">
                                 <div className="pt-0.5">{getAlertIcon(alert.type, alert.severity)}</div>
                                 <div className="flex-1">
                                     <AlertTitle className="font-semibold">{alert.type} {alert.severity ? <Badge variant={getAlertVariant(alert.type, alert.severity)} className="ml-2">{alert.severity}</Badge> : ''}</AlertTitle>
                                     <AlertDescription className="mt-1">{alert.description}</AlertDescription>
                                 </div>
                             </Alert>
                         ))}
                     </CardContent>
                 </Card>
             )}
             {alerts && alerts.length > 0 && alerts.every(a => a.type.toLowerCase() === 'none') && ( // Check if all alerts are 'None'
                 <Alert variant="default" className="border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-700 dark:text-green-300">No Severe Weather Alerts</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                        {alerts[0].description} {/* Show description from the 'None' alert */}
                    </AlertDescription>
                 </Alert>
             )}
         </div>
     );
 };

  const renderSchemesResults = (data: GovernmentSchemesOutput) => {
      if (!data.schemes || data.schemes.length === 0) {
          return <p className="text-muted-foreground text-center py-4">No relevant government schemes found for the specified criteria.</p>;
      }
      return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {data.schemes.map((scheme, index) => (
                 <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 bg-card/70 rounded-lg px-4 hover:bg-muted/20 transition-colors">
                    <AccordionTrigger className="text-left hover:no-underline py-4 group">
                        <div className="flex items-start sm:items-center gap-3 flex-1">
                             <Landmark className="size-5 text-primary shrink-0 mt-1 sm:mt-0" />
                             <div className="flex-1">
                                 <span className="font-medium text-base group-hover:text-primary transition-colors">{scheme.schemeName}</span>
                                 {scheme.relevantFor && <Badge variant="outline" className="ml-2 text-xs font-normal hidden sm:inline-block">{scheme.relevantFor}</Badge>}
                             </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-4 pb-4 pl-8 pr-4">
                        <div className="flex items-start gap-3">
                            <Info className="size-4 text-card-foreground mt-0.5 shrink-0" />
                            <p><span className="font-medium text-card-foreground">Description:</span> {scheme.description}</p>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                             <CircleHelp className="size-4 text-card-foreground mt-0.5 shrink-0" />
                             <p><span className="font-medium text-card-foreground">Eligibility:</span> {scheme.eligibility}</p>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <LinkIcon className="size-4 text-card-foreground mt-0.5 shrink-0" />
                            <p><span className="font-medium text-card-foreground">How to Apply / More Info:</span> {formatValue(scheme.howToApply)}</p>
                        </div>
                         {scheme.relevantFor && <Badge variant="outline" className="text-xs font-normal sm:hidden">Relevant for: {scheme.relevantFor}</Badge>}
                    </AccordionContent>
                 </AccordionItem>
            ))}
        </Accordion>
      );
  };

   const renderCalendarResults = (data: CropCalendarOutput) => {
      if (!data.schedule || data.schedule.length === 0) {
          return <p className="text-muted-foreground text-center py-4">Could not generate a calendar schedule for this crop.</p>;
      }
      return (
          <div className="space-y-4">
             <Card className="bg-card/70 border border-border/50 p-4 text-sm">
                 {/* Adjusted grid columns for better mobile stacking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                     <p className="flex items-center gap-2"><Sprout className="size-4 text-muted-foreground" /> Crop: <span className="font-semibold text-primary">{data.cropType}</span></p>
                     <p className="flex items-center gap-2"><CalendarClock className="size-4 text-muted-foreground" /> Planting Date: <span className="font-semibold">{formatValue(data.plantingDate)}</span></p>
                     <p className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> Location: <span className="font-semibold">{data.location}</span></p>
                </div>
                 {data.notes && (
                     <>
                         <Separator className="my-3" />
                         <div className="flex items-start gap-2 text-muted-foreground">
                            <Lightbulb className="size-4 text-yellow-500 mt-0.5 shrink-0" />
                            <p><span className="font-medium text-card-foreground">Notes:</span> {data.notes}</p>
                        </div>
                     </>
                 )}
            </Card>

            <Accordion type="multiple" className="w-full space-y-2">
                {data.schedule.map((task, index) => (
                     <AccordionItem key={index} value={`task-${index}`} className="border border-border/50 bg-card/70 rounded-lg px-4 hover:bg-muted/20 transition-colors">
                        <AccordionTrigger className="text-left hover:no-underline py-3 group">
                             <div className="flex items-center gap-3 flex-1">
                                 <ListChecks className="size-5 text-primary shrink-0" />
                                 <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                     <span className="font-medium text-base group-hover:text-primary transition-colors">{task.taskName}</span>
                                     <span className="text-xs text-muted-foreground flex items-center gap-1">
                                         <Clock className="size-3" /> {task.estimatedDateRange}
                                     </span>
                                 </div>
                             </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground space-y-3 pb-4 pl-8 pr-4">
                            <div className="flex items-start gap-3">
                                <Info className="size-4 text-card-foreground mt-0.5 shrink-0" />
                                <p><span className="font-medium text-card-foreground">Description:</span> {task.description}</p>
                            </div>
                            {task.details && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="size-4 text-yellow-500 mt-0.5 shrink-0" />
                                        <p><span className="font-medium text-card-foreground">Details:</span> {task.details}</p>
                                    </div>
                                </>
                            )}
                        </AccordionContent>
                     </AccordionItem>
                ))}
            </Accordion>
          </div>
      );
  };


  return (
    <Card className="w-full shadow-lg mt-8 animate-in fade-in duration-500 bg-card/50 border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
            <TitleIcon className="text-primary size-6" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Render results based on type */}
        {type === 'recommendation' && renderRecommendationResults(results as CropRecommendationOutput)}
        {type === 'suggestion' && renderSuggestionResults(results as FertilizerRecommendationOutput)}
        {type === 'detection' && renderDetectionResults(results as DetectCropDiseaseOutput)}
        {type === 'market' && renderMarketPriceResults(results as MarketPriceOutput)}
        {type === 'weather' && renderWeatherForecastResults(results as WeatherForecastOutput)}
        {type === 'schemes' && renderSchemesResults(results as GovernmentSchemesOutput)}
        {type === 'calendar' && renderCalendarResults(results as CropCalendarOutput)} {/* Added calendar rendering */}
      </CardContent>
    </Card>
  );
}
    
    
