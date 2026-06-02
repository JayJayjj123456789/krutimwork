# Aether AI – Atmospheric Intelligence

> **Typhoon AI Weather Assistant** — Real-time weather + AI health advisor, built in 2 days on a $0/month stack.

## Features
1. **Health** — AQI/UV/temp/humidity-driven risk scoring (respiratory, migraine, fatigue)
2. **Clothing** — AI-generated clothing suggestions for the day
3. **Menu** — Weather-aware food & drink recommendations
4. **Activities** — Personalized activity suggestions
5. **Mood** — Emotional forecast based on atmospheric conditions
6. **Tips** — AI-summarized daily advisory in Thai

## Stack
| Layer | Tech | Cost |
|------|------|------|
| Weather | [Open-Meteo](https://open-meteo.com/) (no API key) | $0 |
| Geocoding | Open-Meteo Geocoding | $0 |
| AI | [Typhoon](https://opentyphoon.ai/) `typhoon-v2.5-30b-a3b-instruct` | Free tier |
| DB | [Supabase](https://supabase.com) (Postgres) | Free tier |
| Frontend | Vite + React 18 + TypeScript | $0 |
| Backend | Express + TypeScript | $0 |
| Hosting | Render (backend) + Vercel (frontend) | Free tier |

## Architecture
```
┌────────────┐  ┌────────────┐  ┌──────────────┐
│  Open-Meteo│  │  Typhoon   │  │   Supabase   │
│  Weather+AQ│  │  LLM API   │  │  Postgres DB │
└─────┬──────┘  └─────┬──────┘  └──────┬───────┘
      │               │                │
      │     ┌─────────┴────────┐       │
      └────►│  Express Backend │◄──────┘
            │  (Node 20)       │
            └────────┬─────────┘
                     │
              ┌──────┴──────┐
              │  Vercel     │
              │  React App  │
              └─────────────┘
```

## Local Setup

### 1. Install
```bash
git clone <repo>
cd weather-health-ai
npm install --prefix backend
npm install --prefix frontend
```

### 2. Database
- Create a free Supabase project: https://supabase.com
- Open the **SQL Editor** in your dashboard
- Copy-paste `database/schema-enhanced.sql` and click **Run** (with RLS)
- Run the seed:
  ```sql
  INSERT INTO users (name, email, city) VALUES ('Demo User', 'demo@local', 'Bangkok') RETURNING id;
  INSERT INTO health_profiles (user_id, has_asthma, has_allergy, has_migraine, activity_level) VALUES (1, false, false, false, 'moderate');
  ```

### 3. Env
```bash
# backend/.env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=eyJ...your_service_role_jwt
TYPHOON_API_KEY=sk-...
TYPHOON_API_URL=https://api.opentyphoon.ai/v1/chat/completions
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=3000
```

### 4. Run
```bash
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```
Open http://127.0.0.1:5173

## Deploy
- **Backend**: Connect repo to [Render](https://render.com); `render.yaml` configures it automatically. Set secrets in the dashboard (Supabase URL/Key, Typhoon Key, ALLOWED_ORIGINS).
- **Frontend**: Connect repo to [Vercel](https://vercel.com); set `VITE_API_URL` env var to your Render backend URL. `vercel.json` is included for SPA routing.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/weather?city=` | Current weather + 7-day forecast + AQI/UV |
| GET | `/api/weather/geocode?name=&count=` | Search locations |
| POST | `/api/health/analyze` | Run health risk analysis (Thai AI summary) |
| GET | `/api/recommendations?analysisId=` | Get activity/clothing/hydration + menu + mood |
| POST | `/api/chat` | Typhoon-powered weather/health chat |
| GET | `/api/insights/menu?city=` | Menu suggestions |
| GET | `/api/insights/mood?city=` | Mood forecast |
| GET | `/api/reports?userId=&weekStart=` | Weekly report |

## Security
- Helmet, CORS whitelist, rate limiting (100/15min general, 10/min chat)
- Supabase anon-key auth via `x-user-id` header (per-user data isolation)
- City name sanitization (HTML/script tag stripping, max 100 chars)
- 4xx errors return original message; 5xx return generic "internal error" (no stack leak)

## License
MIT
