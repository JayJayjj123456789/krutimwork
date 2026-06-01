-- ============================================
-- Migration 001: Initial Schema
-- Aether AI — Weather & Health Database
-- ============================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    age         INTEGER,
    gender      VARCHAR(20),
    city        VARCHAR(100) DEFAULT 'Bangkok',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Profiles
CREATE TABLE IF NOT EXISTS health_profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
    has_asthma      BOOLEAN DEFAULT FALSE,
    has_allergy     BOOLEAN DEFAULT FALSE,
    has_migraine    BOOLEAN DEFAULT FALSE,
    activity_level  VARCHAR(20) DEFAULT 'moderate',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Weather Records
CREATE TABLE IF NOT EXISTS weather_records (
    id            BIGSERIAL PRIMARY KEY,
    city          VARCHAR(100) NOT NULL,
    temperature   DECIMAL(4,1),
    humidity      DECIMAL(4,1),
    aqi           INTEGER,
    uv            DECIMAL(3,1),
    wind_speed    DECIMAL(4,1),
    pm25          DECIMAL(6,2),
    timestamp     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Health Analysis
CREATE TABLE IF NOT EXISTS health_analysis (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT REFERENCES users(id) ON DELETE CASCADE,
    weather_record_id   BIGINT REFERENCES weather_records(id),
    health_score        INTEGER CHECK (health_score BETWEEN 0 AND 100),
    respiratory_risk    VARCHAR(20),
    migraine_risk       VARCHAR(20),
    fatigue_risk        VARCHAR(20),
    ai_summary          TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id              BIGSERIAL PRIMARY KEY,
    analysis_id     BIGINT REFERENCES health_analysis(id) ON DELETE CASCADE,
    activity        TEXT,
    clothing        TEXT,
    hydration       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Chat History
CREATE TABLE IF NOT EXISTS chat_history (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reports
CREATE TABLE IF NOT EXISTS reports (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
    week_start      DATE NOT NULL,
    week_end        DATE NOT NULL,
    avg_aqi         DECIMAL(6,2),
    avg_health_score DECIMAL(6,2),
    ai_report       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
