# AI News — Video & Article Aggregator

Aggregates AI news from:
- **16 AI YouTube channels** (Two Minute Papers, Matt Wolfe, Andrej Karpathy, Fireship, AI Explained, and more)
- **RSS feeds** (TechCrunch AI, VentureBeat AI, The Verge AI, Hacker News, ArXiv, MIT Tech Review, etc.)
- **Google AI News** alerts

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui
- **Backend**: Cloudflare Workers (scheduled cron — fetches & updates content every 4 hours)
- **Database**: Supabase (Postgres) — stores videos and news items
- **Hosting**: Cloudflare Pages (frontend) + Cloudflare Workers (cron fetcher)

## Setup

### 1. Supabase
Create a new Supabase project, then run the schema:
```bash
psql "your-supabase-connection-string" -f supabase/schema.sql
```

### 2. Environment Variables
```bash
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Deploy
```bash
# Frontend to Cloudflare Pages
npm run build  # outputs to dist/

# Worker (cron fetcher)
cd worker && npx wrangler deploy
```

### 5. Worker Secrets
```bash
cd worker
npx wrangler secret put YOUTUBE_API_KEY
# (get from Google Cloud Console > YouTube Data API v3)
```

## How It Works

- Cloudflare Worker runs every 4 hours via cron trigger
- Fetches latest videos from all 16 YouTube channels via YouTube Data API v3
- Parses RSS feeds from 9 AI news sources
- Pulls Google Alerts for key AI topics
- Stores everything in Supabase
- Frontend reads from Supabase directly (public anon key — safe for read-only)

## YouTube Channels

- Two Minute Papers
- FreeCodeCamp
- Matt Wolfe (Future Tools)
- AI Explained
- Andrej Karpathy
- Fireship
- Daily Dose of Internet
- AltmanNick
- AI Alchemy
- All About AI
- Prompt Engineering
- Digital Chief
- MIT Tech Review
- Google DeepMind
- Sam Kumar
- Prompt Engineering Memes

## RSS Sources

- TechCrunch AI
- VentureBeat AI
- The Verge AI
- Hacker News
- MIT Technology Review
- ArXiv CS.AI / CS.CL
- Artificial Intelligence News
- Microsoft AI Blog
