// components/crop-recommendation-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CropRecommendationInput,
  cropRecommendation,
  CropRecommendationOutput,
} from '@/ai/flows/crop-recommendation';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import Sprout icon and remove unused Seedling/Leaf icon
import { Loader2, Sprout, BrainCircuit, Droplets, Thermometer, CloudRain } from 'lucide-react'; // Changed Seedling to Sprout

const formSchema = z.object({
  nitrogenLevel: z.coerce.number().min(0, 'Nitrogen level cannot be negative.'),
  phosphorusLevel: z.coerce.number().min(0, 'Phosphorus level cannot be negative.'),
  potassiumLevel: z.coerce.number().min(0, 'Potassium level cannot be negative.'),
  moistureLevel: z.coerce.number().min(0, 'Moisture level cannot be negative.'),
  temperature: z.coerce.number(),
  rainfall: z.coerce.number().min(0, 'Rainfall cannot be negative.'),
});

type CropRecommendationFormProps = {
  onRecommendation: (result: CropRecommendationOutput) => void;
};

export default function CropRecommendationForm({ onRecommendation }: CropRecommendationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogenLevel: 50,
      phosphorusLevel: 50,
      potassiumLevel: 50,
      moistureLevel: 50,
      temperature: 25,
      rainfall: 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const input: CropRecommendationInput = values;
      const result = await cropRecommendation(input);
      onRecommendation(result);
    } catch (err) {
      console.error('Error getting crop recommendation:', err);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="text-primary" /> {/* Use Sprout icon */}
          Get Crop Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nitrogenLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><BrainCircuit className="size-4 text-muted-foreground" /> Nitrogen (N)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phosphorusLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Phosphorus (P)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="potassiumLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Potassium (K)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moistureLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Droplets className="size-4 text-muted-foreground" /> Moisture Level</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
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
                    <FormLabel className="flex items-center gap-1"><Thermometer className="size-4 text-muted-foreground" /> Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rainfall"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><CloudRain className="size-4 text-muted-foreground" /> Rainfall (mm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
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
                  Getting Recommendations...
                </>
              ) : (
                'Recommend Crops'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
