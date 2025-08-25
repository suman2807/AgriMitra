'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after component mounts
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="text-center space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl inline-block animate-pulse-soft">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground animate-fade-in">Redirecting to AgriMitra Dashboard...</p>
      </div>
    </div>
  );
}
    
    
    
