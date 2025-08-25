
import React from 'react';
import Link from 'next/link';
import { Sprout, Heart, Globe, Code, Users, Award, Clock, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-gradient-to-r from-background to-secondary/5">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl border border-primary/10">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl brand-text gradient-text leading-normal">AgriMitra</span>
                <span className="text-sm text-muted-foreground leading-normal">Smart Farming Assistant</span>
              </div>
            </Link>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Bridging the gap between traditional farming wisdom and cutting-edge AI technology. 
                Building a sustainable future for agriculture, one farm at a time.
              </p>
              
              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Global Impact</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Farmer-Centric</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Always Evolving</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Excellence */}
          <div className="space-y-6">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Technology
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Platform</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Next.js 15.2.3 with TypeScript for enterprise-grade performance and reliability.
                </p>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">AI Engine</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Google AI Genkit integration with real-time data processing and machine learning models.
                </p>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Infrastructure</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cloud-native architecture with 99.9% uptime and global CDN for fast access worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Support & Community */}
          <div className="space-y-6">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community
            </h3>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Open Source</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contributing to the agricultural technology ecosystem through open-source initiatives.
                </p>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@agrimitra.com</span>
              </div>
              
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-xs font-medium text-primary">Community Growing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border/20 bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} AgriMitra. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500 fill-current" />
                Empowering farmers globally
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
