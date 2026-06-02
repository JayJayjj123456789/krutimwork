-- ============================================
-- Aether AI — Enhanced Schema
-- PostgreSQL-compatible (Supabase)
-- Includes soft delete, better constraints, pm25
-- ============================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    age         INTEGER CHECK (age >= 0 AND age <= 150),
    gender      VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    city        VARCHAR(100) DEFAULT 'Bangkok',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ DEFAULT NULL       -- soft delete
);

-- 2. Health Profiles
CREATE TABLE IF NOT EXISTS health_profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_asthma      BOOLEAN DEFAULT FALSE,
    has_allergy     BOOLEAN DEFAULT FALSE,
    has_migraine    BOOLEAN DEFAULT FALSE,
    activity_level  VARCHAR(20) NOT NULL DEFAULT 'moderate'
                    CHECK (activity_level IN ('low', 'moderate', 'high')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ DEFAULT NULL,  -- soft delete
    UNIQUE (user_id)                           -- one profile per user
);

-- 3. Weather Records
CREATE TABLE IF NOT EXISTS weather_records (
    id            BIGSERIAL PRIMARY KEY,
    city          VARCHAR(100) NOT NULL,
    temperature   DECIMAL(4,1) CHECK (temperature >= -50 AND temperature <= 60),
    humidity      DECIMAL(4,1) CHECK (humidity >= 0 AND humidity <= 100),
    aqi           INTEGER CHECK (aqi >= 0 AND aqi <= 500),
    uv            DECIMAL(3,1) CHECK (uv >= 0 AND uv <= 20),
    wind_speed    DECIMAL(4,1) CHECK (wind_speed >= 0),
    pm25          DECIMAL(6,2) CHECK (pm25 >= 0),
    timestamp     TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ DEFAULT NULL    -- soft delete
);

-- 4. Health Analysis
CREATE TABLE IF NOT EXISTS health_analysis (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weather_record_id   BIGINT REFERENCES weather_records(id),
    health_score        INTEGER CHECK (health_score BETWEEN 0 AND 100),
    respiratory_risk    VARCHAR(20) CHECK (respiratory_risk IN ('low', 'moderate', 'high', 'very_high')),
    migraine_risk       VARCHAR(20) CHECK (migraine_risk IN ('low', 'moderate', 'high', 'very_high')),
    fatigue_risk        VARCHAR(20) CHECK (fatigue_risk IN ('low', 'moderate', 'high', 'very_high')),
    ai_summary          TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ DEFAULT NULL  -- soft delete
);

-- 5. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id              BIGSERIAL PRIMARY KEY,
    analysis_id     BIGINT NOT NULL REFERENCES health_analysis(id) ON DELETE CASCADE,
    activity        TEXT,
    clothing        TEXT,
    hydration       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ DEFAULT NULL   -- soft delete
);

-- 6. Chat History
CREATE TABLE IF NOT EXISTS chat_history (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ DEFAULT NULL   -- soft delete
);

-- 7. Reports
CREATE TABLE IF NOT EXISTS reports (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start      DATE NOT NULL,
    week_end        DATE NOT NULL,
    avg_aqi         DECIMAL(6,2),
    avg_health_score DECIMAL(6,2),
    ai_report       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ DEFAULT NULL,  -- soft delete
    CHECK (week_end > week_start)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_weather_city_timestamp ON weather_records(city, timestamp DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON weather_records(timestamp DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_health_analysis_user ON health_analysis(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reports_user_week ON reports(user_id, week_start DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_health_profiles_user ON health_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_recommendations_analysis ON recommendations(analysis_id) WHERE deleted_at IS NULL;
