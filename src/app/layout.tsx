import type {Metadata} from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgriMitra - AI-Powered Smart Farming Assistant',
  description: 'Transform your farming with AI-driven crop recommendations, disease detection, weather forecasts, and intelligent insights for sustainable agriculture.',
  keywords: 'agriculture, farming, AI, crop recommendation, disease detection, weather forecast, smart farming',
  authors: [{ name: 'AgriMitra Team' }],
  openGraph: {
    title: 'AgriMitra - AI-Powered Smart Farming Assistant',
    description: 'Transform your farming with AI-driven insights and recommendations',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
