
// components/weather-forecast-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  WeatherForecastInput,
  weatherForecast,
  WeatherForecastOutput,
} from '@/ai/flows/weather-forecast-flow';

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
import { Loader2, CloudSun, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(1, 'Location is required (e.g., city, region).'),
});

type WeatherForecastFormProps = {
  onForecast: (result: WeatherForecastOutput) => void;
};

export default function WeatherForecastForm({ onForecast }: WeatherForecastFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const input: WeatherForecastInput = values;
      const result = await weatherForecast(input);
      onForecast(result);
       toast({
            title: 'Weather Forecast Ready',
            description: `Forecast for ${values.location} generated.`,
        });
    } catch (err) {
      console.error('Error getting weather forecast:', err);
      setError('Failed to get weather forecast. Please check the location or try again later.');
      toast({
            variant: 'destructive',
            title: 'Forecast Failed',
            description: 'Could not retrieve weather information.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="text-primary" />
          Get Weather Forecast & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your farm's location to get current weather, a 3-day forecast, and severe weather alerts.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> Location</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Pune, Maharashtra or Your Village Name" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Weather...
                </>
              ) : (
                'Get Forecast'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
