
// components/government-schemes-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  GovernmentSchemesInput,
  governmentSchemes,
  GovernmentSchemesOutput,
} from '@/ai/flows/government-schemes-flow';

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
import { Loader2, Landmark, MapPin, Sprout, User } from 'lucide-react'; // Using Landmark for government schemes
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(1, 'Location (State/Region) is required.'),
  cropType: z.string().optional(),
  farmerCategory: z.string().optional(),
});

type GovernmentSchemesFormProps = {
  onSchemesInfo: (result: GovernmentSchemesOutput) => void;
};

export default function GovernmentSchemesForm({ onSchemesInfo }: GovernmentSchemesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      cropType: '',
      farmerCategory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const input: GovernmentSchemesInput = {
        location: values.location,
        cropType: values.cropType || undefined, // Send undefined if empty
        farmerCategory: values.farmerCategory || undefined, // Send undefined if empty
      };
      const result = await governmentSchemes(input);
      onSchemesInfo(result);
       toast({
            title: 'Government Schemes Info Ready',
            description: `Found schemes relevant to ${values.location}.`,
        });
    } catch (err) {
      console.error('Error getting government schemes:', err);
      setError('Failed to get schemes information. Please check the location or try again later.');
      toast({
            variant: 'destructive',
            title: 'Fetching Failed',
            description: 'Could not retrieve government schemes information.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="text-primary" />
          Find Government Schemes & Subsidies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Enter location and optionally crop or farmer type to find relevant government support.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> Location (State/Region) *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Maharashtra, Punjab" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Crop Type (Optional)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Rice, Cotton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="farmerCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><User className="size-4 text-muted-foreground" /> Farmer Category (Optional)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Smallholder, Organic" {...field} />
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
                  Finding Schemes...
                </>
              ) : (
                'Find Schemes'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
    
    