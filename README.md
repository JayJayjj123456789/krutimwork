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
| DB | [Firebase Firestore](https://firebase.google.com/products/firestore) | Free tier |
| Frontend | Vite + React 18 + TypeScript | $0 |
| Backend | Express + TypeScript | $0 |
| Hosting | Render (backend) + Vercel (frontend) | Free tier |

## Architecture
```
┌────────────┐  ┌────────────┐  ┌──────────────┐
│  Open-Meteo│  │  Typhoon   │  │   Firebase   │
│  Weather+AQ│  │  LLM API   │  │  Firestore   │
└─────┬──────┘  └─────┬──────┘  └──────┬───────┘
      │               │                │
      │     ┌─────────┴────────┐       │
      └────►│  Express Backend │◄──────┘
            │  (Node 20)       │
            └────────┬─────────┘
                     │
              ┌──────┴──────┐
              │  Firebase   │
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

### 2. Database (Firebase Firestore)
- Create a free Firebase project: https://console.firebase.google.com
- Enable **Firestore** in the dashboard
- Download a service account key (Project Settings → Service Accounts → Generate New Private Key)
- Save it as `backend/service-account.json` (or set the `FIREBASE_SERVICE_ACCOUNT` env var)
- Set Firestore security rules from `firestore.rules`

### 3. Env
```bash
# backend/.env
FIREBASE_PROJECT_ID=your-project-id
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
- **Backend**: Connect repo to [Render](https://render.com); `render.yaml` configures it automatically. Set secrets in the dashboard (Firebase service account, Typhoon Key, ALLOWED_ORIGINS).
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
- Firebase Admin SDK auth via `x-user-id` header (per-user data isolation)
- City name sanitization (HTML/script tag stripping, max 100 chars)
- 4xx errors return original message; 5xx return generic "internal error" (no stack leak)

## License
MIT
