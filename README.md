# AgriMitra - Smart Farming Assistant

AgriMitra is an AI-powered smart farming assistant built with Next.js and Google AI Genkit. It provides farmers with intelligent insights for better yields and sustainable agriculture through a clean, authentication-free interface.

## Features

- **Crop Recommendations**: AI-driven suggestions based on soil data, weather, and location
- **Fertilizer Suggestions**: Personalized fertilizer recommendations for better crop growth
- **Disease Detection**: Upload crop images to detect diseases early and get treatment advice
- **Market Price Insights**: Stay updated on current crop prices for informed selling decisions
- **Weather Forecast**: Real-time weather updates and alerts for your farm's location
- **Government Schemes**: Discover relevant agricultural support programs and subsidies
- **Crop Calendar**: Personalized calendars with task reminders for efficient farm management

## Tech Stack

- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google AI Genkit
- **UI Libraries**: React 18.3.1, Lucide React, React Hook Form, Zod
- **Design**: Modern agricultural theme with forest greens and golden accents

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd krishi-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Google AI API key:
   ```
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Available Scripts

- `npm run dev`: Start development server with Turbopack on port 9002
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint for code quality
- `npm run typecheck`: Run TypeScript type checking
- `npm run genkit:dev`: Start Genkit development server for AI flows
- `npm run genkit:watch`: Start Genkit in watch mode for development

## Project Structure

```
src/
├── ai/                 # AI flows and integrations
│   ├── flows/          # Individual AI feature flows (7 tools)
│   ├── ai-instance.ts  # AI instance configuration
│   └── dev.ts          # Development server entry
├── app/                # Next.js app router pages
│   ├── dashboard/      # Main dashboard with all AI tools
│   ├── favicon.ico     # Application icon
│   ├── globals.css     # Global styles and typography
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page (redirects to dashboard)
├── components/         # React components
│   ├── layout/         # Navbar and footer components
│   ├── ui/             # shadcn/ui reusable components
│   └── *-form.tsx      # AI feature-specific forms
├── hooks/              # Custom React hooks
│   └── use-toast.ts    # Toast notification hook
└── lib/                # Utility libraries
    └── utils.ts        # Tailwind CSS utilities
```

## Features Overview

### 🌱 AI-Powered Tools
1. **Crop Recommendations** - Smart crop selection based on environmental data
2. **Fertilizer Suggestions** - Optimized fertilizer recommendations
3. **Disease Detection** - Image-based crop disease identification
4. **Market Analytics** - Real-time crop price insights
5. **Weather Forecasting** - Localized weather data and alerts
6. **Government Schemes** - Agricultural subsidy and support discovery
7. **Crop Calendar** - Personalized farming task scheduling

### 🎨 Design Features
- Clean, professional interface
- Modern agricultural color scheme
- Static logo design for visual stability
- Enhanced typography with proper descender rendering
- Responsive design for all devices
- Simplified navigation without authentication barriers

## Architecture

- **Frontend**: Component-based React architecture with Next.js App Router
- **AI Integration**: Google AI Genkit for intelligent farming insights
- **Styling**: Tailwind CSS with custom agricultural theme
- **Type Safety**: Full TypeScript implementation
- **No Authentication**: Streamlined access to farming tools

## Contributing

This project aims to democratize access to AI-powered agricultural technology. Contributions are welcome to help farmers worldwide make better decisions through intelligent insights.

## License

MIT License - see LICENSE file for details.

## Contributing

This project is designed to help farmers make informed decisions through AI-powered insights. Contributions are welcome!

## License

MIT License - see LICENSE file for details.
