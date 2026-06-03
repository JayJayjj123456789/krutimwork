-- ============================================
-- Aether AI — Seed Data
-- Multiple users with realistic weather records
-- ============================================

-- Users
INSERT INTO users (name, email, age, gender, city) VALUES
    ('ทดสอบ ใช้งาน', 'demo@aether.ai', 25, 'male', 'Bangkok'),
    ('สมหญิง ใจดี', 'somying@aether.ai', 32, 'female', 'Chiang Mai'),
    ('สมชาย แข็งแรง', 'somchai@aether.ai', 45, 'male', 'Phuket'),
    ('พิมพ์ใจ รักสุขภาพ', 'pimjai@aether.ai', 28, 'female', 'Khon Kaen'),
    ('ประสิทธิ์ รู้จริง', 'prasit@aether.ai', 52, 'male', 'Hat Yai');

-- Health Profiles
INSERT INTO health_profiles (user_id, has_asthma, has_allergy, has_migraine, activity_level) VALUES
    (1, TRUE,  TRUE,  FALSE, 'moderate'),
    (2, FALSE, TRUE,  TRUE,  'low'),
    (3, TRUE,  FALSE, FALSE, 'high'),
    (4, FALSE, FALSE, TRUE,  'moderate'),
    (5, TRUE,  TRUE,  TRUE,  'low');

-- Weather Records (7 days of data for each city)
-- Includes all columns expected by the backend: country, latitude, longitude, feels_like, pm10, weather_code, is_day
INSERT INTO weather_records (city, country, latitude, longitude, temperature, feels_like, humidity, aqi, uv, wind_speed, pm25, pm10, weather_code, is_day, timestamp) VALUES
    -- Bangkok (13.76, 100.52)
    ('Bangkok',    'Thailand', 13.76, 100.52, 36.0, 37.5, 80,  95,  8.0, 12.5, 45.20, 65.0, 2, 1, NOW() - INTERVAL '6 days'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 35.5, 37.0, 78,  88,  7.5, 10.0, 40.10, 58.0, 2, 1, NOW() - INTERVAL '5 days'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 34.0, 36.0, 82, 102,  9.0,  8.5, 52.30, 72.0, 3, 1, NOW() - INTERVAL '4 days'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 33.5, 35.5, 85, 110,  6.0, 15.0, 58.00, 80.0, 61, 1, NOW() - INTERVAL '3 days'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 35.0, 36.5, 75,  75,  8.5, 11.0, 35.50, 50.0, 2, 1, NOW() - INTERVAL '2 days'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 36.5, 38.0, 70,  65,  9.5,  9.0, 28.40, 42.0, 1, 1, NOW() - INTERVAL '1 day'),
    ('Bangkok',    'Thailand', 13.76, 100.52, 37.0, 38.5, 72,  90, 10.0, 13.0, 42.80, 60.0, 0, 1, NOW()),
    -- Chiang Mai (18.79, 98.98)
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 28.0, 29.0, 60, 150,  5.0,  5.0, 75.00, 95.0, 3, 1, NOW() - INTERVAL '6 days'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 27.5, 28.5, 62, 145,  4.5,  6.0, 70.20, 90.0, 45, 1, NOW() - INTERVAL '5 days'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 29.0, 30.0, 58, 160,  6.0,  4.5, 82.10, 100.0, 2, 1, NOW() - INTERVAL '4 days'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 30.0, 31.0, 55, 130,  7.0,  7.0, 60.50, 78.0, 0, 1, NOW() - INTERVAL '3 days'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 28.5, 29.5, 63, 140,  5.5,  5.5, 68.00, 85.0, 3, 1, NOW() - INTERVAL '2 days'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 27.0, 28.0, 65, 155,  4.0,  6.5, 78.30, 92.0, 45, 0, NOW() - INTERVAL '1 day'),
    ('Chiang Mai', 'Thailand', 18.79, 98.98, 29.5, 30.5, 59, 135,  6.5,  5.0, 65.40, 82.0, 1, 1, NOW()),
    -- Phuket (7.88, 98.40)
    ('Phuket',     'Thailand',  7.88, 98.40, 31.0, 33.0, 85,  40,  7.0, 18.0, 15.00, 22.0, 61, 1, NOW() - INTERVAL '6 days'),
    ('Phuket',     'Thailand',  7.88, 98.40, 30.5, 32.5, 88,  42,  6.5, 20.0, 16.50, 24.0, 61, 1, NOW() - INTERVAL '5 days'),
    ('Phuket',     'Thailand',  7.88, 98.40, 32.0, 34.0, 82,  38,  8.0, 15.0, 13.20, 20.0, 2, 1, NOW() - INTERVAL '4 days'),
    ('Phuket',     'Thailand',  7.88, 98.40, 30.0, 32.0, 90,  45,  5.5, 22.0, 18.00, 26.0, 80, 1, NOW() - INTERVAL '3 days'),
    ('Phuket',     'Thailand',  7.88, 98.40, 31.5, 33.5, 83,  35,  7.5, 17.0, 12.80, 19.0, 2, 1, NOW() - INTERVAL '2 days'),
    ('Phuket',     'Thailand',  7.88, 98.40, 29.5, 31.5, 92,  50,  5.0, 24.0, 20.10, 28.0, 63, 0, NOW() - INTERVAL '1 day'),
    ('Phuket',     'Thailand',  7.88, 98.40, 32.5, 34.5, 80,  30,  8.5, 16.0, 11.00, 17.0, 0, 1, NOW()),
    -- Khon Kaen (16.43, 102.83)
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 33.0, 34.0, 72,  85,  9.0, 10.0, 38.00, 55.0, 0, 1, NOW() - INTERVAL '6 days'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 34.0, 35.0, 68,  78,  9.5,  8.0, 35.50, 52.0, 1, 1, NOW() - INTERVAL '5 days'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 32.5, 33.5, 75,  92,  8.0, 12.0, 42.00, 60.0, 2, 1, NOW() - INTERVAL '4 days'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 35.0, 36.0, 65,  70, 10.0,  9.0, 30.20, 45.0, 0, 1, NOW() - INTERVAL '3 days'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 33.5, 34.5, 70,  88,  8.5, 11.0, 40.10, 58.0, 3, 1, NOW() - INTERVAL '2 days'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 32.0, 33.0, 78,  95,  7.5, 14.0, 45.00, 62.0, 61, 1, NOW() - INTERVAL '1 day'),
    ('Khon Kaen',  'Thailand', 16.43, 102.83, 34.5, 35.5, 66,  72,  9.5,  8.5, 32.00, 48.0, 0, 1, NOW()),
    -- Hat Yai (7.01, 100.47)
    ('Hat Yai',    'Thailand',  7.01, 100.47, 34.0, 35.5, 78,  60,  8.5, 12.0, 25.00, 35.0, 2, 1, NOW() - INTERVAL '6 days'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 33.5, 35.0, 80,  65,  7.5, 14.0, 28.00, 38.0, 3, 1, NOW() - INTERVAL '5 days'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 35.0, 36.5, 75,  55,  9.0, 10.0, 22.50, 32.0, 0, 1, NOW() - INTERVAL '4 days'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 32.5, 34.0, 85,  70,  6.5, 16.0, 30.00, 42.0, 61, 1, NOW() - INTERVAL '3 days'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 34.5, 36.0, 76,  58,  8.0, 11.0, 24.00, 33.0, 2, 1, NOW() - INTERVAL '2 days'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 33.0, 34.5, 82,  62,  7.0, 15.0, 26.50, 36.0, 3, 0, NOW() - INTERVAL '1 day'),
    ('Hat Yai',    'Thailand',  7.01, 100.47, 35.5, 37.0, 72,  50,  9.5,  9.0, 20.00, 30.0, 0, 1, NOW());
