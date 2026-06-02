-- ============================================
-- Migration 004: Add weather_code + new fields
-- Run after 001/002/003 if those have been applied
-- ============================================

ALTER TABLE weather_records
    ADD COLUMN IF NOT EXISTS country      VARCHAR(100),
    ADD COLUMN IF NOT EXISTS latitude     DECIMAL(9,6),
    ADD COLUMN IF NOT EXISTS longitude    DECIMAL(9,6),
    ADD COLUMN IF NOT EXISTS feels_like   DECIMAL(4,1),
    ADD COLUMN IF NOT EXISTS pm10         DECIMAL(6,2) CHECK (pm10 >= 0),
    ADD COLUMN IF NOT EXISTS weather_code INTEGER;

ALTER TABLE recommendations
    ADD COLUMN IF NOT EXISTS menu         TEXT,
    ADD COLUMN IF NOT EXISTS mood         TEXT;

CREATE INDEX IF NOT EXISTS idx_weather_weather_code ON weather_records(weather_code) WHERE deleted_at IS NULL;
