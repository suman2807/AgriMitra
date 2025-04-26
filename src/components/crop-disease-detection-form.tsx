// components/crop-disease-detection-form.tsx
'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  DetectCropDiseaseInput,
  detectCropDisease,
  DetectCropDiseaseOutput,
} from '@/ai/flows/crop-disease-detection';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ScanEye, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CropDiseaseDetectionFormProps = {
  onDetection: (result: DetectCropDiseaseOutput) => void;
};

export default function CropDiseaseDetectionForm({ onDetection }: CropDiseaseDetectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (consider adding more robust checks like size limits)
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select an image file.',
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the input
        }
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null); // Clear previous errors
    } else {
        setSelectedFile(null);
        setPreviewUrl(null);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const photoDataUri = await readFileAsDataURL(selectedFile);
      const input: DetectCropDiseaseInput = { photoDataUri };
      const result = await detectCropDisease(input);
      onDetection(result);
    } catch (err) {
      console.error('Error detecting crop disease:', err);
      setError('Failed to detect disease. Please ensure the image is clear and try again.');
      toast({
          variant: 'destructive',
          title: 'Detection Failed',
          description: 'Could not analyze the image. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanEye className="text-primary" />
          Detect Crop Disease
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="crop-image">Upload Crop Image</Label>
            <Input
              id="crop-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
             {previewUrl && (
              <div className="mt-4 border rounded-md p-2 bg-muted/50 max-w-xs mx-auto">
                <Image
                    src={previewUrl}
                    alt="Crop preview"
                    width={200}
                    height={200}
                    className="rounded-md object-contain mx-auto aspect-square"
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button type="submit" disabled={isLoading || !selectedFile} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
               <Upload className="mr-2 h-4 w-4" /> Detect Disease
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
