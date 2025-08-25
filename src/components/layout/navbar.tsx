
'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl border border-primary/10">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl brand-text gradient-text leading-normal">AgriMitra</span>
              <span className="text-sm text-muted-foreground leading-normal">Smart Farming Assistant</span>
            </div>
          </Link>

          {/* Right Side Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
              <Leaf className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-foreground">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
