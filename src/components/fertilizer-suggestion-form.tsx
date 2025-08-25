// components/fertilizer-suggestion-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Import the new AI flow and its types
import {
  FertilizerRecommendationInput,
  fertilizerRecommendation,
  FertilizerRecommendationOutput,
} from '@/ai/flows/fertilizer-recommendation-flow';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Beaker, Thermometer, Wheat, MapPin, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  soilType: z.string().min(1, 'Soil type is required.'),
  pH: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14.'),
  temperature: z.coerce.number(),
  crop: z.string().min(1, 'Crop name is required.'),
});

type FertilizerSuggestionFormProps = {
  // Update the prop type to expect the AI flow's output
  onSuggestion: (result: FertilizerRecommendationOutput) => void;
};

export default function FertilizerSuggestionForm({ onSuggestion }: FertilizerSuggestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: '',
      pH: 7.0,
      temperature: 25,
      crop: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      // Prepare input for the AI flow
      const input: FertilizerRecommendationInput = {
        soilType: values.soilType,
        pH: values.pH,
        temperature: values.temperature,
        crop: values.crop,
      };
      // Call the new AI flow
      const result = await fertilizerRecommendation(input);
      onSuggestion(result);
       toast({
            title: 'Suggestion Ready',
            description: 'Fertilizer recommendation generated successfully.',
        });
    } catch (err) {
      console.error('Error getting fertilizer suggestion:', err);
      setError('Failed to get suggestion. Please check your inputs or try again later.');
      toast({
            variant: 'destructive',
            title: 'Suggestion Failed',
            description: 'Could not generate fertilizer recommendation.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wheat className="text-primary" />
          Get Fertilizer Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> Soil Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="sandy">Sandy</SelectItem>
                            <SelectItem value="loamy">Loamy</SelectItem>
                            <SelectItem value="clayey">Clayey</SelectItem>
                            <SelectItem value="silt">Silt</SelectItem>
                            <SelectItem value="peat">Peat</SelectItem>
                             <SelectItem value="chalky">Chalky</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Beaker className="size-4 text-muted-foreground" /> Soil pH</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 7.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Thermometer className="size-4 text-muted-foreground" /> Soil Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Crop Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Corn, Wheat, Tomato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestion...
                </>
              ) : (
                'Suggest Fertilizer'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
