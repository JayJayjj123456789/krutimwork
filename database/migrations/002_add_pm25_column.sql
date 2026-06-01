-- ============================================
-- Migration 002: Add pm25 column
-- Ensures pm25 exists on weather_records
-- ============================================

ALTER TABLE weather_records ADD COLUMN IF NOT EXISTS pm25 DECIMAL(6,2);
