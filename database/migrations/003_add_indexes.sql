-- ============================================
-- Migration 003: Performance Indexes
-- ============================================

-- Weather: fast city + time range lookups
CREATE INDEX IF NOT EXISTS idx_weather_city_timestamp ON weather_records(city, timestamp DESC);

-- Health analysis: user history queries
CREATE INDEX IF NOT EXISTS idx_health_analysis_user ON health_analysis(user_id, created_at DESC);

-- Chat: user conversation history
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id, created_at DESC);

-- Reports: weekly report lookups by user
CREATE INDEX IF NOT EXISTS idx_reports_user_week ON reports(user_id, week_start DESC);

-- Users: email lookups for auth
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Health profiles: direct user lookup
CREATE INDEX IF NOT EXISTS idx_health_profiles_user ON health_profiles(user_id);

-- Recommendations: lookup by analysis
CREATE INDEX IF NOT EXISTS idx_recommendations_analysis ON recommendations(analysis_id);

-- Weather: timestamp-only queries (e.g. latest across cities)
CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON weather_records(timestamp DESC);
