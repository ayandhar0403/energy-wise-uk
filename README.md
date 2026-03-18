# EnergyWise UK 🔋

A smart energy management dashboard for UK households — track usage, scan bills with AI, compare tariffs, and reduce your carbon footprint.

## Features

- **AI Bill Scanner** — Upload or photograph your energy bill and let AI extract provider, tariff, usage, and cost data automatically (powered by Gemini 2.5 Flash via Lovable AI gateway).
- **Energy Dashboard** — At-a-glance overview of electricity and gas consumption, spending trends, and budget tracking.
- **Tariff Comparison** — Side-by-side comparison of current vs. available tariffs to find potential savings.
- **Carbon Footprint** — Estimate your household's CO₂ emissions based on actual usage data.
- **EPC Rating Lookup** — Enter your postcode to view your home's Energy Performance Certificate rating.
- **Bill History** — Persistent record of all scanned bills with filtering and search.
- **Savings Tips & FAQs** — Curated advice on reducing energy costs and understanding your bill.
- **Household Profile** — Store home details (property type, occupants, heating system) for personalised insights.
- **Authentication** — Secure email/password sign-up and login with protected routes.
- **Dark / Light Mode** — Full theme support via CSS custom properties.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui components |
| Routing | React Router 6 |
| State / Data | TanStack React Query 5 |
| Charts | Recharts 2 |
| Backend | Lovable Cloud (Supabase) — auth, Postgres database, Edge Functions |
| AI | Lovable AI Gateway (Google Gemini 2.5 Flash) for bill OCR extraction |
| Testing | Vitest + Playwright |

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard widgets (EnergyOverview, BudgetTracker, UsageChart, etc.)
│   ├── settings/        # Settings page tabs
│   └── ui/              # shadcn/ui primitives
├── hooks/               # Custom hooks (useAuth, useMobile, useToast)
├── integrations/
│   └── supabase/        # Auto-generated Supabase client & types
├── pages/               # Route-level pages (Index, Auth, BillUpload, BillHistory, Settings, etc.)
└── lib/                 # Utility functions

supabase/
├── functions/
│   └── extract-bill/    # Edge Function — AI-powered bill data extraction
└── config.toml          # Supabase project configuration
```

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Environment variables are managed automatically by Lovable Cloud. Key variables:

- `VITE_SUPABASE_URL` — Backend API endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public API key
- `LOVABLE_API_KEY` — AI gateway key (Edge Functions only, set automatically)

## Database

Two main tables:

- **`profiles`** — User display name, avatar, and postcode
- **`bills`** — Scanned bill records (provider, usage, costs, tariff details, billing period)

Row-Level Security is enabled; the `extract-bill` Edge Function verifies JWT tokens to prevent unauthorised AI usage.

## Deployment

Published via Lovable at [venture-spark-uk.lovable.app](https://venture-spark-uk.lovable.app). Push to the connected GitHub repo to trigger automatic syncs.

## Licence

Private project — all rights reserved.
