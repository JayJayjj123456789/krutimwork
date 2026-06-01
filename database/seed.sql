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
INSERT INTO weather_records (city, temperature, humidity, aqi, uv, wind_speed, pm25, timestamp) VALUES
    -- Bangkok
    ('Bangkok',    36.0, 80,  95,  8.0, 12.5, 45.20, NOW() - INTERVAL '6 days'),
    ('Bangkok',    35.5, 78,  88,  7.5, 10.0, 40.10, NOW() - INTERVAL '5 days'),
    ('Bangkok',    34.0, 82, 102,  9.0,  8.5, 52.30, NOW() - INTERVAL '4 days'),
    ('Bangkok',    33.5, 85, 110,  6.0, 15.0, 58.00, NOW() - INTERVAL '3 days'),
    ('Bangkok',    35.0, 75,  75,  8.5, 11.0, 35.50, NOW() - INTERVAL '2 days'),
    ('Bangkok',    36.5, 70,  65,  9.5,  9.0, 28.40, NOW() - INTERVAL '1 day'),
    ('Bangkok',    37.0, 72,  90, 10.0, 13.0, 42.80, NOW()),
    -- Chiang Mai
    ('Chiang Mai', 28.0, 60, 150,  5.0,  5.0, 75.00, NOW() - INTERVAL '6 days'),
    ('Chiang Mai', 27.5, 62, 145,  4.5,  6.0, 70.20, NOW() - INTERVAL '5 days'),
    ('Chiang Mai', 29.0, 58, 160,  6.0,  4.5, 82.10, NOW() - INTERVAL '4 days'),
    ('Chiang Mai', 30.0, 55, 130,  7.0,  7.0, 60.50, NOW() - INTERVAL '3 days'),
    ('Chiang Mai', 28.5, 63, 140,  5.5,  5.5, 68.00, NOW() - INTERVAL '2 days'),
    ('Chiang Mai', 27.0, 65, 155,  4.0,  6.5, 78.30, NOW() - INTERVAL '1 day'),
    ('Chiang Mai', 29.5, 59, 135,  6.5,  5.0, 65.40, NOW()),
    -- Phuket
    ('Phuket',     31.0, 85,  40,  7.0, 18.0, 15.00, NOW() - INTERVAL '6 days'),
    ('Phuket',     30.5, 88,  42,  6.5, 20.0, 16.50, NOW() - INTERVAL '5 days'),
    ('Phuket',     32.0, 82,  38,  8.0, 15.0, 13.20, NOW() - INTERVAL '4 days'),
    ('Phuket',     30.0, 90,  45,  5.5, 22.0, 18.00, NOW() - INTERVAL '3 days'),
    ('Phuket',     31.5, 83,  35,  7.5, 17.0, 12.80, NOW() - INTERVAL '2 days'),
    ('Phuket',     29.5, 92,  50,  5.0, 24.0, 20.10, NOW() - INTERVAL '1 day'),
    ('Phuket',     32.5, 80,  30,  8.5, 16.0, 11.00, NOW()),
    -- Khon Kaen
    ('Khon Kaen',  33.0, 72,  85,  9.0, 10.0, 38.00, NOW() - INTERVAL '6 days'),
    ('Khon Kaen',  34.0, 68,  78,  9.5,  8.0, 35.50, NOW() - INTERVAL '5 days'),
    ('Khon Kaen',  32.5, 75,  92,  8.0, 12.0, 42.00, NOW() - INTERVAL '4 days'),
    ('Khon Kaen',  35.0, 65,  70, 10.0,  9.0, 30.20, NOW() - INTERVAL '3 days'),
    ('Khon Kaen',  33.5, 70,  88,  8.5, 11.0, 40.10, NOW() - INTERVAL '2 days'),
    ('Khon Kaen',  32.0, 78,  95,  7.5, 14.0, 45.00, NOW() - INTERVAL '1 day'),
    ('Khon Kaen',  34.5, 66,  72,  9.5,  8.5, 32.00, NOW()),
    -- Hat Yai
    ('Hat Yai',    34.0, 78,  60,  8.5, 12.0, 25.00, NOW() - INTERVAL '6 days'),
    ('Hat Yai',    33.5, 80,  65,  7.5, 14.0, 28.00, NOW() - INTERVAL '5 days'),
    ('Hat Yai',    35.0, 75,  55,  9.0, 10.0, 22.50, NOW() - INTERVAL '4 days'),
    ('Hat Yai',    32.5, 85,  70,  6.5, 16.0, 30.00, NOW() - INTERVAL '3 days'),
    ('Hat Yai',    34.5, 76,  58,  8.0, 11.0, 24.00, NOW() - INTERVAL '2 days'),
    ('Hat Yai',    33.0, 82,  62,  7.0, 15.0, 26.50, NOW() - INTERVAL '1 day'),
    ('Hat Yai',    35.5, 72,  50,  9.5,  9.0, 20.00, NOW());
