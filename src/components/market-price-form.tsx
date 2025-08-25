
// components/market-price-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  MarketPriceInput,
  marketPrice,
  MarketPriceOutput,
} from '@/ai/flows/market-price-flow';

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
import { Loader2, LineChart, Sprout, MapPin } from 'lucide-react'; // Added MapPin
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required.'),
  location: z.string().min(1, 'Location is required (e.g., city, region).'),
});

type MarketPriceFormProps = {
  onPriceUpdate: (result: MarketPriceOutput) => void;
};

export default function MarketPriceForm({ onPriceUpdate }: MarketPriceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const input: MarketPriceInput = values;
      const result = await marketPrice(input);
      onPriceUpdate(result);
       toast({
            title: 'Market Prices Fetched',
            description: `Price insights for ${values.cropName} in ${values.location} generated.`,
        });
    } catch (err) {
      console.error('Error getting market price:', err);
      setError('Failed to get market prices. Please check your inputs or try again later.');
      toast({
            variant: 'destructive',
            title: 'Fetching Failed',
            description: 'Could not retrieve market price information.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="text-primary" />
          Get Market Price Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the crop and location to get current market prices and trends.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cropName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Crop Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Wheat, Corn, Soybeans" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> Location</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Mumbai, Maharashtra or North India" {...field} />
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
                  Fetching Prices...
                </>
              ) : (
                'Get Prices'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
