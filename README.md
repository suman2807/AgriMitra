# AgriMitra

AgriMitra is an AI-powered agricultural assistant designed to help farmers optimize crop selection, fertilizer use, detect crop diseases through image recognition, and access real-time market price information. By analyzing soil properties and environmental data, AgriMitra provides tailored recommendations to improve crop yield and maintain soil health.

## Core Features

- **Crop Recommendation**: Analyzes soil properties such as nitrogen, phosphorus, potassium (NPK) levels, moisture, temperature, and rainfall to suggest the most suitable crops for your farm.
- **Fertilizer Suggestions**: Provides precise fertilizer recommendations based on soil type, pH, temperature, and the selected crop to enhance soil health and maximize yield.
- **Crop Disease Detection**: Uses AI-powered image recognition to identify crop diseases from uploaded images, enabling quick intervention to protect crops.
- **Market Price Information**: Provides real-time market price data for various crops based on the user's location, helping farmers make informed decisions about when and where to sell their produce for maximum profits.

## Style Guidelines

- Primary color: Earthy green (#388E3C) representing nature and growth.
- Secondary color: Light beige (#F5F5DC) for a neutral background.
- Accent color: Golden yellow (#FFC107) for highlights and important information.
- Clean and organized layout with clear sections and relevant icons.
- Smooth user experience with subtle transitions and animations.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/farmlink.git
   cd farmlink
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the app.

## Project Structure

- `src/` - Source code including AI flows, components, hooks, and styles.
- `public/` - Static assets like images and icons.
- `docs/` - Documentation files including the project blueprint.
- `package.json` - Project metadata and dependencies.
- `next.config.ts` - Next.js configuration.
- `tailwind.config.ts` - Tailwind CSS configuration.

## Technologies Used

- Next.js - React framework for server-side rendering and static site generation.
- Tailwind CSS - Utility-first CSS framework for styling.
- TypeScript - Typed superset of JavaScript.
- AI models and flows for crop disease detection and recommendations.
