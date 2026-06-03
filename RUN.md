# How to Run Aether AI

## Prerequisites
- Node.js 20+
- A Supabase project (free tier)
- A Typhoon API key (free from https://opentyphoon.ai)

## Setup

### 1. Install dependencies
```bash
cd weather-health-ai
npm install --prefix backend
npm install --prefix frontend
```

### 2. Database (Supabase)
- Create a free project at https://supabase.com
- Open **SQL Editor**, run `database/schema-enhanced.sql`
- Seed a test user:
  ```sql
  INSERT INTO users (name, email, city) VALUES ('Demo User', 'demo@local', 'Bangkok') RETURNING id;
  INSERT INTO health_profiles (user_id, has_asthma, has_allergy, has_migraine, activity_level) VALUES (1, false, false, false, 'moderate');
  ```

### 3. Configure environment
**`backend/.env`:**
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=eyJ...your_service_role_jwt
TYPHOON_API_KEY=sk-...
TYPHOON_API_URL=https://api.opentyphoon.ai/v1/chat/completions
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=3000
```

**`frontend/.env`:**
```
VITE_API_URL=http://localhost:3000/api
```

### 4. Run

**Option A — Single terminal (root):**
```bash
npm run dev
```

**Option B — Two terminals:**
```bash
# Terminal 1 — Backend (port 3000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 5. Open
http://127.0.0.1:5173

Authenticate with header `x-user-id: 1` (the app sends this automatically).

## Available Scripts
| Location | Command | Description |
|----------|---------|-------------|
| root | `npm run dev` | Run both FE + BE concurrently |
| backend | `npm run dev` | Start backend with hot reload (nodemon) |
| backend | `npm run build` | Compile TypeScript to dist/ |
| backend | `npm run start` | Run compiled JS |
| backend | `npm run typecheck` | TypeScript check only |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run typecheck` | TypeScript check only |

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/weather?city=` | No | Current weather + 7-day forecast + AQI/UV |
| GET | `/api/weather/geocode?name=&count=` | No | Search cities |
| POST | `/api/health/analyze` | `x-user-id` | Health risk analysis |
| GET | `/api/recommendations?analysisId=` | `x-user-id` | Activity/clothing/hydration/menu/mood |
| POST | `/api/chat` | `x-user-id` | AI weather/health chat |
| GET | `/api/insights/menu?city=` | `x-user-id` | Menu suggestions |
| GET | `/api/insights/mood?city=` | `x-user-id` | Mood forecast |
| GET | `/api/reports` | `x-user-id` | Weekly report |

## Deployment
- **Backend**: Push to Render — `render.yaml` auto-configures
- **Frontend**: Push to Vercel — set `VITE_API_URL` to Render backend URL
