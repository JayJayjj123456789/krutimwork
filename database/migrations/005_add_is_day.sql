-- Migration 005: Add is_day to weather_records
ALTER TABLE weather_records ADD COLUMN IF NOT EXISTS is_day SMALLINT CHECK (is_day IN (0, 1));
