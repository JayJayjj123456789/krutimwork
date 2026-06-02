# Aether AI — Database

## Schema Overview

The database uses PostgreSQL (via Supabase) with 7 tables:

| Table              | Purpose                                         |
|--------------------|-------------------------------------------------|
| `users`            | User accounts with city and demographics        |
| `health_profiles`  | Pre-existing conditions (asthma, allergy, etc.) |
| `weather_records`  | Real-time and historical weather + AQI data     |
| `health_analysis`  | AI-generated health risk assessments            |
| `recommendations`  | Activity, clothing, and hydration suggestions   |
| `chat_history`     | Q&A logs from the health assistant chatbot      |
| `reports`          | Weekly summary reports                          |

## Files

| File                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `schema-enhanced.sql`         | **Source of truth** — full schema with all columns. Run this in Supabase SQL Editor. |
| `schema.sql`                  | Mirror of `schema-enhanced.sql` (kept in sync). |
| `seed.sql`                    | Sample data (5 users, 5 cities, 7 days each)     |
| `api-contract.ts`             | Shared TypeScript types (imported by FE & BE)    |
| `migrations/001_initial_schema.sql` | V1: create all tables (legacy)            |
| `migrations/002_add_pm25_column.sql` | V2: add pm25 (idempotent)               |
| `migrations/003_add_indexes.sql`     | V3: performance indexes (legacy)        |
| `migrations/004_add_weather_code.sql`| V4: add weather_code, country, lat/lon, feels_like, pm10, menu, mood (idempotent) |
| `migrations/005_add_is_day.sql`      | V5: add is_day column to weather_records (idempotent) |

**Important:** `schema.sql` and `schema-enhanced.sql` must be kept in sync. If you change one, change the other. Both are now identical as of the latest update.

## How to Run Migrations

### Via Supabase Dashboard

1. Open your Supabase project → SQL Editor
2. **Recommended**: Copy-paste the full content of `schema-enhanced.sql` and click Run (creates everything in one shot, including the new columns).
   - If you prefer migrations, run them in order:
     - `migrations/001_initial_schema.sql`
     - `migrations/002_add_pm25_column.sql`
     - `migrations/003_add_indexes.sql`
     - `migrations/004_add_weather_code.sql`
     - `migrations/005_add_is_day.sql`
3. (Optional) Run `seed.sql` for test data

### Via Docker (local)

```bash
docker-compose up -d db
```

The docker-compose setup auto-loads `schema.sql` and `seed.sql` on first launch.

### Via psql CLI

```bash
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f database/migrations/002_add_pm25_column.sql
psql "$DATABASE_URL" -f database/migrations/003_add_indexes.sql
psql "$DATABASE_URL" -f database/seed.sql
```

## Seed Data

The `seed.sql` file includes:
- **5 users** across different Thai cities
- **Health profiles** with varied conditions
- **35 weather records** (7 days × 5 cities: Bangkok, Chiang Mai, Phuket, Khon Kaen, Hat Yai)

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

For Docker local:
```
postgresql://aether:aether_pass@localhost:5432/aether_ai
```

For Supabase:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```
