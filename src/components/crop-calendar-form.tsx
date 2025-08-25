
// components/crop-calendar-form.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns'; // For date formatting
import {
  CropCalendarInput,
  cropCalendar,
  CropCalendarOutput,
} from '@/ai/flows/crop-calendar-flow';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // Import Calendar component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CalendarDays, Sprout, MapPin, CalendarClock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // For conditional class names

// Zod schema for form validation
const formSchema = z.object({
  cropType: z.string().min(1, 'Crop type is required.'),
  plantingDate: z.date({ required_error: 'Planting date is required.' }), // Use date object
  location: z.string().min(1, 'Location/Climate context is required.'),
  growingSeasonLengthDays: z.coerce.number().int().positive().optional(),
});

type CropCalendarFormProps = {
  onCalendar: (result: CropCalendarOutput) => void;
};

export default function CropCalendarForm({ onCalendar }: CropCalendarFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: '',
      plantingDate: undefined, // Initialize date as undefined
      location: '',
      growingSeasonLengthDays: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      // Format the date to YYYY-MM-DD string before sending to the flow
      const formattedDate = format(values.plantingDate, 'yyyy-MM-dd');

      const input: CropCalendarInput = {
        cropType: values.cropType,
        plantingDate: formattedDate,
        location: values.location,
        growingSeasonLengthDays: values.growingSeasonLengthDays,
      };
      const result = await cropCalendar(input);
      onCalendar(result);
       toast({
            title: 'Crop Calendar Generated',
            description: `Personalized schedule created for ${values.cropType}.`,
        });
    } catch (err) {
      console.error('Error getting crop calendar:', err);
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate calendar: ${errorMessage}. Please check inputs or try again.`);
      toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'Could not create the crop calendar.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="text-primary" />
          Generate Crop Calendar & Task Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Enter crop details to get a personalized schedule with key tasks and reminders.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Sprout className="size-4 text-muted-foreground" /> Crop Type *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Tomato, Wheat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="plantingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel className="flex items-center gap-1"><CalendarClock className="size-4 text-muted-foreground" /> Planting Date *</FormLabel>
                     <Popover>
                        <PopoverTrigger asChild>
                             <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP") // Format for display e.g., Jun 1, 2024
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                             </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01") // Example disabling future dates
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> Location / Climate Context *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Punjab, India or Coastal California" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="growingSeasonLengthDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><CalendarDays className="size-4 text-muted-foreground" /> Est. Growing Season (Days, Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 90" {...field} value={field.value ?? ''}/>
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
                  Generating Calendar...
                </>
              ) : (
                'Generate Calendar'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
    
    
    