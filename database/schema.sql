-- ============================================
-- Aether AI — Weather & Health Database Schema
-- Supabase (PostgreSQL)
-- ============================================

-- 1. Users
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    age         INTEGER,
    gender      VARCHAR(20),
    city        VARCHAR(100) DEFAULT 'Bangkok',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Profiles
CREATE TABLE health_profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
    has_asthma      BOOLEAN DEFAULT FALSE,
    has_allergy     BOOLEAN DEFAULT FALSE,
    has_migraine    BOOLEAN DEFAULT FALSE,
    activity_level  VARCHAR(20) DEFAULT 'moderate',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Weather Records
CREATE TABLE weather_records (
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
CREATE TABLE health_analysis (
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
CREATE TABLE recommendations (
    id              BIGSERIAL PRIMARY KEY,
    analysis_id     BIGINT REFERENCES health_analysis(id) ON DELETE CASCADE,
    activity        TEXT,
    clothing        TEXT,
    hydration       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Chat History
CREATE TABLE chat_history (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reports
CREATE TABLE reports (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
    week_start      DATE NOT NULL,
    week_end        DATE NOT NULL,
    avg_aqi         DECIMAL(6,2),
    avg_health_score DECIMAL(6,2),
    ai_report       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_weather_city_timestamp ON weather_records(city, timestamp DESC);
CREATE INDEX idx_health_analysis_user ON health_analysis(user_id, created_at DESC);
CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);
CREATE INDEX idx_reports_user_week ON reports(user_id, week_start DESC);

-- Seed Data
INSERT INTO users (name, email, age, gender, city)
VALUES ('ทดสอบ ใช้งาน', 'demo@aether.ai', 25, 'male', 'Bangkok');

INSERT INTO health_profiles (user_id, has_asthma, has_allergy, has_migraine, activity_level)
VALUES (1, TRUE, TRUE, FALSE, 'moderate');

INSERT INTO weather_records (city, temperature, humidity, aqi, uv, wind_speed, pm25, timestamp)
VALUES
    ('Bangkok', 36.0, 80, 95, 8.0, 12.5, 45.20, NOW() - INTERVAL '6 days'),
    ('Bangkok', 35.5, 78, 88, 7.5, 10.0, 40.10, NOW() - INTERVAL '5 days'),
    ('Bangkok', 34.0, 82, 102, 9.0, 8.5,  52.30, NOW() - INTERVAL '4 days'),
    ('Bangkok', 33.5, 85, 110, 6.0, 15.0, 58.00, NOW() - INTERVAL '3 days'),
    ('Bangkok', 35.0, 75, 75, 8.5, 11.0, 35.50, NOW() - INTERVAL '2 days'),
    ('Bangkok', 36.5, 70, 65, 9.5, 9.0,  28.40, NOW() - INTERVAL '1 day'),
    ('Bangkok', 37.0, 72, 90, 10.0, 13.0, 42.80, NOW());
