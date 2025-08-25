
# AgriMitra – Smart Farming Assistant

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-blue?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?logo=tailwindcss)
![Google Genkit](https://img.shields.io/badge/Google_Genkit-AI-green?logo=google)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

AgriMitra is an AI-powered assistant for smart farming, built with Next.js and Google AI Genkit. It empowers farmers with actionable insights for better yields and sustainable agriculture—all through a clean, authentication-free interface.

![img_alt](https://github.com/suman2807/AgriMitra/blob/main/Screenshot%202025-08-26%20014608.png?raw=true)

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AgriMitra
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open** [http://localhost:9002](http://localhost:9002) in your browser.

---


## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **AI:** Google AI Genkit
- **UI Libraries:** React 18.3.1, Lucide React, React Hook Form, Zod
- **Design:** Modern agricultural theme (forest greens & gold)




## 📦 Available Scripts

- `npm run dev` — Start development server (Turbopack, port 9002)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — TypeScript type checking
- `npm run genkit:dev` — Genkit AI flows dev server
- `npm run genkit:watch` — Genkit watch mode


## 📁 Project Structure

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


## 🌱 Features

- **Crop Recommendations:** AI-driven suggestions based on soil, weather, and location
- **Fertilizer Suggestions:** Personalized fertilizer plans
- **Disease Detection:** Upload crop images for instant diagnosis
- **Market Price Insights:** Real-time crop price updates
- **Weather Forecast:** Localized weather alerts
- **Government Schemes:** Discover relevant support programs
- **Crop Calendar:** Personalized farming task reminders

  ![img_alt](https://github.com/suman2807/AgriMitra/blob/main/Screenshot%202025-08-26%20014730.png?raw=true)

### 🎨 Design Highlights
- Clean, professional interface
- Modern agricultural color palette
- Static logo for visual stability
- Enhanced typography
- Fully responsive
- No authentication required


## 🏗️ Architecture

- **Frontend:** Component-based React (Next.js App Router)
- **AI:** Google AI Genkit for farming insights
- **Styling:** Tailwind CSS, custom agricultural theme
- **Type Safety:** TypeScript throughout
- **No Authentication:** Streamlined, open access


## 🤝 Contributing

AgriMitra aims to democratize access to AI-powered agricultural technology. Contributions are welcome to help farmers worldwide make better decisions!

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
